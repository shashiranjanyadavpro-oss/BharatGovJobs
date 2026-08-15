"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8 mt-4">BharatGovJobs</h1>
        
        {loading ? (
          <div className="text-center text-gray-500 font-semibold mt-10">
            <p>Database se Verified Jobs load ho rahi hain...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>Abhi koi verified job available nahi hai.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-600">
                <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                <p className="text-sm text-gray-600 mb-5">{job.title_hi}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6 bg-gray-50 p-4 rounded">
                  <div><span className="font-semibold text-gray-700">Department:</span> {job.department}</div>
                  <div><span className="font-semibold text-gray-700">Qualification:</span> {job.qualification}</div>
                  <div><span className="font-semibold text-gray-700">Last Date:</span> {job.application_end}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Status: </span> 
                    <span className="text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                      ✓ {job.verification_status}
                    </span>
                  </div>
                </div>

                <a 
                  href={job.official_pdf_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block bg-blue-700 text-white px-5 py-2.5 rounded hover:bg-blue-800 transition font-medium text-sm"
                >
                  Download Official PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
