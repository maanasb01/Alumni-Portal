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
import { z } from "zod";
import { EventSchema } from "@/schemas/eventSchema";
import { searchCurrency } from "@/data/currency";

type OptionType = {
  value: number;
  label: string;
};

type EventFormType = z.infer<typeof EventSchema>;

type CurrencySelectPropTypes = {
  form: UseFormReturn<EventFormType>;
  name: FieldPath<EventFormType>;
//   label: string;
//   placeholder?: string;

//   customDefaultOptions?: OptionType[];

//   searchFunction: (query: string) => Promise<
//     {
//       id: number;
//       name: string;
//       currency: string;
//       currencySymbol: string;
//     }[]
//   >;
};

export function CurrencySelectAsync({
  form,
//   searchFunction,
  name,
 

//   label,
//   placeholder,

}: CurrencySelectPropTypes) {
  const id = Date.now().toString();

//   const [defaultOptions, setDefaultOptions] = useState<OptionType[]>([]);

  async function getOptions(query: string): Promise<OptionType[]> {
    try {
      let arr = await searchCurrency(query);
      console.log(arr)
    
      const options = arr.map((obj) => ({
        value: obj.id,
        label: `${obj.name} - ${obj.currency} (${obj.currencySymbol})`,
      }));

      return options;
    } catch (error) {
      form.setError("root", { message: "Something Went Wrong!" });
      return [];
    }
  }

//   useEffect(() => {
//     const getDefaultOptions = async () => {
//       const options = await getOptions("");
//       if (customDefaultOptions) {
//         setDefaultOptions([...customDefaultOptions, ...options]);
//       } else {
//         setDefaultOptions(options);
//       }
//     };
//     getDefaultOptions();
//   }, []);

  const loadOptions = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      getOptions(inputValue).then((options) => callback(options));
    }, 500),
    [] // VVIMP
  )  

 

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel> {"Currency"} </FormLabel>
            <FormControl>
              <AsyncSelect
                placeholder={"Currency"}
                id={id}
                {...field}
                loadOptions={loadOptions}
                defaultOptions={true}
                cacheOptions
               
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
