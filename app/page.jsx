'use client';

import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Calendar,
  Filter,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Clock,
  FileText,
  Copy,
  Info,
  SlidersHorizontal,
  X,
  Lock,
  LogOut,
  LayoutDashboard,
  Eye,
  TrainFront,
  BadgeCheck,
  TriangleAlert,
  GitBranch,
  Cloud,
  Database,
  Timer
} from 'lucide-react';

const INITIAL_JOBS = [
  {
    id: "BR-SUP-AWW-2026-01",
    title: "Supaul Anganwadi Bharti 2026",
    titleHi: "सुपौल आंगनवाड़ी भर्ती 2026 - 10th Pass Mahila",
    district: "Supaul",
    state: "Bihar",
    qualification: "10th",
    category: "Anganwadi",
    isWomenOnly: true,
    isZeroCompetition: true,
    sourceVerified: true,
    lastDate: "15 Aug 2026",
    vacancy: 142,
    age: "18-35 Years",
    fees: "₹0 / No Fee",
    summary: "सुपौल जिले में 142 पदों पर सीधी भर्ती। केवल 10वीं पास महिलाओं के लिए। कोई परीक्षा नहीं - मेरिट बेस्ड।",
    eligibleBullets: ["केवल महिला उम्मीदवार", "10वीं पास अनिवार्य", "स्थायी निवासी Supaul", "आधार + निवास + जाति प्रमाण"],
    officialPdf: "https://supaul.nic.in/notice/recruitment/",
    updatedAt: "2 घंटे पहले",
    author: "Priya Sharma",
    reviewer: "R. Kumar IAS (Retd.)",
    salary: "₹8,500 / माह"
  },
  {
    id: "BR-GAYA-AWW-2026-02",
    title: "Gaya Anganwadi Sevika Bharti",
    titleHi: "गया सेविका सहायिका भर्ती 2026 - 12th Pass",
    district: "Gaya",
    state: "Bihar",
    qualification: "12th",
    category: "Anganwadi",
    isWomenOnly: true,
    isZeroCompetition: true,
    sourceVerified: true,
    lastDate: "22 Aug 2026",
    vacancy: 89,
    age: "21-40 Years",
    fees: "₹0",
    summary: "गया में आंगनवाड़ी सेविका के 89 पद। इंटरव्यू केवल, लिखित परीक्षा नहीं।",
    eligibleBullets: ["महिला - विवाहित/अविवाहित", "12वीं पास", "Gaya जिला निवासी"],
    officialPdf: "https://gaya.bih.nic.in/notice/recruitment/",
    updatedAt: "5 घंटे पहले",
    author: "Anjali Singh",
    reviewer: "R. Kumar IAS (Retd.)",
    salary: "₹7,900 / माह"
  },
  {
    id: "ALL-SSC-GD-2026-10",
    title: "SSC GD Constable 2026 - 10th Pass",
    titleHi: "SSC GD कांस्टेबल 2026 - 39,481 पद - All India",
    district: "All India",
    state: "All India",
    qualification: "10th",
    category: "SSC",
    isWomenOnly: false,
    isZeroCompetition: false,
    sourceVerified: true,
    lastDate: "31 Aug 2026",
    vacancy: 39481,
    age: "18-23",
    fees: "₹100 / SC-ST Free",
    summary: "SSC GD 2026 - सबसे बड़ी भर्ती। BSF, CISF, CRPF में कांस्टेबल। 10वीं पास।",
    eligibleBullets: ["10th Pass Any Board", "18-23 Years", "Male/Female Both", "Physical Required"],
    officialPdf: "https://ssc.nic.in/",
    updatedAt: "1 घंटे पहले",
    author: "Amit Kumar",
    reviewer: "R. Kumar IAS (Retd.)",
    salary: "₹21,700 - ₹69,100"
  },
  {
    id: "ALL-RAILWAY-GRP-D-2026-11",
    title: "Railway Group D Bharti 2026",
    titleHi: "रेलवे ग्रुप D भर्ती 2026 - 32,438 पद - 10th Pass",
    district: "All India",
    state: "All India",
    qualification: "10th",
    category: "Railway",
    isWomenOnly: false,
    isZeroCompetition: false,
    sourceVerified: true,
    lastDate: "28 Aug 2026",
    vacancy: 32438,
    age: "18-33",
    fees: "₹500 (₹400 Refund)",
    summary: "RRB Group D 2026 - Track Maintainer, Helper। 10वीं + ITI। All India।",
    eligibleBullets: ["10th + ITI", "18-33 Years", "All India Eligible"],
    officialPdf: "https://indianrailways.gov.in/",
    updatedAt: "Just Now",
    author: "Amit Kumar",
    reviewer: "S. Verma",
    salary: "₹18,000 + DA"
  }
];

