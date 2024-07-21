import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FaRegEdit } from "react-icons/fa";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold text-red-500">
        Unauthorized
      </div>
    );

  const getInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="p-6 bg-gray-100 ">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
        <div className="flex items-center mb-6">
          {user.image ? (
            <Image
              src={user.image}
              alt={`${user.name}'s profile picture`}
              width={100}
              height={100}
              className="rounded-full border-4 border-blue-500"
            />
          ) : (
            <div className="flex items-center justify-center w-24 h-24 bg-blue-500 text-white text-4xl font-bold rounded-full">
              {user.name && getInitial(user.name)}
            </div>
          )}
          <div className="ml-6">
            <p className="text-4xl font-bold text-gray-900">{user.name}</p>
            <p className="text-lg text-gray-600 mt-2">{user.email}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold text-gray-800">
              Basic Information
            </p>
            <Link href={"/profile/edit/basic-info"}>
                <Button
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <FaRegEdit size={18} />
                </Button>
            </Link>
          </div>
          <div className="text-lg text-gray-700 space-y-2">
            <div>
              <p className="font-medium">Phone:</p> <p>{user.phone || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Organization:</p>
              <p>{user.organization?.name || "N/A"}</p>
              {user.organization && (
                <p className="text-gray-500 text-sm">{`${user.organization?.city.name}, ${user.organization?.state.name}, ${user.organization?.country.name}`}</p>
              )}
            </div>
            <div>
              <p className="font-medium">Degree:</p>{" "}
              <p>{user.degree || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold text-gray-800">
              Employment History
            </p>
            <Link href={"/profile/edit/employment-history"}>
                <Button
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <FaRegEdit size={18} />
                </Button>
            </Link>
          </div>
          <div className="text-lg text-gray-700 space-y-2">
            {user.EmploymentHistory && user.EmploymentHistory.length > 0 ? (
              user.EmploymentHistory.map((job) => (
                <div key={job.id} className="mt-2">
                  <p className="font-medium">Company: {job.company}</p>
                  <p>Position: {job.position}</p>
                  <p>
                    Period: {new Date(job.startDate).toLocaleDateString()} -{" "}
                    {job.endDate
                      ? new Date(job.endDate).toLocaleDateString()
                      : "Present"}
                  </p>
                </div>
              ))
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold text-gray-800">
              Family Members
            </p>
            <Link href={"/profile/edit/family-members"}>
                <Button
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <FaRegEdit size={18} />
                </Button>
            </Link>
          </div>
          <div className="text-lg text-gray-700 space-y-2">
            {user.FamilyMembers && user.FamilyMembers.length > 0 ? (
              user.FamilyMembers.map((member) => (
                <div key={member.id} className="mt-2">
                  <p className="font-medium">Name: {member.name}</p>
                  <p>Relation: {member.relation}</p>
                  <p>Description: {member.description || "No description"}</p>
                </div>
              ))
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
