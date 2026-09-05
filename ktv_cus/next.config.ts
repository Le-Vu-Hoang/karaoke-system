import type {NextConfig} from "next";
import path from "path";

const nextConfig: NextConfig = {
    output: "standalone",
    outputFileTracingRoot: path.join(__dirname, "../"),
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;
