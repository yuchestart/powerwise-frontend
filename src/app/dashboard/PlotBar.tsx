'use client';

import ReactECharts from "echarts-for-react";
import { useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { DashboardContext } from "./context";
import type { EChartsOption } from "echarts";
import { demandPlot } from "@/app/dashboard/_components/plots/DemandPlot";
import { consumerPricePlot } from "@/app/dashboard/_components/plots/CustomerPricePlot";
import Resizable from "./_components/Resizable";
import { mwPricePlot } from "./_components/plots/MWPricePlot";
import { useTheme } from "@/components/ThemeManager";
import { ZonePoint } from "./_components/types";
import { DAY, HOUR, roundToHour } from "@/util/date";
import { fetchWithAuth } from "@/util/auth";
import { debounce } from "@/util/scripting";
import EChartsReact from "echarts-for-react";

function PlotSelector({ where, what, setPlotType }: { setPlotType: (value: string) => void, where: string, what: string }) {
    return <button
        className="border rounded-sm p-2 block text-nowrap w-full text-left cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={() => setPlotType(where)}
    >{what}</button>
}

export default function PlotBar() {
    const [, nudge] = useReducer((x) => x + 1, 0);
    const dataRef = useRef<ZonePoint[]>([]);
   // const zoomRef = useRef<number>(DAY);
    const dashboardContext = useContext(DashboardContext);
    const theme = useTheme();
    const plot = demandPlot(dashboardContext,dataRef.current)
    const fetchData = useCallback(async (startDate: Date, endDate: Date) => {
        if(startDate.getTime() === 0) return;
        const response = await fetchWithAuth(new URL(`/dashboard/data/zonedata?start_date=${roundToHour(startDate).getTime() / 1000}&end_date=${roundToHour(endDate).getTime() / 1000}&density=${HOUR/1000}`, process.env.NEXT_PUBLIC_API_URL))
//        zoomRef.current=density;
        //TODO: Handle errors
        dataRef.current = await response.json();
        for (const element of dataRef.current) {
            element.time *= 1000;
        }
        nudge();
    }, []);
    const echartsRef = useRef<EChartsReact>(null);
    //const onDataZoom = useCallback((param) => {
    //    if (!echartsRef.current) return;
    //    const chartsInstance = echartsRef.current.getEchartsInstance();
    //    const option = chartsInstance.getOption();
    //    const start: number = option.dataZoom[0].startValue;
    //    const end: number = option.dataZoom[0].endValue;
    //    const density:number = Math.ceil(((end-start)/50)/HOUR)*HOUR;
    //    if(density === 0) return;
    //    fetchData(new Date(start),new Date(end),density);
    //}, []);
    useEffect(() => {
        fetchData(dashboardContext.startDate, dashboardContext.endDate);
    }, [dashboardContext.startDate, dashboardContext.endDate]);


//    const onEvents = useMemo(() => ({
//        'datazoom': debounce(onDataZoom, 300)
//    }), []);


    return <Resizable side="bottom" minSize={300} maxSize={500}>
        <div className="p-4 w-full justify-between overflow-hidden h-full">
            <ReactECharts
                option={
                    {
                        ...plot,
                        backgroundColor: 'transparent',
                        dataZoom: [
                            { type: 'slider', xAxisIndex: 0},
                            { type: 'inside', xAxisIndex: 0}
                        ]
                    }
                }
                theme={theme}
                notMerge
                style={{}}
                autoResize
                ref={echartsRef}
            ></ReactECharts>
        </div>
    </Resizable>
}