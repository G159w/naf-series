export type DBMovieApiResult<T> = {
  page: number;
  results: T[];
};

export type DBMovieMovies = {
  adult: boolean;
  backdrop_path: null | string;
  id: number;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: null | string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type DBMovieMoviesDetail = {
  adult: boolean;
  backdrop_path: null | string;
  budget: number | undefined;
  credits: {
    cast: {
      character: string;
      name: string;
      order: number;
      popularity: number;
      profile_path: string;
    }[];
    crew: {
      department: string;
      name: string;
      popularity: number;
      profile_path: string;
    }[];
  };
  genres: {
    id: number;
    name: string;
  }[];
  homepage: null | string;
  id: number;
  imdb_id: null | string;
  original_language: string;
  original_title: string;
  overview: null | string;
  popularity: number;
  poster_path: null | string;
  release_date: string;
  revenue: number | undefined;
  runtime: null | number;
  status: string;
  tagline: null | string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type DBMovieSeries = {
  backdrop_path: null | string;
  first_air_date: string;
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: null | string;
  vote_average: number;
  vote_count: number;
};

export type DBMovieSeriesDetail = {
  adult: boolean;
  aggregate_credits: {
    cast: {
      name: string;
      order: number;
      popularity: number;
      profile_path: string;
      roles: {
        character: string;
      }[];
    }[];
    crew: {
      department: string;
      name: string;
      popularity: number;
      profile_path: string;
    }[];
  };
  backdrop_path: null | string;
  created_by: {
    name: string;
    profile_path: string;
  };
  first_air_date: string;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: null | string;
  id: number;
  imdb_id: null | string;
  name: string;
  original_language: string;
  original_name: string;
  overview: null | string;
  popularity: number;
  poster_path: null | string;
  runtime: null | number;
  status: string;
  tagline: null | string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export function isMovie(video: DBMovieMovies | DBMovieSeries): video is DBMovieMovies {
  return (video as DBMovieMovies).title !== undefined;
}
