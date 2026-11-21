import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/work";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Ryan Zhang about product design, interfaces and front-end.",
};

export default function ContactPage() {
  return (
    <section className="wrap closing" style={{ minHeight: "62vh", alignContent: "center" }}>
      <h1 className="t-xl" style={{ maxWidth: "20em", textWrap: "balance" }}>
        The simplest way to start is a short email.
      </h1>
      <p className="muted" style={{ maxWidth: "34em", textWrap: "pretty" }}>
        A few lines about the work and what needs solving is enough. I
        usually reply within one working day.
      </p>
      <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>
        {CONTACT_EMAIL}
      </a>
    </section>
  );
}
