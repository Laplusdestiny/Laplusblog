"use client";

import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
    }, []);

    const toggleTheme = () => {
        if (theme === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setTheme('dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setTheme('light');
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
            <div className="flex items-center">
                <h1 className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
                    <Link href="/" className="text-foreground">Laplusblog</Link>
                </h1>
            </div>
            {mounted && (
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-secondary transition-colors text-foreground focus:outline-none"
                    aria-label="Toggle dark mode"
                >
                    <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="h-5 w-5" />
                </button>
            )}
        </header>
    )
};

export default Header;
