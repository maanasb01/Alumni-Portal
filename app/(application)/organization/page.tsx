import { leaveOrganization } from "@/actions/joinOrg";
import { auth } from "@/auth";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { JoinOrgForm } from "@/components/org/join-org-form";
import { Button } from "@/components/ui/button";

export default async function JoinOrg() {
  const session = await auth();
  const user = session?.user;

  if (!user) return <div>Unauthorized</div>;

  return (
    <div className="px-2 pt-4">
      {user.isRegistered && user.organization ? (
        <div className="p-6 bg-white shadow-md rounded-lg">
          <p className="text-4xl font-bold text-gray-800">
            {user.organization.name}
          </p>
          <p className="text-lg text-gray-600 mt-2">
            {user.organization.city.name}, {user.organization.state.name},{" "}
            {user.organization.country.name}
          </p>

          <div className="mt-6 flex justify-end">
            <ConfirmationDialog
              actionFunction={async ()=>{
                "use server"
                await leaveOrganization();
              }}
              message={`Are you sure you want to leave the ${user.organization.name} Organization ?`}
            >
              <Button
                size={"sm"}
                variant={"destructive"}
                className="flex items-center"
              >
                Leave Organization
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  className="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
            </ConfirmationDialog>
          </div>
        </div>
      ) : (
        <JoinOrgForm />
      )}
    </div>
  );
}
