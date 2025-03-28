import AuthForm from "../(components)/auth-form";

const LoginPage = () => {
	return (
		<div className="w-full max-w-sm rounded-2xl">
			<AuthForm type="sign-in" />
		</div>
	);
};

export default LoginPage;
