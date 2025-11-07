"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Edit, MapPin, Share2, Copy, Check, Mail, MessageCircle, MessageSquare, Trash2, PlusCircle, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload, ResumeUpload } from "@/components/file-upload";
import { updateUserProfile } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TalentProfile {
  profileId: string;
  profileType: string;
  displayName?: string;
  title?: string;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
  resumeUrl?: string;
  availability?: string;
  ratePerDay?: string;
  ratePerProject?: string;
  portfolio?: string;
  education?: string;
  awards?: string[];
  languages?: string[];
  specialSkills?: string[];
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  bodyType?: string;
  ageRange?: string;
  actingExperience?: string;
  instruments?: string[];
  musicGenres?: string[];
  vocalRange?: string;
  musicExperience?: string;
  recordingExperience?: boolean;
  livePerformanceExperience?: boolean;
  artMediums?: string[];
  artStyles?: string[];
  artExperience?: string;
  exhibitions?: string[];
  artEducation?: string;
  technicalSkills?: string[];
  softwareExpertise?: string[];
  equipmentExperience?: string[];
  certifications?: string[];
  technicalExperience?: string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

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
  activeProfileId?: string;
  talentProfiles?: TalentProfile[];
  isPrimary?: boolean;
  
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

const TALENT_PROFILE_FIELDS = new Set<string>([
  "title",
  "userCategoryType",
  "bio",
  "profileImage",
  "coverImage",
  "resumeUrl",
  "height",
  "weight",
  "eyeColor",
  "hairColor",
  "bodyType",
  "ageRange",
  "languages",
  "actingExperience",
  "specialSkills",
  "instruments",
  "musicGenres",
  "vocalRange",
  "musicExperience",
  "recordingExperience",
  "livePerformanceExperience",
  "artMediums",
  "artStyles",
  "artExperience",
  "exhibitions",
  "artEducation",
  "technicalSkills",
  "softwareExpertise",
  "equipmentExperience",
  "certifications",
  "technicalExperience",
  "education",
  "awards",
  "portfolio",
  "availability",
  "ratePerDay",
  "ratePerProject",
]);

const TALENT_PROFILE_ARRAY_FIELDS = new Set<string>([
  "languages",
  "specialSkills",
  "instruments",
  "musicGenres",
  "artMediums",
  "artStyles",
  "exhibitions",
  "technicalSkills",
  "softwareExpertise",
  "equipmentExperience",
  "certifications",
  "awards",
]);

const PROFILE_TYPE_OPTIONS = [
  "Actor",
  "Director",
  "Actress",
  "Singer",
  "Musician",
  "Composer",
  "Dancer",
  "Writer",
  "Cinematographer",
  "Editor",
  "Technician",
  "Photographer",
  "Visual Artist",
  "Designer",
];

const ensureStringArray = (value?: string[] | string | null): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => item ?? "").filter(Boolean);
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const generateProfileId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const normalizeTalentProfile = (profile: any, defaultType: string): TalentProfile => {
  const profileId = profile?.profileId || generateProfileId();
  const profileType = (profile?.profileType || profile?.userCategoryTypeOverride || profile?.userCategoryType || defaultType || "Artist").trim();
  const displayName = profile?.displayName || profile?.title || profile?.profileLabel || profileType;

  return {
    profileId,
    profileType,
    displayName,
    title: profile?.title || displayName,
    bio: profile?.bio || "",
    profileImage: profile?.profileImage || "",
    coverImage: profile?.coverImage || "",
    resumeUrl: profile?.resumeUrl || "",
    availability: profile?.availability || "",
    ratePerDay: profile?.ratePerDay || "",
    ratePerProject: profile?.ratePerProject || "",
    portfolio: profile?.portfolio || "",
    education: profile?.education || "",
    awards: ensureStringArray(profile?.awards),
    languages: ensureStringArray(profile?.languages),
    specialSkills: ensureStringArray(profile?.specialSkills),
    height: profile?.height || "",
    weight: profile?.weight || "",
    eyeColor: profile?.eyeColor || "",
    hairColor: profile?.hairColor || "",
    bodyType: profile?.bodyType || "",
    ageRange: profile?.ageRange || "",
    actingExperience: profile?.actingExperience || "",
    instruments: ensureStringArray(profile?.instruments),
    musicGenres: ensureStringArray(profile?.musicGenres),
    vocalRange: profile?.vocalRange || "",
    musicExperience: profile?.musicExperience || "",
    recordingExperience: Boolean(profile?.recordingExperience),
    livePerformanceExperience: Boolean(profile?.livePerformanceExperience),
    artMediums: ensureStringArray(profile?.artMediums),
    artStyles: ensureStringArray(profile?.artStyles),
    artExperience: profile?.artExperience || "",
    exhibitions: ensureStringArray(profile?.exhibitions),
    artEducation: profile?.artEducation || "",
    technicalSkills: ensureStringArray(profile?.technicalSkills),
    softwareExpertise: ensureStringArray(profile?.softwareExpertise),
    equipmentExperience: ensureStringArray(profile?.equipmentExperience),
    certifications: ensureStringArray(profile?.certifications),
    technicalExperience: profile?.technicalExperience || "",
    isPrimary: Boolean(profile?.isPrimary),
    createdAt: profile?.createdAt,
    updatedAt: profile?.updatedAt,
  };
};

