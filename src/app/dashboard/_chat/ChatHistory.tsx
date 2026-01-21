'use client';

import { useCallback, useContext, useEffect } from "react";
import { ChatContext } from "./context";
import { Chat } from "./types";
import SmallButton from "@/components/SmallButton";

function ChatButton({ chat }: { chat: Chat }) {
    const context = useContext(ChatContext);
    const selectChat = useCallback(async ()=>{
        const me = context.getMe();
        await me.setCurrentChat(chat.id);
    },[chat])
    const deleteChat = useCallback((e:MouseEvent)=>{
        const me = context.getMe();
        e.stopPropagation()
        if(!confirm("Are you sure you want to delete this chat?")) return
        me.deleteChat(chat.id);
        if(me.currentChatId === chat.id){
            me.updateChat([]);
        }
    },[chat]);
    return <div className="border rounded-md p-2 flex flex-row cursor-pointer hover:bg-[rgba(255,255,255,0.3)] transition-colors" onClick={selectChat}>
        <div className="grow">
            {chat.summary}
        </div>
        <div>
            <SmallButton isDanger onClick={deleteChat}>Delete</SmallButton>
        </div>
    </div>
}

export default function ChatHistory({ hidden }: { hidden?: boolean }) {
    const context = useContext(ChatContext);
    useEffect(() => {
        const updateChats = async () => {
            await context.getChats();
        };
        updateChats();
    }, [hidden]);
    return <div hidden={hidden} className="p-4">
        {
            context.chats.map((x) =>
                <ChatButton chat={x} key={x.id}></ChatButton>
            )
        }
    </div>
}