"use client";
import { useState, useEffect } from "react";

export default function Home(){
  const [jobs,setJobs]=useState([]);
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("All");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    fetch("/api/jobs").then(r=>r.json()).then(d=>{
      if(Array.isArray(d)) setJobs(d);
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);

  const list = jobs.filter(j=>{
    const s = search.toLowerCase();
    const f = filter.toLowerCase();
    const okSearch = j.title?.toLowerCase().includes(s);
    const okFilter = filter==="All" || j.department?.toLowerCase().includes(f) || j.title?.toLowerCase().includes(f);
    return okSearch && okFilter;
  });

  return(
    <div className="min-h-screen bg-[#f6f8fb]">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-blue-700">Bharat<span className="text-orange-600">Gov</span>Jobs</h1>
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">✓ VERIFIED</span>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-4">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search SSC, UPSC, Railway..." className="w-full p-3.5 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none"/>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {["All","SSC","UPSC","Railway","Banking","Defence"].map(c=>(
              <button key={c} onClick={()=>setFilter(c)} className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap ${filter===c?'bg-blue-700 text-white':'bg-white border text-gray-600'}`}>{c}</button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        {loading? <p className="text-center mt-20 text-gray-500">Jobs load ho rahi hain...</p> :
          list.length===0? <p className="text-center mt-20 text-gray-500">Koi job nahi mili</p> :
          <div className="grid md:grid-cols-2 gap-4">
            {list.map((job,i)=>(
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 border-l-4 border-l-green-600 shadow-sm">
                <h2 className="font-bold text-[17px]">{job.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{job.title_hi}</p>
                <div className="bg-gray-50 p-3 rounded-xl text-[13px] mt-3 space-y-1">
                  <div><b>Dept:</b> {job.department}</div>
                  <div><b>Last Date:</b> <span className="text-red-600 font-bold">{job.application_end}</span></div>
                </div>
                <a href={job.official_pdf_url} target="_blank" className="block mt-3 bg-blue-700 text-white text-center py-2.5 rounded-xl font-bold text-sm">Official PDF</a>
              </div>
            ))}
          </div>
        }
      </main>
    </div>
  )
}
