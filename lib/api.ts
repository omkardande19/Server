import axios from "axios";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:5001/api",
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

// ✅ Create Job
export async function createJob(jobData: any) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token");
    }

    try {
        const res = await API.post("/jobs", jobData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ createJob failed:", err);
        throw new Error(err.response?.data?.message || "Failed to create job");
    }
}

// ✅ Get All Jobs
export async function getJobs() {
    try {
        const res = await API.get("/jobs");
        return res.data;
    } catch (err: any) {
        console.error("❌ getJobs failed:", err);
        throw new Error(err.response?.data?.message || "Failed to fetch jobs");
    }
}

// ✅ Get Job by ID
export async function getJobById(jobId: string) {
    try {
        const res = await API.get(`/jobs/${jobId}`);
        return res.data;
    } catch (err: any) {
        console.error("❌ getJobById failed:", err);
        throw new Error(err.response?.data?.message || "Failed to fetch job");
    }
}

// ✅ Update Job
export async function updateJob(jobId: string, jobData: any) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token");
    }

    try {
        const res = await API.put(`/jobs/${jobId}`, jobData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ updateJob failed:", err);
        throw new Error(err.response?.data?.message || "Failed to update job");
    }
}

// ✅ Delete Job
export async function deleteJob(jobId: string) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token");
    }

    try {
        const res = await API.delete(`/jobs/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ deleteJob failed:", err);
        throw new Error(err.response?.data?.message || "Failed to delete job");
    }
}

// ✅ Upload Jobs File (for bulk upload)
export async function uploadJobsFile(file: File) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token");
    }

    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await API.post("/jobs/upload", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ uploadJobsFile failed:", err);
        throw new Error(err.response?.data?.message || "Failed to upload jobs file");
    }
}

// ✅ List Jobs (alias for getJobs)
export async function listJobs() {
    try {
        const res = await API.get("/jobs");
        return res.data;
    } catch (err: any) {
        console.error("❌ listJobs failed:", err);
        throw new Error(err.response?.data?.message || "Failed to fetch jobs");
    }
}

// ✅ Get Job History for Company
export async function getJobHistory() {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token");
    }

    try {
        const res = await API.get("/my/jobs/history", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ getJobHistory failed:", err);
        throw new Error(err.response?.data?.message || "Failed to fetch job history");
    }
}

// ✅ Get Job (alias for getJobById)
export async function getJob(jobId: string) {
    try {
        const res = await API.get(`/jobs/${jobId}`);
        return res.data;
    } catch (err: any) {
        console.error("❌ getJob failed:", err);
        throw new Error(err.response?.data?.message || "Failed to fetch job");
    }
}

// ==================== NETWORKING API ====================

// ✅ Get Connections
export async function getConnections(options?: { status?: string; page?: number; limit?: number }) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Please login to view connections");
    }

    try {
        const status = options?.status || "accepted";
        const page = options?.page || 1;
        const limit = options?.limit || 20;
        
        const res = await API.get(`/connections?status=${status}&page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ getConnections failed:", err);
        const errorMessage = err.response?.data?.message || "ArtistKatta: Failed to load connections. Please try again.";
        throw new Error(errorMessage);
    }
}

// ✅ Get Connection Requests
export async function getConnectionRequests() {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Please login to view connection requests");
    }

    try {
        const res = await API.get("/connections/requests", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ getConnectionRequests failed:", err);
        const errorMessage = err.response?.data?.message || "ArtistKatta: Failed to load connection requests. Please try again.";
        throw new Error(errorMessage);
    }
}

