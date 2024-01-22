# Rabbithole
Commandline Cloudflare R2 pre-signed URL file uploader using KV and Worker\
\
Inspired by [Construindo back-end de app de upload/download de arquivos](https://youtu.be/d21EWSFty6M)

## Features

- [x] Upload files to Cloudflare R2 Bucket using pre-signed URL
- [x] JWT authentication
- [x] Progress bar (with percent and average speed)
- [x] Sharable link after upload
- [ ] MIME Content-Type filtering
- [ ] User upload history

## Setting up

### Intallation
```bash
# Clone git repository
git clone https://github.com/caiostoduto/rabbithole.git
cd rabbithole

# Deploy pages.dev/functions
pnpm web install
pnpm web pages:deploy

# Install cli
pnpm cli install
npm install -g ./@app/cli
```

### Configuring

```bash
# Create a KV Namespace
https://developers.cloudflare.com/kv/get-started/

# Configure KV Namespace in Pages/Functions
https://developers.cloudflare.com/pages/functions/bindings/

# Add /index redirect URL to KV
https://github.com/caiostoduto/rabbithole/blob/main/docs/kv-redirect.jpeg

# Create a R2 Bucket
https://developers.cloudflare.com/r2/get-started/

# (Optional) Congifure file deletion after 7 days
https://github.com/caiostoduto/rabbithole/blob/main/docs/auto-deletion.jpeg

# Create a R2 API Token (with write access)
https://developers.cloudflare.com/r2/api/s3/tokens/

# Set environment variables
https://developers.cloudflare.com/pages/functions/bindings/#environment-variables

# Re-eploy pages.dev/functions
pnpm web pages:deploy

# Configure cli (jwt must be the same as the one in the environment variables)
rabbithole setup
```

Enviroment variables:

| Variable | Description |
| --- | --- |
| ACCESSKEYID | Cloudflare Account ID |
| BUCKETNAME | Cloudflare R2 Bucket Name |
| ENDPOINT | Cloudflare R2 Bucket S3 Endpoint |
| JWTSECRET | Random string without special chars|
| SECRETACCESSKEY | Cloudflare R2 Bucket ID |

### Usage

```bash
rabbithole --help

# Upload file
rabbithole upload <file>

# Setup cli
rabbithole setup
```
