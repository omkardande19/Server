"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Edit, MapPin, Share2, Copy, Check, Mail, MessageCircle, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload, ResumeUpload } from "@/components/file-upload";
import { updateUserProfile } from "@/lib/api";

interface ArtistUser {
  id: string;
  name: string;
  title: string;
  address?: string;
  phoneNumber?: string;
  userCategoryType?: string;
  city?: string;
  country?: string;
  email?: string;
  website?: string;
  youtube?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  agencyName?: string;
  aboutAgency?: string;
  agencyAddress?: string;
  agencyPhone?: string;
  agencyWebsite?: string;
  profileImage?: string;
  coverImage?: string;
  resumeUrl?: string;
  
  // Category-specific parameters
  // Acting/Film Industry
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  bodyType?: string;
  ageRange?: string;
  languages?: string[];
  actingExperience?: string;
  specialSkills?: string[];
  
  // Music Industry
  instruments?: string[];
  musicGenres?: string[];
  vocalRange?: string;
  musicExperience?: string;
  recordingExperience?: boolean;
  livePerformanceExperience?: boolean;
  
  // Visual Arts/Painting
  artMediums?: string[];
  artStyles?: string[];
  artExperience?: string;
  exhibitions?: string[];
  artEducation?: string;
  
  // Technical/Behind the Scenes
  technicalSkills?: string[];
  softwareExpertise?: string[];
  equipmentExperience?: string[];
  certifications?: string[];
  technicalExperience?: string;
  
  // Common professional fields
  education?: string;
  awards?: string[];
  portfolio?: string;
  availability?: string;
  ratePerDay?: string;
  ratePerProject?: string;
  bio?: string;
}

