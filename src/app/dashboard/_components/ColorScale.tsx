'use client';

import SmallButton from "@/components/SmallButton";
import { useContext, useState } from "react";
import { DashboardContext } from "../context";
import clsx from "clsx";

export default function ColorScale() {
    const [show,setShow] = useState(true);
    const dashboardContext = useContext(DashboardContext)
    const SCALE_MIN = Math.ceil(Math.min(...dashboardContext.mapData.map((v)=>v.demand))/100)*100;
    const SCALE_MAX = Math.floor(Math.max(...dashboardContext.mapData.map((v)=>v.demand))/100)*100;
    const format = new Intl.NumberFormat();
    return <div className="p-3 w-fit m-4 pointer-events-auto backdrop-blur-lg bg-blur-background cursor-pointer select-none" onClick={()=>setShow(!show)}>
        <div className="text-sm"  hidden={!show}>Demand (mWh)</div>
        <div className={`flex flex-row text-sm ${clsx({"mt-3":show})}`}>
            <div className="w-3 h-30" style={{ "background": "linear-gradient(to top, blue, red)" }}></div>
            <div className="flex-col flex justify-between ml-2" hidden={!show}>
                <div className="transform-[translateY(-40%)]">{format.format(SCALE_MAX)}</div>
                <div>{format.format((SCALE_MIN+SCALE_MAX)/2)}</div>
                <div className="transform-[translateY(40%)]">{format.format(SCALE_MIN)}</div>
            </div>
        </div>
    </div>
}