const buildProfilesFromUser = (user: any) => {
  const fallbackType = user?.userCategoryType || user?.userCategory || "Artist";
  const rawProfiles = Array.isArray(user?.talentProfiles) ? user.talentProfiles : [];
  const profiles: TalentProfile[] = rawProfiles.map((profile: any) => normalizeTalentProfile(profile, fallbackType));

  if (profiles.length === 0) {
    const legacyProfileSource = {
      profileId: user?.activeProfileId || user?.userId || user?._id,
      profileType: fallbackType,
      displayName: user?.userCategoryType || fallbackType,
      bio: user?.bio || "",
      profileImage: user?.profileImage || "",
      coverImage: user?.coverImage || "",
      resumeUrl: user?.resumeUrl || "",
      availability: user?.availability || "",
      ratePerDay: user?.ratePerDay || "",
      ratePerProject: user?.ratePerProject || "",
      portfolio: user?.portfolio || "",
      education: user?.education || "",
      awards: user?.awards,
      languages: user?.languages,
      specialSkills: user?.specialSkills,
      height: user?.height,
      weight: user?.weight,
      eyeColor: user?.eyeColor,
      hairColor: user?.hairColor,
      bodyType: user?.bodyType,
      ageRange: user?.ageRange,
      actingExperience: user?.actingExperience,
      instruments: user?.instruments,
      musicGenres: user?.musicGenres,
      vocalRange: user?.vocalRange,
      musicExperience: user?.musicExperience,
      recordingExperience: user?.recordingExperience,
      livePerformanceExperience: user?.livePerformanceExperience,
      artMediums: user?.artMediums,
      artStyles: user?.artStyles,
      artExperience: user?.artExperience,
      exhibitions: user?.exhibitions,
      artEducation: user?.artEducation,
      technicalSkills: user?.technicalSkills,
      softwareExpertise: user?.softwareExpertise,
      equipmentExperience: user?.equipmentExperience,
      certifications: user?.certifications,
      technicalExperience: user?.technicalExperience,
      isPrimary: true,
    };
    profiles.push(normalizeTalentProfile(legacyProfileSource, fallbackType));
  }

  let activeProfileId = user?.activeProfileId;
  if (!activeProfileId && profiles.length > 0) {
    const primaryProfile = profiles.find((profile: TalentProfile) => profile.isPrimary);
    activeProfileId = primaryProfile?.profileId || profiles[0].profileId;
  }

  return { profiles, activeProfileId: activeProfileId || null };
};

