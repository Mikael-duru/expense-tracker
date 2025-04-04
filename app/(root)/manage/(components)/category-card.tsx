import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import { TrashIcon } from "lucide-react";
import React from "react";
import DeleteCategoryDialog from "./delete-category";

const CategoryCard = ({ category }: { category: Category }) => {
	return (
		<div className="flex justify-between flex-col border border-separate rounded-lg shadow-sm shadow-black/[0.1] dark:shadow-white/[0.1]">
			<div className="flex flex-col items-center gap-2 p-4">
				<span className="text-3xl" role="img">
					{category.icon}
				</span>
				<span>{category.name}</span>
			</div>
			<DeleteCategoryDialog
				category={category}
				trigger={
					<Button
						variant={"secondary"}
						className="w-full flex items-center gap-2 border-separate rounded-t-none text-muted-foreground hover:bg-red-500/20"
						onClick={() => {}}
					>
						<TrashIcon size={16} /> Remove
					</Button>
				}
			/>
		</div>
	);
};

export default CategoryCard;
