"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── DATA ──
const services = [
  { id: 1, title: "Custom Software Development", icon: "⚙️", desc: "Bespoke enterprise applications engineered for the unique workflows of food manufacturing.", features: ["ERP & WMS Integrations", "Compliance Automation", "Real-Time Analytics", "API-First Architecture"] },
  { id: 2, title: "AI & Machine Learning", icon: "🤖", desc: "Predictive quality control, demand forecasting, and intelligent automation.", features: ["Quality Inspection AI", "Demand Forecasting", "Yield Optimization", "NLP Document Processing"] },
  { id: 3, title: "Cloud & DevOps", icon: "☁️", desc: "Scalable cloud infrastructure on AWS, Azure, and GCP with 99.99% uptime.", features: ["Multi-Cloud Architecture", "CI/CD Pipelines", "Kubernetes Orchestration", "Disaster Recovery"] },
  { id: 4, title: "Business Automation", icon: "⚡", desc: "Eliminate manual bottlenecks across procurement, scheduling, and reporting.", features: ["RPA & Workflow Engines", "EDI Integration", "Auto-Reporting", "Process Mining"] },
  { id: 5, title: "ERP Integration", icon: "🔗", desc: "Seamless integration with SAP, Oracle, and Microsoft Dynamics.", features: ["SAP S/4HANA", "Oracle Cloud ERP", "Microsoft Dynamics", "Custom Connectors"] },
  { id: 6, title: "Cybersecurity Solutions", icon: "🛡️", desc: "Enterprise-grade security frameworks for regulated food environments.", features: ["ISO 27001 Compliance", "Zero-Trust Architecture", "SIEM & Monitoring", "Penetration Testing"] },
];

const industries = [
  { id: 1, icon: "🏭", title: "Food Processing", desc: "End-to-end MES, SCADA integration, and traceability systems." },
  { id: 2, icon: "🥐", title: "Bakery & Confectionery", desc: "Recipe management, batch control, and allergen tracking." },
  { id: 3, icon: "🥛", title: "Dairy & Beverage", desc: "Cold-chain monitoring, pasteurization, and shelf-life optimization." },
  { id: 4, icon: "🚛", title: "Supply Chain & Logistics", desc: "Real-time fleet visibility and warehouse automation." },
  { id: 5, icon: "🍽️", title: "Restaurants & Hospitality", desc: "POS integration, KDS, and multi-site analytics." },
  { id: 6, icon: "🚀", title: "FoodTech Startups", desc: "Rapid MVP development and scalable infrastructure." },
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
  Frontend: "bg-sky-400", Backend: "bg-gold-400", Cloud: "bg-green-400",
  Database: "bg-purple-400", DevOps: "bg-green-400", AI: "bg-gold-400",
};

const features = [
  { id: 1, title: "Enterprise Architecture", desc: "Scalable, microservices-based systems built for millions of transactions per day." },
  { id: 2, title: "AI-Driven Insights", desc: "Embedded ML models that turn operational data into competitive intelligence." },
  { id: 3, title: "Scalable Infrastructure", desc: "Auto-scaling cloud architecture that grows with your business." },
  { id: 4, title: "Deep Industry Expertise", desc: "We understand HACCP, FDA compliance, and food-grade requirements." },
  { id: 5, title: "Rapid Delivery", desc: "Agile sprints and CI/CD mean working software in weeks, not quarters." },
  { id: 6, title: "24/7 Enterprise Support", desc: "Dedicated success managers with 99.9% uptime guarantee." },
];

const visMetrics = [
  { name: "Time to Delivery", score: "3.2×", pct: 85 },
  { name: "System Uptime", score: "99.9%", pct: 99 },
  { name: "ROI within 12 months", score: "340%", pct: 90 },
  { name: "Client Retention Rate", score: "96%", pct: 96 },
];

