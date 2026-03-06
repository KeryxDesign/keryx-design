import { useState, useEffect } from "react";
import { getReferralBySlug, trackClick, type Referral } from "../../lib/referral";
import TestimonialsCarousel from "./TestimonialsCarousel";
import FAQAccordion from "./FAQAccordion";
import CountdownTimer from "./CountdownTimer";

interface Props {
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    imageSrc: string;
  }>;
  davideImgSrc: string;
}

const EXPIRY_DAYS = 21;

const whatsappSvg = (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const checkSvg = (
  <svg className="w-5 h-5 text-[hsl(42,87%,55%)] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const faqs = [
  { question: "E se dopo voglio cambiare qualcosa?", answer: "Nessun problema. Ogni modifica dopo la consegna costa €50 a intervento. Mi scrivi, mi dici cosa cambiare, e lo faccio." },
  { question: "Devo comprare il dominio?", answer: "No. Il dominio (cioè il nome del tuo sito, tipo www.tuonome.it) lo compro io per te. L'unica cosa che devi fare è rinnovarlo ogni anno — costa pochi euro." },
  { question: "Cos'è l'hosting?", answer: "L'hosting è lo \"spazio\" su internet dove sta il tuo sito. Ci penso io, è incluso nel prezzo. Non devi fare niente." },
  { question: "E se non mi piace il risultato?", answer: "Ti ridò tutti i soldi. 100%. Nessuna domanda. Ma in 10 anni non è mai successo." },
  { question: "Quanto ci vuole davvero?", answer: "5 giorni. Ma funziona solo se anche tu rispondi veloce. Se mi mandi le info dopo 2 settimane, i 5 giorni diventano 5 settimane." },
  { question: "Solo una pagina? Non mi servono più pagine?", answer: "Una pagina fatta bene vale più di un sito con 47 pagine che nessuno legge. Una pagina. Chiara. Bella. Che porta clienti. È tutto quello che ti serve." },
];

export default function ReferralLanding({ testimonials, davideImgSrc }: Props) {
  const [state, setState] = useState<"loading" | "found" | "not_found" | "expired">("loading");
  const [referral, setReferral] = useState<Referral | null>(null);

  useEffect(() => {
    const pathname = window.location.pathname;
    const slug = pathname.replace(/^\/r\//, "").replace(/\/$/, "");

    if (!slug) {
      setState("not_found");
      return;
    }

    (async () => {
      const data = await getReferralBySlug(slug);

      if (!data) {
        setState("not_found");
        return;
      }

      // Check expiration
      const expiresAt = new Date(data.created_at);
      expiresAt.setDate(expiresAt.getDate() + EXPIRY_DAYS);
      if (expiresAt < new Date()) {
        setReferral(data);
        setState("expired");
        return;
      }

      setReferral(data);
      setState("found");

      // Track click (once per session)
      const trackingKey = `referral_tracked_${slug}`;
      if (!sessionStorage.getItem(trackingKey)) {
        trackClick(slug);
        sessionStorage.setItem(trackingKey, "1");
      }
    })();
  }, []);

  // ── LOADING ──────────────────────────────────────
  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(40,33%,96%)]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[hsl(42,87%,55%)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[hsl(213,50%,20%)]/60 text-sm">Caricamento...</p>
        </div>
      </div>
    );
  }

  // ── NOT FOUND ────────────────────────────────────
  if (state === "not_found") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(40,33%,96%)]">
        <div className="text-center max-w-md px-6">
          <h1 className="font-bold text-2xl text-[hsl(213,50%,20%)] mb-4">Link non valido</h1>
          <p className="text-[hsl(213,50%,20%)]/60 mb-8">Questo link referral non esiste o è stato rimosso.</p>
          <a href="/it/sitokeryx/" className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(213,50%,20%)] text-white font-bold rounded-xl hover:bg-[hsl(213,50%,25%)] transition-all">
            Vai alla pagina principale &rarr;
          </a>
        </div>
      </div>
    );
  }

  // ── EXPIRED ──────────────────────────────────────
  if (state === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(40,33%,96%)]">
        <div className="text-center max-w-md px-6">
          <h1 className="font-bold text-2xl text-[hsl(213,50%,20%)] mb-4">Sconto scaduto</h1>
          <p className="text-[hsl(213,50%,20%)]/60 mb-2">
            Lo sconto referral di <strong>{referral?.name}</strong> sul Sito Keryx è scaduto.
          </p>
          <p className="text-[hsl(213,50%,20%)]/60 mb-8">Puoi comunque richiedere il Sito Keryx al prezzo standard di €500.</p>
          <a href="/it/sitokeryx/" className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(213,50%,20%)] text-white font-bold rounded-xl hover:bg-[hsl(213,50%,25%)] transition-all">
            Scopri l'offerta &rarr;
          </a>
        </div>
      </div>
    );
  }

  // ── FOUND ────────────────────────────────────────
  const ref = referral!;
  const expiresAt = new Date(ref.created_at);
  expiresAt.setDate(expiresAt.getDate() + EXPIRY_DAYS);

  const whatsappUrl = `https://wa.me/393387445057?text=${encodeURIComponent(
    `Ciao Davide, sono stato consigliato da ${ref.name}. Posso vedere i siti che hai fatto?`
  )}`;

  const WhatsAppCTA = ({ className = "" }: { className?: string }) => (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg px-8 py-5 rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 group ${className}`}
    >
      {whatsappSvg}
      Mandami i siti d'esempio
      <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
    </a>
  );

  return (
    <>
      {/* ═══ TOP BANNER ═══ */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-[hsl(5,70%,55%)] text-white text-center py-2.5 px-4 text-sm font-medium tracking-wide">
        Sei stato consigliato da <strong>{ref.name}</strong> — hai <strong>€103 di sconto</strong> sul Sito Keryx
      </div>

      <div className="pt-10">
        {/* ═══ HERO ═══ */}
        <section className="relative min-h-[80vh] flex items-center" style={{ background: "linear-gradient(135deg, hsl(40,33%,96%) 0%, hsl(40,40%,93%) 100%)" }}>
          <div className="container max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[hsl(42,87%,55%)] mb-5">KERYX DESIGN</p>
            <img
              src={davideImgSrc}
              alt="Davide Filippini — Web Designer"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-7 shadow-xl"
              style={{ outline: "3px solid rgba(240,180,40,0.4)", outlineOffset: "5px" }}
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[hsl(213,50%,20%)] tracking-tight leading-[1.1] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              {ref.name} ti ha riservato €103 di sconto sul Sito Keryx.
            </h1>
            <p className="text-lg md:text-xl text-[hsl(213,50%,20%)]/80 max-w-2xl mx-auto mb-3 leading-relaxed">
              Ti faccio un sito bellissimo che lavora per te. Una pagina. 5 giorni.
            </p>
            <p className="text-lg md:text-xl text-[hsl(213,50%,20%)]/80 max-w-2xl mx-auto mb-6 leading-relaxed">
              <span className="line-through text-[hsl(213,50%,20%)]/40">€500</span>{" "}
              <strong className="text-[hsl(213,50%,20%)] text-3xl">€397</strong>. Tutto incluso.
            </p>

            <CountdownTimer expiresAt={expiresAt} />

            <div className="mt-8">
              <WhatsAppCTA />
            </div>
            <p className="mt-3 text-sm text-[hsl(213,50%,20%)]/50">
              Ti mando subito qualche esempio su WhatsApp. Zero impegno.
            </p>
          </div>
        </section>

        {/* ═══ SOCIAL PROOF ═══ */}
        <section className="bg-[hsl(213,50%,20%)] py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-6">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[hsl(42,87%,55%)] mb-3 text-center">Cosa dicono i miei clienti</p>
            <TestimonialsCarousel testimonials={testimonials} variant="dark" />
          </div>
        </section>

        {/* ═══ IL PROBLEMA ═══ */}
        <section className="bg-[hsl(40,33%,96%)] py-16 md:py-22">
          <div className="container max-w-3xl mx-auto px-6">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[hsl(42,87%,55%)] mb-3">Il problema</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,50%,20%)] tracking-tight mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
              Se non hai un sito, per i tuoi clienti non esisti.
            </h2>
            <div className="space-y-5 text-lg text-[hsl(213,50%,20%)]/80 leading-relaxed">
              <p>Nel 2026 i tuoi clienti cercano tutto online. Il ristorante, l'idraulico, il dentista, il commercialista.</p>
              <p>Oggi le persone chiedono direttamente <strong className="text-[hsl(213,50%,20%)]">all'intelligenza artificiale</strong>. Se il tuo sito non c'è — o è fatto male — <mark className="bg-[hsl(42,87%,55%)]/30 text-[hsl(213,50%,20%)] px-1 rounded">l'AI non ti consiglia a nessuno.</mark></p>
              <p><strong className="text-[hsl(213,50%,20%)]">Se non ti trovano, non esisti.</strong></p>
            </div>
          </div>
        </section>

        {/* ═══ COME LI FACCIO ═══ */}
        <section className="bg-[hsl(213,50%,20%)] text-white py-16 md:py-20">
          <div className="container max-w-3xl mx-auto px-6">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[hsl(42,87%,55%)] mb-3">Il mio approccio</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Come li faccio io.</h2>
            <div className="space-y-5 text-lg text-white/85 leading-relaxed">
              <p>Uso l'intelligenza artificiale per costruire siti in modo veloce e a una <strong className="text-white">frazione del costo</strong>.</p>
              <p>Ma l'AI da sola non basta. La differenza è quello che ci metto sopra:</p>
              <ul className="space-y-4 mt-4">
                {[
                  { bold: "10 anni di marketing", rest: " — so cosa fa vendere e cosa no" },
                  { bold: "Il testo lo scrivo io", rest: " — parole fatte per portarti clienti" },
                  { bold: "Ogni pezzo ha un obiettivo", rest: " — tutto guida il visitatore a contattarti" },
                  { bold: "Il sito è bellissimo", rest: " — perché un sito che funziona deve anche fare una bella figura" },
                  { bold: "Pronto per l'AI", rest: " — ChatGPT, Gemini e le altre AI ti trovano e ti consigliano" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[hsl(42,87%,55%)] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="text-white/85"><strong className="text-white">{item.bold}</strong>{item.rest}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ═══ COME FUNZIONA ═══ */}
        <section className="bg-[hsl(40,40%,93%)] py-20 md:py-28">
          <div className="container max-w-3xl mx-auto px-6">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[hsl(42,87%,55%)] mb-3 text-center">Come funziona</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,50%,20%)] tracking-tight mb-12 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
              5 giorni. Zero complicazioni.
            </h2>
            <div className="space-y-10">
              {[
                { n: "1", title: "Giorno 1: Ci sentiamo", desc: "Chiamata di 20 minuti. Mi racconti cosa fai e chi sono i tuoi clienti." },
                { n: "2", title: "Giorno 2-3: Io scrivo e costruisco", desc: "Il testo lo scrivo io. Il sito lo faccio io. Tu non devi fare niente." },
                { n: "3", title: "Giorno 4-5: Revisione e via", desc: "Applico le modifiche. Il sito va online. Pronto a lavorare per te." },
              ].map((step) => (
                <div key={step.n} className="flex gap-5 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-[hsl(213,50%,20%)] text-white flex items-center justify-center font-bold text-xl">{step.n}</div>
                  <div>
                    <h3 className="text-xl font-bold text-[hsl(213,50%,20%)] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{step.title}</h3>
                    <p className="text-[hsl(213,50%,20%)]/70 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PRICING ═══ */}
        <section className="bg-[hsl(40,33%,96%)] py-20 md:py-28">
          <div className="container max-w-3xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12" style={{ borderTop: "4px solid rgb(240,180,40)" }}>
              <span className="inline-block bg-[hsl(5,70%,55%)] text-white font-semibold tracking-widest uppercase text-xs px-4 py-1.5 rounded-full mb-4">
                Sconto referral di {ref.name} — Sito Keryx
              </span>
              <div className="mb-6">
                <span className="text-gray-400 text-2xl line-through mr-3">€500</span>
                <span className="text-5xl md:text-6xl font-bold text-[hsl(213,50%,20%)]" style={{ fontFamily: "'Playfair Display', serif" }}>€397</span>
              </div>

              <CountdownTimer expiresAt={expiresAt} />

              <ul className="space-y-3 my-8">
                {[
                  "Sito monopagina bellissimo costruito per portarti clienti",
                  "Testo scritto da me — frasi pensate per vendere",
                  "Perfetto da computer, telefono e tablet",
                  "Dominio incluso — lo compro io per te",
                  "Hosting incluso — non devi preoccuparti di nulla",
                  "Pronto per l'intelligenza artificiale",
                  "Consegna in 5 giorni",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    {checkSvg}
                    <span className="text-[hsl(213,50%,20%)]/80 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <WhatsAppCTA className="w-full text-center" />

              <div className="mt-8 p-5 bg-[hsl(40,40%,93%)] rounded-lg border border-gray-200 text-center">
                <p className="text-lg font-bold text-[hsl(213,50%,20%)] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>100% soddisfatto o rimborsato.</p>
                <p className="text-sm text-[hsl(213,50%,20%)]/70 leading-relaxed">
                  Se il sito finito non ti convince, ti ridò i soldi. Tutti. Senza domande.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="bg-[hsl(40,40%,93%)] py-20 md:py-28">
          <div className="container max-w-3xl mx-auto px-6">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[hsl(42,87%,55%)] mb-3 text-center">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(213,50%,20%)] tracking-tight mb-10 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
              Domande frequenti
            </h2>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* ═══ CTA FINALE ═══ */}
        <section className="bg-[hsl(213,50%,20%)] text-white py-20 md:py-28">
          <div className="container max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Non ti sto vendendo nulla.
            </h2>
            <p className="text-xl text-white/80 leading-relaxed mb-4 max-w-2xl mx-auto">
              Chiedimi gli esempi su WhatsApp. Vedi i siti, decidi tu.
            </p>
            <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
              Se sì, <strong className="text-[hsl(42,87%,55%)]">in 5 giorni hai un sito bellissimo che lavora per te.</strong><br />
              Se no, nessun problema.
            </p>
            <WhatsAppCTA />
            <p className="mt-6 text-white/40 text-sm">Ti rispondo personalmente entro poche ore.</p>
          </div>
        </section>
      </div>
    </>
  );
}
