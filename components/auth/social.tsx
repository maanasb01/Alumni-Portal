"use client"

import { FcGoogle } from "react-icons/fc"
import { Button } from "../ui/button"

export function Social(){

    return(
        <div className="flex items-center w-full">
            <Button 
                size='lg'
                className="w-full"
                variant="outline">
                <FcGoogle className="h-7 w-7" />
            </Button>
        </div>
    )
}