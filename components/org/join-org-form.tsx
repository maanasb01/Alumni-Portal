"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode, useCallback, useEffect, useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { Input } from "../ui/input";
import { FormStatus } from "../form-status";
import { Button } from "../ui/button";
import AsyncSelect, { useAsync } from "react-select/async";
import Select from "react-select";
import { BaseJoinOrgSchema, ExtendedJoinOrgSchema } from "@/schemas/orgSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { searchCountries } from "@/data/country";
import debounce from "lodash.debounce";
import { GenericSelect } from "./generic-select";
import { searchStates } from "@/data/state";
import { searchCities } from "@/data/city";
import { searchOrganizations } from "@/data/organization";
import { createjoinOrganization, joinOrganization } from "@/actions/joinOrg";

export function JoinOrgForm() {
  const [schema, setSchema] = useState<
    typeof BaseJoinOrgSchema | typeof ExtendedJoinOrgSchema
  >(BaseJoinOrgSchema);

  const form = useForm<
    z.infer<typeof BaseJoinOrgSchema | typeof ExtendedJoinOrgSchema>
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      // To Prevent the warning: Warning: A component is changing an uncontrolled input to be controlled.
      //This is likely caused by the value changing from undefined to a defined value, which should not happen.
    },
  });
  const [isMounted, setIsMounted] = useState(false); // For React-select error

  const organizationVal = useWatch({
    control: form.control,
    name: "organization",
  });

  const countryVal = useWatch({
    control: form.control,
    name: "country",
  });

  const stateVal = useWatch({
    control: form.control,
    name: "state",
  });

  useEffect(() => {
    if (organizationVal?.value === "other") {
      setSchema(ExtendedJoinOrgSchema);
    }else{
      setSchema(BaseJoinOrgSchema);
    }
  }, [organizationVal]);

  useEffect(() => {
    console.log(countryVal);
    if (countryVal) {
      form.setValue("state", null as any); // TS Error. Expecting an object because of zod schema
      form.setValue("city", null as any);
    }
  }, [countryVal]);

  useEffect(() => {
    if (stateVal) {
      form.setValue("city", null as any);
    }
  }, [stateVal]);

  async function onSubmit(values:z.infer<typeof BaseJoinOrgSchema | typeof ExtendedJoinOrgSchema>) {
    console.log(JSON.stringify(values));

    try {
      if (schema === ExtendedJoinOrgSchema) {
        const data = await createjoinOrganization(values as z.infer<typeof ExtendedJoinOrgSchema>);

        if (data && data.error) {
          form.setError("root", { message: data.error });
        }
      }else{
        const data = await joinOrganization(values as z.infer<typeof BaseJoinOrgSchema>);
        if (data && data.error) {
          form.setError("root", { message: data.error });
        }
      }
    } catch (error) {
      form.setError("root", { message: "Something Went Wrong!" });
    }
  }

  const id = Date.now().toString();

  // Must be deleted once
  // https://github.com/JedWatson/react-select/issues/5459 is fixed.
  useEffect(() => setIsMounted(true), []);

  return (
    isMounted && (
      <>
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Join an Organization</CardTitle>

            <CardDescription></CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div className=" flex flex-col space-y-2 text-left mb-3">
                  

                  <GenericSelect
                    label="Select Organization"
                    placeholder="Search Organization"
                    form={form}
                    searchFunction={searchOrganizations as any}
                    customDefaultOptions={[{ value: "other", label: "Other" }]}
                    name="organization"
                  />

                  {schema === ExtendedJoinOrgSchema && (
                    <>
                      <div className="text-center font-semibold text-sm">
                        Register an Organization
                      </div>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> Organization Name </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Organization Name"
                                {...field}
                                type="text"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> Organization Type </FormLabel>
                            <FormControl>
                              <Select
                                id={id}
                                placeholder="Organization Type"
                                {...field}
                                options={ExtendedJoinOrgSchema.shape.type.shape.value.options.map(
                                  (t) => ({ value: t, label: t })
                                )}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <GenericSelect
                        label="Organization Country"
                        placeholder="Search Country"
                        form={form}
                        searchFunction={searchCountries}
                        name="country"
                      />

                      <GenericSelect
                        label="Organization State"
                        placeholder="Search State"
                        form={form}
                        searchFunction={searchStates as any} // as the types (query,countryId?,stateId?) and (query,countryId) dont match
                        countryId={countryVal?.value}
                        name="state"
                        isDisabled={!!!countryVal}
                      />

                      <GenericSelect
                        label="Organization City"
                        placeholder="Search City"
                        form={form}
                        searchFunction={searchCities as any}
                        countryId={countryVal?.value}
                        stateId={stateVal?.value}
                        name="city"
                        isDisabled={!!!countryVal || !!!stateVal}
                      />
                    </>
                  )}
                  <FormStatus
                    type="success"
                    message={
                      form.formState.isSubmitSuccessful ? "Successful!" : ""
                    }
                  />
                  <FormStatus
                    type="error"
                    message={form.formState.errors.root?.message}
                  />
                </div>
                <Button
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  className=""
                >
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter></CardFooter>
        </Card>
      </>
    )
  );
}
