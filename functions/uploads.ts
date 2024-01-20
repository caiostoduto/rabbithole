interface Env {
	RABBITHOLE: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
	return new Response("Get request");
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
	return new Response("Post request");
};
