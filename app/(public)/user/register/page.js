'use client';

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm(){

  const { user} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  if (user) {
    return null;
  }
  
  const auth = getAuth();
  const router = useRouter();
  
  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setRegisterError("Hasła nie są zgodne.");
      return;
    }

    if (password.length < 6) {
      setRegisterError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User registered!");
        sendEmailVerification(auth.currentUser)
          .then(() => {
            console.log("Email verification sent!");
            router.push("/user/verify");
          });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setRegisterError("Email jest już w użyciu.");
        } else {
          setRegisterError(error.message);
        }
        console.dir(error);
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-6">Strona Rejestracji</h1>
      {registerError && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
          {registerError}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
            placeholder="Confirm your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300"
        >
          Register
        </button>
      </form>
    </div>
  );
}