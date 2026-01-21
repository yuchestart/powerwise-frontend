'use client';

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import "vm"

interface ResizeContextInterface {
    isResizing: boolean,
    setIsResizing: (value:boolean)=>void
}

export const ResizeContext = createContext<ResizeContextInterface>(null); 


/**
 * Manages global resizing variables
 * WARNING: DO NOT NEST
 * @returns 
 */
export function ResizeManager({ children }) {
    const [isResizing, setIsResizing] = useState(false);

    const setIsResizingCtx = useCallback((b:boolean)=>{
        setIsResizing(b)
    },[])


    const contextValue = useMemo(() => ({
        isResizing,
        setIsResizing:setIsResizingCtx
    }), [isResizing]);

    useEffect(() => {
        document.addEventListener("mouseup", (e) => {
            setIsResizing(false);
        })
    },[])
    return <ResizeContext.Provider value={contextValue}>{children}</ResizeContext.Provider>
}