# NAF Series

NAF Series is a Svelte-based web application designed to manage and view video content. The project is structured to handle both frontend and backend functionalities, providing a seamless user experience.

## Project Structure

The project is organized into frontend and backend directories, with a clear separation between API routes and frontend routes:

```
naf-series/
├── src/
│   ├── lib/
│   │   ├── server/
│   │   │   └── api/               # Elysia API implementation
│   │   │       ├── videos/        # Video-related endpoints
│   │   │       ├── video-clubs/   # VideoClub-related endpoints
│   │   │       └── application.controller.ts
│   │   └── ...
│   └── routes/
│       ├── api/
│       │   └── [...slug]/         # API catch-all route that forwards to Elysia
│       │       └── +server.ts     # Handles all HTTP methods and forwards to Elysia
│       └── (app)/                 # Frontend routes (SvelteKit pages)
│           ├── videoclubs/        # Frontend video club pages
│           ├── signin/            # Authentication pages
│           └── ...
```

## Frontend

The frontend is built using Svelte and TypeScript. It includes various UI components located in the `src/lib/components/ui/` directory, such as buttons, dialogs, drawers, inputs, and more. The main layout and pages are defined in the `src/routes/` directory.

### Frontend Libraries

- **Svelte + SvelteKit**: Modern framework for building user interfaces with built-in routing and SSR capabilities.
- **TypeScript**: Adds static typing to JavaScript to improve development experience and code quality.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development with consistent design patterns.
- **@tanstack/svelte-query**: Powerful data synchronization for Svelte, handling server state, caching, and real-time updates.
- **shadcn-svelte**: Svelte components for common UI elements like buttons, modals, and notifications.

## Backend

The backend is structured to handle API requests and database interactions, built with a clean architecture pattern (Controllers, Services, Repositories). Key directories include:

- `src/lib/server/api/videos/`: Contains controllers, services, and repositories for managing video-related data.
- `src/lib/server/utils.ts`: Utility functions for the server.

### Backend Libraries

- **Elysia**: Modern Node.js web framework with strong TypeScript support.
- **@needle-di/core**: Dependency injection system for clean architecture and better testability.
- **Prisma**: Type-safe ORM with auto-generated queries and migrations for database management.
- **@elysiajs/swagger**: OpenAPI/Swagger documentation generator for Elysia endpoints.
- **@elysiajs/cors**: CORS middleware for Elysia to handle cross-origin requests.
- **@elysiajs/eden**: Type-safe API client generator for Elysia.
- **@prisma/extension-accelerate**: Performance optimization for Prisma queries.
- **dayjs**: Modern date utility library for consistent date handling.

## Development Tools

- **Vite**: Next-generation frontend build tool offering extremely fast HMR.
- **ESLint + Prettier**: Code linting and formatting for consistent code style:
  - eslint-plugin-svelte: Svelte-specific linting rules
  - eslint-plugin-perfectionist: Advanced code organization rules
  - prettier-plugin-svelte: Svelte support for Prettier
  - prettier-plugin-tailwindcss: Automatic class sorting for Tailwind CSS


## API Documentation

The API documentation is automatically generated using Swagger and is accessible at:

- Development: http://localhost:5173/api/swagger
- Production: https://your-domain.com/api/swagger

The documentation provides detailed information about available endpoints, request/response schemas, and authentication requirements.

## Features

### Video Club Management
- Create and manage multiple video clubs
- Share video clubs with other users
- Organize movies and TV shows by categories
- Track watch status and ratings

### Content Integration
- Integration with The Movie Database (TMDB) API
- Rich metadata for movies and TV shows
- Automatic fetching of:
  - Cast and crew information
  - Release dates and genres
  - Posters and backdrops
  - Plot summaries

### User Experience
- Responsive design for mobile and desktop
- Dark/Light theme support
- Real-time updates using TanStack Query
- Toast notifications for user actions
- Infinite scrolling for content lists
- Advanced search and filtering capabilities


## Architecture

### Clean Architecture
The project follows clean architecture principles:
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Handle data access
- **DTOs**: Define data transfer objects
- **Entities**: Define domain models

### Type Safety
End-to-end type safety is achieved through:
- TypeScript for static type checking
- Prisma for type-safe database queries
- Elysia for type-safe API endpoints
- TanStack Query for type-safe API consumption
- Automatic OpenAPI documentation generation

### Database Schema
The application uses Prisma with PostgreSQL. Key models include:
- Users and Authentication
- Video Clubs
- Videos (Movies/TV Shows)
- Ratings and Comments
- Actors and Creators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Code Style
The project uses ESLint and Prettier for code formatting. Before committing:
```bash
bun run lint
```

### Routing Structure

#### API Routes (`/src/routes/api/`)
The API routing is handled through a catch-all route that forwards requests to the Elysia backend:

1. All API requests go through `/routes/api/[...slug]/+server.ts`
2. This server handler forwards the requests to the Elysia application in `lib/server/api/`
3. Elysia then routes to the appropriate controller:
   - `/api/video-clubs/*` → VideoClubsController
   - `/api/video-clubs/:videoClubId/videos/*` → VideosController

Example API Endpoints:
- GET `/api/video-clubs` - List video clubs
- GET `/api/video-clubs/:videoClubId` - Get video club details
- POST `/api/video-clubs/:videoClubId/videos` - Add video to club
- GET `/api/video-clubs/:videoClubId/videos/:videoId` - Get video details

#### Frontend Routes (`/src/routes/(app)/`)
The frontend routes are handled by SvelteKit and provide the user interface:

1. Base Layout (`/routes/+layout.svelte`)
   - Handles global UI components
   - Sets up TanStack Query provider

2. App Layout (`/routes/(app)/+layout.svelte`)
   - Manages authenticated app structure
   - Handles sidebar and navigation

3. Page Routes:
   - `/videoclubs/[club_id]` - Video club detail page
   - `/signin` - Authentication page
   - `/` - Home page

The frontend communicates with the API using TanStack Query modules:
- `lib/tanstack-query/videos.ts`
- `lib/tanstack-query/video-clubs.ts`

## Prerequisites

- Bun (latest version)
- CockroachDB


## Environment Setup

The project requires certain environment variables to be set. Create a `.env` file in the root directory with:

```env
DATABASE_URL="your-database-url"
MOVIE_DB_KEY="your-moviedb-api-key"
AUTH_GOOGLE_ID="your-auth"
AUTH_GOOGLE_SECRET="your-auth-secret"
AUTH_SECRET="your-auth-secret
```

## Package Management

This project uses Bun as the package manager. Common commands:

```bash
# Install dependencies
bun install

# Add a new dependency
bun add package-name

# Add a development dependency
bun add -D package-name
```

## Development

To start the development server:

```bash
bun run dev
```

To build the project for production:

```bash
bun run build
```

To preview the production build:

```bash
bun run preview
```

## Deployment

### Production Build
1. Set production environment variables
2. Run database migrations:
   ```bash
   bun prisma migrate deploy
   ```
3. Build the application:
   ```bash
   bun run build
   ```
4. Start the production server:
   ```bash
   bun run start
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
