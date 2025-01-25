'use client';

import { useEffect, useState } from 'react';
import { useAuth } from "@/app/lib/AuthContext";
import { getAuth, signOut } from "firebase/auth";

export default function VerifyEmail() {
    const { user } = useAuth();
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);

            const auth = getAuth();
            signOut(auth)
                .then(() => {
                    console.log("User signed out successfully");
                })
                .catch((error) => {
                    console.error("Error during sign out: ", error);
                });
        }
    }, [user]);

    return ( 
    <>
        <h1 className="text-gray-950">
            Email nie zweryfikowany. Link aktywacyjny został wysłany na podany adres: 
            <span className="text-blue-600">{email}</span>
        </h1>
    </> );
}
