The commits messages must respect this format:

```
<gitmoji>(<scope>) <subject>

<body>
```
Where:
- `<gitmoji>`: A gitmoji that represents the type of change you are making. You can find a list of available gitmojis [here](https://gitmoji.dev/).
- `<scope>`: A short description of the area of the codebase that is affected by the change. 
- `<subject>`: A short description of the change you are making. It should be written in the imperative mood and should not exceed 72 characters. the first works should be a verb in the present tense.
- `<body>`: A more detailed description of the change you are making more readable for humans.

# Application

The application is svetlkit web app deployed on Vercel. It uses svelte 5.

# Server side

The server side should respect the clean architecture principles.
- The controller are created `src/lib/server/api/<resource>/<resource>.controller.ts`
  - Every endpoint must have an openapi documentation that also type the route thanks to Elysia typing
  - example file: `src/lib/server/api/video/video.controller.ts`
- The service are created `src/lib/server/api/<resource>/<resource>.service.ts`
  - example file: `src/lib/server/api/video/video.service.ts`
- The repository are created `src/lib/server/api/<resource>/<resource>.repository.ts`
  - It extends a `PrismaRepository` that gives access to `this.prisma.db` to access the database
  - The prisma file is located `prisma/schema.prisma`
  - example file: `src/lib/server/api/video/video.repository.ts`
- The DTO's are created `src/lib/server/api/<resource>/dto/<resource>.dto.ts`
  - The dtos are done with `sinclair/typebox`
  - example file: `src/lib/server/api/video/dto/video.dto.ts`


# Client side

When creating a new component, you must create it in the the folder `src/lib/components/`
- inside, the `ui` folder contains the components that are created by `shadcn-svelte` and used in the app
- you must create new components and store them in the folder`src/lib/components/<subject>/<component>.svelte` with "subject" corresponding to the resource / part of the app where the component is used like `video`, `video-club`, etc.

Every call to the server must be done using the tanstack query. The front queries are stored in the folder `src/lib/tanstack-query/` that will contain the queries and mutations for the app.
- example file: `src/lib/tanstack-query/video.ts`
