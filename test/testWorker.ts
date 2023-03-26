import { ChatGPTClient } from "../src/ChatGPTClient";

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
  OPENAI_API_KEY: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const openAiClient = new ChatGPTClient(env.OPENAI_API_KEY);
    const body = (await request.json()) as Record<string, any>;

    const response = await openAiClient.getResponse({
      prompt:
        "After this sentence, I will give you some text; please repeat all of it verbatim, but add an exclamation point in its end. \n " +
        body.prompt,
      systemContext: "You are a helpful assistant.",
    });

    const responseText = response.text;

    return new Response(
      JSON.stringify({
        response: responseText,
      })
    );
  },
};
