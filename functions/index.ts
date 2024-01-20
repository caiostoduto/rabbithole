import { Env } from "./types/env";

export const onRequest: PagesFunction<Env> = async (context) => {
	return Response.redirect(await context.env.KV.get("_redirect-url"));
};
