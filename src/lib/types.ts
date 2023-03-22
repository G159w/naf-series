import type { VideoType } from "@prisma/client";

export type DBMovieMovies = {
	poster_path: string | null;
	adult: boolean;
	popularity: number;
	id: number;
	backdrop_path: string | null;
	vote_average: number;
	overview: string;
	release_date: string;
	origin_country: string[];
	original_language: string;
	vote_count: number;
	title: string;
	original_title: string;
	video: boolean;
}

export type DBMovieSeries = {
	poster_path: string | null;
	popularity: number;
	id: number;
	backdrop_path: string | null;
	vote_average: number;
	overview: string;
	first_air_date: string;
	origin_country: string[];
	original_language: string;
	vote_count: number;
	name: string;
	original_name: string;
}

export function isMovie(video: DBMovieMovies | DBMovieSeries): video is DBMovieMovies {
	return (video as DBMovieMovies).title !== undefined;
}

export type DBMovieMoviesDetail = {
	adult: boolean;
	backdrop_path: string | null;
	budget: number | undefined;
	genres: {
		id: number;
		name: string
	}[];
	homepage: string | null;
	id: number;
	imdb_id: string | null;
	original_language: string;
	original_title: string;
	overview: string | null;
	popularity: number;
	poster_path: string | null;
	release_date: string;
	revenue: number | undefined;
	runtime: number | null;
	status: string;
	tagline: string | null;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	credits: {
		cast: {
			name: string;
			character: string;
			profile_path: string;
			popularity: number;
			order: number;
		}[];
		crew: {
			name: string;
			profile_path: string;
			popularity: number;
			department: string;
		}[];
	}
}

export type DBMovieSeriesDetail = {
	adult: boolean;
	backdrop_path: string | null;
	genres: {
		id: number;
		name: string
	}[];
	created_by: {
		name: string;
		profile_path: string;
	};
	homepage: string | null;
	id: number;
	imdb_id: string | null;
	original_language: string;
	original_name: string;
	overview: string | null;
	popularity: number;
	poster_path: string | null;
	first_air_date: string;
	runtime: number | null;
	status: string;
	tagline: string | null;
	name: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	aggregate_credits: {
		cast: {
			name: string;
			roles: {
				character: string;
			}[];
			profile_path: string;
			popularity: number;
			order: number;
		}[];
		crew: {
			name: string;
			profile_path: string;
			popularity: number;
			department: string;
		}[];
	}
}