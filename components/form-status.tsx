import { CheckCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormStatusProps{
    type:'error'|'success';
    message?:string;
};

export function FormStatus({type,message}:FormStatusProps){

    if(!message) return null;

    if(type==="error"){
        return(
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <p>{message}</p>
    
            </div>
        )
    }else{
        return(
            <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
                <CheckCircledIcon className="h-5 w-5" />
                <p>{message}</p>
    
            </div>
        )
    }

}