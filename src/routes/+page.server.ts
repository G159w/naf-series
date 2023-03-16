import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { Timer } from 'timer-node';
import prisma from "$lib/server/prismadb"
import * as cheerio from 'cheerio';
import type { movieDBVideo } from '$lib/types';

import { VideoType, type Video, type Personality, type Genre } from '@prisma/client';

type FullVideo = Video & {
	creators: Personality[];
	stars: Personality[];
	genres: Genre[];
};

type filters = keyof Pick<FullVideo, 'creators' | 'title' | 'stars'>


const stringToEnum = <T>(str: string | null | undefined, type: T): keyof T | undefined => {
	if (!str) return undefined
	for (let enumMember in type) {
		if (str.toLowerCase() === enumMember.toString().toLowerCase()) {
			return enumMember;
		}
 }
 return undefined
}

export const load = (async ({ url }) => {
	const textSearch = url.searchParams.get('textSearch') || '';
	const searchType = url.searchParams.get('searchType') || 'title' as filters ;
	const videoType = stringToEnum(url.searchParams.get('videoType'), VideoType)
	const genre = url.searchParams.get('genre') || ''

	const videos = await prisma.video.findMany({
		where:{
			title: searchType === 'title' ? {
				contains: textSearch,
				mode: 'insensitive'
			} : undefined,
			creators: searchType === 'creators' ? {
				some: {
					name: {
						contains: textSearch,
						mode: 'insensitive'
					}
				}
			}: undefined,
			stars: searchType === 'stars' ? {
				some: {
					name: {
						contains: textSearch,
						mode: 'insensitive'
					}
				}
			}: undefined,
			genres: {
				some: {
					name: {
						contains: genre,
						mode: 'insensitive'
					}
				}
			},
			type: videoType ? {
				equals: videoType,
			} : undefined,
		},
		orderBy: {
			year: 'desc',
		},
		include: {
			creators: true,
			stars: true,
			genres: true,
		}
	});
	const genres = await prisma.genre.findMany({
		orderBy: {
			name: 'asc',
		},
	});
	return { videos, genres };
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

	const cheerioVideos = cheerioApi(`${videoType === 'Movie' ? '.movie' : '.tv'} .card`)
	const imdbVideos: movieDBVideo[] = []
	cheerioVideos.map((i, el) => {
		if (i < 6) {
			const cheerioVideo = cheerio.load(el)
			const imgUrl = scrappedSite + cheerioVideo('img').attr('src');
			const title = cheerioVideo('.details a').text() || '';
			const imdbUrl = cheerioVideo('.details a').attr('href');
			const year = cheerioVideo('.release_date').first().text();

			imdbVideos.push({
				title,
				movieDBUrl: imdbUrl || '',
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
			const imdbVideos = [...getVideos(body, 'Movie'), ...getVideos(body, 'Series')];
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
					imgUrl: img ? `${scrappedSite}${img}` : undefined
				}
			}).toArray();
			const videoType = cheerioApi('.movie_wrap').length ? 'Movie' : 'Series';

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
					},
					genres: {
						connectOrCreate: genres.map((genre) => ({
							where: { name: genre },
							create: { name: genre }
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
