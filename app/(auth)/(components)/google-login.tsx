"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { auth, db } from "@/firebase/firebase";
import { Button } from "../../../components/ui/button";
import Image from "next/image";
import { storeUserId } from "../_actions/auth-actions";

const SignInWithGoogle = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleLogin = async () => {
		try {
			setIsLoading(true);

			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);

			await storeUserId(result.user.uid);

			// Store user data to Firestore only if it doesn't already exist
			const userDocRef = doc(db, "users", result.user.uid);
			const userDocSnapshot = await getDoc(userDocRef);
			if (!userDocSnapshot.exists()) {
				await setDoc(userDocRef, {
					_id: result.user.uid,
					photoURL: result.user.photoURL,
					displayName: result.user.displayName,
					email: result.user.email,
					firstName: result.user.displayName?.split(" ")[0] || "",
					lastName: result.user.displayName?.split(" ")[1] || "",
					imgPublicId: "", //From cloudinary
				});
			}

			router.push("/select-currency");
		} catch (error: any) {
			console.log(error.message);
			toast.error("Failed to log in. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
				<span className="relative z-10 bg-background px-5 text-muted-foreground">
					Or
				</span>
			</div>
			<Button
				variant="outline"
				className="w-full"
				onClick={handleGoogleLogin}
				disabled={isLoading}
			>
				{isLoading ? (
					<>
						<Loader2 size={20} className="animate-spin" />
					</>
				) : (
					<>
						<Image
							src="/assets/google-logo.png"
							alt="Google Logo"
							width={20}
							height={20}
						/>
						<span className="ml-1">Continue with Google</span>
					</>
				)}
			</Button>
		</>
	);
};

export default SignInWithGoogle;
