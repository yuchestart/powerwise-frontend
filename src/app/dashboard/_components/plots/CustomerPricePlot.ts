import type { DashboardContextInterface, ZonePoint } from "../types";
import type { EChartsOption, SeriesOption } from 'echarts';

export function consumerPricePlot(context: DashboardContextInterface): EChartsOption {
    return {
        title:{text:"MISO Territory Mean Price per Household"},
        xAxis:{},
        yAxis:{}
    }
}