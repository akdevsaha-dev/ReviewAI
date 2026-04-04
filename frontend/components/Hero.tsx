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
    <div className="bg-neutral-950">
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
              loading="eager"
              src="/dashboard.png"
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
            <div className="min-h-80 max-w-150 bg-neutral-900 rounded-2xl py-10 text-left text-neutral-400 font-semibold  flex items-center justify-center px-8">
              Prwise is a developer-focused collaboration platform designed to
              transform how code reviews happen in modern teams. Instead of
              relying solely on human reviewers who may be busy or unavailable,
              Prwise automatically analyzes pull requests and provides
              intelligent feedback on code quality, structure, and potential
              improvements. It helps developers identify bugs earlier, maintain
              consistent coding standards, and learn better practices directly
              within their workflow. By integrating seamlessly with existing
              repositories and development pipelines, Prwise acts as a smart
              assistant that reviews changes, suggests refinements, and
              accelerates the entire development cycle. Whether you are an
              individual developer working on personal projects or a team
              maintaining large production systems, Prwise helps ensure that
              every pull request is clearer, cleaner, and ready for production
              faster.
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
        <div className="mt-44 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          <div className="bg-neutral-900/60 backdrop-blur border border-neutral-800 rounded-2xl p-8 hover:border-neutral-600 transition">
            <div className="text-xl font-semibold text-white mb-3">
              Instant PR Summaries
            </div>
            <div className="text-neutral-400 text-sm leading-relaxed">
              Every pull request is automatically summarized so you instantly
              understand what changed without reading hundreds of lines of code.
            </div>
          </div>

          <div className="bg-neutral-900/60 backdrop-blur border border-neutral-800 rounded-2xl p-8 hover:border-neutral-600 transition">
            <div className="text-xl font-semibold text-white mb-3">
              Bug Risk Detection
            </div>
            <div className="text-neutral-400 text-sm leading-relaxed">
              AI highlights potential risks, suspicious patterns, and fragile
              code so your team can catch issues before they reach production.
            </div>
          </div>

          <div className="bg-neutral-900/60 backdrop-blur border border-neutral-800 rounded-2xl p-8 hover:border-neutral-600 transition">
            <div className="text-xl font-semibold text-white mb-3">
              Smarter Code Reviews
            </div>
            <div className="text-neutral-400 text-sm leading-relaxed">
              Get actionable suggestions that improve readability, structure,
              and maintainability across your entire codebase.
            </div>
          </div>
        </div>
        <div className="flex justify-center text-xl text-center mt-20 text-neutral-900">
          Get started and see how PRwise helps you process your code in a
          fraction of the time.
        </div>
        <div className="flex items-center justify-center">
          <div className=" w-32 mt-20 bg-white text-center h-12 flex items-center justify-center text-black font-semibold rounded-xl">
            Get Started
          </div>
        </div>
      </div>
      <footer className="w-full bg-neutral-950 border-t border-neutral-800 text-neutral-400">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="text-white text-xl font-semibold">Prwise</div>
              <p className="mt-4 text-sm leading-relaxed">
                Intelligent pull‑request reviews powered by AI. Ship cleaner
                code faster, catch issues early, and help your team maintain
                consistent quality across every repository.
              </p>
            </div>

            <div>
              <div className="text-white font-semibold mb-4">Product</div>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">
                  Features
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Pricing
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Integrations
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Changelog
                </li>
              </ul>
            </div>

            <div>
              <div className="text-white font-semibold mb-4">Resources</div>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">
                  Documentation
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Guides
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Blog
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Support
                </li>
              </ul>
            </div>

            <div>
              <div className="text-white font-semibold mb-4">Company</div>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">
                  About
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Careers
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Privacy
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Terms
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div>© {new Date().getFullYear()} Prwise. All rights reserved.</div>
            <div className="flex gap-6">
              <span className="hover:text-white cursor-pointer transition-colors">
                Twitter
              </span>
              <span className="hover:text-white cursor-pointer transition-colors">
                GitHub
              </span>
              <span className="hover:text-white cursor-pointer transition-colors">
                LinkedIn
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
