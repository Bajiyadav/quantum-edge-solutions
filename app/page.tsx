"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── DATA ──
const services = [
  { id: 1, title: "Custom Software Development", icon: "⚙️", desc: "Bespoke enterprise applications engineered for the unique workflows of growing businesses.", features: ["Web & Mobile Apps", "SaaS Platforms", "API Integrations", "Database Design"] },
  { id: 2, title: "AI & Machine Learning", icon: "🤖", desc: "Intelligent automation, predictive insights, and AI-powered workflows for modern businesses.", features: ["Business Automation AI", "Chatbots & Assistants", "Predictive Analytics", "Document Processing"] },
  { id: 3, title: "Cloud & DevOps", icon: "☁️", desc: "Scalable cloud infrastructure with automated deployments and zero-downtime updates.", features: ["AWS & Azure Setup", "CI/CD Pipelines", "Auto-Scaling", "24/7 Monitoring"] },
  { id: 4, title: "Cybersecurity Solutions", icon: "🛡️", desc: "Security audits, compliance, and protection systems built for Indian businesses.", features: ["Security Audits", "Penetration Testing", "Compliance (ISO/SOC2)", "Threat Monitoring"] },
  { id: 5, title: "Business Automation", icon: "⚡", desc: "Eliminate manual workflows with smart automation tools for billing, invoicing, and operations.", features: ["Workflow Automation", "Invoice & Billing Bots", "Email Automation", "Report Generation"] },
  { id: 6, title: "IT Consulting", icon: "💡", desc: "Technology strategy, system architecture, and digital transformation guidance for businesses.", features: ["Digital Strategy", "System Architecture", "Tech Stack Selection", "Team Augmentation"] },
];

const industries = [
  { id: 1, icon: "💻", title: "Software Development", desc: "Custom software solutions, enterprise applications, and scalable digital platforms." },
  { id: 2, icon: "🌐", title: "Web & Mobile Applications", desc: "Modern websites, mobile apps, SaaS platforms, and customer-facing digital products." },
  { id: 3, icon: "🤖", title: "AI & Automation", desc: "AI-powered workflows, business automation, chatbots, and intelligent process optimization." },
  { id: 4, icon: "🛡️", title: "Cybersecurity", desc: "Security assessments, monitoring, compliance, and protection for modern businesses." },
  { id: 5, icon: "🏪", title: "Retail & Small Businesses", desc: "Billing systems, inventory management, expense tracking, and digital tools for local businesses." },
  { id: 6, icon: "🚀", title: "Startups & Entrepreneurs", desc: "Rapid MVP development, scalable platforms, and technology consulting for growing businesses." },
];

const products = [
  { name: "Quantum Shop Assistant", icon: "🧮", tagline: "Smart Billing & Inventory for Retailers", desc: "All-in-one tool for small shops — billing, GST, inventory, and customer management built for Indian retailers.", features: ["GST Billing & Invoicing", "Inventory Tracking", "Customer Database", "Daily Sales Reports"], color: "from-sky-500/15 to-sky-500/5", border: "border-sky-500/20", accent: "text-sky-300", accentBg: "bg-sky-400", status: "Live" },
  { name: "Quantum Expense Manager", icon: "💰", tagline: "Smart Finance Tracking for SMEs", desc: "Track business expenses, manage budgets, and generate financial reports. Built for freelancers and small teams.", features: ["Multi-Category Expenses", "Monthly Budgeting", "Visual Reports", "Export to Excel/PDF"], color: "from-green-500/15 to-green-500/5", border: "border-green-500/20", accent: "text-green-300", accentBg: "bg-green-400", status: "Live" },
  { name: "Quantum Connect", icon: "🔗", tagline: "Service Marketplace Platform", desc: "Connect businesses with verified technology service providers. Post requirements, get matched, get work done.", features: ["Verified Providers", "Smart Matching", "Secure Communication", "Project Tracking"], color: "from-amber-500/15 to-amber-500/5", border: "border-amber-500/20", accent: "text-amber-300", accentBg: "bg-amber-400", status: "Coming Soon" },
  { name: "Quantum Business Suite", icon: "📊", tagline: "All-in-One Business Dashboard", desc: "Complete dashboard combining billing, inventory, CRM, and analytics for growing Indian businesses.", features: ["Unified Dashboard", "Built-in CRM", "Real-time Analytics", "Multi-Branch Support"], color: "from-purple-500/15 to-purple-500/5", border: "border-purple-500/20", accent: "text-purple-300", accentBg: "bg-purple-400", status: "Coming Soon" },
];

const techStack: Record<string, string[]> = {
  Frontend: ["React", "Next.js", "TypeScript", "Vue.js", "Tailwind", "GraphQL"],
  Backend: ["Node.js", "Python", "FastAPI", "Go", "Java Spring", "REST APIs"],
  Cloud: ["AWS", "Azure", "Google Cloud", "Vercel", "Cloudflare", "Terraform"],
  Database: ["PostgreSQL", "MongoDB", "Redis", "Snowflake", "Elasticsearch", "ClickHouse"],
  DevOps: ["Docker", "Kubernetes", "GitHub Actions", "ArgoCD", "Prometheus", "Grafana"],
  AI: ["OpenAI", "TensorFlow", "PyTorch", "LangChain", "Hugging Face", "Vertex AI"],
};

