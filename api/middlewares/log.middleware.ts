import { Elysia } from "elysia";

export const logMiddleware = new Elysia()
    .onRequest(async ({ request }) => {
        const { method, url } = request;

        console.log(` [${method}] ${url} - Iniciado`);
        console.log(" Body da requisição:", await request.clone().json());

    })
    .onError(({ request, error }) => {
        const { method, url } = request;

        console.error(`❌ [${method}] ${url} - Erro`, {
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            stack: error instanceof Error ? error.stack : undefined
        });
    });