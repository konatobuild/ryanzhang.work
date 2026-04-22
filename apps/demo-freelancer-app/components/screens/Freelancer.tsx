"use client";

import { useState, type ReactNode } from "react";
import type { AppAPI } from "../GuildApp";
import { FREELANCERS } from "../data";
import {
  IconArrowRight,
  IconBack,
  IconBookmark,
  IconBriefcase,
  IconClock,
  IconDots,
  IconHeart,
  IconHeartFill,
  IconPin,
  IconSend,
  IconStar,
} from "../icons";
import { Avatar, Chip, RoundBtn } from "../primitives";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "var(--surface-1)",
        borderRadius: 18,
        padding: "14px 14px 12px",
        border: "1px solid var(--hairline)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "var(--text-3)",
          fontFamily: "var(--font-body)",
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 700,
          color: "var(--text-1)",
          letterSpacing: -0.4,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {value} {icon}
      </div>
    </div>
  );
}

export function FreelancerScreen({ app, id }: { app: AppAPI; id?: string }) {
  const f = FREELANCERS.find((x) => x.id === id) || FREELANCERS[0];
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ paddingBottom: 140 }}>
      <div
        style={{
          padding: "56px 20px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <RoundBtn onClick={() => app.back()}>
          <IconBack size={20} />
        </RoundBtn>
        <div style={{ display: "flex", gap: 8 }}>
          <RoundBtn onClick={() => setSaved(!saved)} tone={saved ? "accent" : "default"}>
            {saved ? <IconHeartFill size={18} color="#0f0f10" /> : <IconHeart size={18} />}
          </RoundBtn>
          <RoundBtn>
            <IconDots size={18} />
          </RoundBtn>
        </div>
      </div>

      <div style={{ padding: "0 14px 14px" }}>
        <div
          style={{
            background: "var(--accent)",
            color: "#0f0f10",
            borderRadius: 28,
            padding: "20px 20px 22px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar data={f.avatar} size={64} rounded="xl" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: -0.6,
                  lineHeight: 1.1,
                }}
              >
                {f.name}
              </div>
              <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>{f.role}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
            <div
              style={{
                background: "rgba(15,15,16,0.9)",
                color: "var(--accent)",
                height: 24,
                padding: "0 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <IconStar size={11} color="var(--accent)" /> {f.rating}
            </div>
            <div
              style={{
                background: "rgba(15,15,16,0.1)",
                color: "#0f0f10",
                height: 24,
                padding: "0 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <IconPin size={11} /> {f.location}
            </div>
            <div
              style={{
                background: "rgba(15,15,16,0.1)",
                color: "#0f0f10",
                height: 24,
                padding: "0 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <IconBriefcase size={11} /> {f.years}
            </div>
            <div
              style={{
                background: "rgba(15,15,16,0.1)",
                color: "#0f0f10",
                height: 24,
                padding: "0 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <IconClock size={11} /> {f.availability}
            </div>
          </div>
          <div
            style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: "1px solid rgba(15,15,16,0.12)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.65,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  fontFamily: "var(--font-body)",
                  lineHeight: 1.25,
                }}
              >
                {f.role}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: -0.5,
                  lineHeight: 1.15,
                }}
              >
                {f.level}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: -0.3,
                  lineHeight: 1.2,
                }}
              >
                ${f.rate.toLocaleString()}
                <span style={{ opacity: 0.6, fontWeight: 500, fontSize: 12 }}> / mo</span>
              </div>
            </div>
            <button
              onClick={() => app.go("messages")}
              style={{
                background: "#0f0f10",
                color: "var(--accent)",
                height: 44,
                padding: "0 18px",
                borderRadius: 22,
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                border: "none",
                fontFamily: "var(--font-body)",
              }}
            >
              Message <IconSend size={13} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 20px 20px" }}>
        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--hairline)",
            borderRadius: 22,
            padding: 18,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-1)",
              marginBottom: 8,
              letterSpacing: -0.2,
            }}
          >
            About
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--text-2)",
              lineHeight: 1.55,
              fontFamily: "var(--font-body)",
              textWrap: "pretty",
            }}
          >
            {f.bio}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
        <StatCard
          label="Rating"
          value={f.rating.toFixed(1)}
          icon={<IconStar size={14} color="var(--accent)" />}
        />
        <StatCard label="Deals" value={f.deals} />
        <StatCard label="Paid" value={`$${f.paid}K`} />
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 700,
            color: "var(--text-1)",
            marginBottom: 12,
            letterSpacing: -0.3,
          }}
        >
          Experience
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {f.experience.map((e, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--hairline)",
                borderRadius: 18,
                padding: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-1)",
                    letterSpacing: -0.2,
                  }}
                >
                  {e.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-2)",
                    marginTop: 2,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {e.company}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-3)",
                    marginTop: 6,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {e.years}
                </div>
              </div>
              {e.tag && (
                <div
                  style={{
                    background: "var(--accent)",
                    color: "#0f0f10",
                    height: 24,
                    padding: "0 10px",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {e.tag}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 700,
            color: "var(--text-1)",
            marginBottom: 12,
            letterSpacing: -0.3,
          }}
        >
          Skills
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {f.skills.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </div>

      {/* Sticky hire CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 20px 32px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0) 0%, var(--bg-0) 35%)",
          zIndex: 25,
          display: "flex",
          gap: 10,
        }}
      >
        <button
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: "var(--surface-1)",
            border: "1px solid var(--hairline)",
            color: "var(--text-1)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconBookmark size={20} />
        </button>
        <button
          onClick={() => app.go("messages")}
          style={{
            flex: 1,
            height: 56,
            borderRadius: 28,
            background: "var(--accent)",
            color: "#0f0f10",
            border: "none",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            letterSpacing: -0.2,
          }}
        >
          Hire {f.name.split(" ")[0]} <IconArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
