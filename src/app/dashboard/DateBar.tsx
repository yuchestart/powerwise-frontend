'use client';

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DashboardContext } from "./context";
import SmallButton from "@/components/SmallButton";
import styles from "./Datebar.module.scss"
import * as Slider from "@radix-ui/react-slider"
import { HOUR, toDateString, toHrString, toTimeString } from "@/util/date";

export default function DateBar() {
    const context = useContext(DashboardContext);
    const [value,setValue] = useState(context.date.getTime());
    const [min,setMin] = useState(context.startDate.getTime());
    const [max,setMax] = useState(context.endDate.getTime());
    const resetToNow = useCallback(()=>{
        update([new Date().getTime()])
    },[min,max])
    const updateTooltip = useCallback((value:number[])=>{
        setValue(value[0]);
    },[])
    const update = useCallback((value:number[])=>{
        setValue(value[0]);
        context.setDate([new Date(min),new Date(value[0]),new Date(max)])
    },[min,max])
    useEffect(()=>{
        setMin(context.startDate.getTime())
        setMax(context.endDate.getTime())
        setValue(context.date.getTime())
    },[context.dateRange])
    return <div className="p-4 pointer-events-auto mx-30 backdrop-blur-lg bg-blur-background">
        <div className="text-center">Selected <SmallButton onClick={resetToNow}>Reset to Now</SmallButton></div>
        <div className="flex flex-row">
            <div>
                <DatePicker
                    className="border"
                    showTimeSelect
                    timeFormat="h:mm a"
                    dateFormat="yyyy-MM-dd h:mm aa"
                    selected={context.startDate}
                    onChange={(date) => context.setDate([date, context.date, context.endDate])}
                ></DatePicker>
            </div>
            <div className="grow flex flex-row justify-center">
                <div>
                    <DatePicker
                        className="border"
                        showTimeSelect
                        timeFormat="h:mm aa"
                        dateFormat="yyyy-MM-dd h:mm aa"
                        selected={context.date}
                        onChange={(date) => context.setDate([context.startDate, date, context.endDate])}
                    ></DatePicker>
                </div>
            </div>
            <div>
                <DatePicker className="border"
                    showTimeSelect
                    timeFormat="h:mm a"
                    dateFormat="yyyy-MM-dd h:mm aa"
                    selected={context.endDate}
                    onChange={(date) => context.setDate([context.startDate, context.date, date])}
                ></DatePicker>
            </div>
        </div>
        <div className="my-3 flex flex-row">
            <div className="mr-5">Start</div>
            <div className="grow h-6 relative">
                <Slider.Root 
                className="relative h-full flex items-center select-none touch-none w-full"
                onValueChange={updateTooltip}
                onValueCommit={update}
                value={[value]}
                min={min}
                max={max} step={HOUR}>
                    <Slider.Track className="bg-gray-200 relative grow h-5">
                        <Slider.Range className="absolute bg-blue-500 h-5"></Slider.Range>
                    </Slider.Track>
                    <Slider.Thumb className="block h-5 w-0.5 bg-yellow-500">
                        <span className="absolute top-full transform-[translate(-50%)] focus:outline-none w-max text-sm">{toDateString(new Date(value)) + " " + toHrString(new Date(value))}</span>
                    </Slider.Thumb>
                </Slider.Root>
            </div>
            <div className="ml-5">End</div>
        </div>
    </div>
}