"use client";

import { auth, provider } from "../../lib/firebase";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { z } from "zod";

// Validation schema
const signupSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  const sendToken = async (token: string) => {
    await api.post("/auth/verify", {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      await sendToken(token);
      router.push("/components/home");
    } catch (err) {
      alert("Google signup failed.");
      console.error("Google Signup Error:", err);
    }
  };

  const registerWithEmail = async () => {
    const validation = signupSchema.safeParse({ email, password });

    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as "email" | "password";
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      await sendToken(token);
      router.push("/components/home");
    } catch (err: unknown) {
      console.error("❌ Registration failed:");
      alert(`Registration Error:\n${err}\n${err instanceof Error ? err.message : ''}`);
    }
  };

  return (
    <div className="flex">
      <div className="right gradient-background md:w-[50%] h-screen"></div>

      <div className="left bg-[#0a0a0a] md:w-[50%] h-screen flex items-center justify-center">
        <Link href="/components/login" className="text-white absolute right-10 top-8">
          Login
        </Link>

        <div className="w-[80%] max-w-md mx-auto text-white p-6 rounded-md space-y-4">
          <h2 className="text-2xl font-semibold text-center">Create your account</h2>
          <p className="text-sm text-gray-400 text-center">
            Enter your email below to create your account
          </p>

          {/* Email Input with Error */}
          <div className="space-y-1">
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            <Input
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-gray-500"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input with Error */}
          <div className="space-y-1">
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            <Input
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-gray-500"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full cursor-pointer bg-white text-black py-2 rounded font-medium"
            onClick={registerWithEmail}
          >
            Sign Up with Email
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
            <a href="#" className="underline underline-offset-2">Terms of Service</a> and{" "}
            <a href="#" className="underline underline-offset-2">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
