import danielPorro from "@/assets/testimonials/daniel-porro.webp";
import andreaDallan from "@/assets/testimonials/andrea-dallan.webp";
import fabrizioMarino from "@/assets/testimonials/fabrizio-marino.webp";
import giacomoBrandi from "@/assets/testimonials/giacomo-brandi.webp";
import massimoUsai from "@/assets/testimonials/massimo-usai.webp";
import michelangeloMunarini from "@/assets/testimonials/michelangelo-munarini.webp";
import nicolaSerafini from "@/assets/testimonials/nicola-serafini.webp";

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  image: ImageMetadata;
};

export function getTestimonials(language: "it" | "en"): Testimonial[] {
  return language === "it"
    ? [
        {
          quote: "L'unico in Italia a cui affido i lavori dei miei clienti. La sua capacità di elevare le mie parole è impeccabile.",
          author: "Daniel Porro",
          role: "Copywriter",
          image: danielPorro,
        },
        {
          quote: "Nelle due settimane di pre-lancio ho quasi raggiunto il break-even. Davide unisce design e strategia.",
          author: "Nicola Serafini",
          role: "Copywriter Senior",
          image: nicolaSerafini,
        },
        {
          quote: "Davide è riuscito a combinare perfettamente graphic design e strategia. Ogni elemento visivo aveva senso anche senza spiegazioni.",
          author: "Massimo Usai",
          role: "Imprenditore",
          image: massimoUsai,
        },
        {
          quote: "Risultato altamente professionale che riflette la cura dei nostri servizi.",
          author: "Andrea Dallan",
          role: "CEO Dallan S.p.a.",
          image: andreaDallan,
        },
        {
          quote: "Non potrei immaginare di affidare i miei materiali a nessun altro designer al mondo.",
          author: "Fabrizio Marino",
          role: "3D4Steel",
          image: fabrizioMarino,
        },
        {
          quote: "Design strategico che parla direttamente al cliente. Risultati misurabili fin dal primo giorno.",
          author: "Giacomo Brandi",
          role: "Imprenditore",
          image: giacomoBrandi,
        },
        {
          quote: "Professionalità e attenzione ai dettagli. Il design ha fatto la differenza nei nostri risultati.",
          author: "Michelangelo Munarini",
          role: "Imprenditore",
          image: michelangeloMunarini,
        },
      ]
    : [
        {
          quote: "The only one in Italy I trust with my clients' work. His ability to elevate my words is impeccable.",
          author: "Daniel Porro",
          role: "Copywriter",
          image: danielPorro,
        },
        {
          quote: "In two weeks of pre-launch I almost reached break-even. Davide combines design and strategy.",
          author: "Nicola Serafini",
          role: "Senior Copywriter",
          image: nicolaSerafini,
        },
        {
          quote: "Davide managed to combine graphic design and strategy perfectly. Every visual element made sense even without explanations.",
          author: "Massimo Usai",
          role: "Entrepreneur",
          image: massimoUsai,
        },
        {
          quote: "A highly professional result that reflects the care of our services.",
          author: "Andrea Dallan",
          role: "CEO Dallan S.p.a.",
          image: andreaDallan,
        },
        {
          quote: "I couldn't imagine entrusting my materials to any other designer in the world.",
          author: "Fabrizio Marino",
          role: "3D4Steel",
          image: fabrizioMarino,
        },
        {
          quote: "Strategic design that speaks directly to the customer. Measurable results from day one.",
          author: "Giacomo Brandi",
          role: "Entrepreneur",
          image: giacomoBrandi,
        },
        {
          quote: "Professionalism and attention to detail. The design made the difference in our results.",
          author: "Michelangelo Munarini",
          role: "Entrepreneur",
          image: michelangeloMunarini,
        },
      ];
}
