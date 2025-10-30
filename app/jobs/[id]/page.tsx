import JobDetailClient from "./page_client"

// Required for static export - must be server component
export async function generateStaticParams() {
  try {
    // Fetch all job IDs from the backend API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/jobs`, {
      cache: 'no-store' // Don't cache during build time
    });
    
    if (!response.ok) {
      console.error('Failed to fetch jobs for static params');
      return [];
    }
    
    const data = await response.json();
    const jobs = data.jobs || [];
    
    console.log(`Generating static params for ${jobs.length} jobs`);
    
    // Return array of params for each job ID
    return jobs.map((job: any) => ({
      id: job._id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function JobDetailPage() {
  return <JobDetailClient />
}