import { useState, useEffect, useCallback } from "react";
import {
  generateSlug,
  findUniqueSlug,
  createReferral,
  getClickCount,
  type Referral,
} from "../../lib/referral";

const STORAGE_KEY = "keryx_referral";
const BASE_URL = "https://keryxdesign.com/r/";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-[hsl(213,50%,20%)] text-white hover:bg-[hsl(213,50%,25%)]"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? "Copiato!" : label}
    </button>
  );
}

export default function ReferralGenerator() {
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "generating" | "generated" | "error">("idle");
  const [referral, setReferral] = useState<Referral | null>(null);
  const [clicks, setClicks] = useState(0);
  const [error, setError] = useState("");

  // Check localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as Referral;
        setReferral(data);
        setState("generated");
        setName(data.name);
      }
    } catch {
      // ignore
    }
  }, []);

  // Poll click count when generated
  useEffect(() => {
    if (state !== "generated" || !referral) return;

    const fetchClicks = async () => {
      const count = await getClickCount(referral.slug);
      setClicks(count);
    };

    fetchClicks();
    const interval = setInterval(fetchClicks, 30_000);
    return () => clearInterval(interval);
  }, [state, referral]);

  const handleGenerate = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      setError("Inserisci il tuo nome e cognome.");
      return;
    }
    if (trimmed.length > 100) {
      setError("Il nome è troppo lungo.");
      return;
    }

    setError("");
    setState("generating");

    try {
      const baseSlug = generateSlug(trimmed);
      if (!baseSlug) {
        setError("Nome non valido. Usa solo lettere e spazi.");
        setState("idle");
        return;
      }

      const slug = await findUniqueSlug(baseSlug);
      const ref = await createReferral(trimmed, slug);

      if (!ref) {
        setError("Errore nella generazione. Riprova tra qualche secondo.");
        setState("idle");
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(ref));
      setReferral(ref);
      setState("generated");
    } catch {
      setError("Errore di connessione. Riprova.");
      setState("idle");
    }
  }, [name]);

  const referralUrl = referral ? `${BASE_URL}${referral.slug}/` : "";

  const messages = referral
    ? {
        whatsapp: `Ciao! Ho fatto fare il mio sito a Davide di Keryx Design ed è venuto incredibile. Se ti serve un sito, con questo link hai €100 di sconto: ${referralUrl}`,
        instagram: `Ehi, se ti serve un sito web professionale ti consiglio Davide di Keryx Design. Con questo link hai €100 di sconto: ${referralUrl}`,
        email: `Ciao,\n\nti scrivo perché ho fatto fare il mio sito a Davide di Keryx Design e il risultato è stato ottimo.\n\nSe ti interessa, con questo link hai €100 di sconto sul sito (€400 invece di €500):\n\n${referralUrl}\n\nNessun obbligo, dai un'occhiata se ti va.`,
      }
    : null;

  return (
    <div className="max-w-2xl mx-auto">
      {state !== "generated" ? (
        /* ── FORM ────────────────────────────────────── */
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
          <h3 className="font-bold text-[hsl(213,50%,20%)] text-xl mb-2">
            Genera il tuo link personale
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Inserisci il tuo nome e cognome. Ti creiamo un link unico da condividere.
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Mario Rossi"
              maxLength={100}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-[hsl(213,50%,20%)] placeholder:text-gray-300 focus:border-[hsl(42,87%,55%)] focus:outline-none transition-colors"
            />
            <button
              onClick={handleGenerate}
              disabled={state === "generating"}
              className="px-6 py-3 bg-[hsl(213,50%,20%)] text-white font-bold rounded-xl hover:bg-[hsl(213,50%,25%)] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {state === "generating" ? "Generazione..." : "Genera il tuo link"}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
        </div>
      ) : (
        /* ── RISULTATO ───────────────────────────────── */
        <div className="space-y-6">
          {/* Link */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <p className="text-sm font-medium text-gray-500 mb-2">Il tuo link referral</p>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <span className="flex-1 font-mono text-[hsl(213,50%,20%)] text-sm md:text-base break-all">
                {referralUrl}
              </span>
              <CopyButton text={referralUrl} label="Copia" />
            </div>

            {/* Click counter */}
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>
                Il tuo link ha ricevuto <strong className="text-[hsl(213,50%,20%)]">{clicks}</strong> click
              </span>
            </div>
          </div>

          {/* Messaggi pre-scritti */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h4 className="font-bold text-[hsl(213,50%,20%)] text-lg mb-1">
              Messaggi pronti da condividere
            </h4>
            <p className="text-sm text-gray-500 mb-6">
              Copia e incolla il messaggio che preferisci.
            </p>

            <div className="space-y-5">
              {/* WhatsApp */}
              <div className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#25D366]"><WhatsAppIcon /></span>
                  <span className="font-semibold text-sm text-[hsl(213,50%,20%)]">WhatsApp</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3 whitespace-pre-wrap">
                  {messages!.whatsapp}
                </p>
                <CopyButton text={messages!.whatsapp} label="Copia messaggio" />
              </div>

              {/* Instagram */}
              <div className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#E4405F]"><InstagramIcon /></span>
                  <span className="font-semibold text-sm text-[hsl(213,50%,20%)]">Instagram DM</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3 whitespace-pre-wrap">
                  {messages!.instagram}
                </p>
                <CopyButton text={messages!.instagram} label="Copia messaggio" />
              </div>

              {/* Email */}
              <div className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-600"><EmailIcon /></span>
                  <span className="font-semibold text-sm text-[hsl(213,50%,20%)]">Email</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3 whitespace-pre-wrap">
                  {messages!.email}
                </p>
                <CopyButton text={messages!.email} label="Copia messaggio" />
              </div>
            </div>
          </div>

          {/* Reset */}
          <div className="text-center">
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setReferral(null);
                setName("");
                setState("idle");
                setClicks(0);
              }}
              className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
            >
              Genera un nuovo link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
