
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { ReactNode } from "react";
import RedirectBtn from "./redirect-btn";


  interface CardWrapperProps {
    cardTitle:string;
    cardDesc:string;
    footerText:string;
    children:ReactNode;
    redirectURL:string
  }
  

export default function CardWrapper({cardTitle,cardDesc,footerText,redirectURL, children}:CardWrapperProps){

    return(
        <Card className="text-center w-1/2 mx-auto mt-10 ">

            <CardHeader>
                <CardTitle>
                    <p className="text-3xl">{cardTitle}</p>
                </CardTitle>

                <CardDescription>
                    {cardDesc}
                </CardDescription>

            </CardHeader>

            <CardContent>
                {children}
            </CardContent>

            <CardFooter className="justify-center">
                <span><RedirectBtn redirectText={footerText} href={redirectURL} /></span>
            </CardFooter>
            
        </Card>
    )
}