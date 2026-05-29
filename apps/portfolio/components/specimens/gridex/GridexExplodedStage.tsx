"use client";

import React, { useEffect, useRef } from "react";
import "./gridex-hero.css";
import "./gridex-exploded.css";
import { initGridexExplodedStage } from "./initGridexExplodedStage";

/**
 * GridexExplodedStage — an axonometric "exploded" reading of the Gridex
 * workspace. Same .ws-* card markup as the live GridexHeroStage, but lifted
 * off a blueprint baseplane so the desk reads as layers. The cards are pinned;
 * the three agent cursors auto-hover (initGridexExplodedStage) — each walks a
 * loop of surfaces and "probes" the one it's reading, firing that layer's own
 * distinct reveal. The probe is the visualization of an agent finding the
 * association between pages.
 */
export default function GridexExplodedStage() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stageRef.current) return;
    return initGridexExplodedStage(stageRef.current);
  }, []);

  return (
    <div className="gridex-stage gridex-exploded">
      <div className="brand-hero-stage" aria-hidden="true" ref={stageRef}>
        {/* Blueprint baseplane — footprint of every slot at its real position */}
        <div className="ex-baseplane">
          <span className="ex-foot ex-foot--topleft" />
          <span className="ex-foot ex-foot--topright" />
          <span className="ex-foot ex-foot--midleft" />
          <span className="ex-foot ex-foot--done" />
          <span className="ex-foot ex-foot--bottom" />
        </div>

        {/* ── Top-left column: INBOX over SLACK CHANNELS ── */}
        <div className="ws-card ws-inbox" data-zone="inbox">
          <div className="ws-card-bar">
            <span className="ws-card-mark">INBOX</span>
            <span className="ws-card-meta">4 unread</span>
          </div>
          <ul className="ws-inbox-list">
            <li className="ws-email is-selected" data-email="0">
              <span className="ws-email-from">Maria Chen</span>
              <span className="ws-email-subj">Re: Q3 renewal pricing</span>
            </li>
            <li className="ws-email" data-email="1">
              <span className="ws-email-from">Hartford Ops</span>
              <span className="ws-email-subj">Wire confirmation</span>
            </li>
            <li className="ws-email" data-email="2">
              <span className="ws-email-from">Brown intake</span>
              <span className="ws-email-subj">New case form</span>
            </li>
            <li className="ws-email" data-email="3">
              <span className="ws-email-from">ABA review</span>
              <span className="ws-email-subj">512 audit follow-up</span>
            </li>
          </ul>
        </div>

        <div className="ws-card ws-slack-channels" data-zone="slack-channels">
          <div className="ws-card-bar">
            <span className="ws-card-mark">Slack · Gridex</span>
            <span className="ws-card-meta">4 unread</span>
          </div>
          <ul className="ws-slack-channel-list">
            <li className="ws-slack-channel is-active" data-ch="brown-matter">
              <span className="ws-slack-hash">#</span>
              <span className="ws-slack-name">brown-matter</span>
              <span className="ws-slack-active-dot" />
            </li>
            <li className="ws-slack-channel" data-ch="ops">
              <span className="ws-slack-hash">#</span>
              <span className="ws-slack-name">ops</span>
              <span className="ws-slack-unread">3</span>
            </li>
            <li className="ws-slack-channel" data-ch="renewals">
              <span className="ws-slack-hash">#</span>
              <span className="ws-slack-name">renewals</span>
              <span className="ws-slack-unread">1</span>
            </li>
            <li className="ws-slack-channel" data-ch="general">
              <span className="ws-slack-hash">#</span>
              <span className="ws-slack-name">general</span>
              <span className="ws-slack-unread">14</span>
            </li>
          </ul>
        </div>

        {/* ── Top-right hero: COMPOSE over SLACK CHAT ── */}
        <div className="ws-card ws-compose" data-zone="compose" data-tilt="0.6">
          <div className="ws-card-bar ws-card-bar--light">
            <button className="ws-close" aria-hidden="true" tabIndex={-1} />
            <span className="ws-card-mark ws-card-mark--ink">Composing</span>
            <span className="ws-card-meta ws-card-meta--ink">draft</span>
          </div>
          <div className="ws-compose-meta">
            <div>
              <span className="ws-compose-label">To</span>
              <span className="ws-compose-val">maria@hartford-ins.com</span>
            </div>
            <div>
              <span className="ws-compose-label">Re</span>
              <span className="ws-compose-val">Q3 renewal — pricing confirmation</span>
            </div>
          </div>
          <div className="ws-compose-body">
            <span className="ws-typed">
              Hi Maria — confirming the Q3 renewal at the rate we discussed. The
              updated schedule is attached; the cap in Schedule B is unchanged.
            </span>
            <span className="ws-caret">▍</span>
          </div>
          <div className="ws-compose-footer">
            <span className="ws-compose-status">draft · auto-saving</span>
            <span className="ws-compose-sent">✓ Sent</span>
          </div>
        </div>

        <div className="ws-card ws-slack-chat" data-zone="slack-chat" data-tilt="0.6">
          <div className="ws-card-bar ws-card-bar--light">
            <button className="ws-close" aria-hidden="true" tabIndex={-1} />
            <span className="ws-card-mark ws-card-mark--ink"># brown-matter</span>
            <span className="ws-card-meta ws-card-meta--ink">4 members</span>
          </div>
          <ul className="ws-slack-stream">
            <li className="ws-slack-msg is-in">
              <span className="ws-slack-avatar ws-slack-avatar--M">M</span>
              <div className="ws-slack-msg-body">
                <div className="ws-slack-msg-head">
                  <span className="ws-slack-msg-name">Maria</span>
                  <span className="ws-slack-msg-time">9:42</span>
                </div>
                <div className="ws-slack-msg-text">
                  Did the conflict check clear on the Brown matter?
                </div>
              </div>
            </li>
            <li className="ws-slack-msg is-in">
              <span className="ws-slack-avatar ws-slack-avatar--G">G</span>
              <div className="ws-slack-msg-body">
                <div className="ws-slack-msg-head">
                  <span className="ws-slack-msg-name">Gridex · 02</span>
                  <span className="ws-slack-msg-time">9:43</span>
                </div>
                <div className="ws-slack-msg-text">
                  Cleared — no overlap with active matters. Filed the note.
                </div>
                <div className="ws-slack-reactions">
                  <span className="ws-slack-reaction is-in">✓ 1</span>
                </div>
              </div>
            </li>
          </ul>
          <div className="ws-slack-input-bar">
            <span className="ws-slack-input-at">@channel</span>
            <span className="ws-slack-input-body">
              <span className="ws-slack-input-text">Routing intake to the renewals queue</span>
              <span className="ws-slack-caret">▍</span>
            </span>
            <button className="ws-slack-send" aria-hidden="true" tabIndex={-1}>
              Send
            </button>
          </div>
        </div>

        {/* ── Mid-left: VOICE TRANSCRIPT over CRM ── */}
        <div className="ws-card ws-voice" data-zone="voice" data-tilt="-0.7">
          <div className="ws-card-bar ws-card-bar--paper">
            <button className="ws-close" aria-hidden="true" tabIndex={-1} />
            <span className="ws-card-mark ws-card-mark--ink">Maria · Hartford</span>
            <span className="ws-card-meta ws-card-meta--ink">04:23</span>
          </div>
          <div className="ws-voice-waveform" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span className="ws-voice-bar" key={i} />
            ))}
          </div>
          <ul className="ws-voice-transcript" aria-live="polite">
            <li className="ws-voice-line is-in">
              <span className="ws-voice-time">04:02</span>
              <span className="ws-voice-spk ws-voice-spk--M">M</span>
              <span className="ws-voice-text">Need the cap confirmed before Friday.</span>
            </li>
            <li className="ws-voice-line is-in is-active">
              <span className="ws-voice-time">04:11</span>
              <span className="ws-voice-spk ws-voice-spk--G">G</span>
              <span className="ws-voice-text">Pulling Schedule B now — will send today.</span>
            </li>
          </ul>
          <div className="ws-voice-rail-bar">action items</div>
          <ul className="ws-voice-rail">
            <li className="ws-voice-item is-in">
              <span className="ws-voice-item-check">✓</span>
              <span className="ws-voice-item-text">Confirm Q3 cap (Sched B)</span>
            </li>
            <li className="ws-voice-item is-in">
              <span className="ws-voice-item-check">✓</span>
              <span className="ws-voice-item-text">Send updated schedule</span>
            </li>
          </ul>
        </div>

        <div className="ws-card ws-crm" data-zone="crm" data-tilt="-0.4">
          <div className="ws-card-bar ws-card-bar--paper">
            <button className="ws-close" aria-hidden="true" tabIndex={-1} />
            <span className="ws-card-mark ws-card-mark--ink">Maria Chen</span>
            <span className="ws-card-meta ws-card-meta--ink">contact</span>
          </div>
          <div className="ws-crm-header">
            <div className="ws-crm-line">maria@hartford-ins.com · +1 555-0192</div>
            <div className="ws-crm-line ws-crm-line--muted">Hartford Insurance</div>
          </div>
          <div className="ws-crm-fields">
            <div className="ws-crm-field" data-field="status">
              <span className="ws-crm-label">Status</span>
              <span className="ws-crm-value">Renewal in progress</span>
            </div>
            <div className="ws-crm-field" data-field="owner">
              <span className="ws-crm-label">Owner</span>
              <span className="ws-crm-value">Reyn</span>
            </div>
            <div className="ws-crm-field" data-field="next">
              <span className="ws-crm-label">Next</span>
              <span className="ws-crm-value">2026-09-18</span>
            </div>
          </div>
          <div className="ws-crm-activity-bar">activity</div>
          <ul className="ws-crm-activity">
            <li className="ws-crm-event is-in">
              <span className="ws-crm-event-time">Yest</span>
              <span className="ws-crm-event-text">Q3 renewal sent</span>
            </li>
            <li className="ws-crm-event is-in">
              <span className="ws-crm-event-time">Aug 9</span>
              <span className="ws-crm-event-text">conflict cleared</span>
            </li>
          </ul>
        </div>

        {/* ── Bottom wide: CONTRACT / DOC / SPREADSHEET tool stack ── */}
        <div className="ws-card ws-contract" data-zone="contract" data-tilt="0.5">
          <div className="ws-card-bar ws-card-bar--paper">
            <button className="ws-close" aria-hidden="true" tabIndex={-1} />
            <span className="ws-card-mark ws-card-mark--ink">
              Hartford Q3 — Master Service Agreement
            </span>
            <span className="ws-card-meta ws-card-meta--ink">p. 14 / 28</span>
          </div>
          <div className="ws-contract-body">
            <p className="ws-clause">
              4.1&nbsp; The Service Provider shall perform all duties in accordance with prevailing
              industry standards and applicable regulations.
            </p>
            <p className="ws-clause ws-clause--target is-highlighted" data-clause="4.2">
              4.2&nbsp; Provider shall be liable for any losses incurred by Client up to the cap
              defined in Schedule B.
            </p>
            <p className="ws-clause">
              4.3&nbsp; No party may assign rights under this Agreement without prior written
              consent of the other party.
            </p>
            <p className="ws-clause">
              4.4&nbsp; Either party may terminate this Agreement for material breach upon thirty
              (30) days&rsquo; written notice and an opportunity to cure.
            </p>
            <p className="ws-clause">
              4.5&nbsp; Any indemnification obligations shall survive termination of this Agreement
              for a period of two (2) years.
            </p>
          </div>
          <div className="ws-margin-note is-visible">verify 2024 cap — see Sched B</div>
        </div>

        <div className="ws-card ws-doc" data-zone="contract" data-tilt="-0.4">
          <div className="ws-card-bar ws-card-bar--paper">
            <button className="ws-close" aria-hidden="true" tabIndex={-1} />
            <span className="ws-card-mark ws-card-mark--ink">Onboarding brief — draft v3</span>
            <span className="ws-card-meta ws-card-meta--ink">edited just now</span>
          </div>
          <div className="ws-doc-body">
            <p className="ws-doc-para">
              Hartford engaged Gridex to absorb three intake-stage workflows their team currently
              handles by hand: new-matter routing, conflict checks, and first-pass policy review.
            </p>
            <p className="ws-doc-para ws-doc-para--target">
              <span className="ws-doc-typed">
                In Q3 the queue cleared 47 matters a day at a 6-hour median cycle time.
              </span>
              <span className="ws-doc-caret">▍</span>
            </p>
            <p className="ws-doc-para">
              No software seats were added to their stack; the work runs against Gridex&apos;s
              managed capacity and reports back through the existing email + ticket channels their
              team already lives in.
            </p>
            <p className="ws-doc-para">
              All AI handling stays within the SOC 2-aligned boundary documented in §2; sensitive
              client data never leaves the Gridex enclave or surfaces to external models.
            </p>
          </div>
          <ul className="ws-doc-sidebar">
            <li className="ws-doc-sugg is-visible is-accepted" data-sugg="1">✦ Add concrete throughput #</li>
            <li className="ws-doc-sugg is-visible" data-sugg="2">✦ Cite Q3 cycle-time figure</li>
            <li className="ws-doc-sugg is-visible" data-sugg="3">✦ Note SOC2 boundary</li>
            <li className="ws-doc-sugg is-visible" data-sugg="4">✦ Link to §2 disclosure</li>
          </ul>
        </div>

        <div className="ws-card ws-spreadsheet" data-zone="contract" data-tilt="-0.3">
          <div className="ws-card-bar ws-card-bar--paper">
            <button className="ws-close" aria-hidden="true" tabIndex={-1} />
            <span className="ws-card-mark ws-card-mark--ink">Q3 renewal recon</span>
            <span className="ws-card-meta ws-card-meta--ink">Sheet · audit</span>
          </div>
          <div className="ws-sheet-formula-bar">
            <span className="ws-sheet-fcell">D2</span>
            <span className="ws-sheet-fx">
              f<sub>x</sub>
            </span>
            <span className="ws-sheet-fval is-formula">=Actual-Filed</span>
          </div>
          <div className="ws-sheet-body">
            <table className="ws-sheet-table">
              <thead>
                <tr>
                  <th className="ws-sheet-row-head" />
                  <th className="ws-sheet-col-label">Account</th>
                  <th>Filed</th>
                  <th>Actual</th>
                  <th>Δ</th>
                  <th className="ws-sheet-col-note">Note</th>
                </tr>
              </thead>
              <tbody>
                <tr data-sheet-row="0">
                  <th>1</th>
                  <td className="ws-sheet-label">Hartford</td>
                  <td className="ws-sheet-filed">24,500</td>
                  <td className="ws-sheet-actual">24,500</td>
                  <td className="ws-sheet-delta is-match">0</td>
                  <td className="ws-sheet-note" />
                </tr>
                <tr data-sheet-row="1">
                  <th>2</th>
                  <td className="ws-sheet-label">Smith</td>
                  <td className="ws-sheet-filed">18,200</td>
                  <td className="ws-sheet-actual">18,200</td>
                  <td className="ws-sheet-delta is-match">0</td>
                  <td className="ws-sheet-note" />
                </tr>
                <tr data-sheet-row="2">
                  <th>3</th>
                  <td className="ws-sheet-label">Davis</td>
                  <td className="ws-sheet-filed">11,750</td>
                  <td className="ws-sheet-actual">12,400</td>
                  <td className="ws-sheet-delta is-variance">+650</td>
                  <td className="ws-sheet-note is-visible">recheck filing</td>
                </tr>
                <tr data-sheet-row="3">
                  <th>4</th>
                  <td className="ws-sheet-label">Park</td>
                  <td className="ws-sheet-filed">9,800</td>
                  <td className="ws-sheet-actual">9,800</td>
                  <td className="ws-sheet-delta is-match">0</td>
                  <td className="ws-sheet-note" />
                </tr>
                <tr data-sheet-row="4">
                  <th>5</th>
                  <td className="ws-sheet-label">Carlin</td>
                  <td className="ws-sheet-filed">7,400</td>
                  <td className="ws-sheet-actual">7,400</td>
                  <td className="ws-sheet-delta is-match">0</td>
                  <td className="ws-sheet-note" />
                </tr>
                <tr data-sheet-row="5">
                  <th>6</th>
                  <td className="ws-sheet-label">Mitchell</td>
                  <td className="ws-sheet-filed">5,200</td>
                  <td className="ws-sheet-actual">5,200</td>
                  <td className="ws-sheet-delta is-match">0</td>
                  <td className="ws-sheet-note" />
                </tr>
                <tr className="ws-sheet-total-row">
                  <th>Σ</th>
                  <td />
                  <td className="ws-sheet-filed-total">76,850</td>
                  <td className="ws-sheet-total">77,500</td>
                  <td />
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── DONE pile ── */}
        <div className="ws-done-pile" data-zone="done">
          <div className="ws-card-bar">
            <span className="ws-card-mark">DONE</span>
            <span className="ws-card-meta">
              <span className="ws-done-count">47</span> today
            </span>
          </div>
          <ul className="ws-done-log" aria-live="polite">
            <li className="ws-done-row ws-done-row--gamma">
              <span className="ws-done-dot ws-done-dot--gamma" />
              <span className="ws-done-action">Filed</span>
              <span className="ws-done-subj">Wells subpoena response</span>
            </li>
            <li className="ws-done-row ws-done-row--beta">
              <span className="ws-done-dot ws-done-dot--beta" />
              <span className="ws-done-action">Replied</span>
              <span className="ws-done-subj">Wire confirmation — Q3</span>
            </li>
            <li className="ws-done-row ws-done-row--alpha">
              <span className="ws-done-dot ws-done-dot--alpha" />
              <span className="ws-done-action">Recon</span>
              <span className="ws-done-subj">March variance</span>
            </li>
            <li className="ws-done-row ws-done-row--alpha">
              <span className="ws-done-dot ws-done-dot--alpha" />
              <span className="ws-done-action">Flagged</span>
              <span className="ws-done-subj">Hartford MSA §4.2</span>
            </li>
          </ul>
        </div>

        {/* ── 3 agent cursors, floating highest ── */}
        <div className="stage-cursor stage-cursor--alpha">
          <div className="cursor-pin">
            <svg viewBox="0 0 14 19" width="14" height="19">
              <path d="M 1 1 L 1 17 L 13 12 Z" fill="#d7eb75" />
            </svg>
          </div>
          <span className="cursor-label">Gridex · 01</span>
        </div>
        <div className="stage-cursor stage-cursor--beta">
          <div className="cursor-pin">
            <svg viewBox="0 0 14 19" width="14" height="19">
              <path d="M 1 1 L 1 17 L 13 12 Z" fill="#b79264" />
            </svg>
          </div>
          <span className="cursor-label">Gridex · 02</span>
        </div>
        <div className="stage-cursor stage-cursor--gamma">
          <div className="cursor-pin">
            <svg viewBox="0 0 14 19" width="14" height="19">
              <path d="M 1 1 L 1 17 L 13 12 Z" fill="#5a7368" />
            </svg>
          </div>
          <span className="cursor-label">Gridex · 03</span>
        </div>
      </div>
    </div>
  );
}
