import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import type { Referral } from "../../lib/referral";

const BASE_URL = "https://keryxdesign.com/r/";
const SESSION_KEY = "keryx_admin_auth";

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!password.trim()) return;
    setChecking(true);
    setError("");

    const { data, error: err } = await supabase.rpc("verify_admin_password", {
      pwd: password,
    });

    if (err || data !== true) {
      setError("Password errata.");
      setChecking(false);
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");
    onAuth();
  }, [password, onAuth]);

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[hsl(204,96%,10%)] rounded-full flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3 className="font-bold text-[hsl(204,96%,10%)] text-lg">Area riservata</h3>
          <p className="text-sm text-gray-500 mt-1">Inserisci la password per accedere.</p>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Password"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[hsl(204,96%,10%)] placeholder:text-gray-300 focus:border-[hsl(42,87%,55%)] focus:outline-none transition-colors"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={checking}
            className="w-full px-4 py-3 bg-[hsl(204,96%,10%)] text-white font-bold rounded-xl hover:bg-[hsl(204,96%,15%)] transition-all disabled:opacity-50"
          >
            {checking ? "Verifica..." : "Accedi"}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "clicks">("date");

  useEffect(() => {
    fetchReferrals();
  }, []);

  async function fetchReferrals() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("referrals")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) {
      setError("Errore nel caricamento: " + err.message);
      setLoading(false);
      return;
    }

    setReferrals(data || []);
    setLoading(false);
  }

  const sorted = [...referrals].sort((a, b) => {
    if (sortBy === "clicks") return b.clicks - a.clicks;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const totalClicks = referrals.reduce((sum, r) => sum + r.clicks, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-[hsl(42,87%,55%)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchReferrals}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Link generati</p>
          <p className="text-3xl font-bold text-[hsl(204,96%,10%)]">{referrals.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Click totali</p>
          <p className="text-3xl font-bold text-[hsl(204,96%,10%)]">{totalClicks}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 col-span-2 md:col-span-1">
          <p className="text-sm text-gray-500 mb-1">Media click/link</p>
          <p className="text-3xl font-bold text-[hsl(204,96%,10%)]">
            {referrals.length > 0 ? (totalClicks / referrals.length).toFixed(1) : "0"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={fetchReferrals}
          className="text-sm text-gray-500 hover:text-[hsl(204,96%,10%)] transition-colors flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Aggiorna
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Ordina per:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "clicks")}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-[hsl(204,96%,10%)]"
          >
            <option value="date">Data</option>
            <option value="clicks">Click</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {referrals.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400">Nessun link referral generato.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Nome</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Link</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Click</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Creato</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-[hsl(204,96%,10%)]">
                      {r.name}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`${BASE_URL}${r.slug}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[hsl(42,87%,55%)] hover:underline font-mono text-xs"
                      >
                        /r/{r.slug}/
                      </a>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-bold ${
                        r.clicks > 0
                          ? "bg-[hsl(42,87%,55%)]/15 text-[hsl(38,90%,33%)]"
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {r.clicks}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString("it-IT", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReferralAdmin() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  if (!authed) {
    return <LoginGate onAuth={() => setAuthed(true)} />;
  }

  return <Dashboard />;
}
