import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { Timer } from 'timer-node';
import prisma from "$lib/server/prismadb"
import type { DBMovieMovies, DBMovieSeries, DBMovieMoviesDetail, DBMovieSeriesDetail } from '$lib/types';

import { VideoType, type Video, type Personality, type Genre } from '@prisma/client';
import { getUserSession, } from '$lib/server/utils';
import { MOVIE_DB_KEY } from '$env/static/private';

type FullVideo = Video & {
	creators: Personality[];
	actors: Personality[];
	genres: Genre[];
};

type filters = keyof Pick<FullVideo, 'creators' | 'title' | 'actors'>

const stringToEnum = <T>(str: string | null | undefined, type: T): keyof T | undefined => {
	if (!str) return undefined
	for (let enumMember in type) {
		if (str.toLowerCase() === enumMember.toString().toLowerCase()) {
			return enumMember;
		}
 }
 return undefined
}

const fetchImdbVideosSchema = z.object({
	searchedVideo: z.string(),
});

const addMovieDbVideosSchema = z.object({
	type: z.string(),
	movieDbId: z.string(),
});

const createCommentSchema = z.object({
	videoId: z.string(),
	content: z.string(),
});

const updateCommentSchema = z.object({
	videoId: z.string(),
	commentId: z.string(),
	content: z.string(),
});

const deleteCommentSchema = z.object({
	videoId: z.string(),
	commentId: z.string(),
});

type DBMovieApiResult<T> = {
	page: number;
	results: T[]
}

export const load = (async ({ url, locals }) => {
	const session = await locals.getSession();
	const searchText = url.searchParams.get('searchText') || '';
	const searchType = url.searchParams.get('searchType') || 'title' as filters ;
	const videoType = stringToEnum(url.searchParams.get('videoType'), VideoType)
	const genre = url.searchParams.get('genre') || ''

	const videos = await prisma.video.findMany({
		where:{
			OR: searchType === 'title' ? [
				{
					title: {
						contains: searchText,
						mode: 'insensitive'
					} 
				},
				{
					originalTitle: {
						contains: searchText,
						mode: 'insensitive'
					}
				} 
			] : undefined,
			creators: searchType === 'creators' ? {
				some: {
					name: {
						contains: searchText,
						mode: 'insensitive'
					}
				}
			}: undefined,
			actors: searchType === 'actors' ? {
				some: {
					name: {
						contains: searchText,
						mode: 'insensitive'
					}
				}
			}: undefined,
			genres: genre ? {
				some: {
					id: {
						equals: genre
					}
				}
			} : undefined,
			type: videoType ? {
				equals: videoType,
			} : undefined,
		},
		orderBy: {
			releaseDate: 'desc',
		},
		include: {
			creators: {
				orderBy: {
					popularity: 'desc'
				}
			},
			actors: true,
			genres: {
				orderBy: {
					name: 'asc'
				}
			},
			comments: {
				include: {
					user: true,
				},
				orderBy: {
					createdAt: 'asc'
				}
			},
			ratings: {
				where: {
					user: {
						email: {
							equals: session?.user?.email,
						}
					}
				}
			},
		}
	});

	const genres = await prisma.genre.findMany({
		orderBy: {
			name: 'asc',
		},
	});

	const ratingAvg = await prisma.rating.groupBy({
		by: ['videoId'],
		_avg: {
			note: true,
		}
	});
	const videoWithUserAvg = videos.map((video) => ({ ...video,  userAvg: ratingAvg.find(rate => rate.videoId === video.id)?._avg.note || null }))
	return { videos: videoWithUserAvg, genres };
}) satisfies PageServerLoad;

