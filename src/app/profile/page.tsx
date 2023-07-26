"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function ProfilePage() {
  const [data, setData] = useState("");
  const router = useRouter();

  const logout = async () => {
    try {
      const res = await axios.get("/api/users/logout");

      if (res.data.Success === true) {
        toast.success(res.data.message, {
          position: "bottom-right",
        });

        router.push("/login");
      }
    } catch (error: any) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error, {
        position: "bottom-right",
      });
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data._id);
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-indigo-600">
      <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-white">
        welcome to user Profile Page
      </h2>
      <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-white">
        <Link href={`/profile/${data}`}>{data}</Link>
      </h2>
      <hr />
      <div className="flex justify-center flex-col">
        <button
          onClick={logout}
          className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>

        <button
          onClick={getUserDetails}
          className="bg-purple-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          GetUserDetails
        </button>
      </div>

      <Toaster />
    </div>
  );
}
