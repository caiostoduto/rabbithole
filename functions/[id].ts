import { z } from "zod";
import { Env, KVFileEntry } from "./types/env";
import { r2 } from "./utils/r2";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const onRequestGet: PagesFunction<Env> = async (context) => {
	const fileParamsSchema = z.object({
		id: z.string().cuid2(),
	});

	let fileParams: z.infer<typeof fileParamsSchema>;

	try {
		fileParams = fileParamsSchema.parse(context.params);
	} catch (e) {
		return new Response(e, { status: 400 });
	}

	const { id } = fileParams;
	const file = (await context.env.KV.get(id, "json")) as KVFileEntry;

	if (file === null) {
		return new Response("File not found", { status: 404 });
	}

	const signedUrl = await getSignedUrl(
		r2(context.env),
		new GetObjectCommand({
			Bucket: context.env.BUCKETNAME,
			Key: file.key,
		}),
		{
			expiresIn: 600,
		},
	);

	return Response.redirect(signedUrl, 302);
};