export default function ArtistProfilePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ArtistUser | null>(null);
  const [originalData, setOriginalData] = useState<ArtistUser | null>(null);

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<{
    coverImage?: { url: string; key: string };
    profileImage?: { url: string; key: string };
    resumeUrl?: { url: string; key: string };
  }>({});

  // Edit mode state
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Share state
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // -----------------------------------
  // Fetch and map user data from sessionStorage
  // -----------------------------------
  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser) {
        router.push("/login");
        return;
      }

      try {
        // First try to get fresh data from API
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:5001/api"}/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            if (response.ok) {
              const apiData = await response.json();
              if (apiData.success && apiData.user) {
                const userData = apiData.user;
                // Map fresh API data
                const mappedUser: ArtistUser = {
                  id: userData.userId || userData._id,
                  name: userData.fullName,
                  title: userData.userCategory,
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
                  resumeUrl: userData.resumeUrl || "",
                  bio: userData.bio || "",
                  education: userData.education || "",
                  availability: userData.availability || "",
                  ratePerDay: userData.ratePerDay || "",
                  ratePerProject: userData.ratePerProject || "",
                  portfolio: userData.portfolio || "",
                  awards: userData.awards || [],
                  // Category-specific fields
                  height: userData.height || "",
                  weight: userData.weight || "",
                  eyeColor: userData.eyeColor || "",
                  hairColor: userData.hairColor || "",
                  bodyType: userData.bodyType || "",
                  ageRange: userData.ageRange || "",
                  languages: userData.languages || [],
                  actingExperience: userData.actingExperience || "",
                  specialSkills: userData.specialSkills || [],
                  instruments: userData.instruments || [],
                  musicGenres: userData.musicGenres || [],
                  vocalRange: userData.vocalRange || "",
                  musicExperience: userData.musicExperience || "",
                  recordingExperience: userData.recordingExperience || false,
                  livePerformanceExperience: userData.livePerformanceExperience || false,
                  artMediums: userData.artMediums || [],
                  artStyles: userData.artStyles || [],
                  artExperience: userData.artExperience || "",
                  exhibitions: userData.exhibitions || [],
                  artEducation: userData.artEducation || "",
                  technicalSkills: userData.technicalSkills || [],
                  softwareExpertise: userData.softwareExpertise || [],
                  equipmentExperience: userData.equipmentExperience || [],
                  certifications: userData.certifications || [],
                  technicalExperience: userData.technicalExperience || "",
                };
                setProfileData(mappedUser);
                setOriginalData(mappedUser);
                setIsLoading(false);
                return;
              }
            }
          } catch (apiError) {
            console.log("API fetch failed, using sessionStorage:", apiError);
          }
        }
        
        // Fallback to sessionStorage
        const userData = JSON.parse(storedUser);
        const mappedUser: ArtistUser = {
          id: userData.userId,
          name: userData.fullName,
          title: userData.userCategory,
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
    };

    loadUserData();
  }, [router]);

  // -----------------------------------
  // File upload handlers for S3
  // -----------------------------------
  const handleCoverImageUpload = (url: string, key: string) => {
    setUploadedFiles(prev => ({ ...prev, coverImage: { url, key } }));
    setProfileData((prev) =>
      prev ? { ...prev, coverImage: url } : null
    );
  };

  const handleProfileImageUpload = (url: string, key: string) => {
    setUploadedFiles(prev => ({ ...prev, profileImage: { url, key } }));
    setProfileData((prev) =>
      prev ? { ...prev, profileImage: url } : null
    );
  };

  const handleResumeUpload = (url: string, key: string) => {
    setUploadedFiles(prev => ({ ...prev, resumeUrl: { url, key } }));
    setProfileData((prev) =>
      prev ? { ...prev, resumeUrl: url } : null
    );
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
      // Use uploaded file URLs if available
      if (uploadedFiles.coverImage) {
        updatedData.coverImage = uploadedFiles.coverImage.url;
      }
      if (uploadedFiles.profileImage) {
        updatedData.profileImage = uploadedFiles.profileImage.url;
      }
      if (uploadedFiles.resumeUrl) {
        updatedData.resumeUrl = uploadedFiles.resumeUrl.url;
      }

      // Prepare payload for MongoDB backend
      const payload = {
        fullName: updatedData.name,
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
        bio: updatedData.bio || "",
        education: updatedData.education || "",
        ratePerDay: updatedData.ratePerDay || "",
        ratePerProject: updatedData.ratePerProject || "",
        availability: updatedData.availability || "",
        portfolio: updatedData.portfolio || "",
        awards: updatedData.awards || [],
        // Category-specific fields
        height: updatedData.height || "",
        weight: updatedData.weight || "",
        eyeColor: updatedData.eyeColor || "",
        hairColor: updatedData.hairColor || "",
        bodyType: updatedData.bodyType || "",
        ageRange: updatedData.ageRange || "",
        languages: updatedData.languages || [],
        actingExperience: updatedData.actingExperience || "",
        specialSkills: updatedData.specialSkills || [],
        instruments: updatedData.instruments || [],
        musicGenres: updatedData.musicGenres || [],
        vocalRange: updatedData.vocalRange || "",
        musicExperience: updatedData.musicExperience || "",
        recordingExperience: updatedData.recordingExperience || false,
        livePerformanceExperience: updatedData.livePerformanceExperience || false,
        artMediums: updatedData.artMediums || [],
        artStyles: updatedData.artStyles || [],
        artExperience: updatedData.artExperience || "",
        exhibitions: updatedData.exhibitions || [],
        artEducation: updatedData.artEducation || "",
        technicalSkills: updatedData.technicalSkills || [],
        softwareExpertise: updatedData.softwareExpertise || [],
        equipmentExperience: updatedData.equipmentExperience || [],
        certifications: updatedData.certifications || [],
        technicalExperience: updatedData.technicalExperience || "",
      };

      console.log("Sending payload to MongoDB API:", JSON.stringify(payload, null, 2));

      // Use MongoDB backend API instead of AWS API Gateway
      const result = await updateUserProfile(payload);
      console.log("Update result:", result);

      if (result.success) {
        // Update sessionStorage with the new user details
        const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, ...result.user };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        toast({ 
          title: "Success", 
          description: "Profile updated successfully. Redirecting to dashboard..." 
        });
        
        setProfileData(updatedData);
        setOriginalData(updatedData);

        // Clear uploaded file states after successful save
        setUploadedFiles({});

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
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

  // Click outside handler for share menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }
    };

    if (showShareOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareOptions]);

  // Get profile URL
  const getProfileUrl = () => {
    return `${window.location.origin}/profile/artist?id=${profileData?.id}`;
  };

  // Get share text
  const getShareText = () => {
    return `Check out ${profileData?.name}'s profile on ArtistKatta: ${getProfileUrl()}`;
  };

  // Share via Email
  const handleShareEmail = () => {
    const subject = encodeURIComponent(`${profileData?.name}'s Profile - ArtistKatta`);
    const body = encodeURIComponent(getShareText());
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    setShowShareOptions(false);
    toast({
      title: "Opening Email",
      description: "Your email client should open with the profile link.",
    });
  };

  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    const whatsappLink = `https://wa.me/?text=${text}`;
    window.open(whatsappLink, "_blank");
    setShowShareOptions(false);
    toast({
      title: "Opening WhatsApp",
      description: "Sharing profile via WhatsApp...",
    });
  };

  // Share via SMS
  const handleShareSMS = () => {
    const text = encodeURIComponent(getShareText());
    const smsLink = `sms:?body=${text}`;
    window.location.href = smsLink;
    setShowShareOptions(false);
    toast({
      title: "Opening SMS",
      description: "Your SMS app should open with the profile link.",
    });
  };

  // Copy to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getProfileUrl());
      setShareCopied(true);
      setShowShareOptions(false);
      toast({
        title: "Link Copied!",
        description: "Profile link has been copied to clipboard.",
      });
      setTimeout(() => setShareCopied(false), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link. Please try again.",
      });
    }
  };

  // Share profile function - shows options menu
  const handleShareProfile = () => {
    setShowShareOptions(!showShareOptions);
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
        <div className="absolute top-4 right-4">
          {isEditingCover ? (
            <ImageUpload
              onUploadComplete={(url, key) => {
                handleCoverImageUpload(url, key);
                setIsEditingCover(false);
              }}
              folder="images"
              className="inline-block"
            />
          ) : (
            <Button
              size="sm"
              variant="secondary"
              className="bg-ink-light/80 hover:bg-ink-hover"
              onClick={() => setIsEditingCover(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Cover
            </Button>
          )}
        </div>
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
            <div className="absolute bottom-2 right-2">
              {isEditingProfile ? (
                <ImageUpload
                  onUploadComplete={(url, key) => {
                    handleProfileImageUpload(url, key);
                    setIsEditingProfile(false);
                  }}
                  folder="images"
                  className="inline-block"
                />
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-ink-light/80 hover:bg-ink-hover"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          {/* Name, Title, and Location */}
          <div className="mb-8 flex-1">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-white">{profileData.name}</h1>
              <div className="relative" ref={shareMenuRef}>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                  onClick={handleShareProfile}
                >
                  {shareCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Profile
                    </>
                  )}
                </Button>
                
                {showShareOptions && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={handleShareEmail}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        Share via Email
                      </button>
                      <button
                        onClick={handleShareWhatsApp}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Share via WhatsApp
                      </button>
                      <button
                        onClick={handleShareSMS}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Share via SMS
                      </button>
                      <div className="border-t border-[#2f2f2f] my-1" />
                      <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
            {/* Basic Info Card */}
            <Card className="p-6 bg-ink-light border-ink">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
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
                <Input
                  name="ageRange"
                  value={profileData.ageRange || ""}
                  onChange={handleInputChange}
                  placeholder="Age Range (e.g. 25-35)"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                <Input
                  name="availability"
                  value={profileData.availability || ""}
                  onChange={handleInputChange}
                  placeholder="Availability (e.g. Full-time, Part-time)"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-2">Bio</label>
                <Textarea
                  name="bio"
                  value={profileData.bio || ""}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself, your experience, and what makes you unique..."
                  rows={4}
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
              </div>
            </Card>

            {/* Category-Specific Parameters */}
            {profileData.userCategoryType?.toLowerCase().includes('actor') && (
              <Card className="p-6 bg-ink-light border-ink">
                <h3 className="text-lg font-semibold text-white mb-4">🎭 Acting Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="height"
                    value={profileData.height || ""}
                    onChange={handleInputChange}
                    placeholder="Height (e.g. 5'8&quot;, 175cm)"
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                  <Input
                    name="weight"
                    value={profileData.weight || ""}
                    onChange={handleInputChange}
                    placeholder="Weight (e.g. 70kg, 155lbs)"
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                  <Input
                    name="eyeColor"
                    value={profileData.eyeColor || ""}
                    onChange={handleInputChange}
                    placeholder="Eye Color"
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                  <Input
                    name="hairColor"
                    value={profileData.hairColor || ""}
                    onChange={handleInputChange}
                    placeholder="Hair Color"
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                  <Input
                    name="bodyType"
                    value={profileData.bodyType || ""}
                    onChange={handleInputChange}
                    placeholder="Body Type (e.g. Athletic, Slim)"
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                  <Input
                    name="actingExperience"
                    value={profileData.actingExperience || ""}
                    onChange={handleInputChange}
                    placeholder="Acting Experience (years)"
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Languages (comma-separated)</label>
                  <Input
                    name="languages"
                    value={profileData.languages?.join(', ') || ""}
                    onChange={(e) => {
                      const languages = e.target.value.split(',').map(lang => lang.trim()).filter(Boolean);
                      setProfileData(prev => prev ? { ...prev, languages } : null);
                    }}
                    placeholder="English, Hindi, Tamil, etc."
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Special Skills (comma-separated)</label>
                  <Input
                    name="specialSkills"
                    value={profileData.specialSkills?.join(', ') || ""}
                    onChange={(e) => {
                      const specialSkills = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
                      setProfileData(prev => prev ? { ...prev, specialSkills } : null);
                    }}
                    placeholder="Dancing, Singing, Martial Arts, etc."
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
              </Card>
            )}

            {/* Music Industry Parameters */}
            {(profileData.userCategoryType?.toLowerCase().includes('music') || 
              profileData.userCategoryType?.toLowerCase().includes('singer') ||
              profileData.userCategoryType?.toLowerCase().includes('musician')) && (
              <Card className="p-6 bg-ink-light border-ink">
                <h3 className="text-lg font-semibold text-white mb-4">🎵 Music Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="vocalRange"
                    value={profileData.vocalRange || ""}
                    onChange={handleInputChange}
                    placeholder="Vocal Range (e.g. Soprano, Baritone)"
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                  <Input
                    name="musicExperience"
                    value={profileData.musicExperience || ""}
                    onChange={handleInputChange}
                    placeholder="Music Experience (years)"
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Instruments (comma-separated)</label>
                  <Input
                    name="instruments"
                    value={profileData.instruments?.join(', ') || ""}
                    onChange={(e) => {
                      const instruments = e.target.value.split(',').map(inst => inst.trim()).filter(Boolean);
                      setProfileData(prev => prev ? { ...prev, instruments } : null);
                    }}
                    placeholder="Guitar, Piano, Drums, Violin, etc."
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Music Genres (comma-separated)</label>
                  <Input
                    name="musicGenres"
                    value={profileData.musicGenres?.join(', ') || ""}
                    onChange={(e) => {
                      const musicGenres = e.target.value.split(',').map(genre => genre.trim()).filter(Boolean);
                      setProfileData(prev => prev ? { ...prev, musicGenres } : null);
                    }}
                    placeholder="Classical, Rock, Pop, Jazz, etc."
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={profileData.recordingExperience || false}
                      onChange={(e) => setProfileData(prev => prev ? { ...prev, recordingExperience: e.target.checked } : null)}
                      className="rounded"
                    />
                    <span className="text-white text-sm">Recording Experience</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={profileData.livePerformanceExperience || false}
                      onChange={(e) => setProfileData(prev => prev ? { ...prev, livePerformanceExperience: e.target.checked } : null)}
                      className="rounded"
                    />
                    <span className="text-white text-sm">Live Performance Experience</span>
                  </label>
                </div>
              </Card>
            )}

            {/* Visual Arts/Painting Parameters */}
            {(profileData.userCategoryType?.toLowerCase().includes('paint') || 
              profileData.userCategoryType?.toLowerCase().includes('artist') ||
              profileData.userCategoryType?.toLowerCase().includes('visual')) && (
              <Card className="p-6 bg-ink-light border-ink">
                <h3 className="text-lg font-semibold text-white mb-4">🎨 Visual Arts Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="artExperience"
                    value={profileData.artExperience || ""}
                    onChange={handleInputChange}
                    placeholder="Art Experience (years)"
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                  <Input
                    name="artEducation"
                    value={profileData.artEducation || ""}
                    onChange={handleInputChange}
                    placeholder="Art Education/Degree"
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Art Mediums (comma-separated)</label>
                  <Input
                    name="artMediums"
                    value={profileData.artMediums?.join(', ') || ""}
                    onChange={(e) => {
                      const artMediums = e.target.value.split(',').map(medium => medium.trim()).filter(Boolean);
                      setProfileData(prev => prev ? { ...prev, artMediums } : null);
                    }}
                    placeholder="Oil, Watercolor, Acrylic, Digital, etc."
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Art Styles (comma-separated)</label>
                  <Input
                    name="artStyles"
                    value={profileData.artStyles?.join(', ') || ""}
                    onChange={(e) => {
                      const artStyles = e.target.value.split(',').map(style => style.trim()).filter(Boolean);
                      setProfileData(prev => prev ? { ...prev, artStyles } : null);
                    }}
                    placeholder="Realistic, Abstract, Impressionist, etc."
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Exhibitions (comma-separated)</label>
                  <Input
                    name="exhibitions"
                    value={profileData.exhibitions?.join(', ') || ""}
                    onChange={(e) => {
                      const exhibitions = e.target.value.split(',').map(exh => exh.trim()).filter(Boolean);
                      setProfileData(prev => prev ? { ...prev, exhibitions } : null);
                    }}
                    placeholder="Gallery names, exhibition titles, etc."
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
              </Card>
            )}

            {/* Technical/Behind the Scenes Parameters */}
            {(profileData.userCategoryType?.toLowerCase().includes('director') || 
              profileData.userCategoryType?.toLowerCase().includes('editor') ||
              profileData.userCategoryType?.toLowerCase().includes('technical') ||
              profileData.userCategoryType?.toLowerCase().includes('sound') ||
              profileData.userCategoryType?.toLowerCase().includes('camera')) && (
              <Card className="p-6 bg-ink-light border-ink">
                <h3 className="text-lg font-semibold text-white mb-4">🎬 Technical Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="technicalExperience"
                    value={profileData.technicalExperience || ""}
                    onChange={handleInputChange}
                    placeholder="Technical Experience (years)"
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                  <Input
                    name="portfolio"
                    value={profileData.portfolio || ""}
                    onChange={handleInputChange}
                    placeholder="Portfolio URL"
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Technical Skills (comma-separated)</label>
                  <Input
                    name="technicalSkills"
                    value={profileData.technicalSkills?.join(', ') || ""}
                    onChange={(e) => {
                      const technicalSkills = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
                      setProfileData(prev => prev ? { ...prev, technicalSkills } : null);
                    }}
                    placeholder="Cinematography, Video Editing, Sound Design, etc."
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Software Expertise (comma-separated)</label>
                  <Input
                    name="softwareExpertise"
                    value={profileData.softwareExpertise?.join(', ') || ""}
                    onChange={(e) => {
                      const softwareExpertise = e.target.value.split(',').map(sw => sw.trim()).filter(Boolean);
                      setProfileData(prev => prev ? { ...prev, softwareExpertise } : null);
                    }}
                    placeholder="Final Cut Pro, Avid, Pro Tools, Photoshop, etc."
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Equipment Experience (comma-separated)</label>
                  <Input
                    name="equipmentExperience"
                    value={profileData.equipmentExperience?.join(', ') || ""}
                    onChange={(e) => {
                      const equipmentExperience = e.target.value.split(',').map(eq => eq.trim()).filter(Boolean);
                      setProfileData(prev => prev ? { ...prev, equipmentExperience } : null);
                    }}
                    placeholder="RED Camera, Canon C300, Steadicam, etc."
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Certifications (comma-separated)</label>
                  <Input
                    name="certifications"
                    value={profileData.certifications?.join(', ') || ""}
                    onChange={(e) => {
                      const certifications = e.target.value.split(',').map(cert => cert.trim()).filter(Boolean);
                      setProfileData(prev => prev ? { ...prev, certifications } : null);
                    }}
                    placeholder="Avid Certified, Adobe Certified Expert, etc."
                    className="bg-gray-800 text-white placeholder-gray-400"
                  />
                </div>
              </Card>
            )}

            {/* Professional Details Card */}
            <Card className="p-6 bg-ink-light border-ink">
              <h3 className="text-lg font-semibold text-white mb-4">💼 Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="education"
                  value={profileData.education || ""}
                  onChange={handleInputChange}
                  placeholder="Education/Degree"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                <Input
                  name="ratePerDay"
                  value={profileData.ratePerDay || ""}
                  onChange={handleInputChange}
                  placeholder="Rate per Day (₹)"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                <Input
                  name="ratePerProject"
                  value={profileData.ratePerProject || ""}
                  onChange={handleInputChange}
                  placeholder="Rate per Project (₹)"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-2">Awards & Achievements (comma-separated)</label>
                <Input
                  name="awards"
                  value={profileData.awards?.join(', ') || ""}
                  onChange={(e) => {
                    const awards = e.target.value.split(',').map(award => award.trim()).filter(Boolean);
                    setProfileData(prev => prev ? { ...prev, awards } : null);
                  }}
                  placeholder="Best Actor 2023, Filmfare Award, etc."
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
              <ResumeUpload
                onUploadComplete={handleResumeUpload}
                existingFile={profileData.resumeUrl}
                showPreview={true}
              />
              {profileData.resumeUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Current Resume:</p>
                  <a
                    href={profileData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Resume
                  </a>
                </div>
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