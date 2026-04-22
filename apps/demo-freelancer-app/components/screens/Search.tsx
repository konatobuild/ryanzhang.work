"use client";

import { useState } from "react";
import type { AppAPI } from "../GuildApp";
import { CATEGORIES, FREELANCERS, type Freelancer } from "../data";
import {
  IconArrowRight,
  IconBriefcase,
  IconChat,
  IconClock,
  IconFilter,
  IconHeart,
  IconHeartFill,
  IconPin,
  IconSearch,
  IconStar,
  IconX,
} from "../icons";
import { Avatar, Chip } from "../primitives";

export function SearchScreen({ app }: { app: AppAPI }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Full-time");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = FREELANCERS.filter((f) => {
    if (
      query &&
      !f.name.toLowerCase().includes(query.toLowerCase()) &&
      !f.role.toLowerCase().includes(query.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div style={{ paddingBottom: 120 }}>
      <div style={{ padding: "58px 20px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 34,
              fontWeight: 700,
              color: "var(--text-1)",
              letterSpacing: -1,
              lineHeight: 1.05,
              textWrap: "pretty",
            }}
          >
            Search
            <br />
            freelancers
          </div>
          <button
            onClick={() => setShowFilters(true)}
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: 19,
              background: "#fff",
              color: "var(--text-1)",
              border: "1px solid var(--hairline)",
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "var(--font-body)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              marginTop: 6,
            }}
          >
            <IconFilter size={14} /> Filters
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <div style={{ color: "var(--text-3)", fontSize: 14, fontFamily: "var(--font-body)" }}>
            {activeFilter === "All" ? "All specialties" : activeFilter}
          </div>
          <div style={{ color: "var(--text-3)", fontSize: 13, fontFamily: "var(--font-body)" }}>
            {filtered.length} results
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px 14px" }}>
        <div
          style={{
            height: 52,
            background: "#fff",
            borderRadius: 26,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            border: "1px solid var(--hairline)",
          }}
        >
          <IconSearch size={18} color="var(--text-2)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, role, or skill"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              color: "var(--text-1)",
              fontSize: 15,
              padding: "0 12px",
              fontFamily: "var(--font-body)",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                background: "rgba(15,15,16,0.08)",
                border: "none",
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-2)",
              }}
            >
              <IconX size={12} />
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "0 20px 20px",
          overflowX: "auto",
        }}
      >
        {["All", "Full-time", "Part-time", "Contract", "Remote only"].map((f) => (
          <Chip
            key={f}
            active={activeFilter === f}
            onClick={() => setActiveFilter(f)}
            tone="white"
            icon={f === "Full-time" || f === "Part-time" ? <IconClock size={12} /> : null}
          >
            {f}
          </Chip>
        ))}
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((f, i) =>
          i === 0 ? (
            <FreelancerHeroCard key={f.id} f={f} onClick={() => app.goFreelancer(f.id)} />
          ) : (
            <FreelancerListCard key={f.id} f={f} onClick={() => app.goFreelancer(f.id)} />
          ),
        )}
      </div>

      {showFilters && <FilterSheet onClose={() => setShowFilters(false)} />}
    </div>
  );
}

