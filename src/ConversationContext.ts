export type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

export class ConversationContext {
  public readonly messages: Message[];

  constructor() {
    this.messages = [];
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }

  addMessages(messages: readonly Message[]) {
    this.messages.push(...messages);
  }
}
