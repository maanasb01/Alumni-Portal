import { auth } from "@/auth";
import { EditFamilyMembers } from "@/components/profile/edit-family-info-form";
export default async function FamilyMembersEditPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) return <div>Unauthorized</div>;

  return <><EditFamilyMembers familyMembers={user.FamilyMembers||[]} /></>;
}
