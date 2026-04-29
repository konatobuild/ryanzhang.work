/**
 * Awards — structured record of recognition.
 *
 * Surfaces under the Taste-formation facet as side evidence. Kept in its
 * own file so adding awards doesn't bloat the facet metadata.
 *
 * Fill the array as the user provides real entries. Empty is fine; the
 * facet detail page handles the empty state.
 */

export interface Award {
  /** Stable id, kebab-case. */
  slug: string;
  /** Award / recognition title. */
  title: string;
  /** Display year, string for flexibility. */
  year: string;
  /** Awarding organization, optional. */
  org?: string;
  /** Project or work the award was given to, optional. */
  project?: string;
  /** Category / discipline tag — e.g. "Industrial design", "Graphic". */
  category?: string;
  /** External link to the award page or coverage, optional. */
  source?: string;
}

export const awards: Award[] = [
  // [待你亲笔填: 把奖项 一条一条加进来]
];
