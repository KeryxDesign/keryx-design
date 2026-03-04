import brandiThumbIt from "@/assets/articles/brandi-case-study-it.webp";
import barInvitoThumbIt from "@/assets/articles/bar-invito-case-study-it.webp";
import anubismoThumbIt from "@/assets/articles/anubismo-case-study-it.webp";
import libroCommThumbIt from "@/assets/articles/libro-commercialista-case-study-it.webp";
import manifestoVinoThumbIt from "@/assets/articles/manifesto-vino-case-study-it.webp";
import posterEventoThumbIt from "@/assets/articles/poster-evento-sold-out-case-study-it.webp";
import sostaCamperThumbIt from "@/assets/articles/sosta-camper-case-study-it.webp";
import trifoldThumbIt from "@/assets/articles/trifold-case-study-it.webp";
import victorNoirThumbIt from "@/assets/articles/victor-noir-comic-case-study-it.webp";
import bushoriThumbIt from "@/assets/articles/bushori-case-study-it.webp";
import personalTrainerThumbIt from "@/assets/articles/personal-trainer-it.webp";

import brandiThumbEn from "@/assets/articles/brandi-case-study-en.webp";
import barInvitoThumbEn from "@/assets/articles/bar-invito-case-study-en.webp";
import anubismoThumbEn from "@/assets/articles/anubismo-case-study-en.webp";
import libroCommThumbEn from "@/assets/articles/libro-commercialista-case-study-en.webp";
import manifestoVinoThumbEn from "@/assets/articles/manifesto-vino-case-study-en.webp";
import posterEventoThumbEn from "@/assets/articles/poster-evento-sold-out-case-study-en.webp";
import sostaCamperThumbEn from "@/assets/articles/sosta-camper-case-study-en.webp";
import trifoldThumbEn from "@/assets/articles/trifold-case-study-en.webp";
import victorNoirThumbEn from "@/assets/articles/victor-noir-case-study-en.webp";
import bushoriThumbEn from "@/assets/articles/bushori-case-study-en.webp";
import personalTrainerThumbEn from "@/assets/articles/personal-trainer-en.webp";

export type CaseStudy = {
  slug: string;
  thumbnail: ImageMetadata;
};

export function getCaseStudies(language: "it" | "en"): CaseStudy[] {
  return language === "it"
    ? [
        { slug: "grafica-agenzia-immobiliare-caso-studio", thumbnail: brandiThumbIt },
        { slug: "come-applicare-il-marketing-per-bar-usando-il-design-a-risposta-diretta-il-caso-dellinvito-pieghevole-che-ha-generato-un-1114-di-conversione", thumbnail: barInvitoThumbIt },
        { slug: "600-copie", thumbnail: anubismoThumbIt },
        { slug: "libroincarnato", thumbnail: libroCommThumbIt },
        { slug: "copertina-self-publishing-professionale", thumbnail: manifestoVinoThumbIt },
        { slug: "design-poster-eventi", thumbnail: posterEventoThumbIt },
        { slug: "design-risposta-diretta-listino-sosta-camper", thumbnail: sostaCamperThumbIt },
        { slug: "treante-design-risposta-diretta", thumbnail: trifoldThumbIt },
        { slug: "idea-assurda-120-seguaci", thumbnail: victorNoirThumbIt },
        { slug: "brochure-pubblicitaria-da-record-il-segreto-del-50-di-scansioni-nel-caso-bushori", thumbnail: bushoriThumbIt },
        { slug: "design-risposta-diretta-personal-trainer", thumbnail: personalTrainerThumbIt },
      ]
    : [
        { slug: "case-study-real-estate-flyer", thumbnail: brandiThumbEn },
        { slug: "5441-2", thumbnail: barInvitoThumbEn },
        { slug: "book-600-copies", thumbnail: anubismoThumbEn },
        { slug: "sell-150-copies", thumbnail: libroCommThumbEn },
        { slug: "libro-indipendente-2500-copie", thumbnail: manifestoVinoThumbEn },
        { slug: "5428-2", thumbnail: posterEventoThumbEn },
        { slug: "price-list-redesign", thumbnail: sostaCamperThumbEn },
        { slug: "drd-trifold-redesign-37-leads", thumbnail: trifoldThumbEn },
        { slug: "from-an-absurd-idea-to-120-followers-on-telegram", thumbnail: victorNoirThumbEn },
        { slug: "record-breaking-advertising-brochure", thumbnail: bushoriThumbEn },
        { slug: "1700-euro-personal-trainer", thumbnail: personalTrainerThumbEn },
      ];
}