const techColors: Record<string, string> = {
  Frontend: "bg-sky-400", Backend: "bg-amber-400", Cloud: "bg-green-400",
  Database: "bg-purple-400", DevOps: "bg-green-400", AI: "bg-amber-400",
};

const features = [
  { id: 1, title: "Affordable Solutions", desc: "Technology built for Indian businesses — transparent pricing with no hidden costs." },
  { id: 2, title: "AI-First Approach", desc: "Every product we build integrates smart automation and intelligent features by default." },
  { id: 3, title: "Scalable Architecture", desc: "Start small, grow fast — our solutions scale from 10 users to 10,000 without rebuilds." },
  { id: 4, title: "Local Expertise, Global Standards", desc: "We understand Indian business needs while following international engineering best practices." },
  { id: 5, title: "Rapid Delivery", desc: "MVPs in weeks, full platforms in months — we move fast without breaking quality." },
  { id: 6, title: "Long-term Partnership", desc: "We don't disappear after launch — ongoing support, updates, and growth guidance." },
];

const visMetrics = [
  { name: "Time to Delivery", score: "2×", pct: 80 },
  { name: "Client Satisfaction", score: "100%", pct: 100 },
  { name: "On-Time Delivery", score: "98%", pct: 98 },
  { name: "Support Response", score: "<2h", pct: 95 },
];

const caseStudies = [
  { id: 1, icon: "🥐", metric: "Live", tag: "Business Website", title: "House of Bakers Website", desc: "Designed and developed a complete business website with online menu, contact system, and Google Maps integration for a local bakery brand." },
  { id: 2, icon: "🦺", metric: "Active", tag: "Training Platform", title: "Safety Training Platform", desc: "Built a web-based safety training and certification platform with progress tracking, quizzes, and downloadable certificates for industrial workers." },
  { id: 3, icon: "🎓", metric: "Deployed", tag: "Education Software", title: "Student Management System", desc: "Developed a comprehensive student management system for an educational institution — handling admissions, attendance, results, and parent communication." },
  { id: 4, icon: "🔐", metric: "Working", tag: "Cybersecurity", title: "Fingerprint Authentication System", desc: "Engineered a fingerprint-based authentication module for secure access control — integrated into existing enterprise systems with real-time verification." },
];

const processSteps = [
  { n: "01", title: "Discovery", desc: "Understand your business, requirements, and challenges" },
  { n: "02", title: "Planning", desc: "Architecture design, timeline, and transparent pricing" },
  { n: "03", title: "Design", desc: "UI/UX prototypes, data models, and user flows" },
  { n: "04", title: "Development", desc: "Agile sprints with weekly progress updates" },
  { n: "05", title: "Launch", desc: "Testing, deployment, and go-live support" },
  { n: "06", title: "Support", desc: "Ongoing maintenance, updates, and growth consulting" },
];

const faqs = [
  { q: "What does QuantumEdge Solutions do?", a: "QuantumEdge Solutions is a technology company that builds software products, provides custom development services, and runs a service marketplace connecting businesses with verified technology professionals." },
  { q: "Who are your typical clients?", a: "We work with startups, small businesses, enterprises, retailers, educational institutions, healthcare organizations, and technology-driven companies across India and globally." },
  { q: "Do you build ready-made products or only custom?", a: "We do both. We have our own product line (Quantum Shop Assistant, Quantum Expense Manager, etc.) and we also build fully custom solutions tailored to your business needs." },
  { q: "What is your pricing model?", a: "We offer fixed-scope pricing for defined projects, monthly retainers for ongoing work, and subscription pricing for our products. Projects typically start at ₹25,000." },
  { q: "Where are you based?", a: "We are based in Amaravati, Andhra Pradesh, India, and serve clients across India and globally through remote collaboration." },
  { q: "How can I become a service provider on QuantumEdge?", a: "Click the 'Become a Service Provider' button, fill out the registration form with your skills and portfolio, and our team will verify and onboard you within 48 hours." },
];

const trustLogos = ["House of Bakers", "SafetyFirst Training", "EduTech Academy", "SmartRetail India", "GreenLogistics", "HealthCare Plus", "TechStartup Hub", "BuildMart", "CloudServe", "DataMinds", "SecureNet", "AppWorks"];

const dashBars = [60, 75, 55, 85, 70, 92, 78, 88, 75, 95, 82, 100];

// ── TYPES ──
type FormType = "service" | "provider" | null;

interface ServiceFormData {
  name: string;
  business: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
}

interface ProviderFormData {
  name: string;
  email: string;
  phone: string;
  skills: string;
  experience: string;
  portfolio: string;
  linkedin: string;
}

