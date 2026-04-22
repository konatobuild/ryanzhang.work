"use client";

import { useEffect, useState, type CSSProperties, type ReactElement } from "react";
import Image from "next/image";
import {
  Apple,
  Arrow,
  Bottle,
  Carrot,
  Cart,
  Chat,
  Check,
  Clock,
  Dots,
  Heart,
  Hex,
  HomeHex,
  Leaf,
  Minus,
  Phone,
  Plus,
  Search,
  Shield,
  Truck,
  ZoomIn,
  ZoomOut,
} from "./icons";

export type FreshScreen = "home" | "product" | "tracking";
export type ProductId = "green" | "fruit" | "red";

type ProductEntry = {
  id: ProductId;
  title: string;
  heroTitle: string;
  size: string;
  price: number;
  bg: string;
  label: string;
  labelColor: string;
  nutrition: Record<string, string>;
  tags: { icon: ReactElement; label: string }[];
};

const CATALOG: Record<ProductId, ProductEntry> = {
  green: {
    id: "green",
    title: "Green Energy Smoothie",
    heroTitle: "Green Energy\nSmoothie",
    size: "500 ml",
    price: 6.5,
    bg: "linear-gradient(160deg, #e8efe2 0%, #d8e3cf 100%)",
    label: "GREEN SMOOTHIE",
    labelColor: "#3c5a2b",
    nutrition: { Calories: "150 kcal", Sugar: "18 g", Fat: "1 g", Fiber: "6 g" },
    tags: [
      { icon: <Leaf color="#4a8a3a" />, label: "Vegan" },
      { icon: <Apple />, label: "Energy boost" },
    ],
  },
  fruit: {
    id: "fruit",
    title: "Fresh Fruit Basket",
    heroTitle: "Fresh Fruit\nBasket",
    size: "1 kg",
    price: 12.9,
    bg: "linear-gradient(160deg, #eee7dc 0%, #d8cfbf 100%)",
    label: "FRUIT MODEL SHOT",
    labelColor: "#5a4a2b",
    nutrition: { Calories: "220 kcal", Sugar: "40 g", Fat: "1 g", Fiber: "8 g" },
    tags: [
      { icon: <Leaf color="#4a8a3a" />, label: "Vegan" },
      { icon: <Apple />, label: "Vitamin C" },
    ],
  },
  red: {
    id: "red",
    title: "Red strawberries & seeds",
    heroTitle: "Red strawberries &\nseeds smoothie",
    size: "500 ml",
    price: 7.2,
    bg: "linear-gradient(160deg, #f1dcdc 0%, #dfbcbc 100%)",
    label: "STRAWBERRY BOTTLE",
    labelColor: "#6b2a2a",
    nutrition: { Calories: "180 kcal", Sugar: "30 g", Fat: "2 g", Fiber: "5 g" },
    tags: [
      { icon: <Leaf color="#4a8a3a" />, label: "Vegan" },
      { icon: <Apple />, label: "Energy boost" },
    ],
  },
};

const PRODUCT_ORDER: ProductId[] = ["green", "fruit", "red"];

/* ------------------------------------------------------------------ */
/*  Home                                                               */
/* ------------------------------------------------------------------ */

type HomeProps = {
  accent: string;
  favs: ProductId[];
  toggleFav: (id: ProductId) => void;
  onOpenProduct: (id: ProductId) => void;
  onOpenTracking: () => void;
};