function FreelancerHeroCard({ f, onClick }: { f: Freelancer; onClick: () => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      style={{
        textAlign: "left",
        background: "var(--accent)",
        color: "#0f0f10",
        borderRadius: 28,
        padding: 18,
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Avatar data={f.avatar} size={48} rounded="xl" />
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(15,15,16,0.12)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0f0f10",
            }}
          >
            {saved ? <IconHeartFill size={16} color="#0f0f10" /> : <IconHeart size={16} />}
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(15,15,16,0.12)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0f0f10",
            }}
          >
            <IconChat size={16} />
          </button>
        </div>
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: -0.7,
          marginTop: 14,
        }}
      >
        {f.name}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
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
      </div>
      <div style={{ marginTop: 8 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(15,15,16,0.1)",
            color: "#0f0f10",
            height: 24,
            padding: "0 10px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <IconClock size={11} /> {f.availability}
        </div>
      </div>
      <div
        style={{
          marginTop: 18,
          paddingTop: 16,
          borderTop: "1px solid rgba(15,15,16,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
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
        <div
          style={{
            background: "#0f0f10",
            color: "var(--accent)",
            height: 40,
            padding: "0 18px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-body)",
          }}
        >
          See details <IconArrowRight size={13} />
        </div>
      </div>
    </div>
  );
}

function FreelancerListCard({ f, onClick }: { f: Freelancer; onClick: () => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      style={{
        textAlign: "left",
        background: "#0f0f10",
        color: "var(--on-dark-1)",
        borderRadius: 24,
        padding: 16,
        cursor: "pointer",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
      }}
    >
      <Avatar data={f.avatar} size={56} rounded="xl" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: -0.3,
              }}
            >
              {f.name}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--on-dark-2)",
                fontFamily: "var(--font-body)",
                marginTop: 1,
              }}
            >
              {f.role} · {f.level}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: saved ? "var(--accent)" : "rgba(255,255,255,0.08)",
              color: saved ? "#0f0f10" : "var(--on-dark-2)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {saved ? <IconHeartFill size={14} color="#0f0f10" /> : <IconHeart size={14} />}
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              background: "rgba(255,255,255,0.08)",
              color: "var(--on-dark-1)",
              height: 22,
              padding: "0 8px",
              borderRadius: 11,
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            <IconStar size={10} color="var(--accent)" /> {f.rating}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.08)",
              color: "var(--on-dark-2)",
              height: 22,
              padding: "0 8px",
              borderRadius: 11,
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            {f.location}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.08)",
              color: "var(--on-dark-2)",
              height: 22,
              padding: "0 8px",
              borderRadius: 11,
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            {f.availability}
          </div>
        </div>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--accent)",
              letterSpacing: -0.3,
            }}
          >
            ${f.rate.toLocaleString()}
            <span style={{ color: "var(--on-dark-3)", fontWeight: 500, fontSize: 12 }}> / mo</span>
          </div>
          <div style={{ color: "var(--on-dark-3)", fontSize: 12, fontFamily: "var(--font-body)" }}>
            {f.reviews} reviews
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSheet({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>(["Product Designer", "DevOps Engineer"]);
  const [type, setType] = useState("Full-time");
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(15,15,16,0.45)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        zIndex: 100,
        animation: "guild-fade 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-0)",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          padding: "22px 20px 40px",
          animation: "guild-slide-up 0.25s ease",
          maxHeight: "85%",
          overflow: "auto",
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: "rgba(15,15,16,0.15)",
            borderRadius: 2,
            margin: "0 auto 18px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--text-1)",
              letterSpacing: -0.5,
            }}
          >
            Filters
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(15,15,16,0.06)",
              color: "var(--text-2)",
              border: "none",
              borderRadius: 99,
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            Reset
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-3)",
              fontFamily: "var(--font-body)",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Professions
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map((c) => (
              <Chip
                key={c}
                active={selected.includes(c)}
                tone="white"
                onClick={() =>
                  setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]))
                }
              >
                {c}
              </Chip>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-3)",
              fontFamily: "var(--font-body)",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Availability
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Full-time", "Part-time", "Contract"].map((t) => (
              <Chip
                key={t}
                active={type === t}
                tone="white"
                onClick={() => setType(t)}
                size="lg"
                icon={<IconClock size={12} />}
              >
                {t}
              </Chip>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-3)",
              fontFamily: "var(--font-body)",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Monthly budget
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 16,
              border: "1px solid var(--hairline)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ color: "var(--text-2)", fontSize: 13 }}>$1,200</span>
              <span style={{ color: "var(--text-1)", fontSize: 13, fontWeight: 600 }}>$3,400</span>
            </div>
            <div
              style={{
                position: "relative",
                height: 6,
                background: "rgba(15,15,16,0.08)",
                borderRadius: 3,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "20%",
                  right: "30%",
                  height: 6,
                  background: "#0f0f10",
                  borderRadius: 3,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "20%",
                  top: -5,
                  width: 16,
                  height: 16,
                  background: "var(--accent)",
                  borderRadius: 8,
                  transform: "translateX(-50%)",
                  border: "2px solid #0f0f10",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "70%",
                  top: -5,
                  width: 16,
                  height: 16,
                  background: "var(--accent)",
                  borderRadius: 8,
                  transform: "translateX(-50%)",
                  border: "2px solid #0f0f10",
                }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            height: 56,
            borderRadius: 28,
            background: "#0f0f10",
            color: "var(--accent)",
            border: "none",
            fontSize: 16,
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            cursor: "pointer",
          }}
        >
          Show 238 results
        </button>
      </div>
    </div>
  );
}
