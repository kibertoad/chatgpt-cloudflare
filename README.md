# chatgpt-cloudflare
ChatGPT API client, compatible with Cloudflare Workers

## Running tests

In order to execute tests that make call to real ChatGPT, please copy `dev.vars.default` into `.dev.vars` and replace key with the real one.

## Usage example

```ts
import { ChatGPTClient, ConversationContext } from "chatgpt-cloudflare";

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

    const context = new ConversationContext();
    await openAiClient.getResponse(
      {
        prompt:
          "After this sentence, I will give you some text; please repeat all of it verbatim, but add an exclamation point in its end. \n " +
          body.prompt,
        systemContext: "You are a helpful assistant.",
      },
      context
    );

    const response2 = await openAiClient.getResponse(
      {
        prompt:
          "Please respond with your previous answer, but add one more exclamation mark to it",
      },
      context
    );

    const responseText = response2.text;

    return new Response(
      JSON.stringify({
        response: responseText,
      })
    );
  },
};
```
