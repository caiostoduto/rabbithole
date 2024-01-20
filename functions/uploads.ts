import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { Env, KVFileEntry } from "./types/env";
import { r2 } from "./utils/r2";

export const onRequestPost: PagesFunction<Env> = async (context) => {
	const uploadBodySchema = z.object({
		name: z.string().min(1),
		contentType: z.string().regex(/\w+\/[-+.\w]+/),
	});

	let uploadBody: z.infer<typeof uploadBodySchema>;
	try {
		uploadBody = uploadBodySchema.parse(await context.request.json());
	} catch (e) {
		return new Response(e, { status: 400 });
	}

	const { name, contentType } = uploadBody;

	const fileId = createId();
	const fileKey = `${fileId}-${name}`;

	const signedUrl = await getSignedUrl(
		r2(context.env),
		new PutObjectCommand({
			Bucket: context.env.BUCKETNAME,
			Key: fileKey,
			ContentType: contentType,
		}),
		{
			expiresIn: 600,
		},
	);

	await context.env.KV.put(
		fileId,
		JSON.stringify({
			name,
			contentType,
			createdAt: new Date().toISOString(),
			key: fileKey,
		} as KVFileEntry),
	);

	return new Response(JSON.stringify({ signedUrl, fileId }), { status: 200 });
};
