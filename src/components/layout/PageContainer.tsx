import type { ReactNode } from "react";

export default function PageContainer({children=null}:{children?:ReactNode}){
    return <div className="absolute w-full left-0 top-(--navbar-height) h-[calc(100%-var(--navbar-height))]">
        {children}
    </div>
}