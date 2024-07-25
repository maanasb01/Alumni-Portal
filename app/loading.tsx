"use client"
import { Grid } from "react-loader-spinner";

export default function Loading(){
    return(
        <div className="flex w-full h-full mt-5 justify-center items-center">
            <Grid color="gray" height={"80"} width={"80"}/>
        </div>
    )
}