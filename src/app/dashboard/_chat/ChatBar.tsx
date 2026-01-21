'use client';

import Button from "@/components/Button"
import { ChatScreen } from "./ChatScreen"
import { useCallback, useContext, useState } from "react"
import ChatHistory from "./ChatHistory";
import { ChatContext, ChatManager } from "./context";

function ChatUI() {
    const chatContext = useContext(ChatContext);
    const [screen, setScreen] = useState<'chat' | 'history'>("chat");
    const newChat = useCallback(()=>{
        if(!confirm("Creating a new chat will delete your current one. Are you sure?")) return;
        const ctx = chatContext.getMe();
        ctx.setCurrentChat(null);
        ctx.updateChat([]);
    },[])
    return <div className="flex flex-col h-full overflow-auto">
        <div className="p-4 text-2xl flex flex-row sticky top-0">
            <div className="grow">
                {screen === "chat" ? "Chat with AI" : "My Chats"}
                <p className="text-[0.5em]">Responses from AI may be incorrect.</p>
            </div>
            <div>
                {/*<Button onClick={() => setScreen(screen === "chat" ? "history" : "chat")}>{
                    screen === "chat" ?
                        <>My Chats &gt;</> :
                        <>&lt; Back</>
                }</Button>*/}
                <Button onClick={newChat}>New Chat</Button>
            </div>
        </div>
        <ChatScreen hidden={screen !== 'chat'}></ChatScreen>
        {/*<ChatHistory hidden={screen !== 'history'}></ChatHistory>*/}
    </div>
}

export default function ChatBar() {
    //TODO: Add auth guard
    return <ChatManager>
        <ChatUI></ChatUI>
    </ChatManager>
}