"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/api";

export default function SignupPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        fullName: "",
        emailId: "",
        password: "",
        userCategory: "",
        userCategoryType: "",
        phoneNumber: "",
        city: "",
        country: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // ✅ stop page reload
        console.log("Submitting form:", form);
        setLoading(true);
        setError("");

        try {
            const result = await signup(form); // ✅ send JSON body to backend
            console.log("✅ API response:", result);
            if (result.success) {
                alert("Signup successful! Please login.");
                router.push("/login"); // ✅ redirect to login page
            } else {
                setError(result.message || "Signup failed");
            }
        } catch (err: any) {
            console.error(err);
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <h1 className="text-2xl mb-6">Create an Account</h1>

            <form
                onSubmit={handleSubmit} // ✅ use handleSubmit
                method="POST" // optional, but good practice
                className="grid grid-cols-2 gap-4 w-[600px]"
            >
                <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="col-span-2 border p-2 rounded text-black"
                />

                <input
                    type="email"
                    name="emailId"
                    value={form.emailId}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="col-span-2 border p-2 rounded text-black"
                />

                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="col-span-2 border p-2 rounded text-black"
                />

                <select
                    name="userCategory"
                    value={form.userCategory}
                    onChange={handleChange}
                    required
                    className="col-span-1 border p-2 rounded text-black"
                >
                    <option value="">Select Account Type</option>
                    <option value="artist">Artist</option>
                    <option value="company">Company</option>
                </select>

                <input
                    type="text"
                    name="userCategoryType"
                    value={form.userCategoryType}
                    onChange={handleChange}
                    placeholder={form.userCategory === "artist" ? "Artist Type" : "Company Type"}
                    required
                    className="col-span-1 border p-2 rounded text-black"
                />

                <input
                    type="text"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="col-span-1 border p-2 rounded text-black"
                />

                <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="col-span-1 border p-2 rounded text-black"
                />

                <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="col-span-2 border p-2 rounded text-black"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="col-span-2 bg-green-500 text-white p-2 rounded"
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}
