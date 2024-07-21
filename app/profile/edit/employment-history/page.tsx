import { auth } from "@/auth";
import { EditEmploymentHistory } from "@/components/profile/edit-employment-form";

export default async function EmploymentHistoryEditPage(){
    const session = await auth();
    const user = session?.user;
  
    if (!user) return <div>Unauthorized</div>;

    return(
        <>
        <EditEmploymentHistory empHistory={user.EmploymentHistory} />
        </>
    )
}