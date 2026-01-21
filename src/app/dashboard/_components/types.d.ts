export interface DashboardContextInterface {
    get date(): Date;
    get startDate(): Date;
    get endDate(): Date;
    dateRange: [Date,Date,Date];
    setDate: (x: [Date,Date,Date]) => void;
    selectZone: (zone: number)=>void;
    mapData: ZonePoint[];
    selectedZones: number[];
    features: CustomFeature[];
    addFeature:(feature:CustomFeature)=>void;
    updateFeature:(id:number,feature:CustomFeature)=>void;
    deleteFeature:(index:number)=>void;
    mode: 'general'|'selectingmap';
    setMode: (x: 'general'|'selectingmap') => void;
    /**
     * This is Longitude Latitude
     */
    selectedLocation: [number,number] | null;
    setSelectedLocation;
    baseShape;
    selectLayer(layer:string)
    layers:Record<string,boolean>
}

export interface _DashboardContextInterface extends DashboardContextInterface{
    getMe: ()=>DashboardContextInterface
}

export interface ZonePoint {
    time: number;
    temperature_2m: number;
    cloud_cover: number;
    cloud_cover_low: number;
    cloud_cover_mid: number;
    cloud_cover_high: number;
    apparent_temperature: number;
    wind_speed_100m: number;
    demand: number;
    zone: number;
    didpredict: boolean;
}

export interface CustomFeature {
    name: string;
    description: string;
    location: [number, number];
    demand: number;
    selected: boolean;
}