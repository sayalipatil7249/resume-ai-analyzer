import { useState, useCallback, useEffect } from "react";
import API from "./api/api";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard,
  Upload,
  FileText,
  Eye,
  Briefcase,
  Search,
  User,
  LogOut,
  Sun,
  Moon,
  Download,
  ArrowLeft,
  ChevronDown,
  Shield,
  Zap,
  Target,
  MessageSquare,
  Star,
  CheckCircle,
  BarChart2,
  Bell,
  Camera,
  Lock,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  MoreVertical,
} from "lucide-react";

// ─── MOCK DATA LAYER ──────────────────────────────────────────────────────────
// Replace these with API fetch calls (useEffect + axios/fetch)

const MOCK_USER = {
  name: "Aarav Sharma",
  username: "aarav.sharma",
  email: "user@example.com",
  role: "Data Scientist",
  memberSince: "12 May 2024",
  avatar: null,
};

const MOCK_DASHBOARD = {
  overallScore: 85,
  predictedRole: "Data Scientist",
  confidence: 92,
  matchedSkills: 18,
  totalSkills: 24,
  missingSkills: 6,
  radarData: [
    { subject: "Skills", A: 82 },
    { subject: "Projects", A: 72 },
    { subject: "Experience", A: 68 },
    { subject: "Education", A: 78 },
    { subject: "Certifications", A: 58 },
  ],
  topSkills: [
    "Python",
    "Machine Learning",
    "SQL",
    "Pandas",
    "NumPy",
    "Scikit Learn",
    "TensorFlow",
    "Data Analysis",
    "+ 10 more",
  ],
  feedback: [
    "Strong technical skill set detected.",
    "Good project experience with real implementations.",
    "Consider adding more certifications.",
    "Work on Cloud & DevOps skills.",
  ],
};

const MOCK_RESUMES = [
  {
    id: 1,
    name: "Aarav_Sharma_Resume.pdf",
    role: "Data Scientist",
    score: 85,
    date: "20 May 2024",
  },
  {
    id: 2,
    name: "Full_Stack_Developer.docx",
    role: "Full Stack Developer",
    score: 78,
    date: "18 May 2024",
  },
  {
    id: 3,
    name: "ML_Engineer_Resume.pdf",
    role: "ML Engineer",
    score: 90,
    date: "15 May 2024",
  },
  {
    id: 4,
    name: "Data_Analyst_CV.docx",
    role: "Data Analyst",
    score: 72,
    date: "10 May 2024",
  },
  {
    id: 5,
    name: "Backend_Developer.pdf",
    role: "Backend Developer",
    score: 80,
    date: "05 May 2024",
  },
];

const MOCK_RESUME_DETAIL = {
  id: 1,
  name: "Aarav_Sharma_Resume.pdf",
  uploadDate: "20 May 2024",
  score: 85,
  summary:
    "This resume belongs to a Data Scientist with strong skills in Machine Learning, Python, and Data Analysis. Good project experience and academic background.",
  totalSkills: 18,
  matchedSkills: 18,
  outOf: 24,
  missingSkills: 6,
  predictedRole: "Data Scientist",
  confidence: 92,
  experienceLevel: "Fresher",
  topSkills: [
    "Python",
    "Machine Learning",
    "SQL",
    "Pandas",
    "NumPy",
    "Scikit Learn",
    "TensorFlow",
    "Data Analysis",
    "Matplotlib",
    "Seaborn",
  ],
  feedback: [
    "Strong technical skill set detected.",
    "Good project experience with real implementations.",
    "Consider adding more certifications.",
    "Work on Cloud & DevOps skills.",
  ],
};

const MOCK_JOB_MATCH = {
  percentage: 78,
  status: "Good Match",
  missingSkills: [
    "AWS",
    "Docker",
    "Kubernetes",
    "Statistics",
    "Deep Learning",
    "R",
  ],
  commonSkills: [
    "Python",
    "Machine Learning",
    "SQL",
    "Pandas",
    "TensorFlow",
    "+ 13 more",
  ],
};

const MOCK_SEARCH_RESULTS = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Data Scientist",
    skills: "Python, ML, SQL, Pandas, TensorFlow",
    score: 92,
  },
  {
    id: 2,
    name: "Riya Patel",
    role: "ML Engineer",
    skills: "Python, Deep Learning, TensorFlow, Keras, AWS",
    score: 89,
  },
  {
    id: 3,
    name: "Karan Verma",
    role: "Data Analyst",
    skills: "SQL, Python, Data Analysis, Power BI",
    score: 86,
  },
];

