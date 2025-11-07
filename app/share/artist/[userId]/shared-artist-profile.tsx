'use client';

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone, Globe, Award, Download, Music, Palette, Film, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import type { SharedArtistProfileProps } from "./page";

const iconForProfileType = (profileType?: string) => {
  if (!profileType) return <Star className="h-4 w-4" />;
  const lower = profileType.toLowerCase();
  if (lower.includes("music") || lower.includes("singer") || lower.includes("vocal")) {
    return <Music className="h-4 w-4" />;
  }
  if (lower.includes("paint") || lower.includes("art")) {
    return <Palette className="h-4 w-4" />;
  }
  if (lower.includes("film") || lower.includes("actor") || lower.includes("director")) {
    return <Film className="h-4 w-4" />;
  }
  return <Star className="h-4 w-4" />;
};

const formatList = (items?: string[]) => (items && items.length > 0 ? items : []);

const formatText = (value?: string) => value?.trim() || '—';

const renderBadgeList = (items?: string[]) => {
  const list = formatList(items);
  if (list.length === 0) {
    return <p className="text-sm text-gray-400">—</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((item) => (
        <Badge key={item} variant="outline" className="border-[#2f2f2f] bg-[#1f1f1f] text-gray-200">
          {item}
        </Badge>
      ))}
    </div>
  );
};

const detailRow = (label: string, value?: string | React.ReactNode) => (
  <div className="flex justify-between gap-4 py-1 text-sm">
    <span className="text-gray-400">{label}</span>
    <div className="text-gray-100 text-right max-w-xs break-words">
      {typeof value === 'string' ? (value.trim() ? value : '—') : value ?? '—'}
    </div>
  </div>
);

