"use client";

import Link from "next/link";

export default function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800">500 - Page Not Found</h1>
            <h2 className="text-2xl font-bold text-gray-800">The page you are looking for does not exist.</h2>
            <Link className="mt-4 px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600" href="/">Go to Home</Link>
        </div>
    );
}
