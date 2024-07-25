// import { auth } from "@/auth";
// import { Button } from "@/components/ui/button";
// import { getUserById } from "@/data/user"
// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { FaRegEdit } from "react-icons/fa";

// export default async function SearchUserPage({params}:{params:{id:string}}){

//   const session = await auth();
//   const sessionUser = session?.user;

//     const user = await getUserById(params.id);

//     if(!user){
//         notFound();
//     }
//     const getInitial = (name: string) =>
//         name ? name.charAt(0).toUpperCase() : "?";

//       return (
//         <div className="">
//         <div className="p-6 ">
//           <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
//             <div className="flex items-center mb-6">
//               {user.image ? (
//                 <Image
//                   src={user.image}
//                   alt={`${user.name}'s profile picture`}
//                   width={100}
//                   height={100}
//                   className="rounded-full border-4 border-blue-500"
//                 />
//               ) : (
//                 <div className="flex items-center justify-center w-24 h-24 bg-blue-500 text-white text-4xl font-bold rounded-full">
//                   {user.name && getInitial(user.name)}
//                 </div>
//               )}
//               <div className="ml-6">
//                 <p className="text-4xl font-bold text-gray-900">{user.name}</p>
//                 <p className="text-lg text-gray-600 mt-2">{user.email}</p>
//               </div>
//             </div>

//             <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
//               <div className="flex justify-between items-center">
//                 <p className="text-xl font-semibold text-gray-800">
//                   Basic Information
//                 </p>
//                 {user.id === sessionUser?.id && <Link href={"/profile/edit/basic-info"}>
//                     <Button
//                       className="bg-blue-500 hover:bg-blue-600"
//                     >
//                       <FaRegEdit size={18} />
//                     </Button>
//                 </Link>}
//               </div>
//               <div className="text-lg text-gray-700 space-y-2">
//                 <div>
//                   <p className="font-medium">Phone:</p> <p>{user.phone || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="font-medium">Organization:</p>
//                   <p>{user.organization?.name || "N/A"}</p>
//                   {user.organization && (
//                     <p className="text-gray-500 text-sm">{`${user.organization?.city.name}, ${user.organization?.state.name}, ${user.organization?.country.name}`}</p>
//                   )}
//                 </div>
//                 <div>
//                   <p className="font-medium">Degree:</p>{" "}
//                   <p>{user.degree || "N/A"}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
//               <div className="flex justify-between items-center">
//                 <p className="text-xl font-semibold text-gray-800">
//                   Employment History
//                 </p>
//                 {user.id === sessionUser?.id && <Link href={"/profile/edit/employment-history"}>
//                     <Button
//                       className="bg-blue-500 hover:bg-blue-600"
//                     >
//                       <FaRegEdit size={18} />
//                     </Button>
//                 </Link>}
//               </div>
//               <div className="text-lg text-gray-700 space-y-2">
//                 {user.EmploymentHistory && user.EmploymentHistory.length > 0 ? (
//                   user.EmploymentHistory.map((job) => (
//                     <div key={job.id} className="mt-2">
//                       <p className="font-medium">Company: {job.company}</p>
//                       <p>Position: {job.position}</p>
//                       <p>
//                         Period: {new Date(job.startDate).toLocaleDateString()} -{" "}
//                         {job.endDate
//                           ? new Date(job.endDate).toLocaleDateString()
//                           : "Present"}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p>N/A</p>
//                 )}
//               </div>
//             </div>

//             <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
//               <div className="flex justify-between items-center">
//                 <p className="text-xl font-semibold text-gray-800">
//                   Family Members
//                 </p>
//                 {user.id === sessionUser?.id && <Link href={"/profile/edit/family-members"}>
//                     <Button
//                       className="bg-blue-500 hover:bg-blue-600"
//                     >
//                       <FaRegEdit size={18} />
//                     </Button>
//                 </Link>}
//               </div>
//               <div className="text-lg text-gray-700 space-y-2">
//                 {user.FamilyMembers && user.FamilyMembers.length > 0 ? (
//                   user.FamilyMembers.map((member) => (
//                     <div key={member.id} className="mt-2">
//                       <p className="font-medium">Name: {member.name}</p>
//                       <p>Relation: {member.relation}</p>
//                       <p>Description: {member.description || "No description"}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <p>N/A</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       );
//     }

import { auth } from "@/auth";
import { PostFeed } from "@/components/posts-events/posts/posts-feed";
import { ProfilePostsEvents } from "@/components/posts-events/profile-posts-events";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/data/user";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const sessionUser = session?.user;

  const user = await getUserById(params.id);

  if (!user) {
    notFound();
  }

  const getInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center p-8 bg-blue-600 text-white">
          {user.image ? (
            <Image
              src={user.image}
              alt={`${user.name}'s profile picture`}
              width={150}
              height={150}
              className="rounded-full border-4 border-white"
            />
          ) : (
            <div className="flex items-center justify-center w-36 h-36 bg-blue-100 text-slate-500 text-6xl font-bold rounded-full">
              {user.name && getInitial(user.name)}
            </div>
          )}
          <div className="md:ml-8 mt-6 md:mt-0 text-center md:text-left">
            <p className="text-4xl font-bold">{user.name}</p>
            <p className="text-lg mt-2">{user.email}</p>
          </div>
        </div>
        <div className="p-8 space-y-8">
          <Section
            title="Basic Information"
            userId={user.id}
            sessionUserId={sessionUser?.id}
          >
            <div className="text-lg text-gray-700 space-y-4">
              <Detail label="Phone:" value={user.phone || "N/A"} />
              <Detail
                label="Organization:"
                value={user.organization?.name || "N/A"}
              >
                {user.organization && (
                  <p className="text-gray-500 text-sm">{`${user.organization.city.name}, ${user.organization.state.name}, ${user.organization.country.name}`}</p>
                )}
              </Detail>
              <Detail label="Degree:" value={user.degree || "N/A"} />
            </div>
          </Section>

          <Section
            title="Employment History"
            userId={user.id}
            sessionUserId={sessionUser?.id}
          >
            <div className="text-lg text-gray-700 space-y-4">
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
          </Section>

          <Section
            title="Family Members"
            userId={user.id}
            sessionUserId={sessionUser?.id}
          >
            <div className="text-lg text-gray-700 space-y-4">
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
          </Section>
        </div>
        <div className="p-8">
          <Section title="Posts and Events" userId={user.id}>
            <ProfilePostsEvents
              user={user}
              showCreateOption={user.id === sessionUser?.id}
              showOnlyUsers={true}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  userId,
  sessionUserId,
}: {
  title: string;
  children: React.ReactNode;
  userId: string;
  sessionUserId?: string;
}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4 border-t-4 border-blue-500">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <p className="text-xl font-semibold text-gray-800">{title}</p>
        {userId === sessionUserId && (
          <Link
            href={`/profile/edit/${title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <Button className="bg-blue-500 hover:bg-blue-600 flex items-center">
              <FaRegEdit size={18} className="mr-2" /> Edit
            </Button>
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function Detail({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-start space-y-2">
      <p className="font-medium text-gray-800">{label}</p>
      <div>
        <p>{value}</p>
        {children}
      </div>
    </div>
  );
}
