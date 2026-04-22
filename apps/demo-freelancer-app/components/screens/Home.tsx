import type { AppAPI } from "../GuildApp";
import { FREELANCERS, JOBS, type Freelancer, type Job } from "../data";
import {
  IconArrowRight,
  IconChat,
  IconHeart,
  IconSparkle,
  IconStar,
} from "../icons";
import { Avatar, Chip, RatingPill, RoundBtn, SectionHead } from "../primitives";

export function HomeScreen({ app }: { app: AppAPI }) {
  return (
    <div style={{ paddingBottom: 120 }}>
      <div
        style={{
          padding: "58px 20px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-3)",
              fontFamily: "var(--font-body)",
            }}
          >
            Tuesday, Apr 22
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              color: "var(--text-1)",
              letterSpacing: -0.8,
              marginTop: 2,
            }}
          >
            Hey, Amelia
          </div>
        </div>
        <RoundBtn badge={1}>
          <IconChat size={20} />
        </RoundBtn>
      </div>

      {/* Lime hero */}
      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            background: "var(--accent)",
            color: "#0f0f10",
            borderRadius: 28,
            padding: "22px 22px 24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "rgba(15,15,16,0.08)",
            }}
          />
          <IconSparkle size={20} color="#0f0f10" />
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: -0.9,
              lineHeight: 1.05,
              marginTop: 10,
              textWrap: "pretty",
              maxWidth: 240,
            }}
          >
            Find someone
            <br />
            brilliant to build
            <br />
            with.
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button
              onClick={() => app.go("search")}
              style={{
                background: "#0f0f10",
                color: "var(--accent)",
                border: "none",
                borderRadius: 99,
                cursor: "pointer",
                padding: "12px 18px",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Find freelancer <IconArrowRight size={14} />
            </button>
            <button
              style={{
                background: "rgba(15,15,16,0.1)",
                color: "#0f0f10",
                border: "1px solid rgba(15,15,16,0.2)",
                borderRadius: 99,
                cursor: "pointer",
                padding: "12px 18px",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
              }}
            >
              Post a job
            </button>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ padding: "0 20px 24px", display: "flex", gap: 10 }}>
        {[
          { label: "Active", value: "3", unit: "projects" },
          { label: "Spent", value: "$4,820", unit: "this month" },
          { label: "Saved", value: "12", unit: "freelancers" },
        ].map((s) => (
          <div
            key={s.label}
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
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-1)",
                marginTop: 2,
                letterSpacing: -0.3,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-3)",
                fontFamily: "var(--font-body)",
                marginTop: 1,
              }}
            >
              {s.unit}
            </div>
          </div>
        ))}
      </div>

      <SectionHead title="Browse" actionLabel="All roles" onAction={() => app.go("search")} />
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "0 20px",
          overflowX: "auto",
          marginBottom: 28,
        }}
      >
        {["Design", "Engineering", "Data", "Product", "Marketing", "Writing"].map((c, i) => (
          <Chip key={c} active={i === 0} tone={i === 0 ? "default" : "white"} size="lg">
            {c}
          </Chip>
        ))}
      </div>

      <SectionHead title="Top this week" actionLabel="See all" onAction={() => app.go("search")} />
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "0 20px 8px",
          overflowX: "auto",
          marginBottom: 28,
        }}
      >
        {FREELANCERS.slice(0, 3).map((f) => (
          <FeaturedCard key={f.id} f={f} onClick={() => app.goFreelancer(f.id)} />
        ))}
      </div>

      <SectionHead title="Jobs for you" actionLabel="All jobs" />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {JOBS.slice(0, 2).map((j) => (
          <JobCardCompact key={j.id} job={j} onClick={() => app.goJob(j.id)} />
        ))}
      </div>
    </div>
  );
}

function FeaturedCard({ f, onClick }: { f: Freelancer; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 240,
        flexShrink: 0,
        textAlign: "left",
        background: "var(--accent)",
        color: "#0f0f10",
        borderRadius: 24,
        padding: 16,
        border: "none",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Avatar data={f.avatar} size={44} rounded="xl" />
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(15,15,16,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconHeart size={14} color="#0f0f10" />
        </div>
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: -0.3,
          marginTop: 14,
          lineHeight: 1.15,
        }}
      >
        {f.name}
      </div>
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
        {f.role} · {f.level}
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 12, flexWrap: "wrap" }}>
        <div
          style={{
            background: "rgba(15,15,16,0.88)",
            color: "var(--accent)",
            height: 22,
            padding: "0 8px",
            borderRadius: 11,
            fontSize: 11,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <IconStar size={10} color="var(--accent)" /> {f.rating}
        </div>
        <div
          style={{
            background: "rgba(15,15,16,0.1)",
            color: "#0f0f10",
            height: 22,
            padding: "0 8px",
            borderRadius: 11,
            fontSize: 11,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
          }}
        >
          {f.location}
        </div>
        <div
          style={{
            background: "rgba(15,15,16,0.1)",
            color: "#0f0f10",
            height: 22,
            padding: "0 8px",
            borderRadius: 11,
            fontSize: 11,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
          }}
        >
          {f.years}
        </div>
      </div>
      <div
        style={{
          marginTop: 14,
          paddingTop: 14,
          borderTop: "1px solid rgba(15,15,16,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              opacity: 0.6,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              fontFamily: "var(--font-body)",
            }}
          >
            From
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: -0.3,
            }}
          >
            ${f.rate.toLocaleString()}
            <span style={{ opacity: 0.6, fontWeight: 500, fontSize: 12 }}> /mo</span>
          </div>
        </div>
        <div
          style={{
            background: "#0f0f10",
            color: "var(--accent)",
            height: 36,
            padding: "0 14px",
            borderRadius: 18,
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          See details <IconArrowRight size={12} />
        </div>
      </div>
    </button>
  );
}

function JobCardCompact({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      style={{
        textAlign: "left",
        background: "#0f0f10",
        borderRadius: 24,
        padding: 18,
        cursor: "pointer",
        color: "var(--on-dark-1)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {job.tags.map((t) => (
              <span
                key={t}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 24,
                  padding: "0 10px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.08)",
                  color: "var(--on-dark-1)",
                  fontSize: 11,
                  fontWeight: 500,
                  fontFamily: "var(--font-body)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: -0.3,
              lineHeight: 1.3,
              textWrap: "pretty",
            }}
          >
            {job.title}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--accent)",
              marginTop: 12,
              letterSpacing: -0.4,
            }}
          >
            ${job.budget.toLocaleString()}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <Avatar data={job.posterAvatar} size={40} rounded="xl" />
          <RatingPill value={job.posterRating} tone="light" />
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          color: "var(--on-dark-3)",
          fontFamily: "var(--font-body)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>{job.posted}</span>
        <span>·</span>
        <span>{job.proposals} proposals</span>
      </div>
    </div>
  );
}
