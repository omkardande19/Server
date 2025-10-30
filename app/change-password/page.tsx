"use client";

import { useState } from "react";
import { changePassword } from "../../lib/api";

export default function ChangePasswordPage() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleChange(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await changePassword(email, oldPassword, newPassword);
      setMessage(result.message);
    } catch {
      setMessage("Server error");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Change Password</h1>
      <form onSubmit={handleChange} className="flex flex-col gap-4 w-64">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old Password" required />
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" required />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
