import React from "react";
import { z } from "zod";
import { Control, FieldPath } from "react-hook-form";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { formSchema } from "@/lib/schemas";

const authFormSchema = formSchema("sign-up");

interface CustomInputProps {
	control: Control<z.infer<typeof authFormSchema>>;
	name: FieldPath<z.infer<typeof authFormSchema>>;
	label: string;
	placeholder: string;
}

const CustomInput = ({
	control,
	name,
	label,
	placeholder,
}: CustomInputProps) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="form-item">
					<FormLabel className="form-label">{label}</FormLabel>
					<div className="flex w-full flex-col">
						<FormControl>
							<Input
								type={name === "password" ? "password" : "text"}
								placeholder={placeholder}
								{...field}
							/>
						</FormControl>
						<FormMessage className="form-message mt-2" />
					</div>
				</FormItem>
			)}
		/>
	);
};

export default CustomInput;
