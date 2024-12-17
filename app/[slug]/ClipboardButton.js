'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';

export default function ClipboardButton({ clipboardText }) {
    const handleClick = () => {
        navigator.clipboard.writeText(clipboardText);
        alert('クリップボードにコピーしました。');
    };

    return (
        <div className='col-span-1 flex justify-center bg-black text-white items-center'>
            <button
                onClick={handleClick}
                className='text-white no-underline bg-transparent border-none cursor-pointer'
            >
                <FontAwesomeIcon icon={faClipboard} className='h-[30px]' />
            </button>
        </div>
    );
}