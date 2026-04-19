import type { Metadata } from "next";
import { MetaLabel } from "@/components/ui/MetaLabel";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Ryan Zhang — design and front-end for hire.",
};

const CONTACT_EMAIL = "ryan.runsheng@gmail.com";

const channels = [
  {
    label: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    note: "Fastest — typical reply within one working day.",
  },
  {
    label: "LinkedIn",
    value: "/in/ — TODO",
    href: "https://www.linkedin.com/in/",
    note: "Professional background and references.",
    external: true,
  },
  {
    label: "Upwork",
    value: "Coming soon",
    href: null as string | null,
    note: "Profile going live alongside EAD.",
  },
];

export default function ContactPage() {
  return (
    <div className="pt-16 md:pt-24 pb-24">
      <section className="container-page px-6 md:px-10 max-w-4xl">
        <MetaLabel as="p" className="mb-6">
          Contact
        </MetaLabel>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.04]">
          The simplest way to start is a short email.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-[color:var(--color-muted)] max-w-2xl leading-relaxed">
          Tell me what you&apos;re building, what&apos;s getting in the way,
          and what success looks like. I&apos;ll reply with a concrete next
          step — not a discovery call template.
        </p>

        <ul className="mt-16 divide-y divide-[color:var(--color-hairline)] border-y border-[color:var(--color-hairline)]">
          {channels.map((channel) => (
            <li
              key={channel.label}
              className="py-6 md:py-8 flex flex-col md:flex-row md:items-center md:gap-8"
            >
              <div className="md:w-40">
                <MetaLabel>{channel.label}</MetaLabel>
              </div>
              <div className="flex-1 mt-2 md:mt-0">
                {channel.href ? (
                  <a
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    className="link-klein text-xl md:text-2xl font-medium"
                  >
                    {channel.value}
                  </a>
                ) : (
                  <span className="text-xl md:text-2xl font-medium text-[color:var(--color-muted)]">
                    {channel.value}
                  </span>
                )}
                <p className="text-sm text-[color:var(--color-muted)] mt-2">
                  {channel.note}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