const sanitizeProfileForSave = (profile: TalentProfile) => ({
  ...profile,
  awards: ensureStringArray(profile.awards),
  languages: ensureStringArray(profile.languages),
  specialSkills: ensureStringArray(profile.specialSkills),
  instruments: ensureStringArray(profile.instruments),
  musicGenres: ensureStringArray(profile.musicGenres),
  artMediums: ensureStringArray(profile.artMediums),
  artStyles: ensureStringArray(profile.artStyles),
  exhibitions: ensureStringArray(profile.exhibitions),
  technicalSkills: ensureStringArray(profile.technicalSkills),
  softwareExpertise: ensureStringArray(profile.softwareExpertise),
  equipmentExperience: ensureStringArray(profile.equipmentExperience),
  certifications: ensureStringArray(profile.certifications),
  recordingExperience: Boolean(profile.recordingExperience),
  livePerformanceExperience: Boolean(profile.livePerformanceExperience),
});

export default function ArtistProfilePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ArtistUser | null>(null);
  const [originalData, setOriginalData] = useState<ArtistUser | null>(null);
  const [talentProfiles, setTalentProfiles] = useState<TalentProfile[]>([]);
  const [originalTalentProfiles, setOriginalTalentProfiles] = useState<TalentProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, {
    coverImage?: { url: string; key: string };
    profileImage?: { url: string; key: string };
    resumeUrl?: { url: string; key: string };
  }>>({});

  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [newProfileType, setNewProfileType] = useState("");
  const [newProfileLabel, setNewProfileLabel] = useState("");
  const [newProfilePrimary, setNewProfilePrimary] = useState(false);

  // Edit mode state
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Share state
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const activeProfile = useMemo(() => {
    if (talentProfiles.length === 0) {
      return null;
    }
    if (!activeProfileId) {
      return talentProfiles[0];
    }
    return (
      talentProfiles.find((profile: TalentProfile) => profile.profileId === activeProfileId) ||
      talentProfiles[0]
    );
  }, [activeProfileId, talentProfiles]);

  const mergedProfileData = useMemo(() => {
    if (!profileData) {
      return null;
    }
    if (!activeProfile) {
      return profileData;
    }
    return { ...profileData, ...activeProfile } as ArtistUser;
  }, [profileData, activeProfile]);

  const applyProfileToState = (profile: TalentProfile | null) => {
    if (!profile) return;
    setProfileData((prev) => {
      if (!prev) return prev;
      const updated: any = { ...prev };
      TALENT_PROFILE_FIELDS.forEach((field) => {
        const value = (profile as any)[field];
        if (typeof value !== "undefined") {
          updated[field] = Array.isArray(value) ? [...value] : value;
        } else if (TALENT_PROFILE_ARRAY_FIELDS.has(field)) {
          updated[field] = [];
        } else if (field === "recordingExperience" || field === "livePerformanceExperience") {
          updated[field] = false;
        } else {
          updated[field] = "";
        }
      });
      updated.userCategoryType = profile.profileType || updated.userCategoryType;
      updated.title = profile.displayName || profile.profileType || updated.title;
      updated.profileImage = profile.profileImage || "";
      updated.coverImage = profile.coverImage || "";
      updated.resumeUrl = profile.resumeUrl || "";
      updated.isPrimary = profile.isPrimary ?? false;
      return updated;
    });
  };

  const updateActiveProfileState = (updates: Partial<TalentProfile>) => {
    if (!activeProfileId) return;

    setTalentProfiles((prev) =>
      prev.map((profile): TalentProfile => {
        if (profile.profileId !== activeProfileId) {
          return profile;
        }
        const nextProfile: any = { ...profile };
        Object.entries(updates).forEach(([key, value]) => {
          nextProfile[key] = Array.isArray(value) ? [...value] : value;
        });
        return nextProfile as TalentProfile;
      })
    );

    setProfileData((prev) => {
      if (!prev) return prev;
      const updated: any = { ...prev };
      Object.entries(updates).forEach(([key, value]) => {
        updated[key] = Array.isArray(value) ? [...value] : value;
      });
      return updated as ArtistUser;
    });
  };

  const handleProfileSelectionChange = (profileId: string) => {
    setActiveProfileId(profileId);
    const nextProfile = talentProfiles.find((profile: TalentProfile) => profile.profileId === profileId) || null;
    applyProfileToState(nextProfile);
  };

  const resetNewProfileForm = () => {
    setNewProfileType("");
    setNewProfileLabel("");
    setNewProfilePrimary(false);
  };

  const handleCreateProfile = () => {
    if (!newProfileType.trim()) {
      toast({
        variant: "destructive",
        title: "Profile type required",
        description: "Please select a profile type before creating a new profile.",
      });
      return;
    }

    const profileId = generateProfileId();
    const displayName = newProfileLabel.trim() || newProfileType.trim();
    const newProfile: TalentProfile = {
      profileId,
      profileType: newProfileType.trim(),
      displayName,
      title: displayName,
      bio: "",
      languages: [],
      specialSkills: [],
      instruments: [],
      musicGenres: [],
      artMediums: [],
      artStyles: [],
      exhibitions: [],
      technicalSkills: [],
      softwareExpertise: [],
      equipmentExperience: [],
      certifications: [],
      awards: [],
      recordingExperience: false,
      livePerformanceExperience: false,
      isPrimary: newProfilePrimary,
    };

    setTalentProfiles((prev) => {
      let updated: TalentProfile[];
      if (newProfilePrimary) {
        updated = prev.map((profile) => ({ ...profile, isPrimary: false } as TalentProfile));
        updated.push({ ...newProfile, isPrimary: true });
      } else {
        updated = [...prev, newProfile];
      }
      return updated;
    });

    const nextActive = newProfilePrimary ? newProfile : newProfile;
    setActiveProfileId(nextActive.profileId);
    applyProfileToState(nextActive);

    setIsAddProfileOpen(false);
    resetNewProfileForm();
  };

  const handleRemoveProfile = () => {
    if (!activeProfileId) {
      return;
    }
    if (talentProfiles.length <= 1) {
      toast({
        variant: "destructive",
        title: "Cannot remove profile",
        description: "At least one talent profile is required.",
      });
      return;
    }

    if (!window.confirm("Are you sure you want to delete this profile?")) {
      return;
    }

    let filteredProfiles = talentProfiles.filter((profile: TalentProfile) => profile.profileId !== activeProfileId);
    let nextActive =
      filteredProfiles.find((profile: TalentProfile) => profile.isPrimary) || filteredProfiles[0] || null;

    if (nextActive && !nextActive.isPrimary) {
      filteredProfiles = filteredProfiles.map((profile: TalentProfile) =>
        profile.profileId === nextActive.profileId ? { ...profile, isPrimary: true } : profile
      );
      nextActive = { ...nextActive, isPrimary: true };
    }

    setTalentProfiles(filteredProfiles);
    setActiveProfileId(nextActive ? nextActive.profileId : null);
    applyProfileToState(nextActive || null);
  };

  const handleSetPrimaryProfile = () => {
    if (!activeProfileId) {
      return;
    }

    setTalentProfiles((prev) =>
      prev.map((profile) => ({
        ...profile,
        isPrimary: profile.profileId === activeProfileId,
      }))
    );

    setProfileData((prev) => {
      if (!prev) return prev;
      return { ...prev, isPrimary: true } as ArtistUser;
    });
  };

  const initializeProfileState = (user: any) => {
    const { profiles, activeProfileId: derivedActiveId } = buildProfilesFromUser(user);
    const active = profiles.find((profile: TalentProfile) => profile.profileId === derivedActiveId) || profiles[0] || null;

    const mappedUser: ArtistUser = {
      id: user.userId || user._id,
      name: user.fullName,
      title: active?.displayName || user.userCategory || "",
      email: user.emailId,
      address: user.address || "",
      phoneNumber: user.phoneNumber || "",
      userCategoryType: active?.profileType || user.userCategoryType || "",
      city: user.city || "",
      country: user.country || "",
      website: user.website || "",
      youtube: user.youtube || "",
      linkedin: user.linkedin || "",
      agencyName: user.agencyName || "",
      aboutAgency: user.aboutAgency || "",
      agencyAddress: user.agencyAddress || "",
      agencyPhone: user.agencyPhone || "",
      agencyWebsite: user.agencyWebsite || "",
      profileImage: active?.profileImage || user.profileImage || "",
      coverImage: active?.coverImage || user.coverImage || "",
      resumeUrl: active?.resumeUrl || user.resumeUrl || "",
      bio: active?.bio || user.bio || "",
      education: active?.education || user.education || "",
      availability: active?.availability || user.availability || "",
      ratePerDay: active?.ratePerDay || user.ratePerDay || "",
      ratePerProject: active?.ratePerProject || user.ratePerProject || "",
      portfolio: active?.portfolio || user.portfolio || "",
      awards: active?.awards || ensureStringArray(user.awards),
      height: active?.height || user.height || "",
      weight: active?.weight || user.weight || "",
      eyeColor: active?.eyeColor || user.eyeColor || "",
      hairColor: active?.hairColor || user.hairColor || "",
      bodyType: active?.bodyType || user.bodyType || "",
      ageRange: active?.ageRange || user.ageRange || "",
      languages: active?.languages || ensureStringArray(user.languages),
      actingExperience: active?.actingExperience || user.actingExperience || "",
      specialSkills: active?.specialSkills || ensureStringArray(user.specialSkills),
      instruments: active?.instruments || ensureStringArray(user.instruments),
      musicGenres: active?.musicGenres || ensureStringArray(user.musicGenres),
      vocalRange: active?.vocalRange || user.vocalRange || "",
      musicExperience: active?.musicExperience || user.musicExperience || "",
      recordingExperience: active?.recordingExperience ?? user.recordingExperience ?? false,
      livePerformanceExperience: active?.livePerformanceExperience ?? user.livePerformanceExperience ?? false,
      artMediums: active?.artMediums || ensureStringArray(user.artMediums),
      artStyles: active?.artStyles || ensureStringArray(user.artStyles),
      artExperience: active?.artExperience || user.artExperience || "",
      exhibitions: active?.exhibitions || ensureStringArray(user.exhibitions),
      artEducation: active?.artEducation || user.artEducation || "",
      technicalSkills: active?.technicalSkills || ensureStringArray(user.technicalSkills),
      softwareExpertise: active?.softwareExpertise || ensureStringArray(user.softwareExpertise),
      equipmentExperience: active?.equipmentExperience || ensureStringArray(user.equipmentExperience),
      certifications: active?.certifications || ensureStringArray(user.certifications),
      technicalExperience: active?.technicalExperience || user.technicalExperience || "",
      talentProfiles: profiles,
      activeProfileId: (active?.profileId || derivedActiveId || (profiles[0]?.profileId ?? null) || undefined) as string | undefined,
      isPrimary: active?.isPrimary ?? true,
    };

    setProfileData(mappedUser);
    setOriginalData(mappedUser);
    setTalentProfiles(profiles);
    setOriginalTalentProfiles(JSON.parse(JSON.stringify(profiles)) as TalentProfile[]);
    setActiveProfileId(active?.profileId || derivedActiveId || (profiles[0]?.profileId ?? null));
  };

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
                initializeProfileState(userData);
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
        initializeProfileState(userData);
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
    if (!activeProfileId) return;
    setUploadedFiles((prev) => ({
      ...prev,
      [activeProfileId]: {
        ...(prev[activeProfileId] || {}),
        coverImage: { url, key },
      },
    }));
    updateActiveProfileState({ coverImage: url });
  };

  const handleProfileImageUpload = (url: string, key: string) => {
    if (!activeProfileId) return;
    setUploadedFiles((prev) => ({
      ...prev,
      [activeProfileId]: {
        ...(prev[activeProfileId] || {}),
        profileImage: { url, key },
      },
    }));
    updateActiveProfileState({ profileImage: url });
  };

  const handleResumeUpload = (url: string, key: string) => {
    if (!activeProfileId) return;
    setUploadedFiles((prev) => ({
      ...prev,
      [activeProfileId]: {
        ...(prev[activeProfileId] || {}),
        resumeUrl: { url, key },
      },
    }));
    updateActiveProfileState({ resumeUrl: url });
  };

  // -----------------------------------
  // Input handling for text fields
  // -----------------------------------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (TALENT_PROFILE_FIELDS.has(name)) {
      updateActiveProfileState({ [name]: value } as Partial<TalentProfile>);
    } else {
      setProfileData((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };

  // -----------------------------------
  // Save/Cancel: on Save Changes, upload files (if any) and call the editUser API Gateway endpoint.
  // Then, update sessionStorage with the updated user details.
  // -----------------------------------
  const handleSaveChanges = async () => {
    if (!profileData) return;
    if (talentProfiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No talent profiles",
        description: "Please create at least one talent profile before saving.",
      });
      return;
    }

    try {
      const profilesForSave = talentProfiles.map((profile) => {
        const uploads = uploadedFiles[profile.profileId];
        const enrichedProfile: TalentProfile = {
          ...profile,
          profileImage: uploads?.profileImage?.url || profile.profileImage || "",
          coverImage: uploads?.coverImage?.url || profile.coverImage || "",
          resumeUrl: uploads?.resumeUrl?.url || profile.resumeUrl || "",
        };
        return sanitizeProfileForSave(enrichedProfile);
      });

      const activeId =
        activeProfile?.profileId || activeProfileId || profilesForSave[0]?.profileId;

      const activeProfileForSave = profilesForSave.find((profile: TalentProfile) => profile.profileId === activeId);

      if (!activeProfileForSave) {
        throw new Error("Unable to determine active talent profile");
      }

      const payload = {
        fullName: profileData.name,
        phoneNumber: profileData.phoneNumber || "",
        userCategory: profileData.title || "",
        userCategoryType: activeProfileForSave.profileType || profileData.userCategoryType || "",
        profileImage: activeProfileForSave.profileImage || "",
        coverImage: activeProfileForSave.coverImage || "",
        resumeUrl: activeProfileForSave.resumeUrl || "",
        city: profileData.city || "",
        country: profileData.country || "",
        website: profileData.website || "",
        youtube: profileData.youtube || "",
        linkedin: profileData.linkedin || "",
        agencyName: profileData.agencyName || "",
        aboutAgency: profileData.aboutAgency || "",
        agencyAddress: profileData.agencyAddress || "",
        agencyPhone: profileData.agencyPhone || "",
        agencyWebsite: profileData.agencyWebsite || "",
        bio: activeProfileForSave.bio || "",
        education: activeProfileForSave.education || "",
        ratePerDay: activeProfileForSave.ratePerDay || "",
        ratePerProject: activeProfileForSave.ratePerProject || "",
        availability: activeProfileForSave.availability || "",
        portfolio: activeProfileForSave.portfolio || "",
        awards: activeProfileForSave.awards || [],
        height: activeProfileForSave.height || "",
        weight: activeProfileForSave.weight || "",
        eyeColor: activeProfileForSave.eyeColor || "",
        hairColor: activeProfileForSave.hairColor || "",
        bodyType: activeProfileForSave.bodyType || "",
        ageRange: activeProfileForSave.ageRange || "",
        languages: activeProfileForSave.languages || [],
        actingExperience: activeProfileForSave.actingExperience || "",
        specialSkills: activeProfileForSave.specialSkills || [],
        instruments: activeProfileForSave.instruments || [],
        musicGenres: activeProfileForSave.musicGenres || [],
        vocalRange: activeProfileForSave.vocalRange || "",
        musicExperience: activeProfileForSave.musicExperience || "",
        recordingExperience: activeProfileForSave.recordingExperience || false,
        livePerformanceExperience: activeProfileForSave.livePerformanceExperience || false,
        artMediums: activeProfileForSave.artMediums || [],
        artStyles: activeProfileForSave.artStyles || [],
        artExperience: activeProfileForSave.artExperience || "",
        exhibitions: activeProfileForSave.exhibitions || [],
        artEducation: activeProfileForSave.artEducation || "",
        technicalSkills: activeProfileForSave.technicalSkills || [],
        softwareExpertise: activeProfileForSave.softwareExpertise || [],
        equipmentExperience: activeProfileForSave.equipmentExperience || [],
        certifications: activeProfileForSave.certifications || [],
        technicalExperience: activeProfileForSave.technicalExperience || "",
        talentProfiles: profilesForSave,
        activeProfileId: activeId,
      };

      const result = await updateUserProfile(payload);

      if (result.success) {
        const updatedUser = result.user;
        if (updatedUser) {
          initializeProfileState(updatedUser);
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
        }

        setUploadedFiles({});
        toast({
          title: "Profile updated",
          description: "Your profile changes have been saved.",
        });
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
      setTalentProfiles(JSON.parse(JSON.stringify(originalTalentProfiles)) as TalentProfile[]);
      setActiveProfileId(originalData.activeProfileId || (originalTalentProfiles[0]?.profileId ?? null));
      setUploadedFiles({});
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
    if (!profileData?.id) return "";
    const profileQuery = activeProfileId ? `?profile=${activeProfileId}` : "";
    return `${window.location.origin}/share/artist/${profileData.id}${profileQuery}`;
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
            <div className="mt-4 flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={activeProfile?.profileId || ""}
                  onValueChange={handleProfileSelectionChange}
                  disabled={talentProfiles.length === 0}
                >
                  <SelectTrigger className="w-60 bg-[#2a2a2a] border-[#3f3f3f] text-white">
                    <SelectValue placeholder="Select talent profile" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f1f1f] border-[#2f2f2f] text-white">
                    {talentProfiles.map((profile) => (
                      <SelectItem key={profile.profileId} value={profile.profileId}>
                        {profile.displayName || profile.profileType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Dialog open={isAddProfileOpen} onOpenChange={setIsAddProfileOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#2f2f2f] text-white hover:bg-[#2a2a2a]"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1f1f1f] border-[#2f2f2f] text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Talent Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">Talent Type</Label>
                        <Select value={newProfileType} onValueChange={setNewProfileType}>
                          <SelectTrigger className="w-full bg-[#2a2a2a] border-[#3f3f3f] text-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1f1f1f] border-[#2f2f2f] text-white">
                            {PROFILE_TYPE_OPTIONS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300" htmlFor="new-profile-label">
                          Display Name (optional)
                        </Label>
                        <Input
                          id="new-profile-label"
                          value={newProfileLabel}
                          onChange={(e) => setNewProfileLabel(e.target.value)}
                          placeholder="e.g. Film Actor, Playback Singer"
                          className="bg-[#2a2a2a] border-[#3f3f3f] text-white"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          id="new-profile-primary"
                          checked={newProfilePrimary}
                          onCheckedChange={setNewProfilePrimary}
                        />
                        <Label htmlFor="new-profile-primary" className="text-sm text-gray-300">
                          Set as primary profile
                        </Label>
                      </div>
                    </div>
                    <DialogFooter className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIsAddProfileOpen(false);
                          resetNewProfileForm();
                        }}
                        className="text-gray-300 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateProfile}>Add Profile</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {talentProfiles.length > 1 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#3f3f3f] text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={handleRemoveProfile}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Profile
                  </Button>
                )}
                {!activeProfile?.isPrimary && talentProfiles.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#3f3f3f] text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                    onClick={handleSetPrimaryProfile}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Set Primary
                  </Button>
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
                      updateActiveProfileState({ languages });
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
                      updateActiveProfileState({ specialSkills });
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
                      updateActiveProfileState({ instruments });
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
                      updateActiveProfileState({ musicGenres });
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
                    onChange={(e) => updateActiveProfileState({ recordingExperience: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-white text-sm">Recording Experience</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={profileData.livePerformanceExperience || false}
                    onChange={(e) => updateActiveProfileState({ livePerformanceExperience: e.target.checked })}
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
                      updateActiveProfileState({ artMediums });
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
                      updateActiveProfileState({ artStyles });
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
                      updateActiveProfileState({ exhibitions });
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
                      updateActiveProfileState({ technicalSkills });
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
                      updateActiveProfileState({ softwareExpertise });
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
                      updateActiveProfileState({ equipmentExperience });
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
                      updateActiveProfileState({ certifications });
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
                updateActiveProfileState({ awards });
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