"use client";

import { auth, provider } from "../../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const sendToken = async (token: string) => {
    await api.post("/auth/verify", {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    console.log(token)
    localStorage.setItem("token", token);
    await sendToken(token);
    router.push("/components/home");
  };

  const loginWithEmail = async () => {
    try{
      const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();
    localStorage.setItem("token", token);
    await sendToken(token);
    router.push("/components/home");
    }
    catch (err: any) {
      console.error("❌ Login failed:");
      console.error("Code:", err.code);
      console.error("Message:", err.message);
      alert(`Login Error:\n${err.code}\n${err.message}`);
    }
  };

 return (
  <div className="flex">
    <div className="right gradient-background w-[50%] h-screen"></div>

    <div className="left bg-[#0a0a0a] w-[50%] h-screen flex items-center justify-center">

    <Link  href="/components/signup" className=" text-white absolute right-10 top-8">Register</Link>
      
      <div className="w-[80%] max-w-md mx-auto  text-white p-6 rounded-md space-y-4">
        <h2 className="text-2xl font-semibold text-center">Login to your account</h2>
        <p className="text-sm text-gray-400 text-center">
          Enter your email below to login to your account
        </p>

        <Input
          className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-gray-500"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-gray-500"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full cursor-pointer bg-white text-black py-2 rounded font-medium"
          onClick={loginWithEmail}
        >
          Sign In with Email
        </button>

        <div className="flex items-center gap-2">
          <div className="flex-grow h-px bg-gray-700" />
          <span className="text-sm text-gray-400">OR CONTINUE WITH</span>
          <div className="flex-grow h-px bg-gray-700" />
        </div>

        <button
          className="w-full border cursor-pointer border-zinc-700 py-2 rounded flex items-center justify-center gap-2 hover:bg-zinc-800 transition"
          onClick={loginWithGoogle}
        >
          <FcGoogle className="w-5 h-5" />
          Google
        </button>

        <p className="text-xs text-center text-gray-400">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline underline-offset-2">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </div>

    </div>
  </div>
);

}
