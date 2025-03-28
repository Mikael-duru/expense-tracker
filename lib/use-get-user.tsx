"use client";

import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { auth, db } from "@/firebase/firebase";

export function useGetUserInfo() {
	const [user, setUser] = useState<User | null>(null);
	const [userDetails, setUserDetails] = useState<UserProps | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				setUser(user);

				try {
					const userDocRef = doc(db, "users", user.uid);
					const unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
						if (doc.exists()) {
							setUserDetails(doc.data() as UserProps);
						}
					});

					return () => unsubscribeDoc();
				} catch (error) {
					console.error(error);
				}
			} else {
				setUser(null);
				setUserDetails(null);
				router.push("/");
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return { user, userDetails, loading };
}
