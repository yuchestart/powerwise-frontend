'use client';
import { ResizeManager } from "@/app/dashboard/_components/ResizeManager"
import FeatureBar from "./FeatureBar"
import Resizable from "@/app/dashboard/_components/Resizable"
import DashboardManager from "./context"
import MapScreen from "./_map/MapScreen"
import { useState } from "react"
import PageContainer from "@/components/layout/PageContainer";
import PlotBar from "./PlotBar";
import DateBar from "./DateBar";
import Chat from "./_chat/Chat";
import { MapProvider } from "react-map-gl/maplibre";
import ColorScale from "./_components/ColorScale";
import ThemeManager from "@/components/ThemeManager";

function DashboardOld() {
    return <ResizeManager>
        <DashboardManager>
            <PageContainer>
                <MapScreen></MapScreen>
                <div className="w-full h-full flex flex-col absolute top-0 left-0 pointer-events-none">
                    <div className="grow w-full flex flex-row">
                        <FeatureBar></FeatureBar>
                        <div className="grow">
                        </div>
                    </div>
                    <Resizable side="bottom" minSize={300} maxSize={500}>
                        <PlotBar></PlotBar>
                    </Resizable>
                </div>
            </PageContainer>
        </DashboardManager>
    </ResizeManager>
}

export default function Dashboard() {
    return <ThemeManager>
        <MapProvider>
            <ResizeManager>
                <DashboardManager>
                    <PageContainer>
                        <MapScreen></MapScreen>
                        <div className="w-full h-full flex flex-col absolute top-0 left-0 pointer-events-none">
                            <div className="w-full h-full flex flex-row">
                                <FeatureBar></FeatureBar>
                                <div className="grow h-full flex flex-col">
                                    <div className="grow">
                                        <DateBar></DateBar>
                                    </div>
                                    <ColorScale></ColorScale>
                                </div>
                                <Chat></Chat>
                            </div>
                            <PlotBar></PlotBar>
                        </div>
                    </PageContainer>
                </DashboardManager>
            </ResizeManager>
        </MapProvider>
    </ThemeManager>
}