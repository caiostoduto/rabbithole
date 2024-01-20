interface Env {
	RABBITHOLE: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
	return Response.redirect(await context.env.RABBITHOLE.get("_redirect-url"));
};
