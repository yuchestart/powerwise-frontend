'use client';

import { createContext, ReactNode, RefObject, useReducer, useRef, useState } from "react";
import type { _ChatContextInterface, Chat, Message } from "./types";
import { fetchWithAuth } from "@/util/auth";

export const ChatContext = createContext<_ChatContextInterface>(null);

export function ChatManager({children}:{children?:ReactNode}){
    const chatsRef:RefObject<Chat[]> = useRef<Chat[]>([]);
    const currentChatRef:RefObject<Message[]> = useRef<Message[]>([]);
    const [currentChatId,setCurrentChatId] = useState<string>(null);
    const [revision,nudge] = useReducer((x)=>x+1,0);

    const valueRef:RefObject<_ChatContextInterface> = useRef(null);
    valueRef.current = {
        chats:chatsRef.current,
        currentChat:currentChatRef.current,
        currentChatId:currentChatId,
        async setCurrentChat(id:string){
            setCurrentChatId(id);
            currentChatRef.current = [];
            if(id === null) return;
            //TODO: Add service worker
            const response = await fetchWithAuth(new URL(`/chat/get_chat?chatid=${id}`,process.env.NEXT_PUBLIC_API_URL));
            if(response.status !== 200){
                throw new Error(`Getting chat failed - status code ${response}`)
            }
            currentChatRef.current = await response.json()
        },
        async getChats(){
            nudge();
            return; //TODO: Remove once chat history is implemented
            const response = await fetchWithAuth(new URL("/chat/get_chats",process.env.NEXT_PUBLIC_API_URL))
            if(response.status !== 200){
                if(response.status === 404){
                    setCurrentChatId(null);
                    chatsRef.current = [];
                    return
                }
                throw new Error(`Getting chats failed - status code ${response}`)
            }
            const chats = await response.json();
            chatsRef.current = chats;
            nudge();
            return chats;
        },
        async deleteChat(id:any){
            if(id === currentChatId){
                setCurrentChatId(null);
                chatsRef.current = [];
            }
            const response = await fetchWithAuth(new URL(`/chat/delete?chatid=${id}`,process.env.NEXT_PUBLIC_API_URL),{
                method:'delete'
            });
            if(response.status !== 200){
                throw new Error("Failed to delete chat");
            }
            chatsRef.current = chatsRef.current.filter((v)=>v.id !== id);
        },
        updateChat(contents: Message[]){
            currentChatRef.current = [...contents];
            nudge();
        },
        getMe(){
            return valueRef.current;
        },
        revision
    }
    return <ChatContext.Provider value={valueRef.current}>
        {children}
    </ChatContext.Provider>
}