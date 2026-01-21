"use client";

import { useContext, useEffect, useMemo, useReducer, useState } from "react"
import { DashboardContext } from "../context"
import { Layer, Source, useMap } from "react-map-gl/maplibre";
import chroma from "chroma-js";
import { GeoJSONSource, MapLayerMouseEvent, Popup } from "maplibre-gl";
import { HOUR } from "@/util/date";

export default function LRZ({ show, setHandler }: { show: boolean, setHandler: (layer: string, callback: any) => void }) {
    const { getMe, mapData, selectedZones, baseShape } = useContext(DashboardContext);
    const initialShape = useMemo(() => ({ type: "FeatureCollection", features: [] }), []);
    const scale = useMemo(() => chroma.scale(["#0000ff","#ff0000"]).mode("rgb"), []);
    const mapRef = useMap();

    function updateColors() {
        const dashboardContext = getMe();
        const zoneagg: Record<number, number> = {};
        //Select the features within the selected time range
        const features = dashboardContext.mapData.slice().filter((x) =>
            ((dashboardContext.date.getTime()) <= x.time) &&
            ((dashboardContext.date.getTime() + HOUR) > x.time)
        );
        //Average the demands
        for (const feature of features) {
            if (!(feature.zone in zoneagg)) {
                zoneagg[feature.zone] = feature.demand;
            } else {
                zoneagg[feature.zone] = (zoneagg[feature.zone] + feature.demand) / 2;
            }
        }

        //TODO: Pick a scale
        const SCALE_MIN = Math.ceil(Math.min(...dashboardContext.mapData.map((v)=>v.demand))/100)*100;
        const SCALE_MAX = Math.floor(Math.max(...dashboardContext.mapData.map((v)=>v.demand))/100)*100;
        const shape = { ...dashboardContext.baseShape }
        let id = 0;
        for (const feature of shape.features) {
            const zone = parseInt(feature.properties.Zone.slice(3))
            if (!(zone in zoneagg)) feature.properties.color = "#ccc";
            feature.id = ++id;
            feature.properties.color = scale((zoneagg[zone] - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)).hex();
            feature.properties.outlinecolor = dashboardContext.selectedZones.indexOf(zone) !== -1 ? "#f00" : "#000";
            feature.properties.Demand = (zoneagg[zone] ?? -1).toString();
        }
        const source = mapRef.current.getSource("lrz-src") as GeoJSONSource;
        if (source && "setData" in source) {
            source.setData(shape)
        }
    }

    useEffect(() => {
        const clickHandler = (e: MapLayerMouseEvent & { didClick: boolean }) => {
            if (e.didClick) return;
            const { mode, setMode, setSelectedLocation, selectZone } = getMe();
            if (mode === "selectingmap") {
                console.log(mode)
                setSelectedLocation([e.lngLat.lng, e.lngLat.lat]);
                setMode("general");
                return;
            }
            e.didClick = true;
            if (e.features.length === 0) return;
            const feature = e.features[0];
            if (e.originalEvent.ctrlKey) {
                selectZone(parseInt(feature.properties.Zone.slice(3)));
            } else {
                const demand: number = parseFloat(feature.properties.Demand);
                const popupData = `${feature.properties.Zone}<br>Mean Demand for time: ${demand === -1 ? "N/A" : demand.toFixed(2)} mWh`

                new Popup().setLngLat(e.lngLat).setHTML(popupData).addTo(mapRef.current.getMap());
            }
        }
        if (mapRef.current?.getLayer('lrz-fill')) {
            setHandler("lrz-fill", () => {
                mapRef.current.on("click", "lrz-fill", clickHandler);
            })
        }
        return () => {
            if (mapRef.current?.getLayer('lrz-fill')) {
                mapRef.current.off("click", "lrz-fill", clickHandler)
            }
        }
    }, [])

    useEffect(
        () => {
            updateColors();
        }, [baseShape, mapData, selectedZones]);

    useEffect(() => {
        if (mapRef.current.getLayer('lrz-fill') && mapRef.current.getLayer('lrz-outline')) {
            mapRef.current.getMap().setLayoutProperty("lrz-fill", "visibility", show ? "visible" : "none")
            mapRef.current.getMap().setLayoutProperty("lrz-outline", "visibility", show ? "visible" : "none")
        }
    }, [show])
    //@ts-ignore
    return <Source id="lrz-src" type="geojson" data={initialShape}>
        <Layer id="lrz-fill" type="fill" paint={{
            "fill-color": ["case", ["has", 'color'], ['get', 'color'], '#ccc'],
            "fill-opacity": 0.7,
        }}></Layer>
        <Layer id="lrz-outline" type="line" paint={{
            "line-color": ["case", ["has", "outlinecolor"], ["get", "outlinecolor"], "#000"],
            "line-width": 1
        }}></Layer>
    </Source>
}