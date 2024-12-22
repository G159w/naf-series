import { apiApp } from '$lib/server/api';

const app = apiApp;

type RequestHandler = (v: { request: Request }) => Promise<Response> | Response;

export const GET: RequestHandler = ({ request }) => app.handle(request);
export const POST: RequestHandler = ({ request }) => app.handle(request);
export const PUT: RequestHandler = ({ request }) => app.handle(request);
export const DELETE: RequestHandler = ({ request }) => app.handle(request);
export const PATCH: RequestHandler = ({ request }) => app.handle(request);
export const HEAD: RequestHandler = ({ request }) => app.handle(request);
