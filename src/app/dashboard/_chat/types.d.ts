export interface Message{
    role:'assistant'|'user';
    content:string;
    typing?:boolean;
}

export interface Chat{
    id:string;
    summary:string;
}

export interface ChatContextInterface{
    chats: Chat[]
    currentChat: Message[],
    currentChatId: string,
    setCurrentChat(id:string): Promise<void>;
    getChats(): Promise<void>
    updateChat(chat: Message[])
    deleteChat(id): Promise<void>;

}

export interface _ChatContextInterface extends ChatContextInterface{
    getMe(): ChatContextInterface,
    revision: number
}