import { Env } from "../types/env";

interface context {
  env: Env;
}

export async function checkTLS(context: any) {
  const tlsVersion = context.request.cf.tlsVersion;
  // Allow only TLS versions 1.3 (https://developers.cloudflare.com/workers/examples/block-on-tls)
  if (tlsVersion !== "TLSv1.3") {
    throw new Response("Please use TLS version 1.3 or higher.", {
      status: 403,
    });
  }
}