const caseStudies = [
  { id: 1, icon: "📦", metric: "45% Efficiency ↑", tag: "Manufacturing", title: "Inventory Management Platform", desc: "Rebuilt a legacy warehouse system with real-time RFID tracking." },
  { id: 2, icon: "🔬", metric: "60% Inspection ↓", tag: "AI & Quality", title: "AI Quality Monitoring System", desc: "Computer vision models on the production line to automate defect detection." },
  { id: 3, icon: "📊", metric: "35% Cost Savings", tag: "Analytics", title: "Food Distribution Analytics", desc: "Unified data warehouse consolidating 17 data sources." },
];

const processSteps = [
  { n: "01", title: "Discovery", desc: "Stakeholder interviews, process mapping, technical audit" },
  { n: "02", title: "Strategy", desc: "Architecture design, roadmap, investment planning" },
  { n: "03", title: "Design", desc: "UX prototypes, data models, API contracts" },
  { n: "04", title: "Development", desc: "Agile sprints, code review, automated testing" },
  { n: "05", title: "Deployment", desc: "CI/CD pipeline, staging, production launch" },
  { n: "06", title: "Optimization", desc: "Performance tuning, analytics, continuous improvement" },
];

const testimonials = [
  { name: "Sarah Chen", company: "Pacific Foods Group", quote: "Delivered an ERP integration that our previous vendor said was impossible. We went live 3 weeks ahead of schedule.", initials: "SC" },
  { name: "Raj Patel", company: "Heritage Dairy Ltd.", quote: "The AI quality system has transformed our production floor. We've reduced waste by 28% in the first quarter.", initials: "RP" },
  { name: "Maria González", company: "Sunrise Bakeries", quote: "The platform handles 4x our original volume without any changes.", initials: "MG" },
  { name: "James Whitfield", company: "GlobalFresh Logistics", quote: "They think like a business partner, not a vendor.", initials: "JW" },
  { name: "Aiko Tanaka", company: "Umami Foods Corp.", quote: "From discovery to go-live in 14 weeks. The predictive engine cut our overstock by 40%.", initials: "AT" },
  { name: "David Osei", company: "Accra Grain Holdings", quote: "Zero downtime, full data integrity, and our IT costs dropped 32% year-over-year.", initials: "DO" },
];

const faqs = [
  { q: "What industries do you serve?", a: "We specialize in food technology and manufacturing — processing, bakery, dairy, beverage, supply chain, distribution, restaurants, and FoodTech startups." },
  { q: "How long does a typical enterprise project take?", a: "A focused module takes 6–10 weeks. A full ERP or AI platform ranges from 4–12 months. We start with a 2-week discovery sprint." },
  { q: "Do you work with our existing technology stack?", a: "Yes. We're stack-agnostic with deep integration experience in SAP, Oracle, Microsoft Dynamics, Salesforce, and more." },
  { q: "What does your pricing model look like?", a: "Fixed-scope for defined deliverables, retainers for ongoing work. Enterprise projects typically start at $50K." },
  { q: "Do you offer post-launch support?", a: "All projects include 90-day hypercare. We offer tiered SLA contracts up to 24/7 with sub-1-hour response." },
  { q: "How do you handle data security and compliance?", a: "We design to ISO 27001, SOC 2 Type II, and FDA 21 CFR Part 11. Encryption at rest and in transit, RBAC, full audit logging." },
];

const trustLogos = ["PremiumFoods Co.", "AgriTech Ventures", "GlobalFresh", "Heritage Dairy", "Sunrise Group", "Pacific Foods", "Umami Corp.", "ColdChain Plus", "FreshRoute", "NutriScale", "GrainHoldings", "BatchMaster"];

const dashBars = [55, 70, 48, 82, 65, 90, 75, 88, 72, 95, 80, 100];

// ── HOOKS ──
function useScrollY(threshold = 50) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const fn = () => setS(window.scrollY > threshold);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return s;
}

