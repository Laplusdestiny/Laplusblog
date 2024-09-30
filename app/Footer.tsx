// import Link from "next/link";
import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-4 md:mt-0 text-gray-500 text-sm text-center p-8">
            © 2024-{new Date().getFullYear()} Laplusblog. All rights reserved.
        </footer>
    )
};

export default Footer;