// ── MAIN PAGE ──
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTech, setActiveTech] = useState("All");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Modal state
  const [openForm, setOpenForm] = useState<FormType>(null);

  // Service form
  const [serviceForm, setServiceForm] = useState<ServiceFormData>({
    name: "", business: "", email: "", phone: "", service: "", budget: "", message: "",
  });
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceSuccess, setServiceSuccess] = useState(false);
  const [serviceErrors, setServiceErrors] = useState<Partial<Record<keyof ServiceFormData, string>>>({});

  // Provider form
  const [providerForm, setProviderForm] = useState<ProviderFormData>({
    name: "", email: "", phone: "", skills: "", experience: "", portfolio: "", linkedin: "",
  });
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerSuccess, setProviderSuccess] = useState(false);
  const [providerErrors, setProviderErrors] = useState<Partial<Record<keyof ProviderFormData, string>>>({});

  // Scroll listener (useEffect so it only runs on the client)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const showTech = (() => {
    const all = Object.entries(techStack).flatMap(([cat, ts]) => ts.map((t) => ({ t, cat })));
    return activeTech === "All" ? all : all.filter((x) => x.cat === activeTech);
  })();

  const links = [
    { href: "#hero", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#products", label: "Products" },
    { href: "#industries", label: "Solutions" },
    { href: "#technology", label: "Technology" },
    { href: "#casestudies", label: "Projects" },
    { href: "#faq", label: "About" },
    { href: "#cta", label: "Contact" },
  ];

  // ── Validation ──
  const validateService = (): boolean => {
    const errs: Partial<Record<keyof ServiceFormData, string>> = {};
    if (!serviceForm.name.trim()) errs.name = "Name is required";
    if (!serviceForm.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(serviceForm.email)) errs.email = "Invalid email";
    if (!serviceForm.phone.trim()) errs.phone = "Phone is required";
    if (!serviceForm.service.trim()) errs.service = "Please select a service";
    setServiceErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateProvider = (): boolean => {
    const errs: Partial<Record<keyof ProviderFormData, string>> = {};
    if (!providerForm.name.trim()) errs.name = "Name is required";
    if (!providerForm.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(providerForm.email)) errs.email = "Invalid email";
    if (!providerForm.skills.trim()) errs.skills = "Skills are required";
    setProviderErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit: Service Request → POST /api/leads ──
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateService()) return;

    setServiceLoading(true);
    setServiceErrors({});

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceForm),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit request");
      }

      setServiceSuccess(true);
      setServiceForm({
        name: "", business: "", email: "", phone: "", service: "", budget: "", message: "",
      });
    } catch (error: any) {
      setServiceErrors({
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setServiceLoading(false);
    }
  };

  // ── Submit: Provider Application → POST /api/providers ──
  const handleProviderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProvider()) return;

    setProviderLoading(true);
    setProviderErrors({});

    try {
      const response = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(providerForm),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit application");
      }

      setProviderSuccess(true);
      setProviderForm({
        name: "", email: "", phone: "", skills: "", experience: "", portfolio: "", linkedin: "",
      });
    } catch (error: any) {
      setProviderErrors({
        name: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setProviderLoading(false);
    }
  };

  const closeModal = () => {
    setOpenForm(null);
    setServiceSuccess(false);
    setProviderSuccess(false);
    setServiceErrors({});
    setProviderErrors({});
  };

  return (
    <main>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[68px] px-[5%] flex items-center justify-between transition-all duration-300 ${scrolled ? "bg-[rgba(2,11,24,0.92)] border-b border-sky-500/25 shadow-[0_4px_40px_rgba(0,0,0,0.5)]" : "bg-[rgba(2,11,24,0.7)] border-b border-white/10"} backdrop-blur-xl`}>
        <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }} className="text-xl font-bold whitespace-nowrap">
          <span className="gradient-sky">QuantumEdge</span> <span className="text-amber-400">Solutions</span>
        </a>
        <ul className="hidden lg:flex gap-8 list-none">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={(e) => { e.preventDefault(); scrollTo(l.href); }} className="text-ink-muted text-sm font-medium hover:text-sky-300 transition-colors">{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="hidden lg:block">
          <button onClick={() => setOpenForm("service")} className="bg-gradient-to-br from-sky-500 to-sky-600 text-white px-[22px] py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(14,165,233,0.35)]">
            Get Started
          </button>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" className="lg:hidden flex flex-col gap-1.5 bg-transparent border-none p-1">
          <span className={`block w-6 h-0.5 bg-sky-400 rounded-sm transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-sky-400 rounded-sm transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-sky-400 rounded-sm transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="lg:hidden fixed top-[68px] left-0 right-0 z-40 bg-[rgba(2,11,24,0.97)] backdrop-blur-xl border-b border-white/10 py-6 px-[5%]">
            <ul className="list-none flex flex-col gap-4">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={(e) => { e.preventDefault(); scrollTo(l.href); }} className="text-ink-muted text-base font-medium block py-2 hover:text-sky-400">{l.label}</a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center pt-[68px] overflow-hidden">
        <div className="grid-bg" />
        <div className="absolute w-[600px] h-[600px] -top-[200px] -left-[150px] rounded-full bg-sky-500/15 blur-[80px] pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] top-[10%] -right-[100px] rounded-full bg-amber-400/10 blur-[80px] pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] bottom-[10%] left-[30%] rounded-full bg-sky-600/10 blur-[80px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-[5%] w-full py-20">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-sky-400/10 border border-sky-400/20 rounded-full px-4 py-1.5 text-xs font-semibold text-sky-300 tracking-wider uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse-slow" />Technology, Products & Services
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-extrabold text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.1] mb-6">
                Empowering <span className="gradient-sky">Businesses</span> Through <span className="gradient-gold">Technology & Innovation</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-[1.05rem] text-ink-muted max-w-[500px] mb-10 leading-relaxed">
                QuantumEdge Solutions builds software products, provides custom development services, and runs a marketplace connecting businesses with trusted technology professionals.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4 flex-wrap mb-10">
                <button onClick={() => setOpenForm("service")} className="bg-gradient-to-br from-sky-500 to-sky-600 text-white px-7 py-3.5 rounded-[10px] text-[15px] font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(14,165,233,0.4)]">Request a Service</button>
                <button onClick={() => setOpenForm("provider")} className="bg-transparent border border-sky-400/30 text-sky-300 px-7 py-3.5 rounded-[10px] text-[15px] font-semibold transition-all hover:bg-sky-400/10 hover:border-sky-400 hover:-translate-y-0.5">Become a Provider →</button>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { val: "Solutions", lbl: "Software" },
                  { val: "Automation", lbl: "Business" },
                  { val: "Marketplace", lbl: "Service" },
                  { val: "Innovation", lbl: "Product" },
                ].map((s, i) => (
                  <div key={i} className="bg-[rgba(7,21,37,0.6)] border border-white/10 rounded-xl p-5 hover:border-sky-500/25 transition-colors">
                    <div className="text-[1.05rem] font-bold gradient-mix leading-tight">{s.val}</div>
                    <div className="text-xs text-ink-dim mt-1 font-medium">{s.lbl}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="max-w-[480px] mx-auto w-full relative">
              <div className="absolute -top-5 right-5 z-10 bg-[rgba(7,21,37,0.95)] border border-sky-500/20 rounded-xl px-4 py-2.5 text-[11px] font-semibold text-amber-300 shadow-lg whitespace-nowrap animate-float-1">⚡ Live Marketplace</div>
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="bg-[rgba(7,21,37,0.85)] border border-sky-500/15 rounded-[20px] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(14,165,233,0.08)]">
                <div className="flex items-center justify-between mb-5">
                  <div className="text-[13px] font-semibold text-ink-muted">QuantumEdge Dashboard</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-green-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Live
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { lbl: "Active Projects", val: "12", c: "text-sky-400" },
                    { lbl: "Service Requests", val: "8", c: "text-amber-400" },
                    { lbl: "Providers", val: "24", c: "text-green-400" },
                    { lbl: "Products", val: "4", c: "text-purple-400" },
                  ].map((k) => (
                    <div key={k.lbl} className="bg-[rgba(14,32,55,0.8)] border border-white/10 rounded-xl px-3 py-3">
                      <div className="text-[10px] text-ink-dim mb-1">{k.lbl}</div>
                      <div className={`text-xl font-bold ${k.c}`}>{k.val}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-[rgba(14,32,55,0.5)] border border-white/10 rounded-xl p-4 mb-3 h-[120px]">
                  <div className="text-[11px] text-ink-dim mb-2">Marketplace Activity</div>
                  <div className="flex items-end gap-1 h-20">
                    {dashBars.map((v, i) => (
                      <div key={i} className={`flex-1 rounded-t ${i % 3 === 2 ? "bg-gradient-to-t from-amber-400 to-amber-400/30" : "bg-gradient-to-t from-sky-500 to-sky-500/30"}`} style={{ height: `${v * 0.8}%` }} />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-sky-500/10 to-amber-400/5 border border-sky-500/20 rounded-xl p-3.5">
                    <div className="text-[10px] text-amber-400 font-semibold tracking-wider mb-1">🤖 SMART MATCH</div>
                    <div className="text-[11px] text-ink-muted leading-relaxed">3 new requests matched with verified providers.</div>
                  </div>
                  <div className="bg-[rgba(14,32,55,0.6)] border border-white/10 rounded-xl p-3.5 space-y-2">
                    {[{ n: "Active", v: "94%" }, { n: "Online", v: "100%" }, { n: "Matched", v: "88%" }].map((p) => (
                      <div key={p.n}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-ink-muted">{p.n}</span>
                          <span className="text-sky-300 font-semibold">{p.v}</span>
                        </div>
                        <div className="h-[3px] bg-sky-400/10 rounded-sm overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-sky-600 to-sky-300" style={{ width: p.v }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
              <div className="absolute bottom-[30px] -left-5 z-10 bg-[rgba(7,21,37,0.95)] border border-sky-500/20 rounded-xl px-4 py-2.5 text-[11px] font-semibold text-green-400 shadow-lg whitespace-nowrap animate-float-2">✅ Verified Providers</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="py-12 border-y border-white/10 bg-[rgba(5,15,30,0.5)]">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <div className="text-center text-xs text-ink-dim font-semibold tracking-widest uppercase mb-8">Trusted by Growing Businesses</div>
          <div className="overflow-hidden fade-mask-x">
            <div className="flex gap-16 animate-scroll-x w-max">
              {[...trustLogos, ...trustLogos].map((l, i) => (
                <div key={i} className="text-[15px] font-bold text-ink-dim whitespace-nowrap flex items-center gap-2">
                  <span className="text-sky-600 text-lg">◆</span>{l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="relative py-28 overflow-hidden">
        <div className="grid-bg" />
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">What We Build</span>
            <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-bold mb-4">Professional <span className="gradient-sky">Development Services</span></h2>
            <p className="text-[1.05rem] text-ink-muted max-w-[560px]">From custom applications to AI solutions — we deliver technology that drives real business outcomes.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 3) * 0.1 }} className="group relative bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-[20px] p-8 transition-all hover:border-sky-400/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <div className="w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-sky-500/15 to-amber-400/10 border border-sky-400/20 flex items-center justify-center mb-5 text-[22px] group-hover:scale-110 transition-transform">{s.icon}</div>
                <h3 className="text-[1.1rem] font-bold mb-2.5">{s.title}</h3>
                <p className="text-[0.9rem] text-ink-muted leading-relaxed mb-4">{s.desc}</p>
                <ul className="list-none flex flex-col gap-1.5">
                  {s.features.map((f) => (
                    <li key={f} className="text-[0.82rem] text-ink-dim flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />{f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="products" className="py-28 relative overflow-hidden">
        <div className="grid-bg" />
        <div className="absolute w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/8 blur-[100px] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-[5%] relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">Our Products</span>
            <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-bold mb-4">Quantum <span className="gradient-sky">Software Suite</span></h2>
            <p className="text-[1.05rem] text-ink-muted max-w-[600px] mx-auto">Ready-to-use products built by our team — affordable, reliable, and made for Indian businesses.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className={`group relative bg-[rgba(7,21,37,0.8)] border ${p.border} rounded-[20px] p-8 transition-all hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.color} border ${p.border} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>{p.icon}</div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${p.status === "Live" ? "bg-green-500/15 text-green-300 border border-green-500/30" : "bg-amber-500/15 text-amber-300 border border-amber-500/30"}`}>
                      {p.status === "Live" ? "● " : "○ "}{p.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold mb-2">{p.name}</h3>
                  <p className={`text-sm font-semibold ${p.accent} mb-4`}>{p.tagline}</p>
                  <p className="text-[0.9rem] text-ink-muted leading-relaxed mb-5">{p.desc}</p>
                  <ul className="list-none flex flex-col gap-2 mb-6">
                    {p.features.map((f) => (
                      <li key={f} className="text-[0.85rem] text-ink-dim flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${p.accentBg}`} />{f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3 flex-wrap">
                    <button disabled={p.status !== "Live"} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${p.status === "Live" ? "bg-gradient-to-br from-sky-500 to-sky-600 text-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(14,165,233,0.4)]" : "bg-white/5 text-ink-dim cursor-not-allowed border border-white/10"}`}>
                      {p.status === "Live" ? "▶ View Demo" : "Notify Me"}
                    </button>
                    <button onClick={() => setOpenForm("service")} className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-sky-400/30 text-sky-300 hover:bg-sky-400/10 hover:border-sky-400 transition-all">Contact Sales</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section id="industries" className="py-28 bg-gradient-to-b from-bg to-bg-alt">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">Industries We Serve</span>
            <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-bold mb-4">Solutions for <span className="gradient-gold">Every Business</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((ind, i) => (
              <motion.div key={ind.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 3) * 0.1 }} className="group relative bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-[20px] p-8 hover:border-sky-500/25 hover:-translate-y-1 transition-all overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-600 to-amber-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                <div className="text-[2.2rem] mb-4">{ind.icon}</div>
                <h3 className="text-[1.05rem] font-bold mb-2">{ind.title}</h3>
                <p className="text-[0.88rem] text-ink-muted leading-relaxed">{ind.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY ── */}
      <section id="technology" className="py-28 bg-bg-alt relative">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">Our Stack</span>
            <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-bold mb-4">Built on <span className="gradient-sky">Modern Technology</span></h2>
          </motion.div>
          <div className="flex flex-wrap gap-3 mb-10">
            {["All", ...Object.keys(techStack)].map((c) => (
              <button key={c} onClick={() => setActiveTech(c)} className={`px-[18px] py-2 rounded-full text-[13px] font-semibold transition-all border ${activeTech === c ? "bg-sky-400/15 border-sky-400 text-sky-300" : "bg-sky-400/5 border-white/10 text-ink-muted hover:bg-sky-400/10 hover:border-sky-400 hover:text-sky-300"}`}>{c}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {showTech.map(({ t, cat }, i) => (
              <motion.div key={`${t}-${activeTech}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.02 }} className="flex items-center gap-2.5 bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-xl px-5 py-2.5 text-[0.88rem] font-semibold hover:border-sky-500/30 hover:-translate-y-1 transition-all">
                <div className={`w-2 h-2 rounded-full ${techColors[cat]}`} />
                {t}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 relative">
        <div className="grid-bg" />
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">Why QuantumEdge</span>
            <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-bold">Why Growing Businesses <span className="gradient-sky">Trust Us</span></h2>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              {features.map((f, i) => (
                <motion.div key={f.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group flex gap-6 py-6 border-b border-white/10 last:border-b-0">
                  <div className="w-11 h-11 rounded-full bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sm font-bold text-sky-400 flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-sky-600 group-hover:to-sky-400 group-hover:text-white transition-all">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1.5">{f.title}</h3>
                    <p className="text-[0.88rem] text-ink-muted leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:sticky lg:top-24 bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-[20px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <div className="text-[0.88rem] text-ink-dim mb-6">Our Performance Promise</div>
              {visMetrics.map((m) => (
                <div key={m.name} className="bg-[rgba(14,32,55,0.6)] border border-white/10 rounded-xl p-4 mb-3 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-[0.88rem] text-ink-muted">{m.name}</div>
                    <div className="h-1 bg-sky-400/10 rounded-sm mt-2 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${m.pct}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-sky-600 to-sky-300 rounded-sm" />
                    </div>
                  </div>
                  <div className="text-[1.2rem] font-bold text-sky-300 ml-4">{m.score}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section id="casestudies" className="py-28 bg-gradient-to-b from-bg-alt to-bg">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">Our Work</span>
            <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-bold mb-4">Real <span className="gradient-gold">Projects</span> We've Delivered</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-[20px] overflow-hidden hover:border-sky-400/30 hover:-translate-y-1.5 transition-all">
                <div className="h-[180px] relative bg-gradient-to-br from-sky-500/10 to-amber-400/5 border-b border-white/10 flex items-center justify-center">
                  <div className="text-6xl">{c.icon}</div>
                  <div className="absolute top-4 right-4 bg-[rgba(7,21,37,0.95)] border border-sky-500/25 rounded-lg px-3.5 py-1.5 text-[13px] font-bold text-amber-300">{c.metric}</div>
                </div>
                <div className="p-7">
                  <div className="text-[11px] text-sky-400 font-semibold tracking-widest uppercase mb-2">{c.tag}</div>
                  <h3 className="text-[1.1rem] font-bold mb-2.5">{c.title}</h3>
                  <p className="text-[0.88rem] text-ink-muted leading-relaxed">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section id="process" className="py-28 bg-bg-alt">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">How We Work</span>
            <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-bold mb-4">Our <span className="gradient-sky">Delivery Process</span></h2>
          </motion.div>
          <div className="overflow-x-auto pb-4">
            <div className="flex min-w-max relative px-4">
              <div className="absolute top-7 left-[80px] right-[80px] h-0.5 bg-gradient-to-r from-sky-600 to-amber-400 z-0" />
              {processSteps.map((s, i) => (
                <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group flex flex-col items-center w-[180px] px-4 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-bg-alt border-2 border-sky-600 flex items-center justify-center text-[1.1rem] font-bold text-sky-400 mb-4 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-400 transition-all">
                    {s.n}
                  </div>
                  <h3 className="text-[0.9rem] font-bold text-center mb-1.5">{s.title}</h3>
                  <p className="text-[0.78rem] text-ink-dim text-center leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 bg-bg-alt">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">Testimonials</span>
            <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-bold">Client <span className="gradient-sky">Success Stories</span></h2>
          </motion.div>
          <div className="max-w-[700px] mx-auto bg-[rgba(7,21,37,0.6)] border border-white/10 rounded-[20px] p-12 text-center">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-ink-muted text-lg leading-relaxed">Real client testimonials will appear here as projects are completed.</p>
            <p className="text-ink-dim text-sm mt-4">Want to be our first review? <a href="mailto:hello@quantumedge.io" className="text-sky-400 font-semibold">Share your experience →</a></p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 bg-bg-alt">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">FAQ</span>
            <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-bold">Common <span className="gradient-gold">Questions</span></h2>
          </motion.div>
          <div className="max-w-[760px] mx-auto">
            {faqs.map((f, i) => (
              <div key={i} className="border-b border-white/10">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left bg-transparent border-none py-6 flex justify-between items-center text-base font-semibold text-ink hover:text-sky-300 transition-colors">
                  <span>{f.q}</span>
                  <span className={`w-7 h-7 rounded-full bg-sky-400/10 border border-white/10 flex items-center justify-center text-sky-400 transition-all ${openFaq === i ? "bg-sky-600 text-white border-sky-600 rotate-45" : ""}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="text-[0.92rem] text-ink-muted leading-relaxed pb-6">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" className="relative bg-[linear-gradient(135deg,rgba(14,165,233,0.06)_0%,rgba(2,11,24,1)_50%,rgba(245,158,11,0.04)_100%)] border-y border-white/10">
        <div className="grid-bg" />
        <div className="max-w-[700px] mx-auto px-[5%] text-center py-28">
          <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">Get Started Today</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold mb-4">
            Need a Website, App, or <span className="gradient-sky">Software Solution</span>?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-[1.1rem] text-ink-muted mb-10">Tell us about your project and our team will get back to you quickly.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => setOpenForm("service")} className="bg-gradient-to-br from-sky-500 to-sky-600 text-white px-7 py-3.5 rounded-[10px] text-[15px] font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(14,165,233,0.4)] transition-all">Request a Service</button>
            <button onClick={() => setOpenForm("provider")} className="bg-transparent border border-sky-400/30 text-sky-300 px-7 py-3.5 rounded-[10px] text-[15px] font-semibold hover:bg-sky-400/10 hover:border-sky-400 hover:-translate-y-0.5 transition-all">Become a Provider</button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-bg-alt border-t border-white/10 py-16">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            <div>
              <a href="#hero" className="text-lg font-bold block mb-3"><span className="gradient-sky">QuantumEdge</span> <span className="text-amber-400">Solutions</span></a>
              <p className="text-[0.85rem] text-ink-dim leading-relaxed mb-5">Connecting businesses with technology solutions, software products, and trusted service providers.</p>
              <div className="flex gap-2">
                {["in", "𝕏", "⌥", "▶"].map((s) => <a key={s} href="#" className="w-9 h-9 rounded-lg bg-sky-400/10 border border-white/10 flex items-center justify-center text-sm text-ink-dim hover:bg-sky-400/20 hover:border-sky-400 hover:text-sky-400 transition-all">{s}</a>)}
              </div>
            </div>
            {[
              { t: "Services", l: ["Custom Software", "AI & ML", "Cloud & DevOps", "Cybersecurity", "Automation", "IT Consulting"] },
              { t: "Products", l: ["Quantum Shop", "Quantum Expense", "Quantum Connect", "Quantum Suite"] },
              { t: "Company", l: ["About", "Projects", "Careers", "Partners", "Blog", "Contact"] },
            ].map((c) => (
              <div key={c.t}>
                <div className="text-[0.82rem] font-bold text-ink tracking-wider uppercase mb-4">{c.t}</div>
                <ul className="list-none flex flex-col gap-2">
                  {c.l.map((x) => <li key={x}><a href="#" className="text-[0.85rem] text-ink-dim hover:text-sky-300 transition-colors">{x}</a></li>)}
                </ul>
              </div>
            ))}
            <div>
              <div className="text-[0.82rem] font-bold text-ink tracking-wider uppercase mb-4">Newsletter</div>
              <p className="text-[0.85rem] text-ink-dim leading-relaxed mb-3">Monthly tech insights.</p>
              <form onSubmit={(e) => { e.preventDefault(); setNewsletterEmail(""); }} className="flex gap-2">
                <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Your email" className="flex-1 min-w-0 bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-lg px-3 py-2 text-ink text-[0.85rem] outline-none focus:border-sky-400 placeholder:text-ink-dim" />
                <button type="submit" className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg px-4 py-2 text-white text-[0.85rem] font-semibold">→</button>
              </form>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-[0.82rem] text-ink-dim">© 2026 QuantumEdge Solutions. All rights reserved.</div>
            <div className="flex gap-5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => <a key={l} href="#" className="text-[0.82rem] text-ink-dim hover:text-sky-300 transition-colors">{l}</a>)}
            </div>
          </div>
        </div>
      </footer>

      {/* ── FORM MODALS ── */}
      <AnimatePresence>
        {openForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={closeModal}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#071525] border border-white/10 rounded-2xl max-w-2xl w-full my-8" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#071525] rounded-t-2xl z-10">
                <div>
                  <h2 className="text-2xl font-bold">
                    {openForm === "service" ? "Request a Service" : "Become a Provider"}
                  </h2>
                  <p className="text-sm text-ink-muted mt-1">
                    {openForm === "service" ? "Tell us about your project" : "Join our network of verified professionals"}
                  </p>
                </div>
                <button onClick={closeModal} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl">×</button>
              </div>

              {openForm === "service" && (
                serviceSuccess ? (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold mb-3 text-green-300">Thank you. Your request has been received.</h3>
                    <p className="text-ink-muted mb-6">Our team will get back to you within 24 hours.</p>
                    <button onClick={closeModal} className="bg-gradient-to-br from-sky-500 to-sky-600 text-white px-6 py-3 rounded-lg font-semibold">Close</button>
                  </div>
                ) : (
                  <form onSubmit={handleServiceSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">Name *</label>
                        <input type="text" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} className={`w-full bg-[rgba(7,21,37,0.8)] border ${serviceErrors.name ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400`} placeholder="Your full name" />
                        {serviceErrors.name && <p className="text-red-400 text-xs mt-1">{serviceErrors.name}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">Business Name</label>
                        <input type="text" value={serviceForm.business} onChange={(e) => setServiceForm({ ...serviceForm, business: e.target.value })} className="w-full bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400" placeholder="Your company" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">Email *</label>
                        <input type="email" value={serviceForm.email} onChange={(e) => setServiceForm({ ...serviceForm, email: e.target.value })} className={`w-full bg-[rgba(7,21,37,0.8)] border ${serviceErrors.email ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400`} placeholder="you@email.com" />
                        {serviceErrors.email && <p className="text-red-400 text-xs mt-1">{serviceErrors.email}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">Phone *</label>
                        <input type="tel" value={serviceForm.phone} onChange={(e) => setServiceForm({ ...serviceForm, phone: e.target.value })} className={`w-full bg-[rgba(7,21,37,0.8)] border ${serviceErrors.phone ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400`} placeholder="+91 98765 43210" />
                        {serviceErrors.phone && <p className="text-red-400 text-xs mt-1">{serviceErrors.phone}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">Service Needed *</label>
                        <select value={serviceForm.service} onChange={(e) => setServiceForm({ ...serviceForm, service: e.target.value })} className={`w-full bg-[rgba(7,21,37,0.8)] border ${serviceErrors.service ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400`}>
                          <option value="">Select a service</option>
                          {services.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
                        </select>
                        {serviceErrors.service && <p className="text-red-400 text-xs mt-1">{serviceErrors.service}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">Budget</label>
                        <select value={serviceForm.budget} onChange={(e) => setServiceForm({ ...serviceForm, budget: e.target.value })} className="w-full bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400">
                          <option value="">Select range</option>
                          <option>Under ₹50,000</option>
                          <option>₹50,000 – ₹2,00,000</option>
                          <option>₹2,00,000 – ₹5,00,000</option>
                          <option>₹5,00,000+</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">Project Details</label>
                      <textarea value={serviceForm.message} onChange={(e) => setServiceForm({ ...serviceForm, message: e.target.value })} rows={4} className="w-full bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400 resize-none" placeholder="Tell us about your project..." />
                      {serviceErrors.message && <p className="text-red-400 text-xs mt-1">{serviceErrors.message}</p>}
                    </div>
                    <button type="submit" disabled={serviceLoading} className="w-full bg-gradient-to-br from-sky-500 to-sky-600 text-white px-6 py-3.5 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(14,165,233,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                      {serviceLoading ? "Submitting..." : "Submit Request"}
                    </button>
                  </form>
                )
              )}

              {openForm === "provider" && (
                providerSuccess ? (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold mb-3 text-green-300">Thank you. Your request has been received.</h3>
                    <p className="text-ink-muted mb-6">Our team will verify your profile and contact you within 48 hours.</p>
                    <button onClick={closeModal} className="bg-gradient-to-br from-sky-500 to-sky-600 text-white px-6 py-3 rounded-lg font-semibold">Close</button>
                  </div>
                ) : (
                  <form onSubmit={handleProviderSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">Name *</label>
                        <input type="text" value={providerForm.name} onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })} className={`w-full bg-[rgba(7,21,37,0.8)] border ${providerErrors.name ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400`} placeholder="Your full name" />
                        {providerErrors.name && <p className="text-red-400 text-xs mt-1">{providerErrors.name}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">Email *</label>
                        <input type="email" value={providerForm.email} onChange={(e) => setProviderForm({ ...providerForm, email: e.target.value })} className={`w-full bg-[rgba(7,21,37,0.8)] border ${providerErrors.email ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400`} placeholder="you@email.com" />
                        {providerErrors.email && <p className="text-red-400 text-xs mt-1">{providerErrors.email}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">Phone</label>
                        <input type="tel" value={providerForm.phone} onChange={(e) => setProviderForm({ ...providerForm, phone: e.target.value })} className="w-full bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400" placeholder="+91 98765 43210" />
                      </div>
                      <div>
                        <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">Experience</label>
                        <select value={providerForm.experience} onChange={(e) => setProviderForm({ ...providerForm, experience: e.target.value })} className="w-full bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400">
                          <option value="">Select</option>
                          <option>Less than 1 year</option>
                          <option>1–3 years</option>
                          <option>3–5 years</option>
                          <option>5+ years</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">Skills *</label>
                      <input type="text" value={providerForm.skills} onChange={(e) => setProviderForm({ ...providerForm, skills: e.target.value })} className={`w-full bg-[rgba(7,21,37,0.8)] border ${providerErrors.skills ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400`} placeholder="React, Node.js, AI, etc." />
                      {providerErrors.skills && <p className="text-red-400 text-xs mt-1">{providerErrors.skills}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">Portfolio URL</label>
                      <input type="url" value={providerForm.portfolio} onChange={(e) => setProviderForm({ ...providerForm, portfolio: e.target.value })} className="w-full bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400" placeholder="https://yourportfolio.com" />
                    </div>
                    <div>
                      <label className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-2 block">LinkedIn</label>
                      <input type="url" value={providerForm.linkedin} onChange={(e) => setProviderForm({ ...providerForm, linkedin: e.target.value })} className="w-full bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-sky-400" placeholder="https://linkedin.com/in/yourprofile" />
                    </div>
                    <button type="submit" disabled={providerLoading} className="w-full bg-gradient-to-br from-sky-500 to-sky-600 text-white px-6 py-3.5 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(14,165,233,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                      {providerLoading ? "Submitting..." : "Submit Application"}
                    </button>
                  </form>
                )
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
