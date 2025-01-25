"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { register, setValue, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      displayName: "",
      photoURL: "",
      street: "",
      city: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setValue("email", user.email);
        setValue("displayName", user.displayName || "");
        setValue("photoURL", user.photoURL || "");

        // Pobierz dane adresowe z Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const address = docSnap.data().address;
          setValue("street", address.street || "");
          setValue("city", address.city || "");
          setValue("zipCode", address.zipCode || "");
        }
      }
    });

    return () => unsubscribe();
  }, [setValue]);

  const onSubmit = async (data) => {
    if (user) {
      try {
        await updateProfile(user, {
          displayName: data.displayName,
          photoURL: data.photoURL,
        });
        await setDoc(doc(db, "users", user?.uid), {
          address: {
            street: data.street,
            city: data.city,
            zipCode: data.zipCode,
          },
        }, { merge: true });
        setSuccess("Profile updated successfully!");
        setError(null);
      } catch (error) {
        setError(error.message);
        setSuccess(null);
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg flex">
      <div className="w-1/3 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-950">Profil</h1>
        {watch("photoURL") && <img src={watch("photoURL")} alt="Profile" className="w-32 h-32 rounded-full mb-4" />}
      </div>
      <div className="w-2/3">
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nazwa użytkownika</label>
            <input
              type="text"
              {...register("displayName")}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none bg-gray-100 text-gray-950"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              readOnly
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none bg-gray-100 text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Photo URL</label>
            <input
              type="text"
              {...register("photoURL")}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none bg-gray-100 text-gray-950"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ulica</label>
            <input
              type="text"
              {...register("street")}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none bg-gray-100 text-gray-950"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Miasto</label>
            <input
              type="text"
              {...register("city")}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none bg-gray-100 text-gray-950"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kod pocztowy</label>
            <input
              type="text"
              {...register("zipCode")}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none bg-gray-100 text-gray-950"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
