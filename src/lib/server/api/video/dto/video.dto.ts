import { type Static, Type } from '@sinclair/typebox';

import { Nullable } from '../../common/utils/elysia';

const UserSchema = Type.Object({
  email: Nullable(Type.String()),
  id: Type.String(),
  name: Nullable(Type.String())
});

const ActorSchema = Type.Object({
  id: Type.String(),
  imgUrl: Type.Optional(Nullable(Type.String())),
  name: Type.String(),
  popularity: Type.Number()
});

const CharacterSchema = Type.Object({
  actor: ActorSchema,
  character: Type.String(),
  id: Type.String()
});

const CommentSchema = Type.Object({
  content: Type.String(),
  createdAt: Type.Date(),
  id: Type.String(),
  user: UserSchema
});

const RatingSchema = Type.Object({
  id: Type.String(),
  note: Type.Number(),
  user: UserSchema
});

export const VideoDtoSchema = Type.Object({
  backdropPath: Nullable(Type.Optional(Type.String())),
  characters: Type.Array(CharacterSchema),
  comments: Type.Array(CommentSchema),
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

export type VideoDtoType = Static<typeof VideoDtoSchema>;

export const exampleVideo: VideoDtoType = {
  backdropPath: '/nX0fiZxhxd4j11EmTTCQPXuujrg.jpg',
  characters: [
    {
      actor: {
        id: 'clhi8s3dz01aijt080knqalsz',
        imgUrl: '/nX0fiZxhxd4j11EmTTCQPXuujrg.jpg',
        name: 'Ella Purnell',
        popularity: 19.744
      },
      character: 'Lucy MacLean',
      id: 'cm409hqhy000dla08ojxuf3yp'
    },
    {
      actor: {
        id: 'cm409hqhy000ila08h2h1zhgv',
        imgUrl: '/h2CJjnDEy2nCbCy6dWzXLmZ4p47.jpg',
        name: 'Aaron Moten',
        popularity: 10.252
      },
      character: 'Maximus',
      id: 'cm409hqhy000hla08dbjsx4oe'
    }
  ],
  comments: [
    {
      content:
        'Une très bonne série sur un univers que je ne connaissais pas. Se regarde tout seul.',
      createdAt: new Date('2024-04-10T00:00:00.000Z'),
      id: 'cm409jznu0000js08lwgifr3w',
      user: {
        email: 'jondoemail@gmail.com',
        id: 'clhf6co6s0000v3zsdv5o0p05',
        name: 'Jon Do,e'
      }
    }
  ],
  id: 'cm409hqhy0002la0820da2fjc',
  imdbId: null,
  movieDbId: '106379',
  overview: null,
  popularity: 136.608,
  posterPath: '/nX0fiZxhxd4j11EmTTCQPXuujrg.jpg',
  ratings: [
    {
      id: 'cm409jcmw004ela08cddpen34',
      note: 8,
      user: {
        email: 'jondoemail@gmail.com',
        id: 'clhf6co6s0000v3zsdv5o0p05',
        name: 'Jon Doe'
      }
    }
  ],
  releaseDate: new Date('2024-04-10T00:00:00.000Z'),
  title: 'Fallout',
  type: 'Series',
  voteAverage: 8.5
};