export default function HomePage() {
  const [view, setView] = useState("home");
  const [selectedJob, setSelectedJob] = useState(null);
  const [search, setSearch] = useState("");
  const [qualFilter, setQualFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [womenOnly, setWomenOnly] = useState(false);
  const [jobs] = useState(INITIAL_JOBS);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchSearch =
        !search ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.titleHi.toLowerCase().includes(search.toLowerCase()) ||
        j.district.toLowerCase().includes(search.toLowerCase());
      const matchQual = qualFilter === "All" || j.qualification === qualFilter;
      const matchState = stateFilter === "All" || j.state === stateFilter || j.state === "All India";
      const matchCat = catFilter === "All" || j.category === catFilter;
      const matchWomen = !womenOnly || j.isWomenOnly;
      return matchSearch && matchQual && matchState && matchCat && matchWomen;
    });
  }, [jobs, search, qualFilter, stateFilter, catFilter, womenOnly]);

  return (
    <div className="min-h-screen bg-[#FFFBF7] text-zinc-900 font-sans antialiased">
      {/* Tricolor Top Bar */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white border-y border-zinc-100"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-zinc-200">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-[64px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white grid place-items-center font-black text-[14px] tracking-tighter">
              BGJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] md:text-[19px] font-extrabold tracking-tight leading-none">
                  BharatGovJobs.in
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200">
                  V2.1 LIVE
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 -mt-0.5 hidden md:block">
                Pure Bharat 40/60 • Big Jobs 40% • Small Jobs 60%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium hidden md:inline-flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Auto Crawler Active
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="border-t border-zinc-100 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search: 'Supaul Anganwadi', '10th Pass Mahila', 'Railway'..."
                className="w-full h-[44px] md:h-[48px] pl-11 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-[14px]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Filter Options */}
      <div className="sticky top-[125px] z-30 bg-white/90 backdrop-blur border-b border-zinc-200 py-3">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-zinc-500">Qual:</span>
            {["All", "8th", "10th", "12th", "Graduate"].map((q) => (
              <button
                key={q}
                onClick={() => setQualFilter(q)}
                className={`h-7 px-2.5 rounded-full text-[12px] font-medium border transition ${
                  qualFilter === q
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white border-zinc-200 hover:border-zinc-300"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-zinc-500">State:</span>
            {["All", "Bihar", "UP", "MP", "All India"].map((s) => (
              <button
                key={s}
                onClick={() => setStateFilter(s)}
                className={`h-7 px-2.5 rounded-full text-[12px] font-medium border transition ${
                  stateFilter === s
                    ? "bg-[#138808] text-white border-[#138808]"
                    : "bg-white border-zinc-200 hover:border-zinc-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => setWomenOnly(!womenOnly)}
            className={`h-7 px-3 rounded-full text-[12px] font-bold border flex items-center gap-1 ${
              womenOnly
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white border-pink-200 text-pink-700"
            }`}
          >
            ♀ Women Only
          </button>
        </div>
      </div>

      {/* Main Job Cards Feed */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-bold text-zinc-700">
            Showing {filteredJobs.length} Jobs
          </h2>
          <span className="text-[11px] text-zinc-500">Zero Competition • Direct Official PDF</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="bg-white rounded-[16px] border border-zinc-200 shadow-sm hover:shadow-md transition-all flex flex-col p-4"
            >
              <div className="flex flex-wrap gap-1.5 mb-2">
                {job.sourceVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                    <BadgeCheck size={12} /> Verified ✅
                  </span>
                )}
                {job.isZeroCompetition && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-700">
                    Zero Comp.
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[10px] font-bold text-orange-700">
                  Last: {job.lastDate}
                </span>
              </div>

              <h3 className="text-[15px] font-bold leading-[1.3] text-zinc-900 mt-1">
                {job.titleHi}
              </h3>
              <p className="text-[12px] text-zinc-500 mt-1">
                {job.district}, {job.state} • {job.vacancy} Posts • {job.salary}
              </p>

              <p className="mt-3 text-[13px] leading-relaxed text-zinc-700 bg-zinc-50 border border-zinc-100 rounded-lg p-2.5">
                {job.summary}
              </p>

              <div className="mt-4 flex gap-2 pt-2 border-t border-zinc-100">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="flex-1 h-9 rounded-full bg-zinc-900 text-white text-[13px] font-semibold hover:bg-black flex items-center justify-center gap-1"
                >
                  View Details <ChevronRight size={14} />
                </button>
                <a
                  href={job.officialPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3 rounded-full border border-zinc-200 bg-white text-[12px] font-medium flex items-center gap-1 hover:bg-zinc-50"
                >
                  <ExternalLink size={14} /> PDF
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[600px] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified Notification
                </span>
                <h3 className="text-[18px] font-bold mt-1">{selectedJob.titleHi}</h3>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 grid place-items-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-zinc-50 p-3 rounded-xl border space-y-1 text-[13px]">
              <div><strong>District:</strong> {selectedJob.district} ({selectedJob.state})</div>
              <div><strong>Qualification:</strong> {selectedJob.qualification} Pass</div>
              <div><strong>Salary:</strong> {selectedJob.salary}</div>
              <div><strong>Fees:</strong> {selectedJob.fees}</div>
              <div><strong>Last Date:</strong> {selectedJob.lastDate}</div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[12px] font-bold text-zinc-700">Eligibility Criteria:</div>
              <ul className="space-y-1 text-[12px] text-zinc-600">
                {selectedJob.eligibleBullets.map((b, i) => (
                  <li key={i} className="flex gap-2 items-center">
                    <CheckCircle size={14} className="text-emerald-600 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex gap-3">
              <a
                href={selectedJob.officialPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-10 rounded-xl bg-[#138808] text-white font-bold flex items-center justify-center gap-1.5 text-[13px]"
              >
                Direct Official Link <ExternalLink size={14} />
              </a>
              <button
                onClick={() => setSelectedJob(null)}
                className="h-10 px-4 rounded-xl border border-zinc-200 font-medium text-[13px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
        }
