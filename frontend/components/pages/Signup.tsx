"use client";
import { handleGithubAuth, handleGoogleAuth } from "@/lib/actions";
import { authClient } from "@/lib/auth-client";

import { Loader } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { InputBox } from "../ui/InputBox";

export const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleEmailSignup = async () => {
    await authClient.signUp.email(
      {
        name,
        email,
        password,
        callbackURL: "/onboarding/welcome",
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          toast.success("Signed up successfully!");
          router.push("/onboarding/welcome");
        },
        onError: (ctx) => {
          setLoading(false);
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <div className="h-screen dark:bg-black bg-white text-black dark:text-white w-full flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="h-125 w-100"
      >
        <div className="dark:text-[white]/90 text-black text-xl text-center font-semibold">
          Create your workspace
        </div>
        <div className="mt-8">
          <InputBox
            type="text"
            value={name}
            label="Name"
            placeholder="John Doe"
            onChange={(e) => {
              setName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                emailRef.current?.focus();
              }
            }}
          />
          <InputBox
            type="text"
            value={email}
            ref={emailRef}
            label="Email address"
            placeholder="Johndoe@gmail.com"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                passwordRef.current?.focus();
              }
            }}
          />
          <InputBox
            type="password"
            value={password}
            ref={passwordRef}
            label="Password"
            placeholder="••••••••••"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
              }
            }}
          />
          <button
            onClick={handleEmailSignup}
            className="h-12  font-semibold mt-8 rounded-md w-full dark:text-black text-white flex items-center justify-center bg-[#5c4cd8] hover:bg-[#8979ff]"
          >
            {loading ? <Loader className="animate-spin" /> : "Sign Up"}
          </button>
          <div className="h-px bg-linear-to-r from-transparent dark:via-[#8979ff] via-[#d1d1d6] to-transparent mt-10"></div>
          <div className="flex gap-5  mt-6">
            <button
              onClick={handleGoogleAuth}
              className="flex-1 hover:bg-neutral-100 dark:hover:bg-neutral-950 h-12 px-3 rounded-md border border-neutral-200 dark:border-neutral-800 flex justify-center items-center gap-2 cursor-pointer"
            >
              <Image
                src="/images/google.png"
                alt="google"
                height={20}
                width={20}
              />
              Google
            </button>
            <button
              onClick={handleGithubAuth}
              className="flex-1 hover:bg-neutral-100 dark:hover:bg-neutral-950 h-12 px-3 rounded-md border border-neutral-200 dark:border-neutral-800 flex justify-center items-center gap-2 cursor-pointer"
            >
              <Image
                src={"/images/github.png"}
                alt="google"
                height={22}
                width={22}
              />
              Github
            </button>
          </div>
          <div className="text-neutral-500 text-sm text-center mt-4">
            Already have an account?{" "}
            <Link
              href={"/signin"}
              className="dark:text-white/90 text-neutral-800 hover:underline hover:underline-offset-2"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