export function HomeScreen({
  accent,
  favs,
  toggleFav,
  onOpenProduct,
  onOpenTracking,
}: HomeProps) {
  const [category, setCategory] = useState("Greens & Fruits");

  const cats = [
    { label: "Greens & Fruits", icon: <Apple /> },
    { label: "Vegan", icon: <Leaf color={accent} /> },
    { label: "Smoothies", icon: <Carrot /> },
    { label: "Bowls", icon: <Apple /> },
  ];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#ECECEC",
      }}
    >
      <div
        className="no-scrollbar"
        style={{ flex: 1, overflow: "auto", padding: "54px 20px 120px" }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                background: "linear-gradient(135deg, #d4b896, #b89670)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontWeight: 700,
                color: "#6b4a2a",
                border: "1.5px solid #fff",
              }}
            >
              N
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#111" }}>
              Hello, Natalie!
            </div>
          </div>
          <button type="button" style={roundBtn}>
            <Search size={18} />
          </button>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 38,
            lineHeight: 1.08,
            fontWeight: 800,
            color: "#111",
            margin: "8px 0 8px",
            letterSpacing: -0.5,
          }}
        >
          Ready for
          <br />
          something fresh?
        </h1>
        <div style={{ fontSize: 15, color: "#6b6b6b", marginBottom: 22 }}>
          Choose what you want to boost your day.
        </div>

        {/* Category pills */}
        <div
          className="no-scrollbar"
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            margin: "0 -20px 22px",
            padding: "0 20px",
          }}
        >
          {cats.map((c) => {
            const active = category === c.label;
            return (
              <button
                type="button"
                key={c.label}
                onClick={() => setCategory(c.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  borderRadius: 24,
                  background: active ? "#fff" : "rgba(255,255,255,0.6)",
                  border: "none",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111",
                  fontFamily: "inherit",
                  boxShadow: active ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
                }}
              >
                {c.icon}
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Product cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {PRODUCT_ORDER.map((id) => {
            const p = CATALOG[id];
            return (
              <div
                key={p.id}
                onClick={() => onOpenProduct(p.id)}
                style={{
                  borderRadius: 22,
                  background: "#fff",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                <div
                  style={{
                    height: 220,
                    background: p.bg,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "repeating-linear-gradient(135deg, rgba(0,0,0,0.03) 0 10px, transparent 10px 20px)",
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 11,
                      letterSpacing: 1.5,
                      color: p.labelColor,
                      opacity: 0.8,
                      background: "rgba(255,255,255,0.6)",
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: `1px dashed ${p.labelColor}40`,
                    }}
                  >
                    {p.label}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFav(p.id);
                    }}
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      border: "none",
                      background: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                    }}
                  >
                    <Heart
                      size={18}
                      filled={favs.includes(p.id)}
                      color={favs.includes(p.id) ? "#e74c3c" : "#111"}
                    />
                  </button>
                </div>
                <div
                  style={{
                    margin: "-36px 14px 14px",
                    background: "#fff",
                    borderRadius: 16,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative",
                    zIndex: 2,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#8a8a8a", marginTop: 2 }}>
                      {p.size}
                    </div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>
                    ${p.price.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav active="home" onOpenTracking={onOpenTracking} />
    </div>
  );
}

function BottomNav({
  active = "home",
  onOpenTracking,
}: {
  active?: "home" | "cart" | "orders" | "profile";
  onOpenTracking?: () => void;
}) {
  const items: {
    key: "home" | "cart" | "orders" | "profile";
    icon: ReactElement;
    onClick?: () => void;
  }[] = [
    { key: "home", icon: <HomeHex size={22} color="#fff" /> },
    { key: "cart", icon: <Cart size={22} color="#fff" /> },
    { key: "orders", icon: <Shield size={22} color="#fff" />, onClick: onOpenTracking },
    { key: "profile", icon: <Hex size={22} color="#fff" /> },
  ];
  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: 20,
        right: 20,
        height: 64,
        borderRadius: 40,
        background: "#1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 10px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      }}
    >
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <button
            type="button"
            key={it.key}
            onClick={it.onClick}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              border: "none",
              cursor: "pointer",
              background: isActive ? "#fff" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isActive
              ? renderNavIcon(it.key, "#111")
              : renderNavIcon(it.key, "#fff")}
          </button>
        );
      })}
    </div>
  );
}

function renderNavIcon(key: "home" | "cart" | "orders" | "profile", color: string) {
  switch (key) {
    case "home":
      return <HomeHex size={22} color={color} />;
    case "cart":
      return <Cart size={22} color={color} />;
    case "orders":
      return <Shield size={22} color={color} />;
    case "profile":
      return <Hex size={22} color={color} />;
  }
}

/* ------------------------------------------------------------------ */
/*  Product                                                            */
/* ------------------------------------------------------------------ */

type ProductProps = {
  accent: string;
  productId: ProductId;
  favs: ProductId[];
  toggleFav: (id: ProductId) => void;
  onBack: () => void;
  onAddToCart: () => void;
};

export function ProductScreen({
  productId,
  favs,
  toggleFav,
  onBack,
  onAddToCart,
}: ProductProps) {
  const [qty, setQty] = useState(1);
  const p = CATALOG[productId];
  const isFav = favs.includes(productId);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#ECECEC",
        position: "relative",
      }}
    >
      <div
        className="no-scrollbar"
        style={{ flex: 1, overflow: "auto", padding: "54px 18px 140px" }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <button type="button" onClick={onBack} style={roundBtn}>
            <Arrow size={20} />
          </button>
          <button type="button" style={roundBtn}>
            <Dots size={20} />
          </button>
        </div>

        {/* Hero */}
        <div
          style={{
            height: 360,
            borderRadius: 22,
            background: p.bg,
            position: "relative",
            overflow: "hidden",
            marginBottom: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(0,0,0,0.03) 0 10px, transparent 10px 20px)",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: 1.5,
              color: p.labelColor,
              opacity: 0.9,
              background: "rgba(255,255,255,0.7)",
              padding: "8px 14px",
              borderRadius: 6,
              border: `1px dashed ${p.labelColor}50`,
            }}
          >
            {p.label}
          </div>
        </div>

        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 14,
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#111",
                margin: 0,
                lineHeight: 1.15,
                letterSpacing: -0.3,
                whiteSpace: "pre-line",
              }}
            >
              {p.heroTitle}
            </h2>
            <div style={{ fontSize: 13, color: "#8a8a8a", marginTop: 6 }}>
              {p.size}
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggleFav(productId)}
            style={{ ...roundBtn, flexShrink: 0 }}
          >
            <Heart size={20} filled={isFav} color={isFav ? "#e74c3c" : "#111"} />
          </button>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {p.tags.map((t) => (
            <div
              key={t.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 20,
                background: "#fff",
                fontSize: 13,
                fontWeight: 600,
                color: "#2f5c24",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              {t.icon} {t.label}
            </div>
          ))}
        </div>

        {/* Nutrition */}
        <div style={{ fontSize: 19, fontWeight: 800, color: "#111", marginBottom: 12 }}>
          Nutrition facts
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {Object.entries(p.nutrition).map(([k, v]) => (
            <div
              key={k}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "12px 10px",
                textAlign: "center",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: 11, color: "#8a8a8a", marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 18,
          right: 18,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            borderRadius: 36,
            padding: 6,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            style={stepBtn}
          >
            <Minus size={18} />
          </button>
          <div style={{ width: 34, textAlign: "center", fontSize: 15, fontWeight: 700 }}>
            {qty}
          </div>
          <button type="button" onClick={() => setQty(qty + 1)} style={stepBtn}>
            <Plus size={18} />
          </button>
        </div>
        <button
          type="button"
          onClick={onAddToCart}
          style={{
            flex: 1,
            height: 56,
            borderRadius: 36,
            border: "none",
            cursor: "pointer",
            background: "#1a1a1a",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "inherit",
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
          }}
        >
          <span>Add to cart</span>
          <span style={{ fontWeight: 800 }}>${(p.price * qty).toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tracking                                                           */
/* ------------------------------------------------------------------ */

type TrackingProps = {
  onBack: () => void;
};

export function TrackingScreen({ onBack }: TrackingProps) {
  const [step, setStep] = useState(2);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s >= 3 ? 0 : s + 1)), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "#e8eef0",
      }}
    >
      {/* Real map image — replaces the code-drawn SVG map */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      >
        <Image
          src="/map.png"
          alt=""
          fill
          priority
          sizes="390px"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 18,
          right: 18,
          zIndex: 5,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <button type="button" onClick={onBack} style={mapBtn}>
          <Arrow size={20} />
        </button>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button type="button" style={mapBtn}>
            <ZoomIn size={18} />
          </button>
          <button type="button" style={mapBtn}>
            <ZoomOut size={18} />
          </button>
        </div>
      </div>

      {/* Bottom sheet */}
      <div
        style={{
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 16,
          zIndex: 6,
          background: "#fff",
          borderRadius: 24,
          padding: "18px 20px 20px",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            width: 44,
            height: 5,
            borderRadius: 3,
            background: "#d0d0d0",
            margin: "0 auto 14px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <div style={{ fontSize: 19, fontWeight: 800, color: "#111" }}>
            Your order is coming!
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#111",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Clock size={16} /> 12 min
          </div>
        </div>

        <StepTrack step={step} />

        {/* Courier card */}
        <div
          style={{
            marginTop: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#f4f4f4",
              borderRadius: 36,
              padding: "6px 16px 6px 6px",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                flexShrink: 0,
                background: "linear-gradient(135deg, #c9a278, #8a6a48)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 14,
                border: "2px solid #fff",
              }}
            >
              M
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>Mike</div>
              <div style={{ fontSize: 12, color: "#8a8a8a" }}>Courier</div>
            </div>
          </div>
          <button type="button" style={actionBtn}>
            <Phone size={18} />
          </button>
          <button type="button" style={actionBtn}>
            <Chat size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepTrack({ step }: { step: number }) {
  const steps: { key: string; icon: ReactElement }[] = [
    { key: "placed", icon: <Shield size={18} color="#fff" /> },
    { key: "packed", icon: <Bottle size={18} color="#fff" /> },
    { key: "out", icon: <Truck size={20} color="#fff" /> },
    { key: "done", icon: <Check size={16} color="#111" /> },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
      {steps.map((s, i) => {
        const active = i <= step;
        const isLast = i === steps.length - 1;
        const nextDone = i < step;
        return (
          <span key={s.key} style={{ display: "contents" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                background: active
                  ? isLast
                    ? "#e5e5e5"
                    : "#1a1a1a"
                  : "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 300ms ease",
              }}
            >
              {renderStepIcon(s.key, active ? (isLast ? "#111" : "#fff") : "#bdbdbd")}
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    margin: "0 6px",
                    backgroundImage: `radial-gradient(circle, ${
                      nextDone ? "#1a1a1a" : "#c8c8c8"
                    } 1.2px, transparent 1.4px)`,
                    backgroundSize: "8px 2px",
                    backgroundRepeat: "repeat-x",
                    backgroundPosition: "center",
                  }}
                />
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
}

function renderStepIcon(key: string, color: string) {
  switch (key) {
    case "placed":
      return <Shield size={18} color={color} />;
    case "packed":
      return <Bottle size={18} color={color} />;
    case "out":
      return <Truck size={20} color={color} />;
    case "done":
      return <Check size={16} color={color} />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */

const roundBtn: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 22,
  background: "#fff",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

const stepBtn: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 19,
  border: "1px solid #e5e5e5",
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mapBtn: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 22,
  background: "#fff",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
};

const actionBtn: CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 24,
  border: "none",
  cursor: "pointer",
  background: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
};
