"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, UseFormReturn } from "react-hook-form";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import { CombinedJoinSchema } from "@/schemas/orgSchema";
import { z } from "zod";

type OptionType = {
  value: number | string;
  label: string;
};

type CombinedFormValues = z.infer<typeof CombinedJoinSchema>;

type GenericSelectPropsType = {
  form: UseFormReturn<CombinedFormValues>;
  name: FieldPath<CombinedFormValues>;
  label: string;
  placeholder?: string;
  isDisabled?: boolean;
  customDefaultOptions?: OptionType[];
  countryId?: number;
  stateId?: number;
  searchFunction: (
    query: string,
    countryId?: number,
    stateId?: number
  ) => Promise<
    {
      id: number;
      name: string;
    }[]
  >;
};

export function GenericSelect({
  form,
  searchFunction,
  name,
  customDefaultOptions,
  countryId,
  stateId,
  label,
  placeholder,
  isDisabled,
}: GenericSelectPropsType) {
  const id = Date.now().toString();

  const [defaultOptions, setDefaultOptions] = useState<OptionType[]>([]);

  async function getOptions(query: string): Promise<OptionType[]> {
    try {
      let arr;
      if (countryId && stateId) {
        arr = await searchFunction(query, countryId, stateId);
      } else if (countryId) {
        console.log("From generic states", countryId);
        arr = await searchFunction(query, countryId);
      } else {
        arr = await searchFunction(query);
      }
      const options = arr.map((obj) => ({
        value: obj.id,
        label: obj.name,
      }));

      return options;
    } catch (error) {
      form.setError("root", { message: "Something Went Wrong!" });
      return [];
    }
  }

  useEffect(() => {
    const getDefaultOptions = async () => {
      const options = await getOptions("");
      if (customDefaultOptions) {
        setDefaultOptions([...customDefaultOptions, ...options]);
      } else {
        setDefaultOptions(options);
      }
    };
    getDefaultOptions();
  }, [countryId, stateId]);

  const loadOptions = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      getOptions(inputValue).then((options) => callback(options));
    }, 500),
    [countryId, stateId] // VVIMP
  ) as any; // To Resolve TS ERROR in loadOptions

  //   function customDebounce(fn, delay = 500) {
  //     let timeout;

  //     return (...args) => {
  //         clearTimeout(timeout);
  //         timeout = setTimeout(() => {
  //             fn(...args);
  //         }, delay);
  //     };
  // }

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel> {label} </FormLabel>
            <FormControl>
              <AsyncSelect
                placeholder={placeholder}
                id={id}
                {...field}
                loadOptions={loadOptions}
                defaultOptions={defaultOptions}
                cacheOptions
                isDisabled={isDisabled ? isDisabled : false}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
