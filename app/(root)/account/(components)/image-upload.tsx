import { Loader2, Upload } from "lucide-react";
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { toast } from "sonner";

import { db } from "@/firebase/firebase";
import { Button } from "@/components/ui/button";

type ProfileImageUploadProps = {
	user: User;
	userDetails: UserProps;
};

const ProfileImageUpload = ({ user, userDetails }: ProfileImageUploadProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleUpload = async (event: any) => {
		const file = event.target.files[0];
		if (!file) return;

		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append(
				"upload_preset",
				process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
			);

			// Upload to Cloudinary
			const uploadRes = await fetch("/api/profile-picture/upload", {
				method: "POST",
				body: formData,
			});

			const uploadData = await uploadRes.json();
			if (!uploadRes.ok) throw new Error(uploadData.error);

			const { imageUrl, publicId } = uploadData;

			const oldPublicId = userDetails?.imgPublicId || "";

			// Update Firestore with new image URL & public ID
			const userRef = doc(db, "users", user?.uid);

			await updateDoc(userRef, {
				photoURL: imageUrl,
				imgPublicId: publicId,
			});

			toast.success("Profile picture changed successfully!");

			// Delete old image if it exists
			if (oldPublicId) {
				await fetch("/api/profile-picture/delete", {
					method: "POST",
					body: JSON.stringify({ publicId: oldPublicId }),
				});
			}
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Failed to upload image.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<Button className="mt-6 max-sm:text-xs" size="sm">
				<label htmlFor="file-upload">
					<p
						key="file-upload-span"
						className="relative flex items-center cursor-pointer"
					>
						{isLoading ? (
							<Loader2 size={20} className="animate-spin" />
						) : (
							<>
								<Upload className="h-4 w-4 mr-2" />
								Change Photo
							</>
						)}
					</p>
					<input
						type="file"
						accept="image/*"
						name="file-upload"
						id="file-upload"
						className="sr-only"
						disabled={isLoading}
						onChange={handleUpload}
					/>
				</label>
			</Button>
			<p className="text-[10px] leading-5 text-muted-foreground pt-1">
				PNG, JPG, JPEG up to 10MB
			</p>
		</div>
	);
};

export default ProfileImageUpload;