export default function SharedArtistProfile({ initialProfile, initialProfileId }: SharedArtistProfileProps) {
  const defaultProfileId = initialProfileId || initialProfile.activeProfileId || initialProfile.talentProfiles[0]?.profileId || '';
  const [selectedProfileId, setSelectedProfileId] = useState(defaultProfileId);

  const selectedProfile = useMemo(() => {
    return (
      initialProfile.talentProfiles.find((profile) => profile.profileId === selectedProfileId) ||
      initialProfile.talentProfiles[0] ||
      null
    );
  }, [initialProfile.talentProfiles, selectedProfileId]);

  if (!selectedProfile) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center px-6">
        <Card className="max-w-xl bg-[#1f1f1f] border-[#2f2f2f] p-8 text-center space-y-4">
          <h1 className="text-2xl font-semibold">Profile unavailable</h1>
          <p className="text-gray-400">
            We couldn&apos;t find an active talent profile for this artist. Please check the link or contact the artist directly.
          </p>
        </Card>
      </div>
    );
  }

  const coverImage = selectedProfile.coverImage || initialProfile.coverImage || '/placeholder.svg';
  const avatarImage = selectedProfile.profileImage || initialProfile.profileImage || '/placeholder-user.jpg';
  const profileTabs = initialProfile.talentProfiles;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="relative h-56 sm:h-72 w-full">
        <Image
          src={coverImage}
          alt={`${initialProfile.fullName} cover`}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#121212]" />
      </div>

      <div className="container max-w-6xl mx-auto px-6 -mt-24 pb-20 relative">
        <Card className="bg-[#1a1a1a]/95 backdrop-blur border-[#2f2f2f] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="relative h-40 w-40 rounded-2xl border-4 border-[#121212] overflow-hidden shadow-xl">
              <Image src={avatarImage} alt={initialProfile.fullName} fill className="object-cover" priority />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                  {initialProfile.fullName}
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    Verified Profile
                  </Badge>
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-[#2f2f2f] bg-[#242424] text-white flex items-center gap-1">
                    {iconForProfileType(selectedProfile.profileType)}
                    {selectedProfile.displayName || selectedProfile.profileType}
                  </Badge>
                  {initialProfile.userCategory && (
                    <Badge variant="outline" className="border-[#2f2f2f] bg-[#242424] text-white">
                      {initialProfile.userCategory}
                    </Badge>
                  )}
                  {initialProfile.status && (
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 bg-emerald-500/10">
                      {initialProfile.status}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                  {(initialProfile.city || initialProfile.country) && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {[initialProfile.city, initialProfile.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                  {selectedProfile.availability && (
                    <span className="inline-flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-400" />
                      {selectedProfile.availability}
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>

          <Separator className="my-6 bg-[#2f2f2f]" />

          <Tabs value={selectedProfileId} onValueChange={setSelectedProfileId} className="space-y-6">
            {profileTabs.length > 1 && (
              <TabsList className="bg-[#1f1f1f] border border-[#2f2f2f] overflow-x-auto w-full">
                {profileTabs.map((profile) => (
                  <TabsTrigger
                    key={profile.profileId}
                    value={profile.profileId}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary"
                  >
                    {profile.displayName || profile.profileType}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}

            {profileTabs.map((profile) => {
              const languages = formatList(profile.languages);
              const specialSkills = formatList(profile.specialSkills);
              const instruments = formatList(profile.instruments);
              const musicGenres = formatList(profile.musicGenres);
              const artMediums = formatList(profile.artMediums);
              const artStyles = formatList(profile.artStyles);
              const technicalSkills = formatList(profile.technicalSkills);

              return (
                <TabsContent key={profile.profileId} value={profile.profileId} className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                      <Card className="bg-[#1f1f1f] border-[#2f2f2f] p-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                            {iconForProfileType(profile.profileType)}
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold">About</h2>
                            <p className="text-sm text-gray-400">Overview of this talent profile</p>
                          </div>
                        </div>
                        <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                          {profile.bio?.trim() || 'No biography added yet.'}
                        </p>
                      </Card>

                      <Card className="bg-[#1f1f1f] border-[#2f2f2f] p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Highlights</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                          {detailRow('Experience', formatText(profile.actingExperience || profile.musicExperience || profile.technicalExperience))}
                          {detailRow('Education', profile.education)}
                          {detailRow('Day Rate', profile.ratePerDay ? `₹${profile.ratePerDay}` : undefined)}
                          {detailRow('Project Rate', profile.ratePerProject ? `₹${profile.ratePerProject}` : undefined)}
                          {detailRow('Portfolio', profile.portfolio ? (
                            <Link href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {profile.portfolio}
                            </Link>
                          ) : undefined)}
                          {detailRow('Resume', profile.resumeUrl ? (
                            <Button asChild variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10">
                              <Link href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                View Resume
                              </Link>
                            </Button>
                          ) : undefined)}
                        </div>
                      </Card>

                      <Card className="bg-[#1f1f1f] border-[#2f2f2f] p-6 space-y-6">
                        <div className="space-y-2">
                          <h2 className="text-xl font-semibold">Skills & Expertise</h2>
                          <p className="text-sm text-gray-400">Key capabilities showcased by this talent</p>
                        </div>

                        <div className="space-y-4">
                          {languages.length > 0 && (
                            <div>
                              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">Languages</h3>
                              {renderBadgeList(languages)}
                            </div>
                          )}
                          {specialSkills.length > 0 && (
                            <div>
                              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">Special Skills</h3>
                              {renderBadgeList(specialSkills)}
                            </div>
                          )}
                          {instruments.length > 0 && (
                            <div>
                              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">Instruments</h3>
                              {renderBadgeList(instruments)}
                            </div>
                          )}
                          {musicGenres.length > 0 && (
                            <div>
                              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">Genres</h3>
                              {renderBadgeList(musicGenres)}
                            </div>
                          )}
                          {artMediums.length > 0 && (
                            <div>
                              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">Art Mediums</h3>
                              {renderBadgeList(artMediums)}
                            </div>
                          )}
                          {artStyles.length > 0 && (
                            <div>
                              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">Art Styles</h3>
                              {renderBadgeList(artStyles)}
                            </div>
                          )}
                          {technicalSkills.length > 0 && (
                            <div>
                              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">Technical Skills</h3>
                              {renderBadgeList(technicalSkills)}
                            </div>
                          )}
                          {profile.awards && profile.awards.length > 0 && (
                            <div>
                              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">Awards & Recognition</h3>
                              <ul className="flex flex-col gap-2">
                                {profile.awards.map((award) => (
                                  <li key={award} className="inline-flex items-center gap-2 text-sm text-gray-200">
                                    <Award className="h-4 w-4 text-amber-400" />
                                    {award}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>

                    <div className="space-y-6">
                      <Card className="bg-[#1f1f1f] border-[#2f2f2f] p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Key Attributes</h2>
                        <div className="space-y-2">
                          {detailRow('Height', profile.height)}
                          {detailRow('Weight', profile.weight)}
                          {detailRow('Eye Colour', profile.eyeColor)}
                          {detailRow('Hair Colour', profile.hairColor)}
                          {detailRow('Body Type', profile.bodyType)}
                          {detailRow('Age Range', profile.ageRange)}
                        </div>
                        <Separator className="my-3 bg-[#2f2f2f]" />
                        <div className="space-y-2">
                          {detailRow('Recording Experience', profile.recordingExperience ? 'Yes' : 'No')}
                          {detailRow('Live Performance', profile.livePerformanceExperience ? 'Yes' : 'No')}
                        </div>
                      </Card>

                      <Card className="bg-[#1f1f1f] border-[#2f2f2f] p-6 space-y-3">
                        <h2 className="text-xl font-semibold">Downloads & Links</h2>
                        <div className="space-y-2 text-sm text-gray-200">
                          {profile.resumeUrl ? (
                            <Link href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                              <Download className="h-4 w-4" />
                              Download Resume
                            </Link>
                          ) : (
                            <p className="text-gray-400">Resume not provided</p>
                          )}
                          {profile.portfolio && (
                            <Link href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                              <Globe className="h-4 w-4" />
                              Portfolio
                            </Link>
                          )}
                          {initialProfile.linkedin && (
                            <Link href={initialProfile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                              <Globe className="h-4 w-4" />
                              LinkedIn
                            </Link>
                          )}
                          {initialProfile.youtube && (
                            <Link href={initialProfile.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                              <Globe className="h-4 w-4" />
                              YouTube
                            </Link>
                          )}
                          {initialProfile.website && (
                            <Link href={initialProfile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                              <Globe className="h-4 w-4" />
                              Website
                            </Link>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </Card>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="bg-[#1a1a1a] border-[#2f2f2f] p-6 space-y-3">
            <h2 className="text-xl font-semibold">Contact</h2>
            <div className="space-y-3 text-sm text-gray-200">
              {initialProfile.phoneNumber ? (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href={`tel:${initialProfile.phoneNumber}`} className="hover:text-primary">
                    {initialProfile.phoneNumber}
                  </a>
                </div>
              ) : (
                <p className="text-gray-400">Phone not provided</p>
              )}
              {initialProfile.emailId ? (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href={`mailto:${initialProfile.emailId}`} className="hover:text-primary">
                    {initialProfile.emailId}
                  </a>
                </div>
              ) : (
                <p className="text-gray-400">Email not provided</p>
              )}
              {initialProfile.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-primary" />
                  <a href={initialProfile.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    {initialProfile.website}
                  </a>
                </div>
              )}
            </div>
          </Card>

          {(initialProfile.agencyName || initialProfile.agencyPhone || initialProfile.agencyWebsite) && (
            <Card className="bg-[#1a1a1a] border-[#2f2f2f] p-6 space-y-3">
              <h2 className="text-xl font-semibold">Agency / Representation</h2>
              <div className="space-y-2 text-sm text-gray-200">
                {detailRow('Agency', initialProfile.agencyName)}
                {detailRow('About', initialProfile.aboutAgency)}
                {detailRow('Phone', initialProfile.agencyPhone)}
                {initialProfile.agencyWebsite && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <a href={initialProfile.agencyWebsite} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      {initialProfile.agencyWebsite}
                    </a>
                  </div>
                )}
                {detailRow('Address', initialProfile.agencyAddress)}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

