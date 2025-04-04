import Logo from "@/components/logo";

const loading = () => {
	return (
		<div className="flex justify-center items-center h-screen w-full bg-background">
			<div className="h-20 w-full animate-bounce flex justify-center items-center">
				<Logo mobileText={true} />
			</div>
		</div>
	);
};

export default loading;