export const actions: Actions = {
	fetchMovieDB: async ({ request, locals }) => {
		await getUserSession(locals)
		const timer = new Timer();
		timer.start();
		try {
			const formData = Object.fromEntries(await request.formData());
			const { searchedVideo } = fetchImdbVideosSchema.parse(formData);
			console.log(timer.time(), searchedVideo);
			
			const moviesResponse = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchedVideo}&language=fr-FR`, {
				headers: {
					Authorization: `Bearer ${MOVIE_DB_KEY}`
				}
			});
			const seriesResponse = await fetch(`https://api.themoviedb.org/3/search/tv?query=${searchedVideo}&language=fr-FR`, {
				headers: {
					Authorization: `Bearer ${MOVIE_DB_KEY}`
				}
			});

			const { results: seriesVideos } = await seriesResponse.json() as DBMovieApiResult<DBMovieMovies>
			const { results: moviesVideos } = await moviesResponse.json() as DBMovieApiResult<DBMovieSeries>
			
			console.log(timer.time(), "movies db found videos", seriesVideos.length + moviesVideos.length);
			return { series: seriesVideos.slice(0, 5), movies: moviesVideos.slice(0, 5)}
		} catch (error) {
			console.log(timer.time(), error);
			return "KO"
		}
	},
	addMovieDbVideo: async ({ request, locals }) => {
		await getUserSession(locals)
		const timer = new Timer();
		timer.start();
		try {
			const formaData = Object.fromEntries(await request.formData());
			const { movieDbId, type } = addMovieDbVideosSchema.parse(formaData);
			console.log(movieDbId);
			const moviesResponse = await fetch(
				`https://api.themoviedb.org/3/${type === 'movie' ? 'movie' : 'tv'}/${movieDbId}?&language=fr-FR&append_to_response=${type === 'movie' ? 'credits' : 'aggregate_credits'}`, 
				{
					headers: {
						Authorization: `Bearer ${MOVIE_DB_KEY}`
					}
				}
			);

			const response = await moviesResponse.json();
			let data: DBMovieMoviesDetail & {
				title: string;
				type: VideoType;

			}
			if (type === 'movie') {
				const movieDbMovie = response as DBMovieMoviesDetail;
				data = {
					...movieDbMovie,
					credits: {
						cast: movieDbMovie.credits.cast.sort((a, b) => a.order - b.order).slice(0, 9),
						crew: movieDbMovie.credits.crew.filter(c =>  ['Directing', 'Writing'].includes(c.department)).sort((a, b) => b.popularity - a.popularity).slice(0, 5),
					},
					type: VideoType.Movie,
				}
			} else {
				const movieDbSeries = response as DBMovieSeriesDetail;
				data = {
					...movieDbSeries,
					title: movieDbSeries.name,
					original_title: movieDbSeries.original_name,
					type: VideoType.Series,
					release_date: movieDbSeries.first_air_date,
					credits: {
						cast: movieDbSeries.aggregate_credits.cast.sort((a, b) => a.order - b.order).slice(0, 9),
						crew: movieDbSeries.aggregate_credits.crew.filter(c =>  ['Directing', 'Writing'].includes(c.department)).sort((a, b) => b.popularity - a.popularity).slice(0, 5),
					},
					budget: undefined,
					revenue: undefined,
				}
			}
			
			const video = await prisma.video.upsert({
				where: {
					title_releaseDate: {
						title: data.title,
						releaseDate: new Date(data.release_date)
					}
				},
				create: {
					adult: data.adult,
					backdropPath: data.backdrop_path,
					posterPath: data.poster_path,
					tagline: data.tagline,
					overview: data.overview,
					title: data.title,
					revenue: data.revenue, 
					status: data.status,
					budget: data.budget,
					originalTitle: data.original_title,
					originalLanguage: data.original_language,
					releaseDate: new Date(data.release_date),
					popularity: data.popularity,
					imdbId: data.imdb_id,

					creators: {
						connectOrCreate: data.credits.crew.map((creator) => ({
							where: { name: creator.name },
							create: { name: creator.name, imgUrl: creator.profile_path, popularity: creator.popularity }
						}))
					},
					actors: {
						connectOrCreate: data.credits.cast.map((actor) => ({
							where: { name: actor.name },
							create: { name: actor.name, imgUrl: actor.profile_path, popularity: actor.popularity }
						}))
					},
					genres: {
						connectOrCreate: data.genres.map((genre) => ({
							where: { name: genre.name },
							create: { name: genre.name }
						}))
					},

					type: data.type,
					voteAverage: data.vote_average,
					voteCount: data.vote_count,
				},
				update: {}
			})
			return video
		} catch (error) {
			console.log(timer.time(), error);
			return "KO"
		}
	},
	createComment: async ({ request, locals, fetch }) => {
		await getUserSession(locals)
		const timer = new Timer();
		timer.start();
		try {
			const formData = Object.fromEntries(await request.formData());
			const { content, videoId } = createCommentSchema.parse(formData);
			
			const result = await fetch(`/videos/${videoId}/comments`, {
				method: 'POST',
				body: JSON.stringify({ content })
			})
			const comment = await result.json()
			console.log(timer.time(), comment);
			return comment;
		} catch (error) {
			console.log(timer.time(), error);
			return "KO"
		}
	},
	deleteComment: async ({ request, locals, fetch }) => {
		await getUserSession(locals)
		const timer = new Timer();
		timer.start();
		try {
			const formData = Object.fromEntries(await request.formData());
			const { commentId, videoId } = deleteCommentSchema.parse(formData);
			
			const result = await fetch(`/videos/${videoId}/comments/${commentId}`, {
				method: 'DELETE',
			})
			console.log(timer.time(), result.json());
			return result.json();
		} catch (error) {
			console.log(timer.time(), error);
			return "KO"
		}
	},
	updateComment: async ({ request, locals, fetch }) => {
		await getUserSession(locals)
		const timer = new Timer();
		timer.start();
		try {
			const formData = Object.fromEntries(await request.formData());
			const { commentId, videoId, content } = updateCommentSchema.parse(formData);
			
			const result = await fetch(`/videos/${videoId}/comments/${commentId}`, {
				method: 'PATCH',
				body: JSON.stringify({ content })
			})
			console.log(timer.time(), result.json());
			return result.json();
		} catch (error) {
			console.log(timer.time(), error);
			return "KO"
		}
	},
};
