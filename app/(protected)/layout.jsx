'use client';
import { useAuth } from "@/app/lib/AuthContext";
import { useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';

function Protected({ children }) {
    const { user } = useAuth();
    const returnUrl = usePathname();
    const router = useRouter();

    useEffect(() => {
        console.log("Protected useEffect:", user);
        if (!user) {
            router.push(`/user/signin?returnUrl=${returnUrl}`);
        }
    }, [user, returnUrl, router]);

    return user ? <>{children}</> : null;
}

export default Protected;