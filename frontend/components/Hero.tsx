"use client";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { authClient } from "../lib/auth-client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
export function Hero() {
  async function handleClick() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/newsletter/inbox",
    });
  }
  useGSAP(() => {
    const magicSplit = new SplitText("#magic", { type: "chars" });
    gsap.from(magicSplit.chars, {
      stagger: 0.08,
      ease: "expo.out",
      duration: 1,
      yPercent: 100,
    });
    gsap.fromTo(
      "#magic-bg",
      { x: "-100%" },
      {
        x: "0%",
        duration: 2,
        ease: "power2.out",
      },
    );
  }, []);
  return (
    <div className="">
      <div className="min-h-[70vh] w-full relative flex flex-col">
        <div
          className="absolute inset-0 z-0 opacity-50"
          style={{
            backgroundColor: "#0a0a0a",
            backgroundImage: `
            radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 3px),
            radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
          `,
            backgroundSize: "10px 10px",
          }}
        />
        <div className="flex-1 flex text-white flex-col items-center justify-center opacity-90 md:mt-20">
          <div className="md:max-w-3xl  max-w-100 text-3xl text-center md:text-6xl font-semibold antialiased">
            Intelligent PR{" "}
            <span
              id="magic"
              className="relative inline-flex items-center overflow-hidden text-neutral-200 px-3 py-1 rounded-lg border border-neutral-500"
            >
              <span
                id="magic-bg"
                className="absolute inset-0 bg-neutral-600"
              ></span>

              <span className="relative z-10">Assistant</span>
            </span>
            , Built to Save You Time.
          </div>
          <div className="mt-5 opacity-65 w-xl md:w-4xl font-semibold text-sm text-center md:text-lg px-8 md:px-0">
            Every pull request gets an instant AI summary. Get bug risk scores,
            and suggestions for your pull requests. Ship better code, faster.
          </div>
          <div className="text-xs opacity-60 mt-5">
            No credit card required.
          </div>
          <div className="flex gap-6 mt-4">
            <button
              onClick={handleClick}
              className="w-40 h-12 flex gap-2 items-center justify-center hover:opacity-80 font-bold rounded-full bg-neutral-800 "
            >
              <div>Get Started</div>
              <ArrowUpRight size={20} />
            </button>
            <div className="w-45 pl-2 h-12 hidden md:flex gap-2 items-center justify-center hover:opacity-80 font-semibold rounded-full bg-white text-black ">
              <div>See it in Action</div>
              <div className="px-1 py-1 rounded-full bg-black text-white">
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-y border-y-neutral-700 bg-[#0f0f0f] relative text-white">
        <div
          className="absolute inset-0 z-0 pointer-events-none hidden md:block"
          style={{
            backgroundImage: `
        repeating-linear-gradient(-45deg,
          rgba(255, 0, 100, 0.15) 0px,
          rgba(255, 0, 100, 0) 2px,
          transparent 2px,
          transparent 20px
        )
      `,
          }}
        />

        <div className="relative z-20 w-full flex items-center justify-center px-4">
          <div className="w-full max-w-7xl md:border-x md:border-x-neutral-700">
            <Image
              src="/email-preview.png"
              width={1920}
              height={1080}
              alt="Newsletter preview"
              className="w-full h-auto object-contain px-px"
            />
          </div>
        </div>
      </div>
      <div className="min-h-screen mt-10 md:mt-50 bg-neutral-950 ">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: { delay: 0.2, duration: 0.5 },
          }}
          className="flex flex-col items-center"
        >
          <div className="opacity-40 text-lg md:text-xl">
            Designed for power users who value time
          </div>
          <div className="mt-10 text-4xl md:text-6xl font-semibold text-white">
            Speed Is Everything
          </div>
          <div className="text-4xl md:text-6xl font-semibold mt-1 text-neutral-500">
            Review in seconds
          </div>
          <div className="px-10 mt-10">
            <div className="min-h-80 max-w-150  bg-neutral-900 rounded-2xl text-center  flex items-center justify-center px-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
              harum qui dolorem in illo quo ipsa, vel ducimus hic nulla
              molestias quae illum ex facilis laudantium, delectus placeat
              praesentium aut debitis fugiat dolor. Quo ab voluptas reiciendis.
              Rem, ratione officiis in deserunt labore voluptatum laudantium, at
              quaerat obcaecati illo suscipit. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Maxime illum, perspiciatis tenetur
              soluta deserunt aspernatur, distinctio cum quisquam laboriosam
              architecto voluptatum amet quibusdam, doloribus nulla quasi qui
              maiores nisi quam. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Earum deleniti ad sed quaerat tenetur dolor,
              nostrum aspernatur beatae eveniet quisquam?
            </div>
          </div>
        </motion.div>
      </div>
      <div className="min-h-[150vh] w-full bg-black relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(58, 175, 169, 0.6) 0%, transparent 60%),
          radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%),
          radial-gradient(circle at 50% 100%, rgba(238, 130, 238, 0.3) 0%, transparent 80%)
        `,
          }}
        />
        <div className="flex text-8xl text-neutral-400 text-center font-bold mt-40 items-center justify-center mask-[linear-gradient(to_bottom,black_20%,transparent)]">
          Experience the Future of Developer Experience
        </div>
        <div className="flex justify-center text-xl text-center mt-10">
          Get started and see how ReviewAI helps you process your code in a
          fraction of the time.
        </div>
        <div className="flex items-center justify-center">
          <div className=" w-32 mt-20 bg-white text-center h-12 flex items-center justify-center text-black font-semibold rounded-xl">
            Get Started
          </div>
        </div>
      </div>
    </div>
  );
}
