
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
import { Social } from "./social";


  interface CardWrapperProps {
    cardTitle:string;
    cardDesc:string;
    footerText:string;
    children:ReactNode;
    redirectURL:string
  }
  

export default function CardWrapper({cardTitle,cardDesc,footerText,redirectURL, children}:CardWrapperProps){

    return(
        <Card className="text-center w-1/3 mx-auto text-sm 2xl:mt-20">

            <CardHeader>
                <CardTitle>
                    <p className="text-2xl">{cardTitle}</p>
                </CardTitle>

                <CardDescription>
                    {cardDesc}
                </CardDescription>

            </CardHeader>

            <CardContent>
                <div className="flex flex-col space-y-2">
                {children}
                <div className="text-sm">OR</div>
                <Social />
                </div>
            </CardContent>
            

            <CardFooter className="justify-center p-1">
                <span><RedirectBtn redirectText={footerText} href={redirectURL} /></span>
            </CardFooter>
            
        </Card>
    )
}