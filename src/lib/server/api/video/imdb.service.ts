import type {
  DBMovieApiResult,
  DBMovieMovies,
  DBMovieMoviesDetail,
  DBMovieSeries,
  DBMovieSeriesDetail
} from '$lib/types';

import { inject, injectable } from '@needle-di/core';
import { VideoType } from '@prisma/client';

import { ConfigService } from '../common/configs/config.service';

@injectable()
export class MovieDbService {
  constructor(private configService = inject(ConfigService)) {}

  async getMovieDbDetails(movieDbId: string, type: 'movie' | 'tv') {
    const moviesResponse = await fetch(
      `https://api.themoviedb.org/3/${
        type === 'movie' ? 'movie' : 'tv'
      }/${movieDbId}?&language=fr-FR&append_to_response=${
        type === 'movie' ? 'credits' : 'aggregate_credits'
      }`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.envs.MOVIE_DB_KEY}`
        }
      }
    );

    const response = await moviesResponse.json();
    let data: DBMovieMoviesDetail & {
      title: string;
      type: VideoType;
    };
    if (type === 'movie') {
      const movieDbMovie = response as DBMovieMoviesDetail;
      data = {
        ...movieDbMovie,
        credits: {
          cast: movieDbMovie.credits.cast.sort((a, b) => a.order - b.order).slice(0, 15),
          crew: movieDbMovie.credits.crew
            .filter((c) => ['Directing', 'Writing'].includes(c.department))
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 5)
        },
        type: VideoType.Movie
      };
    } else {
      const movieDbSeries = response as DBMovieSeriesDetail;
      data = {
        ...movieDbSeries,
        budget: undefined,
        credits: {
          cast: movieDbSeries.aggregate_credits.cast
            .sort((a, b) => a.order - b.order)
            .slice(0, 15)
            .map((actor) => ({ ...actor, character: actor.roles[0].character })),
          crew: movieDbSeries.aggregate_credits.crew
            .filter((c) => ['Directing', 'Writing'].includes(c.department))
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 5)
        },
        original_title: movieDbSeries.original_name,
        release_date: movieDbSeries.first_air_date,
        revenue: undefined,
        title: movieDbSeries.name,
        type: VideoType.Series
      };
    }

    return data;
  }

  async searchMovieDb(query: string) {
    const moviesResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&language=fr-FR`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.envs.MOVIE_DB_KEY}`
        }
      }
    );
    const seriesResponse = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${query}&language=fr-FR`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.envs.MOVIE_DB_KEY}`
        }
      }
    );

    const { results: seriesVideos } =
      (await seriesResponse.json()) as DBMovieApiResult<DBMovieSeries>;
    const { results: moviesVideos } =
      (await moviesResponse.json()) as DBMovieApiResult<DBMovieMovies>;

    return { movies: moviesVideos.slice(0, 5), series: seriesVideos.slice(0, 5) };
  }
}
