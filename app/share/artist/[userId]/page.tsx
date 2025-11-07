import { notFound } from "next/navigation";
import SharedArtistProfile from "./shared-artist-profile";

interface PageProps {
  params: { userId: string };
  searchParams: { profile?: string };
}

export interface SharedArtistProfileProps {
  initialProfile: {
    id: string;
    fullName: string;
    userCategory?: string;
    userCategoryType?: string;
    activeProfileId?: string | null;
    talentProfiles: Array<{
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
    }>;
    profileImage?: string;
    coverImage?: string;
    resumeUrl?: string;
    agencyName?: string;
    agencyAddress?: string;
    agencyPhone?: string;
    agencyWebsite?: string;
    aboutAgency?: string;
    city?: string;
    country?: string;
    status?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
    phoneNumber?: string;
    emailId?: string;
  };
  initialProfileId?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:5001/api";

async function fetchPublicArtistProfile(userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(userId)}/public`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data?.success || !data?.user) {
      return null;
    }

    return data.user as SharedArtistProfileProps["initialProfile"];
  } catch (error) {
    console.error("Failed to fetch public profile:", error);
    return null;
  }
}

export default async function SharedArtistProfilePage({ params, searchParams }: PageProps) {
  const profile = await fetchPublicArtistProfile(params.userId);

  if (!profile) {
    notFound();
  }

  return (
    <SharedArtistProfile
      initialProfile={profile}
      initialProfileId={searchParams?.profile}
    />
  );
}

