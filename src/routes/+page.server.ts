import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { Timer } from 'timer-node';
import prisma from "$lib/server/prismadb"
import * as cheerio from 'cheerio';
import type { imdbVideo } from '$lib/types';

import { VideoType } from '@prisma/client';


export const load = (async () => {
	const videos = await prisma.video.findMany({
		take: 20,
	});
	return { videos };
}) satisfies PageServerLoad;

const fetchImdbVideosSchema = z.object({
	searchedVideo: z.string(),
});

const addImdbVideosSchema = z.object({
	imdbUrl: z.string(),
});

const getOnlyDigit = (str: string) => {
	return str.match(/\d/g)?.join("") || '';
}

const scrappedSite = 'https://www.themoviedb.org';
const getVideos = (html: string, videoType: VideoType) => {
	const cheerioApi = cheerio.load(html);

	const cheerioVideos = cheerioApi(`${videoType === VideoType.Movie ? '.movie' : '.tv'} .card`)
	const imdbVideos: imdbVideo[] = []
	cheerioVideos.map((i, el) => {
		if (i < 6) {
			const cheerioVideo = cheerio.load(el)
			const imgUrl = scrappedSite + cheerioVideo('img').attr('src');
			const title = cheerioVideo('.details a').text() || '';
			const imdbUrl = cheerioVideo('.details a').attr('href');
			const year = cheerioVideo('.release_date').first().text();

			imdbVideos.push({
				title,
				imdbUrl: imdbUrl || '',
				imgUrl,
				year,
				type: videoType
			})
		}
	})
	return imdbVideos;
}

export const actions: Actions = {
	fetchImdbVideos: async ({ request }) => {
		const timer = new Timer();
		timer.start();
		try {
			const formaData = Object.fromEntries(await request.formData());
			const { searchedVideo } = fetchImdbVideosSchema.parse(formaData);
			console.log(timer.time(), searchedVideo);
			const response = await fetch(`${scrappedSite}/search?query=${searchedVideo}`);
			const body = await response.text();
			const imdbVideos = [...getVideos(body, VideoType.Movie), ...getVideos(body, VideoType.Series)];
			console.log(timer.time(), "imdb found videos", imdbVideos.length);
			return imdbVideos
		} catch (error) {
			console.log(timer.time(), error);
			return "KO"
		}
	},
	addImbdbVideo: async ({ request }) => {
		const timer = new Timer();
		timer.start();
		try {
			const formaData = Object.fromEntries(await request.formData());
			const { imdbUrl } = addImdbVideosSchema.parse(formaData);
			const completeUrl = `${scrappedSite}${imdbUrl}`
			console.log(timer.time(), completeUrl);

			const response = await fetch(completeUrl);
			const body = await response.text();
			const cheerioApi = cheerio.load(body);

			const desc = cheerioApi('.tagline').text().trim();
			const storyline = cheerioApi('.overview').text().trim();
			const usersRating = cheerioApi('.user_score_chart').first().attr('data-percent');
			const title = cheerioApi('h2 > a').first().text().trim();
			const imgUrl = scrappedSite + cheerioApi('.image_content .poster').attr('data-srcset')?.split(',').pop()?.replace(/ /g, '')?.slice(0, -2);
			const genres = cheerioApi('.genres a').map((i, el) => {
				return cheerioApi(el).text().trim()
			}).toArray();
			const year = +getOnlyDigit(cheerioApi('.release_date').first().text());
			const creators = cheerioApi('.profile a').map((i, el) => {
				return cheerioApi(el).text().trim()
			}).toArray();
			const actors = cheerioApi('.people .card').map((i, el) => {
				const img = cheerioApi(el).find('img').attr('src');
				return {
					name: cheerioApi(el).find('.character').prev().text().trim(),
					imgUrl: `${scrappedSite}${img}`
				}
			}).toArray();
			const videoType = cheerioApi('.movie_wrap').length ? VideoType.Movie : VideoType.Series;

			const video = await prisma.video.upsert({
				where: {
					title_type: {
						title,
						type: videoType
					}
				},
				create: {
					title,
					type: videoType,
					imageUrl: imgUrl,
					year,
					usersRating: usersRating ? +usersRating : null,
					storyline,
					desc,
					creators: {
						connectOrCreate: creators.map((creator) => ({
							where: { name: creator },
							create: { name: creator }
						}))
					},
					stars: {
						connectOrCreate: actors.map((actor) => ({
							where: { name: actor.name },
							create: { name: actor.name, imgUrl: actor.imgUrl }
						}))
					}
				},
				update: {}
			})
			return video
		} catch (error) {
			console.log(timer.time(), error);
			return "KO"
		}
	}
};
