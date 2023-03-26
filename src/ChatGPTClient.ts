const CHATGPT_MODEL = 'gpt-3.5-turbo'

const USER_LABEL = 'user'
const SYSTEM_LABEL = 'system'

const BASE_URL = "https://api.openai.com/v1/chat/completions"

export type PromptParams = {
    prompt: string
    systemContext?: string
    parentMessageId?: string
}

export class ChatGPTClient {
    apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    private post(url: string, body: Record<string, unknown>, headers?: HeadersInit) {
        let allHeaders = headers || {}
        // @ts-ignore
        allHeaders["Content-Type"] = "application/json;charset=utf-8"
        return fetch(url, {
            method: "post",
            body: JSON.stringify(body),
            headers: allHeaders
        })
    }

    async getResponse(params: PromptParams) {
        const body = {
            model: CHATGPT_MODEL,
            messages: [
                {"role": SYSTEM_LABEL, "content": params.systemContext || "You are a helpful assistant."},
                {"role": USER_LABEL, "content": params.prompt}
            ],
        }
        const headers = {
            "Authorization": "Bearer " + this.apiKey
        }
        try {
            const response = await this.post(BASE_URL, body, headers)
            const json = await response.json() as any
            console.log(JSON.stringify(json))
            if ("error" in json) {
                throw new Error(json.error.message)
            } else if ("choices" in json && json.choices.length > 0) {
                return {
                    text: json.choices[0].message.content,
                    id: json.id,
                }
            } else {
                throw new Error("Did not receive any message choices")
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
