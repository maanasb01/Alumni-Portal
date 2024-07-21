import {
  City,
  Country,
  EmploymentHistory,
  FamilyMember,
  State,
  User,
} from "@prisma/client";

// Properties returned by the getUserById function
type UserSelectKeys =
  | "name"
  | "organization"
  | "id"
  | "degree"
  | "EmploymentHistory"
  | "email"
  | "image"
  | "createdAt"
  | "isRegistered"
  | "organizationId"
  | "phone"
  | "FamilyMembers";

  export type SessionUser = Pick<User & {
  organization: { name:string,country: Country; state: State; city: City } | null;
  EmploymentHistory: EmploymentHistory[];
  FamilyMembers: FamilyMember[] | null;
},UserSelectKeys>;