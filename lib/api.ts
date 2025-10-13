import axios from "axios";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://ec2-13-233-102-70.ap-south-1.compute.amazonaws.com:5001/api",
    headers: { "Content-Type": "application/json" }
});

// ✅ Signup
export async function signup(userData: any) {
  const res = await API.post("/signupdata", userData);
  return res.data;
}

// ✅ Login
/*export async function login(emailId: string, password: string) {
  const res = await API.post("/login", { emailId, password });
  return res.data;
} */
export async function login(userData: any) {
    const res = await API.post("/logindata", userData);
    return res.data;
}
// ✅ Change Password
export async function changePassword(
  emailId: string,
  oldPassword: string,
  newPassword: string
) {
  const res = await API.post("/change-password", {
    emailId,
    oldPassword,
    newPassword,
  });
  return res.data;
}

// ✅ Verify Account
export async function verify(emailId: string) {
  const res = await API.post("/verify", { emailId });
  return res.data;
}

export async function getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token");
    }

    try {
        const res = await API.get("/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data.user; // must match backend response
    } catch (err) {
        console.error("❌ getCurrentUser failed:", err);
        throw err;
    }
}
