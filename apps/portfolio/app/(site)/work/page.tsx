import type { Metadata } from "next";
import { WorkCards } from "@/components/site/Cards";
import { CONTACT_EMAIL, brand, interfaces, more, objects, products, prototypes, web } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "All of Ryan Zhang's work: industrial design, software products, websites, prototypes and brand identity.",
};

export default function WorkPage() {
  return (
    <>
      <section className="wrap hero" style={{ paddingBottom: 0 }}>
        <p className="t-s hero__eyebrow">Work</p>
        <h1 className="t-h1 duo hero__title">
          Everything in one place
          <span>Objects, software, websites, and a few that are more than one of these.</span>
        </h1>
      </section>

      <section className="wrap section" id="objects">
        <div className="section__head">
          <h2 className="t-l duo">
            Objects
            <span>Industrial design: nine objects, from a coffee maker to a concept car.</span>
          </h2>
        </div>
        <WorkCards items={objects} />
      </section>



      <section className="wrap section" id="software">
        <div className="section__head">
          <h2 className="t-l duo">
            Software
            <span>Four apps of my own, designed and built by me.</span>
          </h2>
        </div>
        <WorkCards items={products} />
      </section>

      <section className="wrap section" id="more-software">
        <div className="section__head">
          <h2 className="t-l duo">
            Also in the works
            <span>An editor still in development, and a study.</span>
          </h2>
        </div>
        <WorkCards items={more} cols={2} motion ratio="16 / 10" />
      </section>

      <section className="wrap section" id="websites">
        <div className="section__head">
          <h2 className="t-l duo">
            Websites
            <span>Six sites, designed and built by me.</span>
          </h2>
        </div>
        <WorkCards items={web} cols={3} motion ratio="16 / 10" />
      </section>

      <section className="wrap section" id="prototypes">
        <div className="section__head">
          <h2 className="t-l duo">
            Prototypes
            <span>Interface ideas built far enough to use in the browser.</span>
          </h2>
        </div>
        <WorkCards items={prototypes} cols={3} motion ratio="5 / 4" />
      </section>

      <section className="wrap section" id="brand">
        <div className="section__head">
          <h2 className="t-l duo">
            Interface and brand
            <span>A way to type in a headset, and a full identity from the mark to the street.</span>
          </h2>
        </div>
        <WorkCards items={[...interfaces, ...brand]} cols={3} />
      </section>

      <section className="wrap closing">
        <h2 className="t-xxl">Get in touch.</h2>
        <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </section>
    </>
  );
}
