'use client';

import Resizable from "../_components/Resizable";
import ChatBar from "./ChatBar";
import { ChatManager } from "./context";

export default function Chat() {
    return <Resizable side="right" minSize={200} maxSize={500}>
        <ChatManager>
            <ChatBar></ChatBar>
        </ChatManager>
    </Resizable>
}