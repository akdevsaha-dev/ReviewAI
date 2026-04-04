"use client";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <div className="h-16 w-full fixed top-6 z-50">
      <div className="w-full flex items-center justify-center">
        <div className="lg:min-w-4xl px-8 flex w-auto text-white justify-between bg-neutral-900 rounded-2xl h-16  items-center">
          <Image
            unoptimized
            src="https://cdn.simpleicons.org/bluesound/white?viewbox=auto&size=20"
            alt="Prwise logo"
            width={20}
            height={20}
          />
          <div className="flex gap-10">
            <div>About</div>
            <div>Demo</div>
            <div>Features</div>
          </div>
          <Link
            href={"signup"}
            className="px-4 cursor-pointer hover:opacity-90 py-2 bg-white rounded-md text-black text-sm font-semibold"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
