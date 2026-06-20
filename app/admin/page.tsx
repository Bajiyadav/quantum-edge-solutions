"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ────────────── TYPES ──────────────
interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted" | "archived";
  createdAt: string;
}

type StatusFilter = "all" | Lead["status"];

// ────────────── CONSTANTS ──────────────
const STATUS_STYLES: Record<Lead["status"], { bg: string; text: string; label: string }> = {
  new: { bg: "bg-sky-500/15", text: "text-sky-300", label: "New" },
  contacted: { bg: "bg-amber-500/15", text: "text-amber-300", label: "Contacted" },
  qualified: { bg: "bg-purple-500/15", text: "text-purple-300", label: "Qualified" },
  converted: { bg: "bg-green-500/15", text: "text-green-300", label: "Converted" },
  archived: { bg: "bg-slate-500/15", text: "text-slate-400", label: "Archived" },
};

const STATUS_OPTIONS: Lead["status"][] = ["new", "contacted", "qualified", "converted", "archived"];

const FALLBACK_STATUS_STYLE = {
  bg: "bg-slate-500/15",
  text: "text-slate-400",
  label: "Unknown",
};

const VALID_STATUSES = ["new", "contacted", "qualified", "converted", "archived"] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

// ────────────── HELPERS ──────────────
function getStatusStyle(status: string) {
  return (STATUS_STYLES as Record<string, { bg: string; text: string; label: string }>)[status] ?? FALLBACK_STATUS_STYLE;
}

