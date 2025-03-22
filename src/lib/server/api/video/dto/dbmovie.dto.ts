import { Type } from '@sinclair/typebox';

import { Nullable } from '../../common/utils/elysia';

// Define the TypeBox schema for DBMovieMovies
const DBMovieMoviesSchema = Type.Object({
  adult: Type.Boolean(),
  backdrop_path: Nullable(Type.Optional(Type.String())),
  id: Type.Number(),
  origin_country: Type.Array(Type.String()),
  original_language: Type.String(),
  original_title: Type.String(),
  overview: Type.String(),
  popularity: Type.Number(),
  poster_path: Nullable(Type.Optional(Type.String())),
  release_date: Type.String(),
  title: Type.String(),
  video: Type.Boolean(),
  vote_average: Type.Number(),
  vote_count: Type.Number()
});

// Define the TypeBox schema for DBMovieSeries
const DBMovieSeriesSchema = Type.Object({
  backdrop_path: Nullable(Type.Optional(Type.String())),
  first_air_date: Type.String(),
  id: Type.Number(),
  name: Type.String(),
  origin_country: Type.Array(Type.String()),
  original_language: Type.String(),
  original_name: Type.String(),
  overview: Type.String(),
  popularity: Type.Number(),
  poster_path: Nullable(Type.Optional(Type.String())),
  vote_average: Type.Number(),
  vote_count: Type.Number()
});

export const DBMovieApiResultSearchSchema = Type.Object({
  movies: Type.Array(DBMovieMoviesSchema),
  series: Type.Array(DBMovieSeriesSchema)
});
