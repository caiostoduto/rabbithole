export interface Env {
	KV: KVNamespace;
	BUCKET: R2Bucket;

	ENDPOINT: string;
	BUCKETNAME: string;
	ACCESSKEYID: string;
	SECRETACCESSKEY: string;
}

export interface KVFileEntry {
	name: string;
	contentType: string;
	createdAt: string;
	key: string;
}
