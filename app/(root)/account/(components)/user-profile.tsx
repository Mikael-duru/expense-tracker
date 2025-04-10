"use client";

import {
	deleteUser,
	EmailAuthProvider,
	GoogleAuthProvider,
	reauthenticateWithCredential,
	reauthenticateWithPopup,
	User,
} from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { UserRoundCheck, Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, db } from "@/firebase/firebase";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ProfileImageUpload from "./image-upload";
import { deleteUserFromDB } from "@/app/select-currency/_actions/user-actions";

type UserProfileProps = {
	user: User;
	userDetails: UserProps;
};

const UserProfile = ({ user, userDetails }: UserProfileProps) => {
	const [password, setPassword] = useState("");
	const [deleteAccount, setDeleteAccount] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [passwordError, setPasswordError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const currentUser = auth?.currentUser as User;

	const isEmailUser =
		currentUser?.providerData.some(
			(provider) => provider.providerId === "password"
		) || false;

	const isGoogleUser =
		currentUser?.providerData.some(
			(provider) => provider.providerId === "google.com"
		) || false;

	const handlePasswordChange = (e: any) => {
		setPassword(e.target.value);
		setPasswordError(""); // Clear error when user starts typing
	};

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	const handleDeleteUserAccount = async () => {
		try {
			setIsLoading(true);

			// Ensure password is entered for email users
			if (isEmailUser && !password) {
				setPasswordError("Password is required");
				return;
			}

			// Reauthenticate user
			if (isEmailUser) {
				try {
					const email = currentUser.email as string;
					const credential = EmailAuthProvider.credential(email, password);
					await reauthenticateWithCredential(currentUser, credential);
				} catch (error: any) {
					if (
						error.code === "auth/wrong-password" ||
						error.code === "auth/invalid-credential"
					) {
						setPasswordError("Incorrect password. Please try again.");
					} else {
						toast.error("Reauthentication failed. Please try again.");
					}
					return;
				}
			}

			if (isGoogleUser) {
				try {
					const googleProvider = new GoogleAuthProvider();
					await reauthenticateWithPopup(currentUser, googleProvider);
				} catch (error) {
					console.log("[Delete_Google_Account]", error);
					toast.error("Reauthentication failed. Please try again.");
					return;
				}
			}

			// Proceed with deleting the user account
			const userDocRef = doc(db, "users", currentUser.uid);
			await deleteUserFromDB();
			await deleteDoc(userDocRef);
			await deleteUser(currentUser);
			Cookies.remove("__session_auth");

			toast.success("Account deleted successfully! 🎉", {
				id: "delete-user-account",
			});
			router.push("/");
		} catch (error) {
			console.error("[Delete_Account]", error);
			toast.error("Something went wrong. Please try again.", {
				id: "delete-user-account",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-3xl">My Account</CardTitle>
				<CardDescription className="text-muted-foreground">
					Manage your account here. You can update your profile picture and
					delete your account if needed.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<Card>
					<CardContent className="space-y-4 max-sm:px-4">
						<div className="pt-6 flex flex-wrap justify-between max-sm:text-center">
							<div>
								{/* Profile Image */}
								<Avatar className="h-24 w-24 border-2 border-primary/20 ml-4">
									<AvatarImage
										src={userDetails?.photoURL}
										alt="user profile pic"
									/>
									<AvatarFallback>
										<UserRoundCheck size={50} />
									</AvatarFallback>
								</Avatar>
								{/* Profile Name and Email */}
								<div className="pt-2 text-start">
									<h1 className="font-medium text-xl -mb-0.5">
										{userDetails?.displayName}
									</h1>
									<p className="text-sm sm:text-base text-muted-foreground">
										{userDetails?.email}
									</p>
								</div>
							</div>
							<ProfileImageUpload user={user} userDetails={userDetails} />
						</div>
					</CardContent>
				</Card>

				<Card className="dark:border-red-900">
					<CardHeader>
						<CardTitle className="text-2xl">Delete Account</CardTitle>
						<CardDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our server.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isEmailUser && (
							<div className="space-y-1 pb-8">
								<Label
									htmlFor="password"
									className={`${passwordError ? "text-red-500" : ""}`}
								>
									Password
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										onChange={handlePasswordChange}
										className={`${passwordError ? "border-red-500" : ""} pr-10`}
										value={password}
									/>
									<button
										type="button"
										onClick={togglePasswordVisibility}
										className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
								{passwordError && (
									<p className="text-red-500 text-xs">{passwordError}</p>
								)}
							</div>
						)}

						<div className="space-y-1">
							<Label htmlFor="deleteAcct">
								Type the word{" "}
								<span className="text-red-500">
									&quot;delete my account&quot;
								</span>{" "}
								to confirm.
							</Label>
							<Input
								id="deleteAcct"
								placeholder='Enter the word "delete my account"'
								onChange={(e) => setDeleteAccount(e.target.value)}
								value={deleteAccount}
							/>
						</div>
					</CardContent>
					<CardFooter>
						<div className="w-full flex justify-end">
							<Button
								onClick={() => {
									toast.loading("Deleting your account...", {
										id: "delete-user-account",
									});
									handleDeleteUserAccount();
								}}
								variant="destructive"
								disabled={deleteAccount !== "delete my account" || isLoading}
							>
								Confirm
							</Button>
						</div>
					</CardFooter>
				</Card>
			</CardContent>
		</Card>
	);
};

export default UserProfile;
