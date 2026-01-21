
import { Metadata } from "next"
import Dashboard from "./Dashboard"


export const metadata: Metadata = {
    title: "PowerWise - MISO Forecast Tool"
}


export default function Page() {
    return <Dashboard></Dashboard>
}