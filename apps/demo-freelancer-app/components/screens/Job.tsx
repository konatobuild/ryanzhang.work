import type { AppAPI } from "../GuildApp";
import { JOBS } from "../data";
import {
  IconArrowRight,
  IconBack,
  IconBookmark,
  IconChat,
  IconDots,
  IconStar,
  IconWallet,
} from "../icons";
import { Avatar, Chip, Placeholder, RoundBtn } from "../primitives";

export function JobScreen({ app, id }: { app: AppAPI; id?: string }) {
  const job = JOBS.find((j) => j.id === id) || JOBS[0];

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
          <RoundBtn>
            <IconBookmark size={18} />
          </RoundBtn>
          <RoundBtn>
            <IconDots size={18} />
          </RoundBtn>
        </div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {job.tags.map((t) => (
            <Chip key={t} size="md">
              {t}
            </Chip>
          ))}
          <Chip size="md" tone="dark">
            {job.category}
          </Chip>
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            fontWeight: 700,
            color: "var(--text-1)",
            letterSpacing: -0.8,
            lineHeight: 1.1,
            textWrap: "pretty",
            marginBottom: 18,
          }}
        >
          {job.title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingBottom: 18,
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <Avatar data={job.posterAvatar} size={44} rounded="xl" />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-1)",
                letterSpacing: -0.2,
              }}
            >
              Posted by Client
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-3)",
                fontFamily: "var(--font-body)",
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <IconStar size={11} color="var(--accent)" /> {job.posterRating}
              <span>·</span> {job.posted} <span>·</span> {job.proposals} proposals
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-3)",
            fontFamily: "var(--font-body)",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 8,
          }}
        >
          Budget
        </div>
        <div
          style={{
            background: "var(--accent)",
            color: "#0f0f10",
            borderRadius: 24,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: -1.2,
                lineHeight: 1,
              }}
            >
              ${job.budget.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>
              Fixed project · Funds protected
            </div>
          </div>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              background: "rgba(15,15,16,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconWallet size={22} color="#0f0f10" />
          </div>
        </div>
      </div>

      {job.gallery > 0 && (
        <div style={{ padding: "0 20px 20px" }}>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-3)",
              fontFamily: "var(--font-body)",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            References
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {Array.from({ length: job.gallery }, (_, i) => (
              <Placeholder
                key={i}
                label={`Ref ${i + 1}`}
                height={120}
                style={{ width: 140, flexShrink: 0 }}
              />
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-3)",
            fontFamily: "var(--font-body)",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 10,
          }}
        >
          About this job
        </div>
        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--hairline)",
            borderRadius: 20,
            padding: 18,
            fontSize: 14,
            color: "var(--text-2)",
            lineHeight: 1.55,
            fontFamily: "var(--font-body)",
            textWrap: "pretty",
          }}
        >
          {job.description}
          <br />
          <br />
          The ideal candidate has experience with e-commerce brands and can move fast — we aim to
          launch in three weeks. Bonus points for past work with artisanal or small-batch brands.
        </div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-3)",
            fontFamily: "var(--font-body)",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 10,
          }}
        >
          Required skills
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["Figma", "Webflow", "Brand systems", "Copywriting", "Responsive"].map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </div>

      {/* Sticky action bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 20px 32px",
          background:
            "linear-gradient(180deg, rgba(242,237,228,0) 0%, var(--bg-0) 35%)",
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
          <IconChat size={20} />
        </button>
        <button
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
          Send proposal <IconArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
