import { Type } from '@sinclair/typebox';

import { Nullable } from '../../common/utils/elysia';

const RatingSchema = Type.Object({
  id: Type.String(),
  note: Type.Number()
});

const VideoDtoSchema = Type.Object({
  backdropPath: Nullable(Type.Optional(Type.String())),
  id: Type.String(),
  imdbId: Nullable(Type.Optional(Type.String())),
  movieDbId: Type.String(),
  overview: Nullable(Type.String()),
  popularity: Type.Number(),
  posterPath: Nullable(Type.Optional(Type.String())),
  ratings: Type.Array(RatingSchema),
  releaseDate: Type.Date(),
  title: Type.String(),
  type: Type.String(),
  voteAverage: Type.Number()
});

export const VideoClubDetailDtoSchema = Type.Object({
  id: Type.String(),
  inviteId: Type.String(),
  name: Type.String(),
  videos: Type.Array(VideoDtoSchema)
});

export const VideoClubDtoSchema = Type.Object({
  id: Type.String(),
  inviteId: Type.String(),
  name: Type.String()
});
