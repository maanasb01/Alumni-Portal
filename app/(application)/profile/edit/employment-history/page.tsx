import { auth } from "@/auth";
import { EditEmploymentHistory } from "@/components/profile/edit-employment-form";

export default async function EmploymentHistoryEditPage(){
    const session = await auth();
    const user = session?.user;
  
    if (!user) return <div>Unauthorized</div>;

    return(
        <div className="px-2 pt-4">
        <EditEmploymentHistory empHistory={user.EmploymentHistory} userId={user.id} />
        </div>
    )
}