function useCountUp(target: number, start: boolean, duration = 1500) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setV(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setV(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return v;
}

// ── MAIN PAGE ──
export default function Home() {
  const scrolled = useScrollY(50);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTech, setActiveTech] = useState("All");
  const [email, setEmail] = useState("");
  const [countStart, setCountStart] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCountStart(true); }, { threshold: 0.3 });
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const allTechs = useMemo(
    () => Object.entries(techStack).flatMap(([cat, ts]) => ts.map((t) => ({ t, cat }))),
    []
  );
  const showTech = activeTech === "All" ? allTechs : allTechs.filter((x) => x.cat === activeTech);

  const links = [
    { href: "#hero", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#industries", label: "Industries" },
    { href: "#technology", label: "Technology" },
    { href: "#casestudies", label: "Case Studies" },
    { href: "#faq", label: "About" },
    { href: "#cta", label: "Contact" },
  ];

  const v500 = useCountUp(500, countStart);
  const v98 = useCountUp(98, countStart);
  const v50 = useCountUp(50, countStart);

  return (
    <main>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[68px] px-[5%] flex items-center justify-between transition-all duration-300 ${scrolled ? "bg-[rgba(2,11,24,0.92)] border-b border-sky-500/25 shadow-[0_4px_40px_rgba(0,0,0,0.5)]" : "bg-[rgba(2,11,24,0.7)] border-b border-white/10"} backdrop-blur-xl`}>
        <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }} className="font-display text-xl font-bold whitespace-nowrap">
          <span className="gradient-sky">FOODTECH</span> <span className="text-gold-400">DIGITAL</span>
        </a>
        <ul className="hidden lg:flex gap-8 list-none">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={(e) => { e.preventDefault(); scrollTo(l.href); }} className="text-ink-muted text-sm font-medium hover:text-sky-300 transition-colors">{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="hidden lg:block">
          <button onClick={() => scrollTo("#cta")} className="bg-gradient-to-br from-sky-500 to-sky-600 text-white px-[22px] py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(14,165,233,0.35)]">
            Book Consultation
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
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center pt-[68px] overflow-hidden">
        <div className="grid-bg" />
        <div className="absolute w-[600px] h-[600px] -top-[200px] -left-[150px] rounded-full bg-sky-500/15 blur-[80px] pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] top-[10%] -right-[100px] rounded-full bg-gold-400/10 blur-[80px] pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] bottom-[10%] left-[30%] rounded-full bg-sky-600/10 blur-[80px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-[5%] w-full py-20">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-sky-400/10 border border-sky-400/20 rounded-full px-4 py-1.5 text-xs font-semibold text-sky-300 tracking-wider uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse-slow" />Enterprise Digital Transformation
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display font-extrabold text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.1] mb-6">
                Transforming <span className="gradient-sky">Food Businesses</span> Through <span className="gradient-gold">Technology</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-[1.05rem] text-ink-muted max-w-[500px] mb-10 leading-relaxed">
                Enterprise software, AI-powered automation, cloud solutions, and digital transformation built for modern food businesses.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4 flex-wrap mb-10">
                <button onClick={() => scrollTo("#cta")} className="bg-gradient-to-br from-sky-500 to-sky-600 text-white px-7 py-3.5 rounded-[10px] text-[15px] font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(14,165,233,0.4)]">Book Consultation</button>
                <button onClick={() => scrollTo("#services")} className="bg-transparent border border-sky-400/30 text-sky-300 px-7 py-3.5 rounded-[10px] text-[15px] font-semibold transition-all hover:bg-sky-400/10 hover:border-sky-400 hover:-translate-y-0.5">Explore Solutions →</button>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { val: v500, suf: "+", lbl: "Projects Delivered" },
                  { val: v98, suf: "%", lbl: "Client Satisfaction" },
                  { val: v50, suf: "+", lbl: "Enterprise Clients" },
                  { val: "24/7", suf: "", lbl: "Expert Support" },
                ].map((s, i) => (
                  <div key={i} className="bg-[rgba(7,21,37,0.6)] border border-white/10 rounded-xl p-5 hover:border-sky-500/25 transition-colors">
                    <div className="font-display text-[1.9rem] font-bold gradient-mix leading-none">{s.val}{s.suf}</div>
                    <div className="text-xs text-ink-dim mt-1 font-medium">{s.lbl}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="max-w-[480px] mx-auto w-full relative">
              <div className="absolute -top-5 right-5 z-10 bg-[rgba(7,21,37,0.95)] border border-sky-500/20 rounded-xl px-4 py-2.5 text-[11px] font-semibold text-gold-300 shadow-lg whitespace-nowrap animate-float-1">⚡ AI Insight: +12% Yield</div>
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="bg-[rgba(7,21,37,0.85)] border border-sky-500/15 rounded-[20px] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(14,165,233,0.08)]">
                <div className="flex items-center justify-between mb-5">
                  <div className="text-[13px] font-semibold text-ink-muted">Operations Dashboard</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-green-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Live
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { lbl: "Revenue", val: "$2.4M", c: "text-sky-400" },
                    { lbl: "Production", val: "94.2%", c: "text-gold-400" },
                    { lbl: "Quality", val: "99.1", c: "text-green-400" },
                  ].map((k) => (
                    <div key={k.lbl} className="bg-[rgba(14,32,55,0.8)] border border-white/10 rounded-xl px-3 py-3">
                      <div className="text-[10px] text-ink-dim mb-1">{k.lbl}</div>
                      <div className={`font-display text-xl font-bold ${k.c}`}>{k.val}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-[rgba(14,32,55,0.5)] border border-white/10 rounded-xl p-4 mb-3 h-[120px]">
                  <div className="text-[11px] text-ink-dim mb-2">Monthly Revenue</div>
                  <div className="flex items-end gap-1 h-20">
                    {dashBars.map((v, i) => (
                      <div key={i} className={`flex-1 rounded-t ${i % 3 === 2 ? "bg-gradient-to-t from-gold-400 to-gold-400/30" : "bg-gradient-to-t from-sky-500 to-sky-500/30"}`} style={{ height: `${v * 0.8}%` }} />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-sky-500/10 to-gold-400/5 border border-sky-500/20 rounded-xl p-3.5">
                    <div className="text-[10px] text-gold-400 font-semibold tracking-wider mb-1">🤖 AI INSIGHT</div>
                    <div className="text-[11px] text-ink-muted leading-relaxed">Batch #4782 predicted 96.8% quality. Recommend priority.</div>
                  </div>
                  <div className="bg-[rgba(14,32,55,0.6)] border border-white/10 rounded-xl p-3.5 space-y-2">
                    {[{ n: "Efficiency", v: "94%" }, { n: "Uptime", v: "99.9%" }, { n: "On-Time", v: "97%" }].map((p) => (
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
              <div className="absolute bottom-[30px] -left-5 z-10 bg-[rgba(7,21,37,0.95)] border border-sky-500/20 rounded-xl px-4 py-2.5 text-[11px] font-semibold text-green-400 shadow-lg whitespace-nowrap animate-float-2">✅ 99.9% Uptime SLA</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="py-12 border-y border-white/10 bg-[rgba(5,15,30,0.5)]">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <div className="text-center text-xs text-ink-dim font-semibold tracking-widest uppercase mb-8">Trusted by Industry Leaders</div>
          <div className="overflow-hidden fade-mask-x">
            <div className="flex gap-16 animate-scroll-x w-max">
              {[...trustLogos, ...trustLogos].map((l, i) => (
                <div key={i} className="font-display text-[15px] font-bold text-ink-dim whitespace-nowrap flex items-center gap-2">
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
            <h2 className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold mb-4">Enterprise-Grade <span className="gradient-sky">Digital Solutions</span></h2>
            <p className="text-[1.05rem] text-ink-muted max-w-[560px]">From concept to deployment, we engineer platforms that drive measurable business outcomes at scale.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 3) * 0.1 }} className="group relative bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-[20px] p-8 transition-all hover:border-sky-400/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <div className="w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-sky-500/15 to-gold-400/10 border border-sky-400/20 flex items-center justify-center mb-5 text-[22px] group-hover:scale-110 transition-transform">{s.icon}</div>
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

      {/* ── INDUSTRIES ── */}
      <section id="industries" className="py-28 bg-gradient-to-b from-bg to-bg-alt">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">Sectors We Serve</span>
            <h2 className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold mb-4">Deep <span className="gradient-gold">Industry</span> Expertise</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((ind, i) => (
              <motion.div key={ind.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 3) * 0.1 }} className="group relative bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-[20px] p-8 hover:border-sky-500/25 hover:-translate-y-1 transition-all overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-600 to-gold-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
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
            <h2 className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold mb-4">Built on <span className="gradient-sky">Modern Technology</span></h2>
          </motion.div>
          <div className="flex flex-wrap gap-3 mb-10">
            {["All", ...Object.keys(techStack)].map((c) => (
              <button key={c} onClick={() => setActiveTech(c)} className={`px-[18px] py-2 rounded-full text-[13px] font-semibold transition-all border ${activeTech === c ? "bg-sky-400/15 border-sky-400 text-sky-300" : "bg-sky-400/5 border-white/10 text-ink-muted hover:bg-sky-400/10 hover:border-sky-400 hover:text-sky-300"}`}>
                {c}
              </button>
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
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">Why Choose Us</span>
            <h2 className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold">Why Leading Businesses <span className="gradient-sky">Choose Us</span></h2>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              {features.map((f, i) => (
                <motion.div key={f.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group flex gap-6 py-6 border-b border-white/10 last:border-b-0">
                  <div className="w-11 h-11 rounded-full bg-sky-400/10 border border-sky-400/20 flex items-center justify-center font-display text-sm font-bold text-sky-400 flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-sky-600 group-hover:to-sky-400 group-hover:text-white transition-all">
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
              <div className="text-[0.88rem] text-ink-dim mb-6">Performance Benchmark vs. Industry Average</div>
              {visMetrics.map((m) => (
                <div key={m.name} className="bg-[rgba(14,32,55,0.6)] border border-white/10 rounded-xl p-4 mb-3 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-[0.88rem] text-ink-muted">{m.name}</div>
                    <div className="h-1 bg-sky-400/10 rounded-sm mt-2 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${m.pct}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-sky-600 to-sky-300 rounded-sm" />
                    </div>
                  </div>
                  <div className="font-display text-[1.2rem] font-bold text-sky-300 ml-4">{m.score}</div>
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
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">Proven Results</span>
            <h2 className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold mb-4">Case <span className="gradient-gold">Studies</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-[20px] overflow-hidden hover:border-sky-400/30 hover:-translate-y-1.5 transition-all">
                <div className="h-[200px] relative bg-gradient-to-br from-sky-500/10 to-gold-400/5 border-b border-white/10 flex items-center justify-center">
                  <div className="text-6xl">{c.icon}</div>
                  <div className="absolute top-4 right-4 bg-[rgba(7,21,37,0.95)] border border-sky-500/25 rounded-lg px-3.5 py-1.5 font-display text-[13px] font-bold text-gold-300">{c.metric}</div>
                </div>
                <div className="p-7">
                  <div className="text-[11px] text-sky-400 font-semibold tracking-widest uppercase mb-2">{c.tag}</div>
                  <h3 className="text-[1.1rem] font-bold mb-2.5">{c.title}</h3>
                  <p className="text-[0.88rem] text-ink-muted leading-relaxed mb-5">{c.desc}</p>
                  <a href="#" className="text-[0.88rem] font-semibold text-sky-400 hover:gap-2.5 inline-flex items-center gap-1.5 transition-all">Read Case Study →</a>
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
            <h2 className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold mb-4">Our <span className="gradient-sky">Delivery Process</span></h2>
            <p className="text-[1.05rem] text-ink-muted max-w-[560px] mx-auto">A proven six-step methodology refined across 500+ enterprise engagements.</p>
          </motion.div>
          <div className="overflow-x-auto pb-4">
            <div className="flex min-w-max relative px-4">
              <div className="absolute top-7 left-[80px] right-[80px] h-0.5 bg-gradient-to-r from-sky-600 to-gold-400 z-0" />
              {processSteps.map((s, i) => (
                <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group flex flex-col items-center w-[180px] px-4 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-bg-alt border-2 border-sky-600 flex items-center justify-center font-display text-[1.1rem] font-bold text-sky-400 mb-4 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-400 group-hover:shadow-[0_0_24px_rgba(14,165,233,0.4)] transition-all">
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
      <section id="testimonials" className="py-28 bg-bg-alt">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">Client Voices</span>
            <h2 className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold">What Our <span className="gradient-sky">Clients Say</span></h2>
          </motion.div>
        </div>
        <div className="overflow-hidden fade-mask-x">
          <div className="flex gap-6 animate-scroll-x-slow w-max">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="w-[360px] flex-shrink-0 bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-[20px] p-8 relative mx-3">
                <div className="absolute top-6 right-6 flex gap-0.5 text-gold-400 text-sm">★★★★★</div>
                <p className="text-[0.95rem] text-ink-muted leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-600 to-sky-500 flex items-center justify-center font-bold text-sm text-white">{t.initials}</div>
                  <div>
                    <div className="text-[0.9rem] font-bold">{t.name}</div>
                    <div className="text-[0.8rem] text-ink-dim">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 bg-bg-alt">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">FAQ</span>
            <h2 className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold">Common <span className="gradient-gold">Questions</span></h2>
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
          <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-400 mb-4">Start Your Transformation</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-display text-[clamp(2rem,5vw,3.2rem)] font-extrabold mb-4">
            Ready to Build the <span className="gradient-sky">Future</span>?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-[1.1rem] text-ink-muted mb-10">We typically respond within 2 hours.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex gap-4 justify-center flex-wrap">
            <a href="mailto:hello@foodtechdigital.com" className="bg-gradient-to-br from-sky-500 to-sky-600 text-white px-7 py-3.5 rounded-[10px] text-[15px] font-semibold no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(14,165,233,0.4)] transition-all">Schedule Consultation</a>
            <a href="mailto:proposals@foodtechdigital.com" className="bg-transparent border border-sky-400/30 text-sky-300 px-7 py-3.5 rounded-[10px] text-[15px] font-semibold no-underline hover:bg-sky-400/10 hover:border-sky-400 hover:-translate-y-0.5 transition-all">Request Proposal</a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-bg-alt border-t border-white/10 py-16">
        <div className="max-w-[1200px] mx-auto px-[5%]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            <div>
              <a href="#hero" className="font-display text-lg font-bold block mb-3"><span className="gradient-sky">FOODTECH</span> <span className="text-gold-400">DIGITAL</span></a>
              <p className="text-[0.85rem] text-ink-dim leading-relaxed mb-5">Enterprise digital transformation for the food industry.</p>
              <div className="flex gap-2">
                {["in", "𝕏", "⌥", "▶"].map((s) => <a key={s} href="#" className="w-9 h-9 rounded-lg bg-sky-400/10 border border-white/10 flex items-center justify-center text-sm text-ink-dim hover:bg-sky-400/20 hover:border-sky-400 hover:text-sky-400 transition-all">{s}</a>)}
              </div>
            </div>
            {[
              { t: "Services", l: ["Custom Software", "AI & ML", "Cloud & DevOps", "ERP Integration", "Automation", "Cybersecurity"] },
              { t: "Industries", l: ["Food Processing", "Bakery", "Dairy", "Supply Chain", "Restaurants", "FoodTech"] },
              { t: "Company", l: ["About", "Case Studies", "Blog", "Careers", "Partners", "Contact"] },
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
              <p className="text-[0.85rem] text-ink-dim leading-relaxed mb-3">Monthly food tech insights.</p>
              <form onSubmit={(e) => { e.preventDefault(); setEmail(""); }} className="flex gap-2">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="flex-1 min-w-0 bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-lg px-3 py-2 text-ink text-[0.85rem] outline-none focus:border-sky-400 placeholder:text-ink-dim" />
                <button type="submit" className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg px-4 py-2 text-white text-[0.85rem] font-semibold">→</button>
              </form>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-[0.82rem] text-ink-dim">© 2025 FoodTech Digital. All rights reserved.</div>
            <div className="flex gap-5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => <a key={l} href="#" className="text-[0.82rem] text-ink-dim hover:text-sky-300 transition-colors">{l}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
