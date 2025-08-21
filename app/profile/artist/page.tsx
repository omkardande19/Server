"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Edit, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Set your API Gateway endpoint URL for editing user
const EDIT_USER_ENDPOINT =
  "https://to58hqa8w7.execute-api.ap-south-1.amazonaws.com/prod/users";

interface ArtistUser {
  id: string;               // from stored user.userId
  name: string;             // from stored user.fullName
  title: string;            // from stored user.userCategory (i.e. artist type)
  address?: string;
  phoneNumber?: string;
  userCategoryType?: string;
  city?: string;
  country?: string;
  email?: string;
  website?: string;
  youtube?: string;
  linkedin?: string;
  agencyName?: string;
  aboutAgency?: string;
  agencyAddress?: string;
  agencyPhone?: string;
  agencyWebsite?: string;
  profileImage?: string;    // bio image URI (preview then final public URL)
  coverImage?: string;      // banner image URI
  resumeUrl?: string;
}

export default function ArtistProfilePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ArtistUser | null>(null);
  const [originalData, setOriginalData] = useState<ArtistUser | null>(null);

  // Local file state for images & resume
  const [localCoverFile, setLocalCoverFile] = useState<File | null>(null);
  const [localProfileFile, setLocalProfileFile] = useState<File | null>(null);
  const [localResumeFile, setLocalResumeFile] = useState<File | null>(null);

  // Refs for hidden file inputs
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  // -----------------------------------
  // Fetch and map user data from sessionStorage
  // -----------------------------------
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      // Map stored user data into our ArtistUser structure
      const mappedUser: ArtistUser = {
        id: userData.userId,
        name: userData.fullName,
        title: userData.userCategory, // or userCategoryType if you prefer
        email: userData.emailId,
        address: userData.address || "",
        phoneNumber: userData.phoneNumber || "",
        userCategoryType: userData.userCategoryType || "",
        city: userData.city || "",
        country: userData.country || "",
        website: userData.website || "",
        youtube: userData.youtube || "",
        linkedin: userData.linkedin || "",
        agencyName: userData.agencyName || "",
        aboutAgency: userData.aboutAgency || "",
        agencyAddress: userData.agencyAddress || "",
        agencyPhone: userData.agencyPhone || "",
        agencyWebsite: userData.agencyWebsite || "",
        profileImage: userData.profileImage || "",
        coverImage: userData.coverImage || "",
        resumeUrl: userData.resumeUrl || ""
      };
      setProfileData(mappedUser);
      setOriginalData(mappedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
    setIsLoading(false);
  }, [router]);

  // -----------------------------------
  // Upload helper: convert file to base64 and call the upload API
  // -----------------------------------
  const uploadFile = async (file: File, folder: string) => {
    try {
      const fileBuffer = await file.arrayBuffer();
      const base64File = Buffer.from(fileBuffer).toString("base64");

      // Determine folder type: use 'resumes' for resume files and 'images' for images.
      const folderType = folder === "resumes" ? "resumes" : "images";

      const payload = {
        file: base64File,
        folder: folderType,
        filename: file.name,
        contentType: file.type,
      };

      console.log("Uploading file with payload:", {
        ...payload,
        file: "[BASE64_STRING]",
      });

      const response = await fetch(
        "https://to58hqa8w7.execute-api.ap-south-1.amazonaws.com/prod/uploads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload error:", errorData);
        throw new Error(errorData.error || "Failed to upload file");
      }

      const data = await response.json();
      return data.publicUrl;
    } catch (error) {
      console.error("Error in uploadFile:", error);
      throw error;
    }
  };

  // -----------------------------------
  // File change handlers (set local file state and preview URL)
  // -----------------------------------
  const handleCoverFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLocalCoverFile(file);
      setProfileData((prev) =>
        prev ? { ...prev, coverImage: URL.createObjectURL(file) } : null
      );
    }
  };

  const handleProfileFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLocalProfileFile(file);
      setProfileData((prev) =>
        prev ? { ...prev, profileImage: URL.createObjectURL(file) } : null
      );
    }
  };

  const handleResumeFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLocalResumeFile(file);
      setProfileData((prev) =>
        prev ? { ...prev, resumeUrl: URL.createObjectURL(file) } : null
      );
    }
  };

  // -----------------------------------
  // Input handling for text fields
  // -----------------------------------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // -----------------------------------
  // Save/Cancel: on Save Changes, upload files (if any) and call the editUser API Gateway endpoint.
  // Then, update sessionStorage with the updated user details.
  // -----------------------------------
  const handleSaveChanges = async () => {
    console.log("handleSaveChanges", profileData);
    if (!profileData) return;
    const updatedData = { ...profileData };

    try {
      // Upload cover image if a new file was selected
      if (localCoverFile) {
        const coverUrl = await uploadFile(localCoverFile, "images");
        updatedData.coverImage = coverUrl;
      }
      // Upload profile (bio) image if a new file was selected
      if (localProfileFile) {
        const profileUrl = await uploadFile(localProfileFile, "images");
        updatedData.profileImage = profileUrl;
      }
      // Upload resume file if a new file was selected
      if (localResumeFile) {
        const resumeUrl = await uploadFile(localResumeFile, "resumes");
        updatedData.resumeUrl = resumeUrl;
      }

      // Prepare payload matching the editUser Lambda's expected fields
      const payload = {
        userId: updatedData.id,
        fullName: updatedData.name,
        address: updatedData.address || "",
        phoneNumber: updatedData.phoneNumber || "",
        userCategory: updatedData.title,
        userCategoryType: updatedData.userCategoryType || "",
        profileImage: updatedData.profileImage || "",
        coverImage: updatedData.coverImage || "",
        resumeUrl: updatedData.resumeUrl || "",
        city: updatedData.city || "",
        country: updatedData.country || "",
        website: updatedData.website || "",
        youtube: updatedData.youtube || "",
        linkedin: updatedData.linkedin || "",
        agencyName: updatedData.agencyName || "",
        aboutAgency: updatedData.aboutAgency || "",
        agencyAddress: updatedData.agencyAddress || "",
        agencyPhone: updatedData.agencyPhone || "",
        agencyWebsite: updatedData.agencyWebsite || "",
      };

      console.log("Sending payload to API:", JSON.stringify(payload, null, 2));

      const response = await fetch(EDIT_USER_ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(`Failed to update profile: ${errorText}`);
      }

      const result = await response.json();
      console.log("Update result:", result);

      // Update sessionStorage with the new user details so that refresh pulls updated values
      if (result.user) {
        sessionStorage.setItem("user", JSON.stringify(result.user));
      }

      toast({ title: "Success", description: "Profile updated." });
      setProfileData(updatedData);
      setOriginalData(updatedData);

      // Clear local file states after successful upload
      setLocalCoverFile(null);
      setLocalProfileFile(null);
      setLocalResumeFile(null);
    } catch (error) {
      console.error("Save changes error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile.",
      });
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setProfileData(originalData);
      toast({ title: "Cancelled", description: "Changes reverted." });
    }
  };

  // -----------------------------------
  // Loading / Fallback
  // -----------------------------------
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Not Found</h2>
          <p className="mb-4">We couldn't find your profile. Please log in again.</p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  // -----------------------------------
  // Render the Profile Page
  // -----------------------------------
  return (
    <div className="min-h-screen bg-ink pb-12">
      {/* Cover Image Section */}
      <div className="relative h-[400px] w-full">
        {profileData.coverImage ? (
          <Image
            src={profileData.coverImage}
            alt={`${profileData.name} cover`}
            fill
            className="object-cover object-center"
            priority
          />
        ) : (
          <Image
            src="/placeholder.svg"
            alt="Default cover"
            fill
            className="object-cover object-center"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-4 right-4 bg-ink-light/80 hover:bg-ink-hover"
          onClick={() => coverFileInputRef.current?.click()}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Cover
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={coverFileInputRef}
          onChange={handleCoverFileChange}
          className="hidden"
        />
      </div>

      {/* Profile Header */}
      <div className="container max-w-5xl">
        <div className="relative -mt-[100px] mb-4 flex items-end space-x-4">
          {/* Profile Image */}
          <div className="relative h-[200px] w-[200px] rounded-xl border-8 border-ink overflow-hidden shadow-2xl">
            {profileData.profileImage ? (
              <Image
                src={profileData.profileImage}
                alt={profileData.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <Image
                src="/placeholder.svg"
                alt="Default profile"
                fill
                className="object-cover"
                priority
              />
            )}
            <Button
              size="sm"
              variant="secondary"
              className="absolute bottom-2 right-2 bg-ink-light/80 hover:bg-ink-hover"
              onClick={() => profileFileInputRef.current?.click()}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={profileFileInputRef}
              onChange={handleProfileFileChange}
              className="hidden"
            />
          </div>

          {/* Name, Title, and Location */}
          <div className="mb-8 flex-1">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-white">{profileData.name}</h1>
            </div>
            <h2 className="mt-1 text-xl text-muted-foreground">{profileData.title}</h2>
            {(profileData.city || profileData.country) && (
              <div className="mt-2 flex items-center space-x-4 text-muted-foreground">
                <span className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {profileData.city}
                  {profileData.country ? `, ${profileData.country}` : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Bio, Agency, Resume, and Action Buttons */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Card */}
            <Card className="p-6 bg-ink-light border-ink">
              <h3 className="text-lg font-semibold text-white mb-4">Bio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                <Input
                  name="title"
                  value={profileData.title}
                  onChange={handleInputChange}
                  placeholder="Type (e.g. Artist, Musician)"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                <Input
                  name="city"
                  value={profileData.city || ""}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                <Input
                  name="country"
                  value={profileData.country || ""}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
              </div>
            </Card>

            {/* Agency / Organization Card */}
            <Card className="p-6 bg-ink-light border-ink">
              <h3 className="text-lg font-semibold text-white mb-4">Agency / Organization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="agencyName"
                  value={profileData.agencyName || ""}
                  onChange={handleInputChange}
                  placeholder="Agency/Org Name"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                <Textarea
                  name="aboutAgency"
                  value={profileData.aboutAgency || ""}
                  onChange={handleInputChange}
                  placeholder="About Agency / Organization"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                <Input
                  name="agencyAddress"
                  value={profileData.agencyAddress || ""}
                  onChange={handleInputChange}
                  placeholder="Agency Address"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                <Input
                  name="agencyPhone"
                  value={profileData.agencyPhone || ""}
                  onChange={handleInputChange}
                  placeholder="Agency Phone"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                <Input
                  name="agencyWebsite"
                  value={profileData.agencyWebsite || ""}
                  onChange={handleInputChange}
                  placeholder="Agency Website"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
              </div>
            </Card>

            {/* Resume Card */}
            <Card className="p-6 bg-ink-light border-ink">
              <h3 className="text-lg font-semibold text-white mb-4">Professional Resume</h3>
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                ref={resumeFileInputRef}
                onChange={handleResumeFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
                  file:bg-primary file:text-white hover:file:bg-primary/90"
              />
              {profileData.resumeUrl && (
                <p className="mt-2">
                  <a
                    href={profileData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    View Résumé
                  </a>
                </p>
              )}
            </Card>

            {/* Action Buttons Card */}
            <Card className="p-6 bg-ink-light border-ink">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleSaveChanges} className="w-full bg-primary hover:bg-primary/90 py-3 text-lg">
                  Save Changes
                </Button>
                <Button onClick={handleCancel} className="w-full bg-gray-500 hover:bg-gray-600 py-3 text-lg">
                  Cancel
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Contact & Social Media */}
          <div className="space-y-6">
            {/* Contact Info Card */}
            <Card className="p-6 bg-ink-light border-ink">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400">Phone</label>
                  <Input
                    name="phoneNumber"
                    value={profileData.phoneNumber || ""}
                    onChange={handleInputChange}
                    className="mt-1 bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Email</label>
                  <Input
                    name="email"
                    value={profileData.email || ""}
                    onChange={handleInputChange}
                    className="mt-1 bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Website</label>
                  <Input
                    name="website"
                    value={profileData.website || ""}
                    onChange={handleInputChange}
                    className="mt-1 bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </Card>

            {/* Social Media Card */}
            <Card className="p-6 bg-ink-light border-ink">
              <h3 className="text-lg font-semibold text-white mb-4">Social Media</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400">YouTube</label>
                  <Input
                    name="youtube"
                    value={profileData.youtube || ""}
                    onChange={handleInputChange}
                    className="mt-1 bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">LinkedIn</label>
                  <Input
                    name="linkedin"
                    value={profileData.linkedin || ""}
                    onChange={handleInputChange}
                    className="mt-1 bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}