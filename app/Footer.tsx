import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBluesky, faSquareGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

const Footer = () => {
	return (
		<footer className="mt-4 md:mt-0 text-gray-500 text-sm text-center p-8">
			<div className="my-4">
				<h2 className="text-center text-xl font-semibold mb-4 no-border">Follow Me</h2>
				<div className="flex justify-center items-center space-x-4">
					<Link href="https://x.com/Laplusdestiny" className="transition-transform transform hover:scale-110 text-black">
						<FontAwesomeIcon icon={faXTwitter} className='h-[40px] w-[40px]' />
					</Link>
					<Link href="https://misskey.io/@Laplusdestiny" className="transition-transform transform hover:scale-110">
						<Image
							src="/misskey.svg"
							height={40}
							width={40}
							alt="misskey.io"
							className="socialmedia"
							style={{ width: '40px', height: '40px' }}
						/>
					</Link>
					<Link href="https://github.com/Laplusdestiny" className="transition-transform transform hover:scale-110 text-black ">
						<FontAwesomeIcon icon={faSquareGithub} className='h-[40px] w-[40px]' />
					</Link>
					<Link href="https://bsky.app/profile/laplusdestiny.com" className="transition-transform transform hover:scale-110 text-[#1185FE]">
						<FontAwesomeIcon icon={faBluesky} className='h-[40px] w-[40px]' />
					</Link>
				</div>
			</div>
			© 2024-{new Date().getFullYear()} Laplusblog. All rights reserved.
		</footer>
	)
};

export default Footer;
