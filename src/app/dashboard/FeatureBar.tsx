'use client';

import Resizable from "@/app/dashboard/_components/Resizable";
import { type ReactNode, useCallback, useContext, useMemo, useReducer, useRef, useState } from "react";
import { DashboardContext } from "./context";
import SmallButton from "@/components/SmallButton";
import Button from "@/components/Button";
import CustomFeatures from "./_components/AdditionalFeatures";
import Collapsible from "@/components/Collapsible";

const ZONES = [1, 4, 6, 27, 35, 8910]; // Do not hardcode, but I don't really know otherwise

function Layer({
    children,
    radioName = null,
    radioValue = null,
    checked = false,
    onChange = () => { }
}: {
    children?: ReactNode,
    radioName?: string,
    radioValue?: string,
    checked?: boolean,
    onChange?: (...x: any[]) => any
}) {
    const ref = useRef<HTMLInputElement>(null);
    const _onChange = ()=>{
        onChange(ref.current.checked);
    }
    return <div>
        <label className="select-none inline-block w-full cursor-pointer">
            <input type={radioName ? "radio" : "checkbox"} name={radioName} value={radioName ? radioValue : undefined} className="text-2xl" defaultChecked={checked} onChange={_onChange} ref = {ref}></input>&nbsp;
            {children}
        </label>
    </div>
}

export default function FeatureBar() {
    const dashboardContext = useContext(DashboardContext);
    const onChange = useCallback((x: number) => {
        dashboardContext.selectZone(x);
    }, []);

    return <Resizable side="left" minSize={250} maxSize={400}>
        <div className="p-4 overflow-clip h-full">
            <p className="text-2xl">Layers</p>
            <ul className="p-2">
                <li><Layer checked={true} onChange={(checked)=>{dashboardContext.selectLayer("lrz")}}>Demand by LRZ</Layer></li>
                <li><Layer checked={true} onChange={(checked)=>{dashboardContext.selectLayer("features")}}>Custom Features</Layer></li>
            </ul>
            <CustomFeatures></CustomFeatures>
            <p className="text-2xl">Selected LRZs</p>
            <ul className="p-2">
                {ZONES.map((v, i) =>
                    <li key={i}>
                        <label className="block w-full select-none cursor-pointer">
                            <input
                                type="checkbox"
                                checked={dashboardContext.selectedZones.includes(v)}
                                onChange={() => onChange(v)}>
                            </input> &nbsp;
                            LRZ{v}
                        </label>
                    </li>)}
            </ul>
        </div>
    </Resizable>
}