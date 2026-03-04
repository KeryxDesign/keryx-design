import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: Props) {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="bg-white border border-border rounded-xl px-6 shadow-card"
        >
          <AccordionTrigger className="text-left text-navy font-semibold py-6 hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-navy/80 pb-6 text-left leading-relaxed">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
