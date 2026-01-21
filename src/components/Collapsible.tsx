import { type ReactNode, useState } from "react";

export default function Collapsible({ children, title, collapsed: defaultCollasped = true, maxHeight = 150 }: { children?: ReactNode, title?: ReactNode, collapsed?: boolean, maxHeight?: number }) {
    const [collapsed, setCollapsed] = useState<boolean>(defaultCollasped);
    return <div>
        <div className="flex flex-row">
            <div className="grow">
                {title}
            </div>
            <div>
                <button
                    onClick={() => {setCollapsed(!collapsed)}}
                    style={{transform:collapsed?"rotate(0deg)":"rotate(-180deg)"}}
                    className="transition-transform p-0 m-0 cursor-pointer text-foreground select-none"
                    title="Collapse/Expand"
                >˅</button>
            </div>
        </div>
        <div className="overflow-auto transition-all" style={{maxHeight:collapsed ? "0px" : `${maxHeight}px`}}>
            {children}
        </div>
    </div>
}