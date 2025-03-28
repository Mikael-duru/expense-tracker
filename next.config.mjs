/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com", // Google user profile images
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com", // Cloudinary images
				pathname: "/**", // Allow all paths under Cloudinary
			},
		],
	},
};

export default nextConfig;
