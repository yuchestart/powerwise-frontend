import type { DashboardContextInterface, ZonePoint } from "../types";
import type { EChartsOption, SeriesOption, VisualMapComponentOption } from 'echarts';
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { useMemo } from "react";

export function demandPlot(context: DashboardContextInterface,data:ZonePoint[]): EChartsOption {
    //const data = context.mapData.filter((x) => x);
    const datazones: Record<number, ZonePoint[]> = {};
    const seriesList: SeriesOption[] = [];
    const visualMapList: VisualMapComponentOption[] = [];
    const featureDemand: Record<number, number> = {};

    for (const element of data) {
        if (!(element.zone in datazones))
            datazones[element.zone] = [element];
        else
            datazones[element.zone].push(element);
    }
    //Get demand from custom features
    for (const feature of context.features) {
        if (!feature.selected) continue;
        let targetzone: string = null;
        for (const zone of context.baseShape.features) {
            if (booleanPointInPolygon(feature.location, zone.geometry)) {
                targetzone = zone.properties.Zone;
                break;
            }
        }
        if (targetzone === null) continue;
        featureDemand[parseInt(targetzone.slice(3))] = (featureDemand[parseInt(targetzone.slice(3))] ?? 0) + feature.demand;
    }
    for (const key in datazones) {
        if (!context.selectedZones.includes(parseInt(key))) continue;
        const zone = datazones[key];
        zone.sort((a, b) => a.time - b.time);
        //const zone:ZonePoint[] = [];
        //let lastTime = -1;
        //let current = null;
        /*//Average demand
        for (const x of rawZone) {
            if (x.time > lastTime && current !== null) {
                zone.push(current);
                current = null;
                lastTime = x.time
            }
            if (current === null)
                current = {
                    time: x.time,
                    demand: x.demand,
                    didpredict: x.didpredict
                };
            else {
                current.demand += x.demand
                current.demand /= 2
            }
        }
        console.log(rawZone.length,zone.length)*/
        let visualMap:VisualMapComponentOption;
        { // W/O features
            const series: SeriesOption = {
                name: `LRZ${key}`,
                id:`LRZ${key}`,
                type: 'line',
                lineStyle: {
                    width: 2.5
                },
                data: zone.map((x) => [new Date(x.time), x.demand]),
                markLine: {
                    symbol: ['none', 'none'],
                    label: { show: false },
                },
                showSymbol: false
            };
            let currentPiece = null;
            let lastIsPredicted:string|boolean = "none";
            const pieces = []
            for(let i=0; i<zone.length; i++){
                if(lastIsPredicted !== zone[i].didpredict){
                    if(currentPiece !== null)pieces.push(currentPiece);
                    currentPiece = null;
                    lastIsPredicted = zone[i].didpredict;
                }
                if(!zone[i].didpredict) continue;
                if(currentPiece === null){
                    currentPiece = {
                        gt:zone[i].time,
                        lte:zone[i].time,
                    };
                } else {
                    currentPiece.lte = zone[i].time
                }
            }
            if(currentPiece !== null) pieces.push(currentPiece)
            visualMap = {
                dimension:0,
                type:'piecewise',
                pieces:pieces,
                seriesId:`LRZ${key}`,
                inRange:{
                    opacity:0.5
                },
                outOfRange:{
                    opacity:1
                },
                show:false
            }
            visualMapList.push(visualMap);
            seriesList.push(series);
        }
        if (featureDemand[key]) {
            const series: SeriesOption = {
                name: `LRZ${key} with Features`,
                type: 'line',
                id:`LRZ${key}+feature`,
                lineStyle: {
                    width: 2.5
                },
                data: zone.map((x) => [new Date(x.time), x.demand + (featureDemand[key] ?? 0)]),
                markLine: {
                    symbol: ['none', 'none'],
                    label: { show: false }
                },
                showSymbol: false
            }
            visualMapList.push({...visualMap,seriesId:`LRZ${key}+feature`})
            seriesList.push(series);
        }
    }

    //@ts-ignore
    seriesList.push({
        type: 'line',
        markLine: {
            data: [{ xAxis: context.date }],
            symbol: 'none',
            lineStyle: {
                type: 'dashed',
                color: '#999',
                width: 1
            },
            label: {
                show: true,
                formatter: "Now"
            }
        }
    })

    return {
        title: { "text": "Hourly Demand" },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            right: 10,
            feature: {
                dataZoom: {
                    yAxisIndex: "none"
                },
                restore: {}
            }
        },
        grid: {
            left: "3%",
            right: "8%"
        },
        xAxis: {
            type: "time",
            name: "Time",
            nameLocation: 'middle',
            axisLabel: {
                formatter: '{yyyy}-{MM}-{dd}'
            },
            nameTextStyle: {
                fontWeight: "bold",
                fontSize: 14
            },
        },
        yAxis: {
            type: "value",
            name: "Total Demand mWh",
            nameTextStyle: {
                fontWeight: "bold",
                fontSize: 14
            },
            axisLabel: {
                formatter: (v) => {
                    return (Math.round(v * 100) / 100).toString();
                }
            }
        },
        visualMap:visualMapList,
        series: seriesList,
        legend: {
            type: "scroll",
            orient: "vertical",
            right: 10,
            top: 'center',
        },
    }
}
