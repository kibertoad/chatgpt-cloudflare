import { ChatGPTClient } from "../src/ChatGPTClient";
import { ConversationContext } from "../src/ConversationContext";

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
