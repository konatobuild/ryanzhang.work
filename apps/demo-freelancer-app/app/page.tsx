"use client";

import { useEffect, useState } from "react";
import { GuildApp } from "@/components/GuildApp";
import { IOSDevice } from "@/components/IOSDevice";

const DEVICE_WIDTH = 402;
const DEVICE_HEIGHT = 874;

export default function GuildPrototype() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      const padH = 60;
      const padV = 40;
      const sw = (window.innerWidth - padH * 2) / DEVICE_WIDTH;
      const sh = (window.innerHeight - padV * 2) / DEVICE_HEIGHT;
      setScale(Math.min(1.2, Math.max(0.5, Math.min(sw, sh))));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(1000px 600px at 30% -10%, rgba(202,255,63,0.07), transparent 60%), radial-gradient(800px 500px at 100% 110%, rgba(94,240,200,0.05), transparent 60%), #0b0b0d",
      }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={DEVICE_WIDTH} height={DEVICE_HEIGHT} dark>
          <GuildApp />
        </IOSDevice>
      </div>
    </main>
  );
}
