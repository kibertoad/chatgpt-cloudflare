import {ChatGPTClient} from "../src/ChatGPTClient";

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/testWorker.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/testWorker.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export interface Env {
	OPENAI_API_KEY: string
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const openAiClient = new ChatGPTClient(env.OPENAI_API_KEY)
		const body = await request.json() as Record<string, any>
		console.log(JSON.stringify(body))

		const response = await openAiClient.getResponse({
				prompt: 'After this sentence, I will give you some text; please repeat all of it verbatim, but add an exclamation point in its end. \n ' + body.prompt,
			}
		)

		const responseText = response.text

		return new Response(JSON.stringify({
			response: responseText,
		}));
	},
};

