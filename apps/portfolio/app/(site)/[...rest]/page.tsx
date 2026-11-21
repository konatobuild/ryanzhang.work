import { notFound } from "next/navigation";

/* Any unmatched URL gets the site's own 404 instead of the framework default. */
export default function CatchAll() {
  notFound();
}
