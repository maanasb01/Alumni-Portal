import Link from "next/link";
import { Button } from "../ui/button";

interface RedirectBtnProps{
    redirectText:string;
    href:string
}

export default function RedirectBtn({redirectText,href}:RedirectBtnProps){
    return(
        <Button variant="link">
            <Link href={href}>{redirectText}</Link>
        </Button>
    )
}