const ROLES = [
  "Data Scientist",
  "ML Engineer",
  "Full Stack Developer",
  "Backend Developer",
  "Data Analyst",
  "DevOps Engineer",
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Upload Resume", icon: Upload },
  { id: "my-resumes", label: "My Resumes", icon: FileText },
  { id: "resume-viewer", label: "Resume Viewer", icon: Eye },
  { id: "job-matching", label: "Job Matching", icon: Briefcase },
  { id: "search-resumes", label: "Search Resumes", icon: Search },
  { id: "profile", label: "Profile", icon: User },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const ScoreBadge = ({ score, size = "sm" }) => {
  const color =
    score >= 85
      ? "text-emerald-600 bg-emerald-50"
      : score >= 70
        ? "text-amber-600 bg-amber-50"
        : "text-red-600 bg-red-50";
  return (
    <span
      className={`font-semibold rounded px-2 py-0.5 ${color} ${size === "lg" ? "text-2xl" : "text-sm"}`}
    >
      {score}/100
    </span>
  );
};

const SkillTag = ({ label, variant = "default" }) => {
  const styles = {
    default: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    missing: "bg-red-50 text-red-700 border border-red-100",
    matched: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  };
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[variant]}`}
    >
      {label}
    </span>
  );
};

const CircleProgress = ({ value, size = 100 }) => {
  const r = 40;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#4f46e5"
        strokeWidth="8"
        strokeDasharray={`${dash} ${c}`}
        strokeDashoffset={c / 4}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text
        x="50"
        y="46"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="#1e293b"
      >
        {value}
      </text>
      <text x="50" y="60" textAnchor="middle" fontSize="9" fill="#64748b">
        /100
      </text>
    </svg>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({
  activePage,
  onNavigate,
  dark,
  onToggleDark,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
}) => (
  <>
    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-20 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}
    <aside
      className={`fixed top-0 left-0 h-full z-30 flex flex-col bg-[#0f172a] w-60 transition-transform duration-200
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
    >
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
          <BarChart2 size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-tight">
            Resume AI
          </p>
          <p className="text-slate-400 text-xs">Analyzer</p>
        </div>
        <button
          className="ml-auto lg:hidden text-slate-400 hover:text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={18} />
        </button>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              onNavigate(id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${activePage === id ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <button
          onClick={onToggleDark}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-white/5"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  </>
);

// ─── LAYOUT (pages 2–8) ───────────────────────────────────────────────────────
const Layout = ({ activePage, onNavigate, dark, onToggleDark, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = {
  name: "Sayali Patil",
};

  return (
    <div
      className={`flex h-screen overflow-hidden ${dark ? "dark bg-slate-900" : "bg-slate-50"}`}
    >
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        dark={dark}
        onToggleDark={onToggleDark}
        onLogout={() => onNavigate("landing")}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className={`flex items-center justify-between px-4 sm:px-6 py-3.5 border-b ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`}
        >
          <button
            className="lg:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <p
            className={`text-sm font-medium capitalize hidden sm:block ${dark ? "text-slate-300" : "text-slate-500"}`}
          >
            {NAV_ITEMS.find((n) => n.id === activePage)?.label || ""}
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <button
              className={`p-2 rounded-lg ${dark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-500"}`}
            >
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
  {user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")}
</div>
              <span
                className={`text-sm font-medium hidden sm:block ${dark ? "text-white" : "text-slate-700"}`}
              >
                Hello, {user.name}
              </span>
            </div>
          </div>
        </header>
        <main
          className={`flex-1 overflow-y-auto ${dark ? "bg-slate-900" : "bg-slate-50"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — LANDING
// ═══════════════════════════════════════════════════════════════════════════════
const LandingPage = ({ onNavigate, dark, onToggleDark }) => {
  const features = [
    {
      icon: <Zap size={20} />,
      title: "AI Analysis",
      desc: "Advanced AI analyses your resume deeply.",
    },
    {
      icon: <Target size={20} />,
      title: "Skill Extraction",
      desc: "Extract important skills automatically.",
    },
    {
      icon: <Star size={20} />,
      title: "Smart Matching",
      desc: "Match your skills with job requirements.",
    },
    {
      icon: <Eye size={20} />,
      title: "Resume Viewer",
      desc: "View & manage all your resumes.",
    },
    {
      icon: <MessageSquare size={20} />,
      title: "Detailed Feedback",
      desc: "Get actionable suggestions.",
    },
  ];
  const stats = [
    { n: "10K+", l: "Resumes Analyzed" },
    { n: "95%", l: "Accuracy" },
    { n: "5000+", l: "Happy Users" },
    { n: "24/7", l: "AI Support" },
  ];
  return (
    <div
      className={`min-h-screen ${dark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
    >
      {/* NAV */}
      <nav
        className={`flex items-center justify-between px-6 sm:px-12 py-4 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <BarChart2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm">Resume AI Analyzer</span>
        </div>
        <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-slate-500">
          {["Features", "How It Works", "Pricing", "About"].map((l) => (
            <a
              key={l}
              href="#"
              className={`hover:text-indigo-600 transition-colors ${dark ? "text-slate-400" : ""}`}
            >
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDark}
            className={`p-2 rounded-lg ${dark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => onNavigate("upload")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <h1
            className={`text-4xl sm:text-5xl font-extrabold leading-tight mb-4 ${dark ? "text-white" : "text-slate-900"}`}
          >
            AI-Powered
            <br />
            <span className="text-indigo-600">Resume Analysis</span>
          </h1>
          <p
            className={`text-base mb-8 max-w-md ${dark ? "text-slate-400" : "text-slate-500"}`}
          >
            Upload your resume and get an instant AI analysis, skill extraction,
            role prediction, matching score and improvement suggestions.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate("upload")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Upload Resume
            </button>
            <button
              className={`border font-semibold px-6 py-3 rounded-lg text-sm transition-colors ${dark ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}
            >
              Learn More
            </button>
          </div>
        </div>
        {/* Hero illustration */}
        <div
          className={`flex-shrink-0 w-64 h-64 rounded-2xl flex items-center justify-center ${dark ? "bg-slate-800" : "bg-indigo-50"}`}
        >
          <div className="relative">
            <div
              className={`w-44 h-56 rounded-xl border-2 ${dark ? "bg-slate-700 border-slate-600" : "bg-white border-slate-200"} shadow-lg flex flex-col p-4 gap-2`}
            >
              {[80, 60, 90, 40, 70].map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                  <div
                    className="h-2 rounded-full bg-indigo-200"
                    style={{ width: `${w}%` }}
                  />
                </div>
              ))}
              <div className="mt-2 flex items-center justify-center">
                <div className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                  Score: 85/100
                </div>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={`${dark ? "bg-slate-800" : "bg-slate-50"} py-12`}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className={`rounded-xl p-5 text-center ${dark ? "bg-slate-700" : "bg-white"} border ${dark ? "border-slate-600" : "border-slate-100"}`}
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                {f.icon}
              </div>
              <p
                className={`text-sm font-semibold mb-1 ${dark ? "text-white" : "text-slate-800"}`}
              >
                {f.title}
              </p>
              <p
                className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="bg-indigo-600 py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-extrabold">{s.n}</p>
              <p className="text-sm text-indigo-200 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className={`py-16 ${dark ? "bg-slate-900" : "bg-slate-900"}`}>
        <div className="max-w-4xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Get the most out of
              <br />
              Resume AI Analyzer
            </h2>
            <p className="text-slate-400 text-sm">
              Upload your resume, get AI insights and land your dream job
              faster.
            </p>
          </div>
          <button
            onClick={() => onNavigate("upload")}
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors whitespace-nowrap"
          >
            Upload Resume Now
          </button>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row gap-8 text-slate-500 text-sm">
          <div>
            <p className="text-white font-semibold mb-3">Resume AI Analyzer</p>
            <p className="text-xs max-w-xs">
              AI-powered resume analysis to help you improve your profile and
              get better opportunities.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:ml-16">
            <div>
              <p className="text-slate-300 font-medium mb-2">Quick Links</p>
              {[
                "Dashboard",
                "Upload Resume",
                "Resume Viewer",
                "Job Matching",
                "Search Resumes",
              ].map((l) => (
                <button
                  key={l}
                  onClick={() => onNavigate(l.toLowerCase().replace(" ", "-"))}
                  className="block text-xs text-slate-500 hover:text-slate-300 mb-1.5"
                >
                  {l}
                </button>
              ))}
            </div>
            <div>
              <p className="text-slate-300 font-medium mb-2">Resources</p>
              {["How It Works", "Features", "Pricing", "FAQ", "Contact Us"].map(
                (l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-xs text-slate-500 hover:text-slate-300 mb-1.5"
                  >
                    {l}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
        <p className="text-center text-slate-600 text-xs mt-8">
          © 2024 Resume AI Analyzer. All rights reserved.
        </p>
      </section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — UPLOAD RESUME
// ═══════════════════════════════════════════════════════════════════════════════
const UploadPage = ({ onNavigate, dark }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await API.post(
        `/upload-resume?role=${role || "general"}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(response.data);

      alert("Resume Uploaded Successfully");

      setLoading(false);

      localStorage.setItem(
  "current_resume_id",
  response.data.resume_id
);

onNavigate("dashboard");
    } catch (error) {
      console.error(error);

      alert("Upload Failed");

      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      <h1
        className={`text-2xl font-bold mb-1 ${dark ? "text-white" : "text-slate-900"}`}
      >
        Upload Resume
      </h1>
      <p
        className={`text-sm mb-8 ${dark ? "text-slate-400" : "text-slate-500"}`}
      >
        Upload your resume and get AI-powered analysis
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl py-14 px-8 text-center transition-colors mb-6 cursor-pointer
          ${dragging ? "border-indigo-500 bg-indigo-50" : dark ? "border-slate-600 hover:border-indigo-400" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"}`}
        onClick={() => document.getElementById("file-input").click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
          <Upload size={24} className="text-indigo-600" />
        </div>
        {file ? (
          <>
            <p
              className={`font-semibold mb-1 ${dark ? "text-white" : "text-slate-800"}`}
            >
              {file.name}
            </p>
            <p className="text-sm text-slate-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </>
        ) : (
          <>
            <p
              className={`font-semibold mb-1 ${dark ? "text-white" : "text-slate-700"}`}
            >
              Drag & drop your resume here
            </p>
            <p className="text-sm text-slate-400 mb-4">or</p>
            <span className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg cursor-pointer hover:bg-indigo-700">
              Browse Files
            </span>
            <p className="text-xs text-slate-400 mt-4">
              Supports PDF, DOCX (Max. 10MB)
            </p>
          </>
        )}
      </div>

      <div className="mb-6">
        <label
          className={`block text-sm font-medium mb-2 ${dark ? "text-slate-300" : "text-slate-700"}`}
        >
          Select Target Role (Optional)
        </label>
        <div className="relative">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={`w-full border rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${dark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-700"}`}
          >
            <option value="">Select a role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all
          ${file && !loading ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
        <Shield size={14} /> Your data is secure and will not be shared.
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — ANALYSIS DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const DashboardPage = ({
  dark,
  onNavigate,
  selectedResumeId,
}) => {

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDashboard = async () => {
      try {

        const response = await fetch(
          "http://127.0.0.1:8000/api/dashboard"
        );

        const data = await response.json();

        setDashboardData(data);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className={dark ? "text-white" : "text-slate-700"}>
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500">
          Failed to load dashboard data
        </p>
      </div>
    );
  }

  const d = dashboardData;
  const resumeId = localStorage.getItem("current_resume_id");

  return (
    <div className="p-6 sm:p-8">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className={`text-xl font-bold ${
              dark ? "text-white" : "text-slate-900"
            }`}
          >
            Dashboard
          </h1>

          <p
            className={`text-sm ${
              dark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Here is your resume analysis summary
          </p>
        </div>

        <button
  onClick={() => {
    if (!resumeId) {
      alert("Resume not found");
      return;
    }

    window.open(
      `http://127.0.0.1:8000/download-report/${resumeId}`,
      "_blank"
    );
  }}
  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
>
  <Download size={15} />
  Download Report
</button>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Overall Score",
            content: <CircleProgress value={d.overallScore} size={88} />,
          },
          {
            label: "Predicted Role",
            content: (
              <div className="text-center">
                <User size={28} className="text-indigo-400 mx-auto mb-1" />
                <p
                  className={`font-bold text-base ${dark ? "text-white" : "text-slate-800"}`}
                >
                  {d.predictedRole}
                </p>
                <p className="text-xs text-slate-400">
                  Confidence: {d.confidence}%
                </p>
              </div>
            ),
          },
          {
            label: "Matched Skills",
            content: (
              <div className="text-center">
                <p
                  className={`text-4xl font-extrabold ${dark ? "text-white" : "text-slate-900"}`}
                >
                  {d.matchedSkills}
                  <span className="text-slate-400 text-xl">
                    /{d.totalSkills}
                  </span>
                </p>
                <div className="w-full h-2 rounded-full bg-slate-200 mt-2">
                  <div
                    className="h-2 rounded-full bg-indigo-500"
                    style={{
                      width: `${(d.matchedSkills / d.totalSkills) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">75%</p>
              </div>
            ),
          },
          {
            label: "Missing Skills",
            content: (
              <div className="text-center">
                <p className={`text-5xl font-extrabold text-red-500`}>
                  {d.missingSkills}
                </p>
                <button className="text-xs text-indigo-500 hover:underline mt-2">
                  View Details
                </button>
              </div>
            ),
          },
        ].map(({ label, content }, i) => (
          <div
            key={i}
            className={`rounded-2xl p-5 flex flex-col items-center justify-between gap-3 ${dark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-100"} shadow-sm`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-500"}`}
            >
              {label}
            </p>
            {content}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar */}
        <div
          className={`rounded-2xl p-6 ${dark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-100"} shadow-sm`}
        >
          <p
            className={`text-sm font-semibold mb-4 ${dark ? "text-white" : "text-slate-700"}`}
          >
            Score Breakdown
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={d.radarData || []}>
              <PolarGrid stroke={dark ? "#334155" : "#e2e8f0"} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 11, fill: dark ? "#94a3b8" : "#64748b" }}
              />
              <Radar
                name="Score"
                dataKey="A"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills + Feedback */}
        <div className="space-y-4">
          <div
            className={`rounded-2xl p-5 ${dark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-100"} shadow-sm`}
          >
            <p
              className={`text-sm font-semibold mb-3 ${dark ? "text-white" : "text-slate-700"}`}
            >
              Top Skills Detected
            </p>
            <div className="flex flex-wrap gap-2">
              {d.topSkills?.map((s, i) => (
                <SkillTag key={i} label={s} />
              ))}
            </div>
          </div>
          <div
            className={`rounded-2xl p-5 ${dark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-100"} shadow-sm`}
          >
            <p
              className={`text-sm font-semibold mb-3 ${dark ? "text-white" : "text-slate-700"}`}
            >
              AI Feedback
            </p>
            <ul className="space-y-2">
              {d.feedback?.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle
                    size={14}
                    className="text-indigo-500 mt-0.5 flex-shrink-0"
                  />
                  <span
                    className={`text-xs leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>
            <button className="text-xs text-indigo-500 hover:underline mt-3">
              View Full Feedback →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 4 — RESUME VIEWER (LIST)
// ═══════════════════════════════════════════════════════════════════════════════
const ResumeListPage = ({ dark, onSelectResume }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH FUNCTION OUTSIDE useEffect
  const fetchResumes = async () => {
    try {
      const response = await API.get("/resumes");

      setResumes(response.data.resumes);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // CALL WHEN PAGE LOADS
  useEffect(() => {
    fetchResumes();
  }, []);

  // DELETE FUNCTION
  const handleDelete = async (id) => {
    try {
      await API.delete(`/resume/${id}`);

      // REFRESH LIST
      fetchResumes();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <h1 className="p-10">Loading...</h1>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">Resume Viewer</h1>

      <div className="space-y-4">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold text-lg">{resume.filename}</h2>

              <p>Role: {resume.role}</p>

              <p>Score: {resume.analysis?.score || 0}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onSelectResume(resume.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                View
              </button>

              <a
                href={`http://127.0.0.1:8000/resume-file/${resume.id}`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Open File
              </a>

              <button
                onClick={() => handleDelete(resume.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PAGE 5 — RESUME VIEWER (DETAIL)
// ═══════════════════════════════════════════════════════════════════════

const ResumeDetailPage = ({ dark, onBack, resumeId }) => {
  const [r, setR] = useState(null);

  const [activeTab, setActiveTab] = useState("overview");

  const tabs = ["Overview", "Analysis", "Feedback", "File Preview"];

  // FETCH RESUME
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await API.get(`/resume/${resumeId}`);

        console.log(response.data);

        setR(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchResume();
  }, [resumeId]);

  // LOADING
  if (!r) {
    return <h1 className="p-10">Loading...</h1>;
  }

  return (
    <div className="p-6 sm:p-8">
      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className={`mb-5 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
      >
        ← Back to Resumes
      </button>

      {/* HEADER */}
      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <div>
          <h2
            className={`text-2xl font-bold ${
              dark ? "text-white" : "text-slate-900"
            }`}
          >
            {r.filename}
          </h2>

          <p
            className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
          >
            Role: {r.role}
          </p>
        </div>

        <div className="text-emerald-600">
          <p className="text-sm font-semibold">Resume Score</p>

          <h1 className="text-4xl font-bold">{r.analysis?.score || 0}</h1>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase().replace(" ", "-"))}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === tab.toLowerCase().replace(" ", "-")
                ? "bg-indigo-600 text-white"
                : "bg-slate-200 text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {/* SUMMARY */}
          <div
            className={`rounded-2xl p-5 ${
              dark
                ? "bg-slate-800 border border-slate-700"
                : "bg-white border border-slate-100"
            }`}
          >
            <h3 className="font-bold mb-3">Resume Summary</h3>

            <p>{r.analysis?.summary || "No summary available"}</p>
          </div>

          {/* SKILLS */}
          <div
            className={`rounded-2xl p-5 ${
              dark
                ? "bg-slate-800 border border-slate-700"
                : "bg-white border border-slate-100"
            }`}
          >
            <h3 className="font-bold mb-3">Extracted Skills</h3>

            <div className="flex flex-wrap gap-2">
              {r.analysis?.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ANALYSIS */}
      {activeTab === "analysis" && (
        <div
          className={`rounded-2xl p-5 ${
            dark
              ? "bg-slate-800 border border-slate-700"
              : "bg-white border border-slate-100"
          }`}
        >
          <h3 className="font-bold mb-4">Full Analysis</h3>

          <pre className="text-sm overflow-auto">
            {JSON.stringify(r.analysis, null, 2)}
          </pre>
        </div>
      )}

      {/* FEEDBACK */}
      {activeTab === "feedback" && (
        <div
          className={`rounded-2xl p-5 ${
            dark
              ? "bg-slate-800 border border-slate-700"
              : "bg-white border border-slate-100"
          }`}
        >
          <h3 className="font-bold mb-3">AI Feedback</h3>

          <ul className="space-y-2">
            {r.analysis?.feedback?.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* FILE PREVIEW */}
      {activeTab === "file-preview" && (
        <div
          className={`rounded-2xl p-5 ${
            dark
              ? "bg-slate-800 border border-slate-700"
              : "bg-white border border-slate-100"
          }`}
        >
          <h3 className="font-bold mb-4">Resume File</h3>

          <a
            href={`http://127.0.0.1:8000/resume-file/${r.id}`}
            target="_blank"
            rel="noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Open Resume File
          </a>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 6 — JOB MATCHING
// ═══════════════════════════════════════════════════════════════════════════════
const JobMatchingPage = ({ dark }) => {
  const [jobDesc, setJobDesc] = useState(
    "Python, Machine Learning, Deep Learning, TensorFlow",
  );

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    try {
      setLoading(true);

      // STEP 1: GET ALL RESUMES
      const response = await API.get("/resumes");

      const resumes = response.data.resumes;

      // CHECK IF RESUME EXISTS
      if (resumes.length === 0) {
        alert("Please upload a resume first");

        setLoading(false);

        return;
      }

      // STEP 2: TAKE FIRST RESUME
      const resume = resumes[0];

      // STEP 3: GET RESUME SKILLS
      const resumeSkills = resume.analysis.skills;

      // STEP 4: CONVERT JOB DESCRIPTION TO ARRAY
      const jobSkills = jobDesc
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      // STEP 5: SEND TO BACKEND
      const matchResponse = await API.post("/match", {
        resume_skills: resumeSkills,

        job_skills: jobSkills,
      });

      // STEP 6: FIND COMMON SKILLS
      const commonSkills = resumeSkills.filter((skill) =>
        jobSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase()),
      );

      // STEP 7: SET RESULT
      setResult({
        percentage: matchResponse.data.match_percentage,

        missingSkills: matchResponse.data.missing_skills,

        commonSkills: commonSkills,

        status:
          matchResponse.data.match_percentage >= 70
            ? "Excellent Match"
            : matchResponse.data.match_percentage >= 50
              ? "Good Match"
              : "Low Match",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      <h1
        className={`text-xl font-bold mb-1 ${
          dark ? "text-white" : "text-slate-900"
        }`}
      >
        Job Matching
      </h1>

      <p
        className={`text-sm mb-6 ${dark ? "text-slate-400" : "text-slate-500"}`}
      >
        Match your resume with job requirements
      </p>

      <div
        className={`rounded-2xl p-5 mb-5 ${
          dark
            ? "bg-slate-800 border border-slate-700"
            : "bg-white border border-slate-100"
        }`}
      >
        <label
          className={`block text-sm font-medium mb-2 ${
            dark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Enter Job Skills / Paste Job Description
        </label>

        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          rows={4}
          className={`w-full text-sm border rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${
              dark
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
        />

        <button
          onClick={handleMatch}
          disabled={loading || !jobDesc.trim()}
          className={`w-full mt-3 py-3 rounded-xl font-semibold text-sm transition-colors
            ${
              jobDesc.trim() && !loading
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
        >
          {loading ? "Matching..." : "Match Now"}
        </button>
      </div>

      {result && (
        <div
          className={`rounded-2xl p-5 ${
            dark
              ? "bg-slate-800 border border-slate-700"
              : "bg-white border border-slate-100"
          }`}
        >
          {/* MATCH SCORE */}

          <div className="mb-5">
            <h2 className="text-3xl font-bold text-emerald-500">
              {result.percentage}%
            </h2>

            <p className="text-sm mt-1">{result.status}</p>
          </div>

          {/* MISSING SKILLS */}

          <div className="mb-5">
            <p
              className={`text-sm font-semibold mb-2 ${
                dark ? "text-white" : "text-slate-700"
              }`}
            >
              Missing Skills
            </p>

            <div className="flex flex-wrap gap-2">
              {result.missingSkills.map((s, i) => (
                <SkillTag key={i} label={s} variant="missing" />
              ))}
            </div>
          </div>

          {/* COMMON SKILLS */}

          <div>
            <p
              className={`text-sm font-semibold mb-2 ${
                dark ? "text-white" : "text-slate-700"
              }`}
            >
              Matched Skills
            </p>

            <div className="flex flex-wrap gap-2">
              {result.commonSkills.map((s, i) => (
                <SkillTag key={i} label={s} variant="matched" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 7 — SMART SEARCH
// ═══════════════════════════════════════════════════════════════════════════════

const SearchPage = ({ dark }) => {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);

      // GET ALL RESUMES FIRST
      const resumeResponse = await API.get("/resumes");

      const resumes = resumeResponse.data.resumes;

      // EXTRACT CLEANED TEXTS
      const resumeTexts = resumes.map((r) => r.analysis.cleaned_text);

      // SEND TO SEARCH API
      const response = await API.post("/search", {
        query: query,

        resumes: resumeTexts,
      });

      console.log(response.data);

      // COMBINE RESULT WITH RESUME DATA
      const finalResults = response.data.results.map((item, index) => ({
        id: resumes[index].id,

        name: resumes[index].filename,

        role: resumes[index].analysis.predicted_role,

        skills: resumes[index].analysis.skills.join(", "),

        score: Math.round(item.score),
      }));

      setResults(finalResults);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <h1
        className={`text-xl font-bold mb-1 ${
          dark ? "text-white" : "text-slate-900"
        }`}
      >
        Smart Search
      </h1>

      <p
        className={`text-sm mb-6 ${dark ? "text-slate-400" : "text-slate-500"}`}
      >
        Search resumes using keywords or semantic search
      </p>

      <div className="flex gap-3 mb-7">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter keywords (Python, ML, React...)"
            className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${
              dark
                ? "bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                : "bg-white border-slate-200 text-slate-700"
            }`}
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <p
        className={`text-sm font-semibold mb-3 ${
          dark ? "text-white" : "text-slate-700"
        }`}
      >
        Search Results
      </p>

      <div className="space-y-3">
        {results.map((r) => (
          <div
            key={r.id}
            className={`flex items-center gap-4 p-4 rounded-2xl border
            ${
              dark
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-slate-100"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
              {r.name[0]}
            </div>

            <div className="flex-1">
              <p
                className={`text-sm font-semibold ${
                  dark ? "text-white" : "text-slate-800"
                }`}
              >
                {r.name}
              </p>

              <p
                className={`text-xs ${
                  dark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {r.role}
              </p>

              <p
                className={`text-xs mt-1 ${
                  dark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Skills: {r.skills}
              </p>
            </div>

            <div className="text-right">
              <p
                className={`text-xs font-medium mb-1 ${
                  dark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Match Score
              </p>

              <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                {r.score}%
              </span>
            </div>
          </div>
        ))}

        {results.length === 0 && !loading && (
          <p
            className={`text-sm text-center py-10 ${
              dark ? "text-slate-400" : "text-slate-400"
            }`}
          >
            No results found.
          </p>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 8 — PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
const ProfilePage = ({ dark }) => {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
    memberSince: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [saved, setSaved] = useState(false);

  // =========================
  // FETCH PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      const response = await API.get("/profile");

      setProfile(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async () => {
    try {
      await API.put("/profile", {
        name: profile.name,
        username: profile.username,
        email: profile.email,
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================
  const handlePwChange = async () => {
    if (passwords.next !== passwords.confirm) {
      alert("Passwords do not match");

      return;
    }

    try {
      const response = await API.put("/change-password", {
        current_password: passwords.current,

        new_password: passwords.next,
      });

      alert(response.data.message);

      setPasswords({
        current: "",
        next: "",
        confirm: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <h1
        className={`text-xl font-bold mb-1 ${dark ? "text-white" : "text-slate-900"}`}
      >
        Profile
      </h1>

      <p
        className={`text-sm mb-8 ${dark ? "text-slate-400" : "text-slate-500"}`}
      >
        Manage your account information
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div
          className={`rounded-2xl p-6 ${dark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-100"}`}
        >
          {/* AVATAR */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold">
                {profile.name
                  ?.split(" ")
                  .map((w) => w[0])
                  .join("")}
              </div>
            </div>

            <div>
              <p
                className={`font-bold ${dark ? "text-white" : "text-slate-800"}`}
              >
                {profile.name}
              </p>

              <p
                className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
              >
                {profile.username}
              </p>
            </div>
          </div>

          {/* FORM */}
          {[
            { label: "Full Name", key: "name" },
            { label: "User Name", key: "username" },
            { label: "Email", key: "email" },
          ].map(({ label, key }) => (
            <div key={key} className="mb-4">
              <label
                className={`block text-xs font-medium mb-1.5 ${dark ? "text-slate-400" : "text-slate-500"}`}
              >
                {label}
              </label>

              <input
                value={profile[key]}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    [key]: e.target.value,
                  })
                }
                className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${dark ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}
              />
            </div>
          ))}

          {/* ROLE + MEMBER */}
          <div className="flex gap-4 mt-2">
            <div className="flex-1">
              <p
                className={`text-xs font-medium mb-1 ${dark ? "text-slate-400" : "text-slate-500"}`}
              >
                Role
              </p>

              <p
                className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-800"}`}
              >
                {profile.role}
              </p>
            </div>

            <div className="flex-1">
              <p
                className={`text-xs font-medium mb-1 ${dark ? "text-slate-400" : "text-slate-500"}`}
              >
                Member Since
              </p>

              <p
                className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-800"}`}
              >
                {profile.memberSince}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          className={`rounded-2xl p-6 ${dark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-100"}`}
        >
          <p
            className={`text-sm font-semibold mb-5 ${dark ? "text-white" : "text-slate-700"}`}
          >
            Change Password
          </p>

          {[
            { label: "Current Password", key: "current" },
            { label: "New Password", key: "next" },
            { label: "Confirm New Password", key: "confirm" },
          ].map(({ label, key }) => (
            <div key={key} className="mb-4">
              <label
                className={`block text-xs font-medium mb-1.5 ${dark ? "text-slate-400" : "text-slate-500"}`}
              >
                {label}
              </label>

              <input
                type="password"
                value={passwords[key]}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    [key]: e.target.value,
                  })
                }
                className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${dark ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}
              />
            </div>
          ))}

          <button
            onClick={handlePwChange}
            className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors
          ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState("landing");

  const [dark, setDark] = useState(false);

  const [selectedResumeId, setSelectedResumeId] = useState(null);

  // NEW USER STATE
  const [user, setUser] = useState(null);

  // NAVIGATION
  const navigate = (p) => setPage(p);

  // SELECT RESUME
  const handleSelectResume = (id) => {
    setSelectedResumeId(id);

    setPage("resume-detail");
  };

  // FETCH USER PROFILE
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("/profile");

        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  // PAGES WITHOUT SIDEBAR
  if (page === "landing") {
    return (
      <LandingPage
        onNavigate={navigate}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
      />
    );
  }

  // SIDEBAR PAGE ROUTES
  const SIDEBAR_PAGE_MAP = {
    dashboard: (
  <DashboardPage
    dark={dark}
    onNavigate={navigate}
    selectedResumeId={selectedResumeId}
  />
),

    upload: <UploadPage onNavigate={navigate} dark={dark} />,

    "my-resumes": (
      <ResumeListPage dark={dark} onSelectResume={handleSelectResume} />
    ),

    "resume-viewer": (
      <ResumeListPage dark={dark} onSelectResume={handleSelectResume} />
    ),

    "resume-detail": (
      <ResumeDetailPage
        dark={dark}
        onBack={() => navigate("resume-viewer")}
        resumeId={selectedResumeId}
      />
    ),

    "job-matching": <JobMatchingPage dark={dark} />,

    "search-resumes": <SearchPage dark={dark} />,

    profile: <ProfilePage dark={dark} />,
  };

  // ACTIVE NAV ITEM
  const activeNavPage = page === "resume-detail" ? "resume-viewer" : page;

  // MAIN LAYOUT
  return (
    <Layout
      activePage={activeNavPage}
      onNavigate={navigate}
      dark={dark}
      onToggleDark={() => setDark((d) => !d)}
      user={user}
    >
      {SIDEBAR_PAGE_MAP[page] || (
        <DashboardPage dark={dark} onNavigate={navigate} />
      )}
    </Layout>
  );
}
