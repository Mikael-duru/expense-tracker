"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import SignInWithGoogle from "./google-login";
import { auth, db } from "@/firebase/firebase";
import { formSchema } from "@/schema/auth-form";
import CustomInput from "@/components/custom-input";
import { storeUserId } from "../_actions/auth-actions";

interface AuthFormProps {
	type: AuthFormType;
}

const AuthForm = ({ type }: AuthFormProps) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const checkAuthCookie = async () => {
			const authCookie = Cookies.get("__session_auth");

			if (!authCookie) {
				await signOut(auth);
			}
		};

		checkAuthCookie();
	}, []);

	const authFormSchema = formSchema(type);

	const form = useForm<z.infer<typeof authFormSchema>>({
		resolver: zodResolver(authFormSchema),
		defaultValues: {
			email: "",
			password: "",
			firstName: "",
			lastName: "",
		},
	});

	const handleRegister = async ({
		email,
		password,
		firstName,
		lastName,
	}: any) => {
		console.log("registering");

		const { user } = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		const userData = {
			email,
			firstName,
			lastName,
			_id: user.uid,
			photoURL: "",
			displayName: `${firstName} ${lastName}`,
			imgPublicId: "",
		};

		await setDoc(doc(db, "users", user.uid), userData);
		localStorage.setItem("registrationData", JSON.stringify({ userData }));
		await signOut(auth);
		router.push("/sign-in");
	};

	const handleAuthenticate = async ({ email, password }: any) => {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		await storeUserId(user.uid);

		const userDocRef = doc(db, "users", user.uid);
		const userDoc = await getDoc(userDocRef);

		if (!userDoc.exists()) {
			const userRegistrationData = JSON.parse(
				JSON.stringify(localStorage.getItem("registrationData"))
			);

			await setDoc(doc(db, "users", user.uid), userRegistrationData);
		}

		localStorage.removeItem("registrationData");
		router.push("/select-currency");
	};

	const handlePasswordReset = async ({ email }: any) => {
		await sendPasswordResetEmail(auth, email);
		toast.success(
			`Request Successful! \n If an account exists for ${email}, you'll receive instructions.`
		);
	};

	const onSubmit = async (data: z.infer<typeof authFormSchema>) => {
		try {
			setIsLoading(true);
			const { email, password, firstName, lastName } = data;

			if (type === "sign-up")
				await handleRegister({ email, password, firstName, lastName });
			if (type === "sign-in") await handleAuthenticate({ email, password });
			if (type === "forgot-password") await handlePasswordReset({ email });
		} catch (error: any) {
			const errorMessages: any = {
				"auth/user-not-found": "No user found with this email.",
				"auth/wrong-password": "Incorrect password.",
				"auth/invalid-email": "Invalid email address.",
				"auth/email-already-in-use": "The email is already in use.",
				"auth/invalid-credential": "Invalid credentials",
				"auth/credential-already-in-use":
					"This credential is already associated with a different user account.",
			};
			toast.error(
				errorMessages[error.code] || "An error occurred. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="overflow-hidden">
			<CardContent>
				<div className="pt-6 md:pt-8">
					<div className="flex flex-col gap-6">
						<div className="space-y-1">
							<h1 className="text-3xl font-bold">
								{type === "sign-in"
									? "Sign in"
									: type === "sign-up"
									? "Sign up"
									: "Forgot Password"}
							</h1>
							<p className="text-sm text-muted-foreground">
								{type === "forgot-password"
									? "Please enter your email for password reset link."
									: "to continue to BudgetWise."}
							</p>
						</div>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-5"
							>
								{type === "sign-up" && (
									<div className="flex max-sm:flex-col gap-5">
										<CustomInput
											control={form.control}
											name="firstName"
											label="First Name"
											placeholder="Enter your first name"
										/>
										<CustomInput
											control={form.control}
											name="lastName"
											label="Last Name"
											placeholder="Enter your last name"
										/>
									</div>
								)}
								<CustomInput
									control={form.control}
									name="email"
									label="Email"
									placeholder="Enter your email"
								/>
								{type !== "forgot-password" && (
									<div>
										<CustomInput
											control={form.control}
											name="password"
											label="Password"
											placeholder="Enter your password"
										/>
										{type === "sign-in" && (
											<div className="text-end pt-1">
												<Link
													href="/sign-in/forgot-password"
													className="text-end text-sm underline-offset-4 hover:underline"
												>
													Forgot your password?
												</Link>
											</div>
										)}
									</div>
								)}
								<div className="w-full">
									<Button type="submit" className="w-full" disabled={isLoading}>
										{isLoading ? (
											<>
												<Loader2 size={20} className="animate-spin" />{" "}
												&nbsp;Loading...
											</>
										) : type === "sign-in" ? (
											"Sign In"
										) : type === "sign-up" ? (
											"Sign Up"
										) : (
											"Send Reset Link"
										)}
									</Button>
								</div>
							</form>
						</Form>

						<div className="space-y-5">
							{type === "sign-in" && <SignInWithGoogle />}

							{type !== "forgot-password" && (
								<footer className="flex justify-center gap-1 text-center">
									<p className="text-xs font-normal">
										{type === "sign-in"
											? "Don't have an account?"
											: "Already have an account?"}
									</p>
									<Link
										href={type === "sign-in" ? "/sign-up" : "/sign-in"}
										className="text-xs hover:underline underline-offset-4"
									>
										{type === "sign-in" ? "Sign Up" : "Sign In"}
									</Link>
								</footer>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default AuthForm;
