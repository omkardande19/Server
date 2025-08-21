"use client"; // Mark this component as a Client Component

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Edit,
  MapPin,
  Mail,
 
  Building2,
  Globe,
  Instagram,
  Linkedin,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import axios from "axios";

// Define the type for companyData
interface CompanyData {
  name: string;
  emailId: string; // Changed from 'email' to 'emailId'
  // Add other fields if needed
}

// Define the props for JobPostingDialog
interface JobPostingDialogProps {
  companyData: CompanyData;
}

// Define the type for jobData
interface JobData {
  title: string;
  location: string;
  type: string;
  category: string;
  salaryFrom: string;
  salaryTo: string;
  deadline: string;
  description: string;
  featured: boolean;
  email: string;
}

const JobPostingDialog = ({ companyData }: JobPostingDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobData, setJobData] = useState<JobData>({
    title: "",
    location: "",
    type: "", // Default value
    category: "",
    salaryFrom: "",
    salaryTo: "",
    deadline: "",
    description: "",
    featured: true, // Default value
    email: companyData.emailId || "", // Pre-fill with company email
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate salary fields
    const salaryFrom = parseFloat(jobData.salaryFrom);
    const salaryTo = parseFloat(jobData.salaryTo);

    if (isNaN(salaryFrom) || isNaN(salaryTo) || salaryFrom > salaryTo) {
      alert("Please enter valid salary values. 'Salary From' must be less than or equal to 'Salary To'.");
      setIsSubmitting(false);
      return;
    }

    // Construct the payload
    const payload = {
      title: jobData.title,
      company: companyData.name,
      companyLogo: "/placeholder.svg", // Default logo
      location: jobData.location,
      type: jobData.type,
      category: jobData.category,
      salary: `₹${jobData.salaryFrom}L - ₹${jobData.salaryTo}L per year`,
      posted: new Date().toISOString().split("T")[0], // Today's date
      deadline: jobData.deadline,
      description: jobData.description,
      featured: jobData.featured,
      applications: 0, // Default value
      email: jobData.email,
    };

    try {
      // Make the API call via the proxy server
      const response = await axios.post("https://d69leb59mi.execute-api.ap-south-1.amazonaws.com/prod/jobs", payload);
  
      console.log("Job posted successfully:", response.data);
      setIsOpen(false); // Close the dialog
      alert("Job posted successfully!");
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90 py-3 text-lg">
          Post a Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Post a Job</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill out the form to post a new job.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            value={jobData.title}
            onChange={handleInputChange}
            placeholder="Job Title"
            className="bg-gray-700 text-white placeholder-gray-400"
            required
            disabled={isSubmitting}
          />
          <Input
            name="location"
            value={jobData.location}
            onChange={handleInputChange}
            placeholder="Location"
            className="bg-gray-700 text-white placeholder-gray-400"
            required
            disabled={isSubmitting}
          />
          <Input
            name="type"
            value={jobData.type}
            onChange={handleInputChange}
            placeholder="Job Type (e.g., Full-time)"
            className="bg-gray-700 text-white placeholder-gray-400"
            required
            disabled={isSubmitting}
          />
          <Input
            name="category"
            value={jobData.category}
            onChange={handleInputChange}
            placeholder="Category (e.g., Visual)"
            className="bg-gray-700 text-white placeholder-gray-400"
            required
            disabled={isSubmitting}
          />
          <div className="flex gap-4">
            <Input
              name="salaryFrom"
              value={jobData.salaryFrom}
              onChange={handleInputChange}
              placeholder="Salary From (e.g., 8)"
              className="bg-gray-700 text-white placeholder-gray-400"
              required
              disabled={isSubmitting}
              type="number"
            />
            <Input
              name="salaryTo"
              value={jobData.salaryTo}
              onChange={handleInputChange}
              placeholder="Salary To (e.g., 12)"
              className="bg-gray-700 text-white placeholder-gray-400"
              required
              disabled={isSubmitting}
              type="number"
            />
          </div>
          <Input
            name="deadline"
            type="date"
            value={jobData.deadline}
            onChange={handleInputChange}
            placeholder="Application Deadline"
            className="bg-gray-700 text-white placeholder-gray-400"
            required
            disabled={isSubmitting}
          />
          <Input
            name="email"
            value={jobData.email}
            onChange={handleInputChange}
            placeholder="Contact Email"
            className="bg-gray-700 text-white placeholder-gray-400"
            required
            disabled={isSubmitting}
          />
          <Textarea
            name="description"
            value={jobData.description}
            onChange={handleInputChange}
            placeholder="Job Description"
            className="bg-gray-700 text-white placeholder-gray-400"
            required
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 py-3 text-lg"
          >
            {isSubmitting ? "Posting Job..." : "Post Job"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
// API Gateway endpoint URL for updating company details (editUser Lambda)
const EDIT_USER_ENDPOINT =
"https://to58hqa8w7.execute-api.ap-south-1.amazonaws.com/prod/users";

interface CompanyData {
  id: string;               // from stored user.userId
  name: string;             // from stored user.fullName
  phoneNumber?: string;
  userCategoryType?: string;
  city?: string;
  country?: string;
  email?: string;
  website?: string;
  youtube?: string;
  linkedin?: string;
  instagram?:string;
  agencyName?: string;
  aboutAgency?: string;
  profileImage?: string;    // bio image URI (preview then final public URL)
  coverImage?: string;  
  establishedYear?:string; 
  userCategory?:string;   // banner image URI
}


export default function CompanyProfilePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [originalData, setOriginalData] = useState<CompanyData | null>(null);

  // Local file states for images
  const [localCoverFile, setLocalCoverFile] = useState<File | null>(null);
  const [localProfileFile, setLocalProfileFile] = useState<File | null>(null);

  // Refs for hidden file inputs
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  // -----------------------------------
  // Fetch and map company data from sessionStorage
  // -----------------------------------
  useEffect(() => {
    const storedData = sessionStorage.getItem("user");
    if (!storedData) {
      router.push("/login");
      return;
    }
    try {
      const data = JSON.parse(storedData);
      const mappedCompany: CompanyData = {
        id: data.userId,
        name: data.fullName,
        city: data.city || "",
        aboutAgency: data.aboutAgency || "",
        website: data.website || "",
        email: data.emailId,
        phoneNumber: data.phoneNumber || "",
        establishedYear: data.establishedYear || "",
        coverImage: data.coverImage || "",
        profileImage: data.profileImage || "",
        linkedin: data.linkedin || "",
        instagram: data.instagram || "",
        userCategory: data.userCategory || "company",
        emailId: ""
      };
      setCompanyData(mappedCompany);
      setOriginalData(mappedCompany);
    } catch (error) {
      console.error("Error parsing company data:", error);
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

      const payload = {
        file: base64File,
        folder: "images", // always images for companies
        filename: file.name,
        contentType: file.type,
      };

      const response = await fetch(
        "https://to58hqa8w7.execute-api.ap-south-1.amazonaws.com/prod/uploads",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
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
  // File change handlers
  // -----------------------------------
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLocalCoverFile(file);
      setCompanyData((prev) =>
        prev ? { ...prev, coverImage: URL.createObjectURL(file) } : null
      );
    }
  };

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLocalProfileFile(file);
      setCompanyData((prev) =>
        prev ? { ...prev, profileImage: URL.createObjectURL(file) } : null
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
    setCompanyData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // -----------------------------------
  // Save/Cancel: On Save Changes, upload files (if any) then call the API to update the company record.
  // -----------------------------------
  const handleSaveChanges = async () => {
    if (!companyData) return;
  
    setIsSaving(true);
    let updatedData = { ...companyData };
  
    try {
      // Upload files if new ones are selected
      if (localCoverFile) {
        updatedData.coverImage = await uploadFile(localCoverFile, "images");
      }
      if (localProfileFile) {
        updatedData.profileImage = await uploadFile(localProfileFile, "images");
      }
  
      // Construct payload, ensuring all fields have default values
      const payload = {
        userId: updatedData.id || "",
        fullName: updatedData.name || "",
        userCategory: updatedData.userCategory || "company",
        phoneNumber: updatedData.phoneNumber || "",
        profileImage: updatedData.profileImage || "",
        coverImage: updatedData.coverImage || "",
        website: updatedData.website || "",
        linkedin: updatedData.linkedin || "",
        instagram: updatedData.instagram || "",
        aboutAgency: updatedData.aboutAgency || "",
        establishedYear: updatedData.establishedYear || "",
        city: updatedData.city || "",
      };
  
      console.log("🚀 Sending Payload:", JSON.stringify(payload, null, 2));
  
      // Make API request
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
    
      // Update sessionStorage only if user data is returned
      if (result.user) {
        sessionStorage.setItem("user", JSON.stringify(result.user));
        setCompanyData(updatedData);
        setOriginalData(updatedData);
      }
  
      // Show success toast
      toast({ title: "Success", description: "Company profile updated successfully." });
  
      // Reset file states after successful upload
      setLocalCoverFile(null);
      setLocalProfileFile(null);
    } catch (error) {
      console.error("❌ Save Changes Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update company profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  

  const handleCancel = () => {
    if (originalData) {
      setCompanyData(originalData);
      toast({ title: "Cancelled", description: "Changes reverted." });
    }
  };

  // -----------------------------------
  // Loading / Fallback UI
  // -----------------------------------
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Company Profile Not Found</h2>
          <p className="mb-4">We couldn't find your company profile. Please log in again.</p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  // -----------------------------------
  // Render the Dynamic Company Profile Page
  // -----------------------------------
  return (
    <div className="min-h-screen bg-ink pb-12">
      {/* Cover Image Section */}
      <div className="relative h-[400px] w-full">
        {companyData.coverImage ? (
          <Image
            src={companyData.coverImage}
            alt={`${companyData.name} cover`}
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
          {/* Profile Image (Company Logo) */}
          <div className="relative h-[200px] w-[200px] rounded-xl border-8 border-ink overflow-hidden shadow-2xl">
            {companyData.profileImage ? (
              <Image
                src={companyData.profileImage}
                alt={companyData.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <Image
                src="/placeholder.svg"
                alt="Default logo"
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
              Edit Logo
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={profileFileInputRef}
              onChange={handleProfileFileChange}
              className="hidden"
            />
          </div>

          {/* Company Name, Type, and Location */}
          <div className="mb-8 flex-1">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-white">{companyData.name}</h1>
            </div>
            <h2 className="mt-1 text-xl text-muted-foreground">{companyData.userCategoryType}</h2>
            <div className="mt-2 flex items-center space-x-4 text-muted-foreground">
              <span className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {companyData.city}
              </span>
              <span className="flex items-center">
                <Building2 className="mr-1 h-4 w-4" />
                Est. {companyData.establishedYear}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column: Editable Details */}
          <div className="col-span-2 space-y-6">
            {/* About / Bio Card */}
            <Card className="p-6 bg-ink-light border-ink">
              <h3 className="text-lg font-semibold text-white mb-4">About</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  value={companyData.name}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
               
                 <Input
                  name="city"
                  value={companyData.city}
                  onChange={handleInputChange}
                  placeholder="location"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                <Input
                  name="establishedYear"
                  value={companyData.establishedYear}
                  onChange={handleInputChange}
                  placeholder="Established Year"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                <Textarea
                  name="about"
                  value={companyData.aboutAgency}
                  onChange={handleInputChange}
                  placeholder="About the Company"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
              </div>
            </Card>

            <JobPostingDialog companyData={companyData} />

            {/* Action Buttons Card */}
            <Card className="p-6 bg-ink-light border-ink">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="w-full bg-primary hover:bg-primary/90 py-3 text-lg"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={handleCancel}
                  className="w-full bg-gray-500 hover:bg-gray-600 py-3 text-lg"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Read-only Info & Social Links */}
          <div className="space-y-6">
            {/* Contact Info Card */}
            <Card className="p-6 bg-ink-light border-ink">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  {companyData.email}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <Input
                  name="phoneNumber"
                  value={ companyData.phoneNumber  || ""}
                  onChange={handleInputChange}
                  placeholder="mobile no"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                </div>
                <div className="flex items-center text-muted-foreground">
                <Globe className="h-4 w-4 mr-2" />
                <Input
                  name="website"
                  value={companyData.website || ""}
                  onChange={handleInputChange}
                  placeholder="Website URL"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                </div>
              </div>
            </Card>

            {/* Social Media Card */}
            <Card className="p-6 bg-ink-light border-ink">
              <h3 className="text-lg font-semibold text-white mb-4">Social Media</h3>
              <div className="space-y-3">
                <Input
                  name="linkedin"
                  value={companyData.linkedin || ""}
                  onChange={handleInputChange}
                  placeholder="LinkedIn URL"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
                <Input
                  name="instagram"
                  value={companyData.instagram || ""}
                  onChange={handleInputChange}
                  placeholder="Instagram URL"
                  className="bg-gray-800 text-white placeholder-gray-400"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}