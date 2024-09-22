import Link from "next/link";
import React from 'react';

const Header = () => {
    return (
        <header className="py-5 px-10 border-b flex justify-between">
            <div>
                <h1>
                    <Link href="/">Laplusblog</Link>
                </h1>
            </div>
        </header>
    )
};

export default Header;
