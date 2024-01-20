import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { Env } from "./types/env";
import { FileEntry } from "./types/kv";
import { r2 } from "./utils/r2";
import { checkTLS } from "./utils/tls";

export const onRequestGet: PagesFunction<Env> = async (context) => {
	try {
		checkTLS(context);
	} catch (e) {
		return e as Response;
	}

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
	const file = (await context.env.KV.get(id, "json")) as FileEntry;

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
