import { ConversationContext, Message } from "./ConversationContext";
import { defaultErrorHandler, ErrorHandler } from "./Logger";

const CHATGPT_MODEL = "gpt-3.5-turbo";

const USER_LABEL = "user"; // user input
const SYSTEM_LABEL = "system"; // context
const ASSISTANT_LABEL = "assistant"; // ai response

const BASE_URL = "https://api.openai.com/v1/chat/completions";

export type ChatGPTRequestBody = {
  model: "gpt-3.5-turbo";
  messages: readonly Message[];
  temperature?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
};

export type PromptParams = {
  prompt: string;
  systemContext?: string;
};

export class ChatGPTClient {
  private readonly apiKey: string;
  private readonly errorHandler: ErrorHandler;

  constructor(apiKey: string, errorHandler?: ErrorHandler) {
    this.apiKey = apiKey;
    this.errorHandler = errorHandler || defaultErrorHandler;
  }

  private post(url: string, body: ChatGPTRequestBody, headers?: HeadersInit) {
    let allHeaders = headers || {};
    // @ts-ignore
    allHeaders["Content-Type"] = "application/json;charset=utf-8";
    return fetch(url, {
      method: "post",
      body: JSON.stringify(body),
      headers: allHeaders,
    });
  }

  async getResponse(
    params: PromptParams,
    context: ConversationContext = new ConversationContext()
  ) {
    const newMessages: Message[] = [];
    if (params.systemContext) {
      newMessages.push({ role: SYSTEM_LABEL, content: params.systemContext });
    }
    newMessages.push({ role: USER_LABEL, content: params.prompt });
    context.addMessages(newMessages);
    const finalPrompt = [...context.messages];

    const body = {
      model: CHATGPT_MODEL,
      messages: finalPrompt,
    } satisfies ChatGPTRequestBody;
    const headers = {
      Authorization: "Bearer " + this.apiKey,
    };
    try {
      const response = await this.post(BASE_URL, body, headers);
      const json = (await response.json()) as any;
      if ("error" in json) {
        const error = new Error(json.error.message)
        this.errorHandler(error);
        throw error
      } else if ("choices" in json && json.choices.length > 0) {
        const responseContent = json.choices[0].message.content;
        context.addMessage({
          role: ASSISTANT_LABEL,
          content: responseContent,
        });
        return {
          text: responseContent,
          id: json.id,
        };
      } else {
        const error = new Error("Did not receive any message choices")
        this.errorHandler(error);
        throw error
      }
    } catch (error) {
      this.errorHandler(error as Error);
      throw error
    }
  }
}
