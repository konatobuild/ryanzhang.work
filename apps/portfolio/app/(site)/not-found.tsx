import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap closing" style={{ minHeight: "62vh", alignContent: "center" }}>
      <h1 className="t-xl">Nothing here.</h1>
      <p className="muted" style={{ maxWidth: "30em", textWrap: "pretty" }}>
        That page doesn&apos;t exist, or it moved when the site was rebuilt. The
        work is all on the home page.
      </p>
      <Link href="/" className="btn">
        Go home →
      </Link>
    </section>
  );
}
