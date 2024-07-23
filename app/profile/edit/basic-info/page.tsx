import { auth } from "@/auth";
import { EditBasicInfoForm } from "@/components/profile/edit-basic-info-form";

export default async function BasicInfoEditPage(){

    const session = await auth();
    const user = session?.user;
  
    if (!user) return <div>Unauthorized</div>;

    return(
        <div className="px-2 pt-4">
        <EditBasicInfoForm user={user} />
        </div>
    )
}