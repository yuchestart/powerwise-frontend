import { useContext, useEffect, useMemo, useState } from "react";
import { DashboardContext } from "../context";
import { Layer, Source, useMap } from "react-map-gl/maplibre";
import { Feature, GeoJSONSource, MapLayerMouseEvent, Popup } from "maplibre-gl";

export default function CustomFeatures({ show, setHandler }: { show: boolean, setHandler: (layer: string, callback: any) => void }) {
    const { getMe, features } = useContext(DashboardContext);
    const initialShape = useMemo(() => ({ type: "FeatureCollection", features: [] }), []);
    const mapRef = useMap();
    const [layout, setLayout] = useState({});
    useEffect(() => {
        const loadImage = async () => {
            const image = (await mapRef.current.loadImage("/marker-icon-light.png")).data;
            mapRef.current.addImage("customfeatures-markericon", image);
        }
        loadImage();

        const clickHandler = (e: MapLayerMouseEvent & { didClick: boolean }) => {
            if (e.didClick) return;
            const { mode, setMode, setSelectedLocation } = getMe();
            if (mode === "selectingmap") {
                setSelectedLocation([e.lngLat.lng, e.lngLat.lat]);
                setMode("general");
                return;
            }
            e.didClick = true;
            if (e.features.length === 0) return;
            const feature = e.features[0];
            const popupData =
                `<i><b>${feature.properties.name}</b></i><br>
            <b>Demand incurred:</b> ${feature.properties.demand} mWh<br>
            <b>Description:</b><br>${feature.properties.description}`
            new Popup().setLngLat((feature.geometry as GeoJSON.Point).coordinates as [number, number]).setHTML(popupData).addTo(mapRef.current.getMap());
        };
        setHandler("customfeatures-layer", () => {
            mapRef.current.on("click", "customfeatures-layer", clickHandler);
        })
        return () => {
            mapRef.current.off("click", "customfeatures-layer", clickHandler)
        }
    }, []);
    useEffect(() => {
        const { features } = getMe();
        const source = mapRef.current.getSource("customfeatures-src") as GeoJSONSource;
        if (source) {
            const geojson = {
                "type": "FeatureCollection",
                "features":
                    features.slice().map((v, i) => ({
                        id: i + 1,
                        type: "Feature",
                        geometry: { type: "Point", coordinates: v.location },
                        properties: { name: v.name, description: v.description, demand: v.demand.toString(), opacity: v.selected ? 1 : 0.5 }
                    }))

            }
    //@ts-ignore
            source.setData({ ...geojson })
        }
    }, [features]);
    useEffect(() => {
        if (mapRef.current.getLayer('customfeatures-layer')) {
            mapRef.current.getMap().setLayoutProperty("customfeatures-layer", "visibility", show ? "visible" : "none")
        }
    }, [show])
    //@ts-ignore
    return <Source id="customfeatures-src" type="geojson" data={initialShape}>
        <Layer id="customfeatures-layer" type="symbol" paint={{
            "icon-opacity": ["case", ["has", "opacity"], ["get", "opacity"], 1]
        }} layout={{
            'icon-image': 'customfeatures-markericon',
            'icon-size': 1,
        }}></Layer>
    </Source>
}