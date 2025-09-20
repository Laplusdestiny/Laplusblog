'use client';
import { useEffect } from 'react';

export default function TwitterLoader() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const runLoad = () => {
            if (window.twttr && window.twttr.widgets) {
                // 既に読み込まれている場合は変換を実行
                window.twttr.widgets.load();
                return;
            }

            // 既存の script タグがあれば load イベントを待つ
            const existing = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
            if (existing) {
                existing.addEventListener('load', () => {
                    if (window.twttr && window.twttr.widgets) window.twttr.widgets.load();
                });
                return;
            }

            // 無ければ新しくスクリプトを追加
            const s = document.createElement('script');
            s.src = 'https://platform.twitter.com/widgets.js';
            s.async = true;
            s.charset = 'utf-8';
            s.onload = () => {
                if (window.twttr && window.twttr.widgets) window.twttr.widgets.load();
            };
            document.head.appendChild(s);
        };

        runLoad();
    }, []);

    return null;
}
