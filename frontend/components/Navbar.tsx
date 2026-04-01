"use client";
import Link from "next/link";
import { NavigationMenuDemo } from "./Navigation";

export function Navbar() {
  return (
    <div className="h-16 w-full fixed top-6 z-50">
      <div className="w-full flex items-center justify-center">
        <div className="lg:min-w-4xl px-8 flex justify-between bg-neutral-900 rounded-2xl h-16  items-center">
          <img src="https://cdn.simpleicons.org/bluesound/white?viewbox=auto&size=20" />
          <NavigationMenuDemo />
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
