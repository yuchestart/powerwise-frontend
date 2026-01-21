import PageContainer from "@/components/layout/PageContainer";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: `PowerWise - About Us`
}

export default function Page(){
    return <PageContainer>
        <div className="mx-auto w-fit my-2">
            <p className="text-4xl">About Us</p>
            <p></p>
        </div>
    </PageContainer>
}