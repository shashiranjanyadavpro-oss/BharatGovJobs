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
    return (j.title?.toLowerCase().includes(s)) && (filter==="All" || j.department?.toLowerCase().includes(f) || j.title?.toLowerCase().includes(f));
  });

  const shareJob = (job) => {
    const text = `${job.title} - Last Date: ${job.application_end} | Check: https://bharatgovjobs.pages.dev`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return(
    <div className="min-h-screen bg-[#f6f8fb]">
      {/* Tricolor Top Line */}
      <div className="h-1 w-full flex"><div className="flex-1 bg-orange-500"></div><div className="flex-1 bg-white"></div><div className="flex-1 bg-green-600"></div></div>

      {/* Independence Day Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 text-center py-2 px-2">
        <p className="text-[13px] font-black text-blue-900 tracking-wide">🇮🇳 15 AUGUST SPECIAL - सभी सरकारी नौकरियां VERIFIED - जय हिंद! 🇮🇳</p>
      </div>

      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-[22px] font-black"><span className="text-blue-700">Bharat</span><span className="text-orange-600">Gov</span><span className="text-green-700">Jobs</span></h1>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold border border-green-200">✓ 100% VERIFIED</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-3">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search SSC, UPSC, Railway, Bank..." className="w-full p-3.5 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white"/>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {["All","SSC","UPSC","Railway","Banking","Defence"].map(c=>(
              <button key={c} onClick={()=>setFilter(c)} className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition ${filter===c?'bg-blue-700 text-white shadow-md scale-105':'bg-white border border-gray-200 text-gray-700'}`}>{c}</button>
            ))}
          </div>
        </div>
      </header>

      {/* Ad Slot 1 - For AdSense */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-3 text-center text-[11px] text-gray-400">Ad Space - Header</div>
      </div>

      <main className="max-w-6xl mx-auto p-4">
        {loading? <p className="text-center mt-20 text-gray-500 font-medium">🇮🇳 Tirange wali naukriyan load ho rahi hain...</p> :
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((job,i)=>(
              <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 border-l-[5px] border-l-green-600 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h2 className="font-bold text-[15px] leading-snug text-gray-900 line-clamp-2">{job.title}</h2>
                  <span className="text-[9px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold shrink-0">NEW</span>
                </div>
                <p className="text-[12px] text-gray-500 mt-1">{job.title_hi}</p>

                <div className="bg-[#f8fafc] p-3 rounded-xl text-[12px] mt-3 space-y-1.5 border border-gray-50">
                  <div className="flex justify-between"><span className="text-gray-500">Dept:</span><b className="text-gray-800">{job.department}</b></div>
                  <div className="flex justify-between"><span className="text-gray-500">Qualification:</span><b className="text-gray-800">{job.qualification || "Graduation"}</b></div>
                  <div className="flex justify-between"><span className="text-gray-500">Last Date:</span><b className="text-red-600">{job.application_end}</b></div>
                </div>

                <div className="flex gap-2 mt-3">
                  <a href={job.official_pdf_url} target="_blank" className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-center py-2.5 rounded-xl font-bold text-[13px]">📄 Official PDF</a>
                  <button onClick={()=>shareJob(job)} className="px-3.5 py-2.5 bg-green-50 text-green-700 rounded-xl font-bold text-[13px] border border-green-100">↗️ Share</button>
                </div>
              </div>
            ))}
          </div>
        }

        {/* Ad Slot 2 */}
        <div className="mt-8 bg-white border border-dashed border-gray-300 rounded-xl p-4 text-center text-[11px] text-gray-400">Ad Space - Mid Content (High CPC)</div>
      </main>

      <footer className="mt-10 bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-white font-black text-lg">BharatGovJobs 🇮🇳</h3>
          <p className="text-[12px] mt-2 max-w-xl mx-auto">100% Verified Sarkari Naukri Portal. Hum koi fake job nahi dikhate. Har job Official PDF ke saath verified hai.</p>
          <div className="flex justify-center gap-4 mt-4 text-[12px]">
            <a href="#" className="hover:text-white">About Us</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
          <p className="text-[11px] mt-6 opacity-60">© 2026 BharatGovJobs - Made with ❤️ for Bharat on 15th August</p>
        </div>
      </footer>
    </div>
  )
}
