'use client';
import clsx from "clsx"
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./context";

function ChatMessage({ sender = "user", content = "", typing = false }: { sender?: "assistant" | "user", content?: string, typing?: boolean }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (typing) {
            scrollRef.current.scrollIntoView({ behavior: "instant" });
        }
    })
    return <div className={"flex flex-row"} >
        <div className={clsx({ "grow": sender === 'user' })}></div>
        <div className='w-fit max-w-full'>
            <div className={
                `p-2.5 rounded-t-xl whitespace-normal ${clsx({
                    "rounded-bl-xl bg-foreground text-background": sender === "user",
                    "rounded-br-xl bg-background2": sender === "assistant"
                })
                }`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={
                    {
                        ul({node,className,children,...props}){
                            return <ul {...props} className="pl-8 m-0 space-y-0 list-inside list-disc">
                                {children}
                            </ul>
                        },
                        ol({node,className,children,...props}){
                            return <ol {...props} className="list-decimal pl-8">
                                {children}
                            </ol>
                        },
                        p({node,className,children,...props}){
                            return <p {...props} className="my-2">{children}</p>
                        },
                        pre({ node, className, children, ...props }) {
                            return <pre {...props} className={"max-w-full overflow-x-auto border border-black rounded-sm"}>
                                {children}
                            </pre>
                        }
                    }
                }>
                    {content}
                </ReactMarkdown>
                {typing ? <span className="px-1.25 bg-blue-300 animate-blink"></span> : null}
                <div ref={scrollRef}></div>
            </div>
        </div>
    </div>
}

export default function PreviousMessages() {
    const { currentChat: messages } = useContext(ChatContext)
    //TODO: Replace the hello message
    return <div className="p-4 grow overflow-y-auto">
        <ChatMessage sender="assistant" content={"**👋 Hello, I'm your assistant.**\nIs there anything I can help with?"}></ChatMessage>
        {
            messages.map((message, i) =>
                <ChatMessage sender={message.role} content={message.content} typing={message.typing} key={i}></ChatMessage>
            )
        }
    </div>
}