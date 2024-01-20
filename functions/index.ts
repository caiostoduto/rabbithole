export interface Env {
	KV: KVNamespace;
	BUCKET: R2Bucket;

	ENDPOINT: string;
	BUCKETNAME: string;
	ACCESSKEYID: string;
	SECRETACCESSKEY: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
	return Response.redirect(await context.env.KV.get("_redirect-url"));
};
