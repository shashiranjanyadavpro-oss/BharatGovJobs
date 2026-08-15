"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredJobs = jobs.filter((job: any) => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || job.department?.toLowerCase().includes(filter.toLowerCase()) || job.title?.toLowerCase().includes(filter.toLowerCase());
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-blue-700">Bharat<span className="text-orange-600">Gov</span>Jobs</h1>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">✓ VERIFIED</span>
        </div>
        {/* SEARCH */}
        <div className="max-w-5xl mx-auto px-4 pb-4">
          <input 
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search SSC, UPSC, Railway, Banking..." 
            className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
          />
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {["All","SSC","UPSC","Railway","Banking","Defence"].map(cat=>(
              <button key={cat} onClick={()=>setFilter(cat)} className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${filter===cat ? 'bg-blue-700 text-white' : 'bg-white border text-gray-600'}`}>{cat}</button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        {loading ? (
          <div className="text-center mt-20 text-gray-500 font-medium">Database se Verified Jobs load ho rahi hain...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">Abhi koi verified job available nahi hai.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredJobs.map((job: any) => (
              <div key={job.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-green-600 hover:shadow-md transition">
                <h2 className="text-[17px] font-bold text-gray-900 leading-snug">{job.title}</h2>
                <p className="text-sm text-gray-500 mt-1 mb-3">{job.title_hi}</p>
                
                <div className="bg-gray-50 p-3 rounded-xl text-[13px] space-y-1.5 mb-4">
                  <div><span className="font-bold text-gray-700">Department:</span> {job.department}</div>
                  <div><span className="font-bold text-gray-700">Qualification:</span> {job.qualification}</div>
                  <div><span className="font-bold text-gray-700">Last Date:</span> <span className="text-red-600 font-semibold">{job.application_end}</span></div>
                  <div className="flex items-center gap-2"><span className="font-bold text-gray-700">Status:</span> <span className="text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded text-xs">✓ {job.verification_status}</span></div>
                </div>

                <div className="flex gap-2">
                  <a href={job.official_pdf_url} target="_blank" className="flex-1 bg-blue-700 text-white text-center py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800">Official PDF</a>
                  <a href={`https://wa.me/?text=${encodeURIComponent(job.title + ' - ' + window.location.href)}`} target="_blank" className="px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-bold">Share</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-10">© 2026 BharatGovJobs • Made in India with ❤️</footer>
    </div>
  );
}
