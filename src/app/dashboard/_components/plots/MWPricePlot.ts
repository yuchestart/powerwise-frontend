import type { DashboardContextInterface, ZonePoint } from "../types";
import type { EChartsOption, SeriesOption } from 'echarts';

export function mwPricePlot(context: DashboardContextInterface): EChartsOption {
    return {
        title:{text:"MISO Territory Mean Price per mWh"},
        xAxis:{},
        yAxis:{}
    }
}