function normalizeLead(raw: any): Lead {
  const status: ValidStatus = VALID_STATUSES.includes(raw?.status) ? raw.status : "new";
  return {
    id: String(raw?.id ?? crypto.randomUUID()),
    name: String(raw?.name ?? "Unknown"),
    email: String(raw?.email ?? ""),
    company: raw?.company ? String(raw.company) : undefined,
    message: String(raw?.message ?? ""),
    status,
    createdAt: raw?.createdAt ?? new Date().toISOString(),
  };
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

function exportCSV(leads: Lead[]) {
  const headers = ["Name", "Email", "Company", "Status", "Message", "Created"];
  const rows = leads.map((l) => [l.name, l.email, l.company || "", l.status, l.message.replace(/"/g, '""'), new Date(l.createdAt).toISOString()]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `leads-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

// ────────────── COMPONENT ──────────────
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"leads" | "providers">("leads");
  const [providers, setProviders] = useState<any[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch leads
  const fetchLeads = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/leads");
      const data = await res.json();

      console.log("API DATA:", data);

      if (data?.success && Array.isArray(data.leads)) {
        setLeads(data.leads.map(normalizeLead));
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error("Fetch Leads Error:", error);
      setLeads([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch providers
  const fetchProviders = async () => {
    try {
      const res = await fetch("/api/providers");
      const data = await res.json();

      console.log("PROVIDERS DATA:", data);

      if (data?.success && Array.isArray(data.providers)) {
        setProviders(data.providers);
      }
    } catch (error) {
      console.error("Fetch Providers Error:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchProviders();
  }, []);

  // Filter
  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.company?.toLowerCase().includes(q) ?? false);
      return matchStatus && matchSearch;
    });
  }, [leads, search, statusFilter]);

  // Stats
  const stats = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      qualified: leads.filter((l) => l.status === "qualified").length,
      converted: leads.filter((l) => l.status === "converted").length,
    }),
    [leads]
  );

  // 🐛 DEBUG
  console.log("LEADS:", leads);
  console.log("FILTERED:", filtered);
  console.log("LOADING:", loading);
  console.log("PROVIDERS:", providers);

  // Update status
  const updateStatus = async (id: string, status: Lead["status"]) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch (error) {
      console.error("Update status error:", error);
    }
  };

  // Delete lead
  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead permanently?")) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelected(null);
    try {
      await fetch("/api/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error("Delete lead error:", error);
    }
  };

  // Delete provider
  const deleteProvider = async (id: string) => {
    if (!confirm("Delete this provider application permanently?")) return;
    setProviders((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch("/api/providers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error("Delete provider error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#020B18] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none grid-bg" />

      <div className="relative max-w-[1400px] mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1 text-xs font-semibold text-sky-300 tracking-wider uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Admin Panel
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold">
              Quantum<span className="gradient-sky">Edge</span> Dashboard
            </h1>

            <p className="text-slate-400 mt-2">
              Manage leads, providers, and monitor growth.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                fetchLeads();
                fetchProviders();
              }}
              disabled={refreshing}
              className="bg-sky-500/10 border border-sky-500/30 text-sky-300 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <span className={refreshing ? "animate-spin" : ""}>↻</span> Refresh
            </button>
            {activeTab === "leads" && (
              <button
                onClick={() => exportCSV(filtered)}
                className="bg-gradient-to-br from-sky-500 to-sky-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:-translate-y-0.5 transition-all"
              >
                ⬇ Export CSV
              </button>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === "leads"
                ? "border-sky-400 text-sky-300"
                : "border-transparent text-slate-400 hover:text-sky-300"
            }`}
          >
            📊 Leads ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab("providers")}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === "providers"
                ? "border-sky-400 text-sky-300"
                : "border-transparent text-slate-400 hover:text-sky-300"
            }`}
          >
            👥 Providers ({providers.length})
          </button>
        </div>

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <>
            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Leads", val: stats.total, c: "from-sky-400 to-sky-500", i: "📊" },
                { label: "New", val: stats.new, c: "from-amber-400 to-amber-500", i: "✨" },
                { label: "Qualified", val: stats.qualified, c: "from-purple-400 to-purple-500", i: "🎯" },
                { label: "Converted", val: stats.converted, c: "from-green-400 to-green-500", i: "✅" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-2xl p-6 hover:border-sky-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{s.i}</span>
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${s.c}`} />
                  </div>
                  <div className={`text-3xl font-extrabold bg-gradient-to-r ${s.c} bg-clip-text text-transparent`}>
                    {s.val}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* FILTERS */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-xl px-4 py-3 pl-11 text-white text-sm outline-none focus:border-sky-400 transition-colors placeholder:text-slate-500"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {(["all", ...STATUS_OPTIONS] as StatusFilter[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      statusFilter === s
                        ? "bg-sky-500/20 border-sky-400 text-sky-300"
                        : "bg-[rgba(7,21,37,0.8)] border-white/10 text-slate-400 hover:border-sky-500/30"
                    }`}
                  >
                    {s === "all" ? "All" : STATUS_STYLES[s].label}
                  </button>
                ))}
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-2xl overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-slate-400">Loading leads...</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <div className="text-5xl mb-3">📭</div>
                  <p>No leads found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[rgba(14,32,55,0.5)] border-b border-white/10">
                      <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4 font-semibold">Contact</th>
                        <th className="px-6 py-4 font-semibold">Company</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Received</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((l, i) => {
                        const s = getStatusStyle(l.status);
                        return (
                          <motion.tr
                            key={l.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                            onClick={() => setSelected(l)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-600 to-sky-500 flex items-center justify-center font-bold text-xs">
                                  {l.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-white">{l.name}</div>
                                  <div className="text-xs text-slate-500">{l.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-300">{l.company || "—"}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}
                              >
                                {s.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-xs">{timeAgo(l.createdAt)}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelected(l);
                                }}
                                className="text-sky-400 hover:text-sky-300 text-xs font-semibold"
                              >
                                View →
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="text-center mt-8 text-xs text-slate-500">
              Showing {filtered.length} of {leads.length} leads
            </div>
          </>
        )}

        {/* PROVIDERS TAB */}
        {activeTab === "providers" && (
          <>
            <div className="bg-[rgba(7,21,37,0.8)] border border-white/10 rounded-2xl overflow-hidden">
              {providers.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <div className="text-5xl mb-3">👥</div>
                  <p>No provider applications yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[rgba(14,32,55,0.5)] border-b border-white/10">
                      <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4 font-semibold">Applicant</th>
                        <th className="px-6 py-4 font-semibold">Skills</th>
                        <th className="px-6 py-4 font-semibold">Experience</th>
                        <th className="px-6 py-4 font-semibold">Received</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {providers.map((p, i) => (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center font-bold text-xs">
                                {p.name
                                  ?.split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase() || "??"}
                              </div>
                              <div>
                                <div className="font-semibold text-white">{p.name || "Unknown"}</div>
                                <div className="text-xs text-slate-500">{p.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-300 text-xs max-w-[300px]">
                            {p.skills || "—"}
                          </td>
                          <td className="px-6 py-4 text-slate-300 text-xs">
                            {p.experience || "—"}
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-xs">
                            {p.createdAt ? timeAgo(p.createdAt) : "—"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <a
                              href={`mailto:${p.email}`}
                              className="text-sky-400 hover:text-sky-300 text-xs font-semibold mr-3"
                            >
                              ✉️ Contact
                            </a>
                            <button
                              onClick={() => deleteProvider(p.id)}
                              className="text-red-400 hover:text-red-300 text-xs font-semibold"
                            >
                              🗑 Delete
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="text-center mt-8 text-xs text-slate-500">
              {providers.length} provider application{providers.length === 1 ? "" : "s"} received
            </div>
          </>
        )}
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#071525] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Lead Details</h2>
                <button
                  onClick={() => setSelected(null)}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-600 to-sky-500 flex items-center justify-center font-bold text-lg">
                    {selected.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xl font-bold">{selected.name}</div>
                    <div className="text-sm text-slate-400">{selected.email}</div>
                    {selected.company && (
                      <div className="text-sm text-slate-500">🏢 {selected.company}</div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Message</div>
                  <div className="bg-[rgba(14,32,55,0.5)] rounded-xl p-4 text-slate-300 text-sm leading-relaxed">
                    {selected.message}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Update Status</div>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selected.status === s
                            ? "bg-sky-500/20 border-sky-400 text-sky-300"
                            : "bg-white/5 border-white/10 text-slate-400 hover:border-sky-500/30"
                        }`}
                      >
                        {STATUS_STYLES[s].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  Received {new Date(selected.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="p-6 border-t border-white/10 flex justify-between">
                <button
                  onClick={() => deleteLead(selected.id)}
                  className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/20 transition-all"
                >
                  🗑 Delete
                </button>
                <a
                  href={`mailto:${selected.email}`}
                  className="bg-gradient-to-br from-sky-500 to-sky-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:-translate-y-0.5 transition-all"
                >
                  ✉️ Reply via Email
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