// ✅ Send Connection Request
export async function sendConnectionRequest(data: { recipientId: string; message?: string; connectionType?: string }) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Please login to send connection requests");
    }

    try {
        const res = await API.post("/connections/request", {
            recipientId: data.recipientId,
            message: data.message,
            connectionType: data.connectionType
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ sendConnectionRequest failed:", err);
        const errorMessage = err.response?.data?.message || "ArtistKatta: Failed to send connection request. Please try again.";
        throw new Error(errorMessage);
    }
}

// ✅ Respond to Connection Request
export async function respondToConnectionRequest(connectionId: string, status: "accepted" | "declined") {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Please login to respond to connection requests");
    }

    try {
        const res = await API.patch(`/connections/${connectionId}/respond`, {
            status
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ respondToConnectionRequest failed:", err);
        const errorMessage = err.response?.data?.message || "ArtistKatta: Failed to respond to connection request. Please try again.";
        throw new Error(errorMessage);
    }
}

// ✅ Get Activity Feed
export async function getActivityFeed(options?: { page?: number; limit?: number }) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Please login to view activity feed");
    }

    try {
        const page = options?.page || 1;
        const limit = options?.limit || 20;
        
        const res = await API.get(`/activities/feed?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ getActivityFeed failed:", err);
        const errorMessage = err.response?.data?.message || "ArtistKatta: Failed to load activity feed. Please try again.";
        throw new Error(errorMessage);
    }
}

// ✅ Search Users with Advanced Filters
export async function searchUsers(options: { 
    q: string; 
    limit?: number;
    category?: string;
    role?: string;
    genre?: string;
    instrument?: string;
    medium?: string;
    style?: string;
    experience?: string;
    location?: string;
    ageRange?: string;
    languages?: string;
    priceRange?: string;
    availability?: string;
}) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Please login to search users");
    }

    try {
        const limit = options.limit || 20;
        const queryParams = new URLSearchParams({
            q: options.q,
            limit: limit.toString(),
            ...(options.category && { category: options.category }),
            ...(options.role && { role: options.role }),
            ...(options.genre && { genre: options.genre }),
            ...(options.instrument && { instrument: options.instrument }),
            ...(options.medium && { medium: options.medium }),
            ...(options.style && { style: options.style }),
            ...(options.experience && { experience: options.experience }),
            ...(options.location && { location: options.location }),
            ...(options.ageRange && { ageRange: options.ageRange }),
            ...(options.languages && { languages: options.languages }),
            ...(options.priceRange && { priceRange: options.priceRange }),
            ...(options.availability && { availability: options.availability })
        });
        
        const res = await API.get(`/users/search?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ searchUsers failed:", err);
        const errorMessage = err.response?.data?.message || "ArtistKatta: Failed to search users. Please try again.";
        throw new Error(errorMessage);
    }
}

// ✅ Update User Profile
export async function updateUserProfile(profileData: any) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Please login to update profile");
    }

    try {
        const res = await API.put("/users/profile", profileData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ updateUserProfile failed:", err);
        const errorMessage = err.response?.data?.message || "ArtistKatta: Failed to update profile. Please try again.";
        throw new Error(errorMessage);
    }
}

// ✅ Upload Profile Picture
export async function uploadProfilePicture(file: File) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Please login to upload profile picture");
    }

    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "profile");

        const res = await API.post("/users/upload-image", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ uploadProfilePicture failed:", err);
        const errorMessage = err.response?.data?.message || "ArtistKatta: Failed to upload profile picture. Please try again.";
        throw new Error(errorMessage);
    }
}

// ==================== MESSAGING API ====================

// ✅ Get Conversations
export async function getConversations() {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Please login to view conversations");
    }

    try {
        const res = await API.get("/conversations", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ getConversations failed:", err);
        const errorMessage = err.response?.data?.message || "ArtistKatta: Failed to load conversations. Please try again.";
        throw new Error(errorMessage);
    }
}

// ✅ Get Conversation
export async function getConversation(userId: string) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Please login to start a conversation");
    }

    try {
        const res = await API.get(`/conversations/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ getConversation failed:", err);
        const errorMessage = err.response?.data?.message || "ArtistKatta: Failed to start conversation. Users must be connected to message each other.";
        throw new Error(errorMessage);
    }
}

// ✅ Get Messages
export async function getMessages(conversationId: string, options?: { page?: number; limit?: number }) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Please login to view messages");
    }

    try {
        const page = options?.page || 1;
        const limit = options?.limit || 50;
        const res = await API.get(`/conversations/${conversationId}/messages?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ getMessages failed:", err);
        const errorMessage = err.response?.data?.message || "Failed to load messages. Please try again.";
        throw new Error(errorMessage);
    }
}

// ✅ Send Message
export async function sendMessage(data: { conversationId: string; content: string; replyTo?: string }) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Please login to send messages");
    }

    try {
        const res = await API.post(`/messages`, {
            conversationId: data.conversationId,
            content: data.content,
            replyTo: data.replyTo
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ sendMessage failed:", err);
        const errorMessage = err.response?.data?.message || "Failed to send message. Please try again.";
        throw new Error(errorMessage);
    }
}

// ✅ Mark Messages as Read
export async function markMessagesAsRead(conversationId: string) {
    const token = localStorage.getItem("token");
    if (!token) {
        return { success: false };
    }

    try {
        const res = await API.patch(`/conversations/${conversationId}/read`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("❌ markMessagesAsRead failed:", err);
        // Don't throw error for this, it's not critical
        return { success: false };
    }
}
