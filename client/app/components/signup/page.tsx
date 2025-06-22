"use client";

import { auth, provider } from "../../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    localStorage.setItem("token", token);
    // await sendToken(token);
    router.push("/components/home");
  };

  const loginWithEmail = async () => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();
    localStorage.setItem("token", token);
    // await sendToken(token);
    router.push("/components/home");
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-4">
      <button className="w-full bg-blue-500 text-white p-2" onClick={loginWithGoogle}>
        Continue with Google
      </button>
      <input className="w-full p-2 border" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full p-2 border" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full bg-green-500 text-white p-2" onClick={loginWithEmail}>
        Register
      </button>
    </div>
  );
}
