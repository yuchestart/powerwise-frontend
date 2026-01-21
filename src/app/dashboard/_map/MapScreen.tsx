"use client";

import Map, { AttributionControl, Layer, Source, useMap } from "react-map-gl/maplibre"

import 'maplibre-gl/dist/maplibre-gl.css';
import CustomFeatures from "./CustomFeatures";
import LRZ from "./LRZ";
import { useCallback, useContext, useEffect, useRef } from "react";
import { DashboardContext } from "../context";

export default function MapScreen() {
    const {layers} = useContext(DashboardContext)
    const handlerRef = useRef({});
    const setHandlerCallback = useCallback((key:string,handler:any)=>{
        handlerRef.current[key] = handler;
    },[]);
    useEffect(()=>{
        for(const key of ["customfeatures-layer","lrz-fill"]){
            if(!(key in handlerRef.current)) continue;
            handlerRef.current[key]()
        }
    });

    return <div className="absolute top-0 right-0 w-full h-full">
        <Map id="mainmap" attributionControl={false} initialViewState={{
            latitude:33,
            longitude:-93,
            zoom:3
        }}>
            <AttributionControl position="bottom-right" customAttribution="<a href='https://www.openstreetmap.org/copyright' target='_blank'>© OpenStreetMap</a> | <a href='https://maplibre.org/' target='_blank'>MapLibre</a>"></AttributionControl>
            <Source id="basemap" type="raster" tiles={["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]} tileSize={256}>
                <Layer id="basemap-layer" type="raster"></Layer>
            </Source>
            <LRZ show={layers.lrz} setHandler={setHandlerCallback}></LRZ>
            <CustomFeatures show={layers.features} setHandler={setHandlerCallback}></CustomFeatures>
        </Map>
    </div>
}
