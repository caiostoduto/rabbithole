import { S3Client } from "@aws-sdk/client-s3";
import { Env } from "../types/env";

export function r2(env: Env): S3Client {
	return new S3Client({
		region: "auto",
		endpoint: env.ENDPOINT,
		credentials: {
			accessKeyId: env.ACCESSKEYID,
			secretAccessKey: env.SECRETACCESSKEY,
		},
	});
}
