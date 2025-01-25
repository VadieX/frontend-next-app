'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const NotFound = () => {
    const router = useRouter();

    const goToHomePage = () => {
        router.push('/');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 className="text-gray-950"><strong>404 - Page Not Found</strong></h1>
            <p className="text-gray-950">Sorry, the page you are looking for does not exist.</p>
            <button 
                className="h-10 px-5 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-full focus:shadow-outline hover:bg-indigo-800"
                onClick={goToHomePage}
            >
                Back to Home
            </button>
        </div>
    );
};

export default NotFound;