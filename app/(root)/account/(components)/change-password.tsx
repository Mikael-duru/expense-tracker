"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	signOut,
	updatePassword,
} from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/firebase";
import CustomInput from "@/components/custom-input";
import { toast } from "sonner";
import { formSchema } from "@/lib/schemas";

const ChangePassword = () => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const changePasswordSchema = formSchema("change-password");

	const form = useForm<z.infer<typeof changePasswordSchema>>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
		},
	});

	// 2. Define a submit handler.
	const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
		try {
			setIsLoading(true);

			const { currentPassword, newPassword } = data;

			if (currentPassword === newPassword) {
				toast.error("New password cannot be the same as current password.");
				return;
			}

			const user = auth?.currentUser;

			if (user && user.email) {
				const credential = EmailAuthProvider.credential(
					user.email,
					currentPassword as string
				);

				await reauthenticateWithCredential(user, credential);

				await updatePassword(user, newPassword as string);
				toast.success("Password changed successfully!");

				await signOut(auth);
				router.push("/sign-in");
			} else {
				toast.error("User not found. Please log in again.");
			}
		} catch (error: any) {
			console.error(error);
			if (error.code === "auth/invalid-credential") {
				toast.error("Current password is incorrect. Please try again.");
			} else {
				toast.error("An error occurred. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl">Change Password</CardTitle>
				<CardDescription>
					After saving, you&apos;ll be logged out.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
						<CustomInput
							control={form.control}
							name="currentPassword"
							label="Current Password"
							placeholder="Enter your current password"
						/>
						<CustomInput
							control={form.control}
							name="newPassword"
							label="New Password"
							placeholder="Enter your new password"
						/>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 size={20} className="animate-spin" />{" "}
									&nbsp;Loading...
								</>
							) : (
								"Save password"
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default ChangePassword;
