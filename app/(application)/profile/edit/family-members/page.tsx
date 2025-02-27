import { auth } from "@/auth";
import { EditFamilyMembers } from "@/components/profile/edit-family-info-form";
export default async function FamilyMembersEditPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) return <div>Unauthorized</div>;

  return <div className="px-2 pt-4"><EditFamilyMembers userId={user.id} familyMembers={user.FamilyMembers||[]} /></div>;
}
