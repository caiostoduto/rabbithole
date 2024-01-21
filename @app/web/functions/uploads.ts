import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { Env } from "./types/env";
import { FileEntry } from "./types/kv";
import { r2 } from "./utils/r2";
import { checkTLS } from "./utils/tls";
import jwt from '@tsndr/cloudflare-worker-jwt'


export const onRequestPost: PagesFunction<Env> = async (context) => {
	try {
		checkTLS(context);
	} catch (e) {
		return e as Response;
	}

	const uploadBodySchema = z.object({
		name: z.string().min(1),
		contentType: z.string().regex(/\w+\/[-+.\w]+/),
	});

	const bodyText = await context.request.text();

	if (!await jwt.verify(bodyText, context.env.JWTSECRET, 'HS256')) {
		return new Response('Unauthorized', { status: 401 });
	}

	const decodedBody = jwt.decode(bodyText).payload

	let uploadBody: z.infer<typeof uploadBodySchema>;
	try {
		uploadBody = uploadBodySchema.parse(decodedBody);
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
		} as FileEntry),
	);

	return new Response(JSON.stringify({ signedUrl, fileId }), { status: 200 });
};
