import { MetaLabel } from "../ui/MetaLabel";

interface ContextProps {
  body: string;
}

export function Context({ body }: ContextProps) {
  return (
    <section className="container-page px-6 md:px-10 pt-24 md:pt-32">
      <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-16 max-w-5xl">
        <MetaLabel as="p" className="md:pt-3">
          Context
        </MetaLabel>
        <p className="text-xl md:text-2xl leading-relaxed tracking-tight">
          {body}
        </p>
      </div>
    </section>
  );
}
