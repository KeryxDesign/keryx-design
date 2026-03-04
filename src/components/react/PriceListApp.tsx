import { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  ShoppingCart,
  X,
  Copy,
  Check,
  Tag,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Service {
  id: string;
  name: string;
  description: string;
  priceF: number;
  priceFR: number;
  hasFR: boolean;
  startingFrom?: boolean;
  priceOnRequest?: boolean;
}

interface CartItem {
  serviceId: string;
  name: string;
  fronteRetro: boolean;
  price: number;
  qty: number;
}

interface ServiceCategory {
  label: string;
  services: Service[];
}

interface DiscountOption {
  id: string;
  label: string;
  pct: number;
}

interface Props {
  lang: "en" | "it";
}

/* ------------------------------------------------------------------ */
/*  Data (EN)                                                          */
/* ------------------------------------------------------------------ */
const categoriesEN: ServiceCategory[] = [
  {
    label: "Print",
    services: [
      { id: "flyer-a5", name: "Flyer A5", description: "One sheet. One message. One decision. The A5 flyer is your pocket salesman: designed to stop the eye and drive action, not just look pretty.", priceF: 328.42, priceFR: 422.25, hasFR: true },
      { id: "postcard-a6", name: "Postcard A6", description: "Small in size, precise in impact. The A6 postcard is the ideal format for direct offers, follow-ups, and acquisition campaigns. Every inch works to convert.", priceF: 281.50, priceFR: 328.42, hasFR: true },
      { id: "business-card", name: "Business Card", description: "The first physical contact with your brand. Designed to be kept, not tossed \u2014 with a visual hierarchy that guides the eye toward the next step.", priceF: 168.90, priceFR: 215.82, hasFR: true },
      { id: "trifold", name: "Trifold", description: "Three panels, one sales structure. The trifold brochure follows direct response logic: problem, solution, call to action. Perfect for presentations, sales reps, and retail.", priceF: 469.17, priceFR: 469.17, hasFR: false },
      { id: "envelope", name: "Envelope", description: "The envelope is the first barrier. If it doesn\u2019t get opened, it doesn\u2019t sell. We design envelopes that spark curiosity, build anticipation, and boost open rates for physical mailings.", priceF: 187.67, priceFR: 187.67, hasFR: false },
      { id: "book", name: "Book", description: "A well-designed book isn\u2019t just read \u2014 it\u2019s bought, gifted, and displayed. Editorial layout built for readability, authority, and commercial impact.", priceF: 800, priceFR: 800, hasFR: false, startingFrom: true },
      { id: "magalog", name: "Magalog", description: "The secret weapon of direct mail. The magalog looks like a magazine but reads like a sales letter. High perceived value, high engagement, high returns.", priceF: 1200, priceFR: 1200, hasFR: false, startingFrom: true },
      { id: "sales-letter", name: "Sales Letter", description: "The most tested format in direct marketing history. A letter designed with visual hierarchy, reading rhythm, and psychological triggers that carry the reader all the way to the signature.", priceF: 300, priceFR: 300, hasFR: false, startingFrom: true },
    ],
  },
  {
    label: "Digital",
    services: [
      { id: "mockup", name: "Mockup", description: "Seeing is believing. Realistic mockups turn a file into a tangible product \u2014 essential for presentations, social media, and sales pages.", priceF: 65.68, priceFR: 65.68, hasFR: false },
      { id: "social-post", name: "Social Post / Single Panel", description: "A post that sells, not decorates. Designed with a visual hook, clear hierarchy, and explicit CTA. Direct response applied to social media.", priceF: 140.75, priceFR: 140.75, hasFR: false },
      { id: "websites-landing", name: "Websites & Landing Pages", description: "Not brochure sites. Pages built to convert: persuasive structure, integrated copy and design, every element with a purpose. From first scroll to final action.", priceF: 800, priceFR: 800, hasFR: false, priceOnRequest: true },
    ],
  },
];

const discountsEN: DiscountOption[] = [
  { id: "upfront", label: "Upfront Payment", pct: 10 },
  { id: "existing", label: "Existing Client", pct: 10 },
  { id: "partner", label: "Copy Partner", pct: 20 },
];

/* ------------------------------------------------------------------ */
/*  Data (IT)                                                          */
/* ------------------------------------------------------------------ */
const categoriesIT: ServiceCategory[] = [
  {
    label: "Cartaceo",
    services: [
      { id: "flyer-a5", name: "Flyer A5", description: "Un foglio. Un messaggio. Una decisione. Il flyer A5 \u00e8 il tuo venditore tascabile: progettato per fermare l\u2019occhio e spingere all\u2019azione, non per fare scena.", priceF: 328.42, priceFR: 422.25, hasFR: true },
      { id: "cartolina-a6", name: "Cartolina A6", description: "Piccola nel formato, precisa nel colpo. La cartolina A6 \u00e8 il formato ideale per offerte dirette, follow-up e campagne di acquisizione. Ogni centimetro lavora per convertire.", priceF: 281.50, priceFR: 328.42, hasFR: true },
      { id: "bdv", name: "Biglietto da Visita", description: "Il primo contatto fisico con il tuo brand. Progettato per essere conservato, non buttato \u2014 con una gerarchia visiva che guida l\u2019occhio verso il passo successivo.", priceF: 168.90, priceFR: 215.82, hasFR: true },
      { id: "tre-ante", name: "Tre Ante", description: "Tre pannelli, una struttura di vendita. Il pieghevole tre ante segue la logica del direct response: problema, soluzione, chiamata all\u2019azione. Perfetto per presentazioni, agenti e punti vendita.", priceF: 469.17, priceFR: 469.17, hasFR: false },
      { id: "busta-lettera", name: "Busta Lettera", description: "La busta \u00e8 il primo ostacolo. Se non apre, non vende. Progettiamo buste che incuriosiscono, creano aspettativa e aumentano i tassi di apertura del mailing fisico.", priceF: 187.67, priceFR: 187.67, hasFR: false },
      { id: "libro", name: "Libro", description: "Un libro ben progettato non si legge solo \u2014 si compra, si regala, si espone. Layout editoriale pensato per leggibilit\u00e0, autorevolezza e impatto commerciale.", priceF: 800, priceFR: 800, hasFR: false, startingFrom: true },
      { id: "magalog", name: "Magalog", description: "L\u2019arma segreta del direct mail. Il magalog ha l\u2019aspetto di una rivista, la sostanza di una lettera di vendita. Alta percezione, alto coinvolgimento, alti ritorni.", priceF: 1200, priceFR: 1200, hasFR: false, startingFrom: true },
      { id: "lettera-vendita", name: "Lettera di Vendita", description: "Il formato pi\u00f9 testato nella storia del marketing diretto. Una lettera progettata con gerarchia visiva, ritmo di lettura e trigger psicologici che portano il lettore fino alla firma.", priceF: 300, priceFR: 300, hasFR: false, startingFrom: true },
    ],
  },
  {
    label: "Digitale",
    services: [
      { id: "mockup", name: "Mockup", description: "Vedere per credere. I mockup realistici trasformano un file in un prodotto tangibile \u2014 indispensabili per presentazioni, social e pagine di vendita.", priceF: 65.68, priceFR: 65.68, hasFR: false },
      { id: "pannello", name: "Post Social / Pannello Singolo", description: "Un post che vende, non che decora. Progettato con hook visivo, gerarchia chiara e CTA esplicita. Direct response applicato ai social.", priceF: 140.75, priceFR: 140.75, hasFR: false },
      { id: "siti-landing", name: "Siti Web e Landing Page", description: "Non siti vetrina. Pagine costruite per convertire: struttura persuasiva, copy e design integrati, ogni elemento con uno scopo. Dal primo scroll all\u2019azione finale.", priceF: 800, priceFR: 800, hasFR: false, priceOnRequest: true },
    ],
  },
];

const discountsIT: DiscountOption[] = [
  { id: "anticipato", label: "Pagamento Anticipato", pct: 10 },
  { id: "cliente", label: "Gi\u00e0 cliente", pct: 10 },
  { id: "partner", label: "Copy Partner", pct: 20 },
];

/* ------------------------------------------------------------------ */
/*  i18n strings                                                       */
/* ------------------------------------------------------------------ */
const strings = {
  en: {
    pageTitle: "Price List",
    pageSubtitle: "Prices VAT included. Click",
    pageSubtitleEnd: "to add to your quote.",
    frLabel: "Front / Back",
    fLabel: "Front Only",
    startingFrom: "starting from",
    priceOnRequest: "price on request",
    quoteTitle: "Quote",
    emptyCart: "Add services from the price list",
    discountsLabel: "Discounts",
    subtotal: "Subtotal",
    discountLabel: "Discount",
    total: "Total",
    vatIncluded: "VAT included",
    copyQuote: "Copy Quote",
    copied: "Copied!",
    fbSuffix: "F/B",
    fSuffix: "F",
    clipboardTitle: "Keryx Quote",
    clipboardSubtotal: "Subtotal",
    clipboardDiscounts: "Discounts applied",
    clipboardTotalDiscount: "Total discount",
    clipboardTotal: "Total",
    clipboardVat: "(VAT included)",
    formatLocale: "en-US",
  },
  it: {
    pageTitle: "Listino Prezzi",
    pageSubtitle: "Prezzi IVA inclusa. Clicca",
    pageSubtitleEnd: "per aggiungere al preventivo.",
    frLabel: "Fronte / Retro",
    fLabel: "Solo Fronte",
    startingFrom: "a partire da",
    priceOnRequest: "prezzo su richiesta",
    quoteTitle: "Preventivo",
    emptyCart: "Aggiungi servizi dal listino",
    discountsLabel: "Sconti",
    subtotal: "Subtotale",
    discountLabel: "Sconto",
    total: "Totale",
    vatIncluded: "IVA inclusa",
    copyQuote: "Copia Preventivo",
    copied: "Copiato!",
    fbSuffix: "F/R",
    fSuffix: "F",
    clipboardTitle: "Preventivo Keryx",
    clipboardSubtotal: "Subtotale",
    clipboardDiscounts: "Sconti applicati",
    clipboardTotalDiscount: "Sconto totale",
    clipboardTotal: "Totale",
    clipboardVat: "(IVA inclusa)",
    formatLocale: "it-IT",
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatPrice(n: number, locale: string) {
  return n.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* ------------------------------------------------------------------ */
/*  Inline Toggle Switch (no Radix)                                    */
/* ------------------------------------------------------------------ */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        checked ? "bg-primary" : "bg-border"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function PriceListApp({ lang }: Props) {
  const categories = lang === "it" ? categoriesIT : categoriesEN;
  const discountOptions = lang === "it" ? discountsIT : discountsEN;
  const s = strings[lang];

  const [frOptions, setFrOptions] = useState<Record<string, boolean>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeDiscounts, setActiveDiscounts] = useState<
    Record<string, boolean>
  >({});
  const [copied, setCopied] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* lock body scroll when mobile sheet is open */
  useEffect(() => {
    if (sheetOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen, isMobile]);

  const toggleFR = (id: string) =>
    setFrOptions((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleDiscount = (id: string) =>
    setActiveDiscounts((prev) => ({ ...prev, [id]: !prev[id] }));

  const getPrice = (svc: Service) =>
    frOptions[svc.id] ? svc.priceFR : svc.priceF;

  const addToCart = (svc: Service) => {
    if (svc.priceOnRequest) return;
    const fr = !!frOptions[svc.id];
    const key = `${svc.id}-${fr ? "fr" : "f"}`;
    setCart((prev) => {
      const existing = prev.find((c) => c.serviceId === key);
      if (existing) {
        return prev.map((c) =>
          c.serviceId === key ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [
        ...prev,
        {
          serviceId: key,
          name: svc.hasFR
            ? `${svc.name} ${fr ? s.fbSuffix : s.fSuffix}`
            : svc.name,
          fronteRetro: fr,
          price: fr ? svc.priceFR : svc.priceF,
          qty: 1,
        },
      ];
    });
  };

  const updateQty = (key: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((c) => (c.serviceId === key ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );

  const removeItem = (key: string) =>
    setCart((prev) => prev.filter((c) => c.serviceId !== key));

  const subtotal = cart.reduce((acc, c) => acc + c.price * c.qty, 0);
  const itemCount = cart.reduce((acc, c) => acc + c.qty, 0);

  const appliedDiscounts = discountOptions.filter(
    (d) => activeDiscounts[d.id]
  );
  const totalDiscountPct = appliedDiscounts.reduce(
    (acc, d) => acc + d.pct,
    0
  );
  const discountAmount = subtotal * (totalDiscountPct / 100);
  const total = subtotal - discountAmount;

  const fp = (n: number) => formatPrice(n, s.formatLocale);

  const copyQuote = () => {
    const lines = cart.map(
      (c) => `${c.qty}\u00d7 ${c.name} \u2014 \u20ac${fp(c.price * c.qty)}`
    );
    const discountLines = appliedDiscounts.map(
      (d) => `  \u2212 ${d.label} (${d.pct}%)`
    );
    let text = `${s.clipboardTitle}\n${"—".repeat(24)}\n${lines.join(
      "\n"
    )}\n${"—".repeat(24)}\n${s.clipboardSubtotal}: \u20ac${fp(subtotal)}`;
    if (discountLines.length > 0) {
      text += `\n${s.clipboardDiscounts}:\n${discountLines.join(
        "\n"
      )}\n${s.clipboardTotalDiscount}: \u2212\u20ac${fp(discountAmount)}`;
    }
    text += `\n${s.clipboardTotal}: \u20ac${fp(total)} ${s.clipboardVat}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---------------------------------------------------------------- */
  /*  Cart Content (shared between desktop sidebar & mobile sheet)     */
  /* ---------------------------------------------------------------- */
  const CartContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            {s.emptyCart}
          </p>
        ) : (
          <div className="space-y-3">
            {cart.map((c) => (
              <div
                key={c.serviceId}
                className="bg-secondary/50 rounded-lg p-3"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-foreground text-sm font-medium leading-tight">
                    {c.name}
                  </span>
                  <button
                    onClick={() => removeItem(c.serviceId)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(c.serviceId, -1)}
                      className="h-7 w-7 rounded-md border border-border flex items-center justify-center hover:bg-secondary"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-foreground font-medium w-6 text-center">
                      {c.qty}
                    </span>
                    <button
                      onClick={() => updateQty(c.serviceId, 1)}
                      className="h-7 w-7 rounded-md border border-border flex items-center justify-center hover:bg-secondary"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-primary font-bold">
                    &euro;{fp(c.price * c.qty)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t border-border pt-4 mt-4 space-y-3">
          {/* Discounts */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Tag className="h-3 w-3" /> {s.discountsLabel}
            </p>
            {discountOptions.map((d) => (
              <label
                key={d.id}
                className="flex items-center gap-2 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={!!activeDiscounts[d.id]}
                  onChange={() => toggleDiscount(d.id)}
                  className="h-4 w-4 rounded border-border text-primary accent-primary"
                />
                <span className="text-foreground">{d.label}</span>
                <span className="text-muted-foreground ml-auto">
                  &minus;{d.pct}%
                </span>
              </label>
            ))}
          </div>

          <div className="border-t border-border pt-3 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{s.subtotal}</span>
              <span className="text-foreground">&euro;{fp(subtotal)}</span>
            </div>
            {totalDiscountPct > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {s.discountLabel} (&minus;{totalDiscountPct}%)
                </span>
                <span className="text-coral font-medium">
                  &minus;&euro;{fp(discountAmount)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <span className="text-foreground font-bold text-lg">
                {s.total}
              </span>
              <span className="text-primary font-bold text-xl">
                &euro;{fp(total)}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{s.vatIncluded}</p>
          <button
            onClick={copyQuote}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg h-11 px-6 text-sm transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? s.copied : s.copyQuote}
          </button>
        </div>
      )}
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <>
      <div
        className={`max-w-6xl mx-auto ${!isMobile ? "flex gap-8" : ""}`}
      >
        {/* Services list */}
        <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground text-center lg:text-left mb-4">
            {s.pageTitle}
          </h1>
          <p className="text-center lg:text-left text-muted-foreground mb-10">
            {s.pageSubtitle} <strong>+</strong> {s.pageSubtitleEnd}
          </p>

          <div className="space-y-8">
            {categories.map((cat) => (
              <div key={cat.label}>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-4 uppercase tracking-wide">
                  {cat.label}
                </h2>
                <div className="space-y-3">
                  {cat.services.map((svc) => {
                    const isFR = !!frOptions[svc.id];
                    const price = getPrice(svc);
                    return (
                      <div
                        key={svc.id}
                        className="bg-card border border-border rounded-xl px-5 py-4 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-foreground font-medium truncate">
                              {svc.name}
                            </span>
                            {svc.hasFR && (
                              <label className="flex items-center gap-2 cursor-pointer">
                                <Toggle
                                  checked={isFR}
                                  onChange={() => toggleFR(svc.id)}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {isFR ? s.frLabel : s.fLabel}
                                </span>
                              </label>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              {svc.startingFrom && !svc.priceOnRequest && (
                                <span className="text-xs text-muted-foreground block">
                                  {s.startingFrom}
                                </span>
                              )}
                              {svc.priceOnRequest ? (
                                <span className="text-primary font-bold text-sm">
                                  {s.priceOnRequest}
                                </span>
                              ) : (
                                <span className="text-primary font-bold text-lg">
                                  &euro;{fp(price)}
                                </span>
                              )}
                            </div>
                            {!svc.priceOnRequest && (
                              <button
                                className="h-9 w-9 rounded-full border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                                onClick={() => addToCart(svc)}
                                aria-label={
                                  lang === "it"
                                    ? `Aggiungi ${svc.name}`
                                    : `Add ${svc.name}`
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {svc.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop sidebar cart */}
        {!isMobile && (
          <aside className="w-80 shrink-0 sticky top-28 self-start">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h2 className="text-foreground font-bold text-lg mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" /> {s.quoteTitle}
              </h2>
              <CartContent />
            </div>
          </aside>
        )}
      </div>

      {/* Mobile floating cart button + bottom sheet */}
      {isMobile && (
        <>
          <button
            onClick={() => setSheetOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground h-14 w-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-coral text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Backdrop */}
          {sheetOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setSheetOpen(false)}
            />
          )}

          {/* Sheet */}
          <div
            className={`fixed inset-x-0 bottom-0 z-50 h-[70vh] bg-card rounded-t-2xl shadow-xl transition-transform duration-300 ${
              sheetOpen ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-foreground font-bold text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" /> {s.quoteTitle}
                </h2>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <CartContent />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
