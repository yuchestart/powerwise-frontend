'use client';

import Collapsible from "@/components/Collapsible";
import SmallButton from "@/components/SmallButton";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { DashboardContext, useGetDashboardContext } from "../context";
import type { CustomFeature } from "./types";
import { useMap } from "react-map-gl/maplibre";
import HelpLink from "@/components/HelpLink";

function FeatureItem({ id, feature }: { id: number, feature: CustomFeature }) {
    const { getMe } = useContext(DashboardContext);
    const context = getMe();
    const selectedInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    const editRefs = {
        demand: useRef<HTMLInputElement>(null),
        lon: useRef<HTMLInputElement>(null),
        lat: useRef<HTMLInputElement>(null),
        description: useRef<HTMLTextAreaElement>(null),
        name: useRef<HTMLInputElement>(null)
    };
    const toggleSelection = () => {
        const context = getMe();
        context.updateFeature(id, { ...feature, selected: !feature.selected });
    };
    const toggleEditing = () => {
        setEditing(!editing);
        editRefs.demand.current.value = feature.demand.toString();
        editRefs.lat.current.value = feature.location[1].toString();
        editRefs.lon.current.value = feature.location[0].toString();
        editRefs.description.current.value = feature.description;
        editRefs.name.current.value = feature.name;
    };
    const saveFeature = () => {
        setError("")
        const context = getMe();
        if ([
            editRefs.demand.current.value.length,
            editRefs.lat.current.value.length,
            editRefs.lon.current.value.length,
        ].includes(0)) {
            setError("Location and demand required.")
            return;
        }
        const newFeature: CustomFeature = {
            selected: feature.selected,
            demand: parseFloat(editRefs.demand.current.value) / 1000,
            name: editRefs.name.current.value,
            description: editRefs.name.current.value,
            location: [
                parseFloat(editRefs.lon.current.value),
                parseFloat(editRefs.lat.current.value)
            ]
        };

        context.updateFeature(id, newFeature);

        toggleEditing();
    }
    const deleteFeature = () => {
        const context = getMe();
        if (!confirm(`Are you sure you want to delete the feature ${feature.name}?`)) return;
        context.deleteFeature(id);
    }
    const { mainmap } = useMap();
    const zoomTo = () => {
        if (!mainmap) return;
        mainmap.zoomTo(6, { center: feature.location })
    }
    const [editing, setEditing] = useState(false);

    return <li>
        <Collapsible title={
            <div className="flex flex-row">
                <div>
                    <input type="checkbox" checked={context.features[id].selected} onChange={toggleSelection}></input>&nbsp;
                    {editing ? null : feature.name}
                </div>
                <input ref={editRefs.name} className="border w-20 grow" hidden={!editing}></input>
                &nbsp;
                <div>
                    <SmallButton onClick={toggleEditing}>{editing ? "Cancel" : "Edit"}</SmallButton>
                    {editing ? <SmallButton onClick={saveFeature}>Save</SmallButton> : null}
                    <SmallButton isDanger={true} onClick={deleteFeature}>Delete</SmallButton>
                </div>
            </div>
        }>
            <p className="text-red-500"></p>
            <p>Demand: {editing ? null : feature.demand}<input ref={editRefs.demand} className="border w-20" hidden={!editing}></input> kWh</p>
            <p>
                Lat: {editing ? null : feature.location[1].toFixed(2)}<input className="border w-20" ref={editRefs.lat} hidden={!editing}></input>&deg;
                Lon: {editing ? null : feature.location[0].toFixed(2)}<input className="border w-20" ref={editRefs.lon} hidden={!editing}></input>&deg;&nbsp;<SmallButton onClick={zoomTo}>Zoom To</SmallButton>{editing ? <SmallButton>Pick On Map</SmallButton> : null}
            </p>
            <p>Description:<br></br>{editing ? null : feature.description}<textarea defaultValue={feature.description} className="w-full border" ref={editRefs.description} hidden={!editing}></textarea></p>
        </Collapsible>
    </li>;
}

function FeatureForm() {
    const dashboardContext = useContext(DashboardContext);
    const getDashboardContext = useGetDashboardContext();
    const location = dashboardContext.selectedLocation ?? [null, null];
    const inputRefs = {
        name: useRef<HTMLInputElement>(null),
        demand: useRef<HTMLInputElement>(null),
        lat: useRef<HTMLInputElement>(null),
        lon: useRef<HTMLInputElement>(null),
        description: useRef<HTMLTextAreaElement>(null)
    };
    const [error, setError] = useState("")
    const submit = useCallback(() => {
        if (inputRefs.lat.current.value.length === 0 || inputRefs.lon.current.value.length === 0 || inputRefs.demand.current.value.length === 0)
            return setError("Latitude, Longitude, and Demand are required.");
        const context = getDashboardContext();
        const feature: CustomFeature = {
            name: inputRefs.name.current.value === "" ? "My Feature" : inputRefs.name.current.value,
            location: [inputRefs.lon.current.value, inputRefs.lat.current.value].map((v) => parseFloat(v)) as [number, number],
            description: inputRefs.description.current.value,
            demand: parseFloat(inputRefs.demand.current.value) / 1000,
            selected: true
        }
        inputRefs.demand.current.value = ""
        inputRefs.description.current.value = ""
        inputRefs.name.current.value = ""
        context.setSelectedLocation([null, null]);
        context.addFeature(feature);
        setError("")
    }, []);

    useEffect(() => {
        if (location[0] === null) return
        inputRefs.lon.current.value = location[0].toString();
        inputRefs.lat.current.value = location[1].toString();
    }, [location[0], location[1]])

    return <>
        <Collapsible title={<span className="font-bold">Create new feature</span>} maxHeight={275}>
            <p>Name: <input className="border" ref={inputRefs.name} placeholder="My Feature"></input></p>
            <p>Demand: <input className="border w-30" type="number" ref={inputRefs.demand}></input> kWh</p>
            <p>Location: <SmallButton isDanger={dashboardContext.mode === "selectingmap"} onClick={() => dashboardContext.setMode(dashboardContext.mode === "general" ? "selectingmap" : "general")}>
                {dashboardContext.mode === "general" ? "Select on Map" : "Cancel"}
            </SmallButton><br></br>
                Lat:
                <input className="border w-20" type="number" ref={inputRefs.lat} ></input>
                &deg; Lon:
                <input className="border w-20" type="number" ref={inputRefs.lon}></input>
                &deg;
            </p>
            <p>Description: <br></br><textarea className="border" ref={inputRefs.description}></textarea></p>
            <p className="text-red-500">{error}</p>
            <SmallButton onClick={submit}>Add New Feature</SmallButton>
        </Collapsible>
    </>
}


export default function CustomFeatures() {
    const dashboardContext = useContext(DashboardContext);
    const features = dashboardContext.features.map((x, i) =>
        <FeatureItem id={i} feature={x} key={i}>
        </FeatureItem>
    );

    return <>
        <p className="text-2xl">Custom Features <HelpLink to="custom_features"></HelpLink></p>
        <div className="p-2">
            <ul>
                {features}
            </ul>
            <FeatureForm>
            </FeatureForm>
        </div>
    </>
}