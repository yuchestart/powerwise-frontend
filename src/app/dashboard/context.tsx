'use client';
import { _DashboardContextInterface, type CustomFeature, DashboardContextInterface, ZonePoint } from "@/app/dashboard/_components/types";
import { DAY, HOUR, roundToHour, toISOString } from "@/util/date";
import { createContext, use, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";

export const DashboardContext = createContext<_DashboardContextInterface>(null);

export function useGetDashboardContext(): () => DashboardContextInterface {
    const ctx = useContext(DashboardContext)
    return ctx.getMe;
}

export default function DashboardManager({ children }) {
    //TODO: Fix retrieving data as null initially
    const [date, setDate] = useState<[Date, Date, Date]>([new Date(0), new Date(0), new Date(0)]);
    const [mode, setMode] = useState<'general' | 'selectingmap'>('general');
    const [, nudge] = useReducer((x) => x + 1, 0);
    const selectedLocationRef = useRef<[number, number]>(null);
    const selectedZonesRef = useRef<number[]>([1, 4, 6, 27, 35, 8910]);
    const mapDataRef = useRef<ZonePoint[]>([]);
    const baseShapeRef = useRef<any>({ type: "FeatureCollections", features: [] });
    const featuresRef = useRef<CustomFeature[]>([]);
    const layersRef = useRef({
        lrz: true,
        features: true
    });
    const fetchData = async (date:[Date,Date,Date]) => {
        if(date[0].getTime() === 0) return;
        const response = await fetch(new URL(`dashboard/data/zonedata?start_date=${roundToHour(date[1]).getTime()/1000}&end_date=${roundToHour(new Date(date[1].getTime()+HOUR)).getTime()/1000}`, process.env.NEXT_PUBLIC_API_URL));
        if (response.status !== 200 && response.status !== 404) throw new Error("Failed to retrieve zone data");
        mapDataRef.current = [];
        mapDataRef.current = await response.json();
        for (const element of mapDataRef.current) {
            element.time *= 1000;
        }
        nudge();
    }
    const contextValueRef = useRef<_DashboardContextInterface>(null);
    contextValueRef.current = {
        get date() {
            return date[1]
        },
        get startDate() {
            return date[0]
        },
        get endDate() {
            return date[2]
        },
        dateRange: date,
        setDate: async (newdate: [Date, Date, Date]) => {
            setDate([...newdate])
        },
        selectZone: (zone) => {
            selectedZonesRef.current = [...selectedZonesRef.current]
            if (selectedZonesRef.current.includes(zone))
                selectedZonesRef.current.splice(selectedZonesRef.current.indexOf(zone), 1);
            else
                selectedZonesRef.current.push(zone);
            nudge();
        },
        mapData: mapDataRef.current,
        selectedZones: selectedZonesRef.current,
        features: featuresRef.current,
        getMe: () => {
            return contextValueRef.current
        },
        mode: mode,
        setMode: setMode,
        selectedLocation: selectedLocationRef.current,
        setSelectedLocation: (location: [number, number]) => {
            selectedLocationRef.current = location;
            nudge();
        },
        addFeature: (feature: CustomFeature) => {
            featuresRef.current = [...featuresRef.current, feature]
            nudge();
        },
        deleteFeature: (index: number) => {
            featuresRef.current.splice(index, 1)
            featuresRef.current = [...featuresRef.current]
            nudge();
        },
        updateFeature: (id, feature) => {
            featuresRef.current = [...featuresRef.current]
            featuresRef.current[id] = feature;
            nudge();
        },
        baseShape: baseShapeRef.current,
        layers: layersRef.current,
        selectLayer: (layer) => {
            layersRef.current[layer] = !layersRef.current[layer];
            layersRef.current = { ...layersRef.current };
            nudge();
        }
    };

    useEffect(() => {
        setDate([
            new Date(new Date().getTime() - 14 * DAY),
            new Date(),
            new Date(new Date().getTime() + 7 * DAY)
        ])
        const fetchBaseShape = async () => {
            const response = await fetch(new URL("dashboard/data/zoneshape", process.env.NEXT_PUBLIC_API_URL));
            const json = await response.json();
            if (json.type !== "FeatureCollection")
                throw new Error("Fetching zone shape failed.")
            baseShapeRef.current = json;
            nudge();
        };
        fetchBaseShape();
    }, []);


    useEffect(() => {
        fetchData(date);
    }, [date])

    return <DashboardContext.Provider value={contextValueRef.current}>
        {children}
    </DashboardContext.Provider>
}