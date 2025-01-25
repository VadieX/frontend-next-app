'use client';

import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");
  const auth = getAuth();
  const params = useSearchParams();
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        const user = userCredential.user;

        if (!user.emailVerified) {
          setError("Zweryfikuj swój adres email.");
          signOut(auth);
          return;
        }

        const returnUrl = params.get("returnUrl") || "/";
        router.push(returnUrl);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(`Error: ${errorCode} - ${errorMessage}`);
      });
  };

  return (
    <>
    <h1 className="text-gray-950 font-bold text-center">Zaloguj się do aplikacji</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300"
        >
          Sign In
        </button>
      </form>
    </>
  );
}