'use client';
import { ReactNode, useContext, useState, useRef, useCallback, useEffect } from "react";
import { ResizeContext } from "./ResizeManager";
import styles from "./Resizable.module.scss";
import clsx from "clsx";

export default function Resizable({ children, side, minSize=100, maxSize=300 }: { children?: ReactNode, maxSize?:number, minSize?:number, side: 'top' | 'left' | 'bottom' | 'right' }) {
    const resizeContext = useContext(ResizeContext);
    const isResizingRef = useRef(null);
    const isVert = side === 'top' || side === 'bottom';
    const [isResizing, setIsResizing] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    const [size,setSize] = useState((minSize + maxSize) / 2);
    const mouseDown = useCallback((e) => {
        setIsResizing(true);
        resizeContext.setIsResizing(true);
    }, []);
    useEffect(()=>{isResizingRef.current = {
        ctx:resizeContext,
        down:isResizing
    }})
    useEffect(() => {
        document.addEventListener("mousemove", (e) => {
            if (!isResizingRef.current.ctx.isResizing) return setIsResizing(false);
            if (!isResizingRef.current.down) return;
            const sidePosition = boxRef.current.getBoundingClientRect()[side];
            const newSize = (sidePosition - (isVert ? e.clientY : e.clientX)) * (side === "top" || side === "left" ? -1 : 1)
            setSize(Math.min(maxSize,Math.max(newSize,minSize)))
        });
    },[]);
    return <div className={`
        flex
        w-full h-full
        relative
        ${clsx({"select-none":isResizing,"select-auto":!isResizing})}
        overflow-hidden
        backdrop-blur-lg
        bg-blur-background
        pointer-events-auto
`} style={{[isVert ? "maxHeight" : "maxWidth"]:`${size}px`}} >
        <div onMouseDown={mouseDown} className={`
            ${clsx({'h-px':isVert, 'w-px':!isVert})}
            ${clsx({'cursor-ns-resize':isVert, 'cursor-ew-resize':!isVert})}
            before:content-['']
            before:bg-transparent
            before:absolute before:block
            ${clsx({'before:h-1.5':isVert,'before:w-1.5':!isVert})}
            ${clsx({'before:w-full':isVert,'before:h-full':!isVert})}
            ${clsx({
                'before:bottom-[-3px]':side==="top",
                'before:top-[-3px]':side==="bottom",
                "before:left-[-3px]":side==="right",
                "before:right-[-3px]":side==="left"
            })}
            before:transition-colors
            hover:before:bg-foreground
            pointer-events-auto
        `}></div>
        <div ref={boxRef} className={`
            flex-1
            ${clsx({"w-full":isVert,"h-full":!isVert})} shadow-sm
            ${{'t':'border-b','r':'border-l','b':'border-t','l':'border-r'}[side[0]]} border-gray-200
            overflow-auto
            `}>{children}</div>
    </div>

}
