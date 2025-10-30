"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileIndex() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is stored in sessionStorage
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      // If no user data, redirect to login
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      //console.log("11111111userData.userCategory ", userData.userCategory);

      // Ensure userRole is of type UserRole
      const userRole = userData.userCategory;

      if (userRole === "admin") {
        router.push("/profile/admin");
      } else if (userRole === "company") {
        router.push("/profile/company");
      } else if (userRole === "artist") {
        router.push("/profile/artist");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  // This page is just a redirect, so no actual UI
  return null;
}