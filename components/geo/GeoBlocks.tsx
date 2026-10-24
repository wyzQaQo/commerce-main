/**
 * GEO (Generative Engine Optimization) primitives.
 *
 * The blocks here exist to make a product page machine-extractable:
 *
 *  1. `GeoAnswerLead`  — a single self-contained sentence an answer engine can
 *     quote without surrounding context. Rendered as the first <p> after the
 *     H1 so it sits in the top 30% of the document, where most AI citations
 *     are drawn from.
 *  2. `GeoSpecTable`   — parameters as a real <table>, not a div grid. Tables
 *     survive extraction as structured rows; div grids collapse to a text blob.
 *  3. `GeoUseCases`    — scenario list as <ul>/<li> so each item is an
 *     independently retrievable statement.
 *  4. `GeoComparison`  — head-to-head rows against the incumbent alternative.
 *     Answer engines weight explicit trade-offs heavily when a query is
 *     "X vs Y" shaped.
 *
 * All four emit semantic HTML only; styling is left to the caller's design
 * system so the blocks drop into any of the sites unchanged.
 */

import type { ReactNode } from "react";

export interface GeoAnswerLeadProps {
  /** The conclusion sentence. Aim for 40-60 words, no pronouns referring back. */
  children: ReactNode;
}

export function GeoAnswerLead({ children }: GeoAnswerLeadProps) {
  return (
    <p
      data-geo="answer-lead"
      className="text-lg leading-relaxed text-muted-foreground"
    >
      {children}
    </p>
  );
}

export interface GeoSpecRow {
  label: string;
  value: string;
}

export interface GeoSpecTableProps {
  caption: string;
  rows: GeoSpecRow[];
}

export function GeoSpecTable({ caption, rows }: GeoSpecTableProps) {
  return (
    <table data-geo="spec-table" className="w-full text-sm">
      <caption className="sr-only">{caption}</caption>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-border last:border-0">
            <th
              scope="row"
              className="py-2 pr-4 text-left font-medium text-muted-foreground align-top"
            >
              {row.label}
            </th>
            <td className="py-2 text-foreground">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export interface GeoUseCase {
  /** Short scenario name, e.g. "Hotel lobby atrium". */
  scenario: string;
  /** One sentence explaining why this product fits the scenario. */
  detail: string;
}

export interface GeoUseCasesProps {
  items: GeoUseCase[];
}

export function GeoUseCases({ items }: GeoUseCasesProps) {
  return (
    <ul data-geo="use-cases" className="space-y-3">
      {items.map((item) => (
        <li key={item.scenario} className="flex gap-3">
          <span aria-hidden="true" className="text-brand-ocean">
            &bull;
          </span>
          <span>
            <strong className="font-semibold text-foreground">
              {item.scenario}:
            </strong>{" "}
            <span className="text-muted-foreground">{item.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export interface GeoComparisonRow {
  /** The dimension being compared, e.g. "Annual maintenance cost". */
  dimension: string;
  /** This product's value. */
  ours: string;
  /** The incumbent alternative's value. */
  alternative: string;
}

export interface GeoComparisonProps {
  caption: string;
  rows: GeoComparisonRow[];
  /** Column header for this product, e.g. "This system". */
  oursLabel: string;
  /** Column header for the alternative, e.g. "Living plants". */
  alternativeLabel: string;
}

export function GeoComparison({
  caption,
  rows,
  oursLabel,
  alternativeLabel,
}: GeoComparisonProps) {
  return (
    <table data-geo="comparison" className="w-full text-sm">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="border-b border-border">
          <th scope="col" className="py-2 pr-4 text-left font-medium text-muted-foreground">
            &nbsp;
          </th>
          <th scope="col" className="py-2 pr-4 text-left font-semibold text-brand-ocean">
            {oursLabel}
          </th>
          <th scope="col" className="py-2 text-left font-medium text-muted-foreground">
            {alternativeLabel}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.dimension} className="border-b border-border last:border-0">
            <th scope="row" className="py-2 pr-4 text-left font-medium text-muted-foreground align-top">
              {row.dimension}
            </th>
            <td className="py-2 pr-4 text-foreground align-top">{row.ours}</td>
            <td className="py-2 text-muted-foreground align-top">{row.alternative}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
