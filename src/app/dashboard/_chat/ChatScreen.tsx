'use client'

import Button from "@/components/Button"
import PreviousMessages from "./PreviousMessages"
import { useCallback, useContext, useMemo, useRef, useState } from "react"
import { ChatContext } from "./context"
import { fetchWithAuth } from "@/util/auth"
import type { Message } from "./types"
import { DashboardContext } from "../context"
import { toISOString } from "@/util/date"
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { SendHorizontal } from "lucide-react"

function ChatBox() {
    const { getMe: getContext } = useContext(ChatContext);
    const { getMe: getDashboardContext, features, mapData } = useContext(DashboardContext);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { metricsCsv, userFeaturesJson } = useMemo(() => {
        const dashboardContext = getDashboardContext();
        let metricsCsv: string = "|Zone|Date|Demand|\n|---|---|---|", userFeaturesJson: any = {};
        {
            //TOOD: Add row scrunching
            for (const point of dashboardContext.mapData) {
                metricsCsv += `|LRZ${point.zone}|${toISOString(new Date(point.time))}|${point.demand}|`
            }
        }
        {
            let i = 0;
            for (const feature of dashboardContext.features) {
                if (!feature.selected) continue;
                let targetzone: string = null;
                for (const zone of dashboardContext.baseShape.features) {
                    if (booleanPointInPolygon(feature.location, zone.geometry)) {
                        targetzone = zone.properties.Zone;
                        break;
                    }
                }
                i++;
                userFeaturesJson[`#${i}. ${feature.name}`] = {
                    demand: feature.demand,
                    zone: targetzone,
                    description: feature.description
                }
            }
        }
        return { metricsCsv, userFeaturesJson }
    }, [features, mapData])
    const sendMessage = useCallback(async () => {
        setError("");
        const context = getContext();
        const userPrompt = inputRef.current.value;
        const chatNow: Message[] = [...context.currentChat, {
            "role": "user",
            "content": userPrompt
        }];
        inputRef.current.value = null;
        let chatId = context.currentChatId;
        if (context.currentChatId === null) {
            //Create new chat if is null
            const response = await fetchWithAuth(new URL("/chat/create", process.env.NEXT_PUBLIC_API_URL));
            if (response.status !== 200) {
                console.error(`Failed to create new chat, status code ${response.status}`)
                setError("Failed to send message.");
                return;
            }
            const id = await response.text();
            chatId = id;
            await context.setCurrentChat(id);
        }
        context.updateChat([...chatNow, { "role": "assistant", "content": "", "typing": true }])
        try{
            const response = await fetchWithAuth(new URL(`/chat/send?chatid=${chatId}`, process.env.NEXT_PUBLIC_API_URL), {
                method: "post",
                body: JSON.stringify({
                    "contents": userPrompt,
                    "context": {
                        "metrics": metricsCsv,
                        "userfeatures": JSON.stringify(userFeaturesJson)
                    }
                })
            });
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let message = "";
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                context.updateChat([...chatNow, { "role": "assistant", "content": message += chunk, "typing": true }])
            }
            context.updateChat([...chatNow, { "role": "assistant", "content": message }])
        }catch(e){
            context.updateChat([...chatNow]);
            setError("Something went wrong")
        }
    }, [metricsCsv, userFeaturesJson]);

    return <div className="w-full">
        <div className="text-red-500">{error}</div>
        <div className="flex flex-row items-start shrink">
            <textarea className="rounded-sm border w-full resize-none field-sizing-content min-h-16 p-1" ref={inputRef} placeholder="Enter Message"></textarea>
            <Button title="Send" onClick={sendMessage}>
                <SendHorizontal></SendHorizontal>
            </Button>
        </div>
    </div>
}

export function ChatScreen({ hidden }: { hidden?: boolean }) {
    return <div hidden={hidden} className="flex flex-col contain-size grow">
        <PreviousMessages></PreviousMessages>
        <ChatBox></ChatBox>
    </div>
}
