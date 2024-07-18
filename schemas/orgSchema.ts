import z from "zod";

export const BaseJoinOrgSchema = z.object({
//   organization: z.string().trim().min(1, { message: "Required" }),
organization: z.object({
    value: z.string().trim().min(1,{message:"Required"}),
    label: z.string()
}).required()
});

export const orgType = z.enum(["University", "College", "School"]);
export const ExtendedJoinOrgSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Org's Name should be at least be 3 characters" }),
  type: z.object({
    value: orgType,
    label: orgType,
  },{required_error:"Required"}),
  country: z.object({
    value:z.number(),
    label:z.string()
  },{
    required_error: "Required",
  }),
  state: z.object({
    value:z.number(),
    label:z.string()
  },{
    required_error: "Required",
  }),
  city: z.object({
    value:z.number(),
    label:z.string()
  },{
    required_error: "Required",
  }),
});


export const CombinedJoinSchema = BaseJoinOrgSchema.or(ExtendedJoinOrgSchema);