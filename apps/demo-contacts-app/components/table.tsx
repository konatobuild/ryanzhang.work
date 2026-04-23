"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Icons } from "./icons";
import { StatsRow } from "./stats";
import {
  CONTACTS,
  STATUS_META,
  TAG_OPTIONS,
  type Contact,
  type ContactStatus,
  type ContactTag,
} from "../lib/data";

type StyleMap = Record<string, CSSProperties>;

export type Density = "comfortable" | "compact";

const tableStyles: StyleMap = {
  host: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
    background: "var(--paper)",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 18px",
    borderBottom: "1px solid var(--border)",
    gap: 12,
  },
  tabs: { display: "flex", alignItems: "center", gap: 2 },
  tab: {
    padding: "6px 10px",
    fontSize: 13,
    color: "var(--muted)",
    cursor: "pointer",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  tabActive: { color: "var(--ink)", background: "var(--hover)" },
  tabCount: {
    fontFamily: "var(--mono)",
    fontSize: 10.5,
    color: "var(--muted)",
    background: "var(--border)",
    padding: "1px 5px",
    borderRadius: 3,
  },
  tabAdd: { padding: "6px 8px", color: "var(--muted)", cursor: "pointer", borderRadius: 6 },
  topActions: { display: "flex", alignItems: "center", gap: 8 },
  primaryBtn: {
    background: "var(--ink)",
    color: "var(--paper)",
    border: "none",
    padding: "7px 12px",
    borderRadius: 7,
    fontSize: 12.5,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  ghostBtn: {
    border: "1px solid var(--border)",
    background: "var(--paper)",
    padding: "7px 10px",
    borderRadius: 7,
    fontSize: 12.5,
    color: "var(--ink-2)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  iconBtn: {
    border: "1px solid var(--border)",
    background: "var(--paper)",
    width: 30,
    height: 30,
    borderRadius: 7,
    color: "var(--muted)",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 18px",
    borderBottom: "1px solid var(--border)",
  },
  toolLeft: { display: "flex", alignItems: "center", gap: 10 },
  toolBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12.5,
    color: "var(--ink-2)",
    cursor: "pointer",
    padding: "5px 9px",
    borderRadius: 6,
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 9px",
    borderRadius: 6,
    color: "var(--muted)",
    cursor: "pointer",
  },
  customize: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12.5,
    color: "var(--muted)",
    cursor: "pointer",
  },
  tableWrap: { flex: 1, overflow: "auto", position: "relative" },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    fontSize: 13,
  },
  th: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    background: "var(--paper)",
    textAlign: "left",
    fontWeight: 500,
    fontSize: 11,
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    padding: "10px 14px",
    borderBottom: "1px solid var(--border)",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  thCheck: { width: 38, padding: "10px 0 10px 18px" },
  td: {
    padding: "0 14px",
    borderBottom: "1px solid var(--border-soft)",
    height: 44,
    color: "var(--ink)",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  tdCheck: { padding: "0 0 0 18px", width: 38 },
  rowHover: { background: "var(--hover)" },
  rowSelected: { background: "var(--accent-bg)" },
  nameCell: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    fontSize: 10,
    fontWeight: 600,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  status: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 500,
  },
  statusDot: { width: 5, height: 5, borderRadius: "50%" },
  check: {
    width: 16,
    height: 16,
    borderRadius: 4,
    border: "1.5px solid var(--border-strong)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    background: "var(--paper)",
    transition: "border-color .12s, background .12s",
  },
  checkOn: {
    background: "var(--ink)",
    borderColor: "var(--ink)",
    color: "var(--paper)",
  },
  bulkBar: {
    position: "absolute",
    bottom: 22,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: 2,
    background: "var(--ink)",
    color: "var(--paper)",
    borderRadius: 10,
    padding: 5,
    boxShadow: "0 10px 28px -8px rgba(0,0,0,.35), 0 2px 8px rgba(0,0,0,.18)",
    fontSize: 12.5,
    zIndex: 10,
  },
  bulkClose: {
    width: 28,
    height: 28,
    display: "grid",
    placeItems: "center",
    borderRadius: 6,
    cursor: "pointer",
    color: "oklch(0.75 0.01 80)",
  },
  bulkCount: { padding: "0 10px 0 4px", color: "oklch(0.85 0.01 80)" },
  bulkCountNum: {
    color: "var(--paper)",
    fontWeight: 600,
    fontFamily: "var(--mono)",
    marginLeft: 6,
  },
  bulkBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
  bulkSep: {
    width: 1,
    height: 20,
    background: "oklch(0.28 0.005 80)",
    margin: "0 2px",
  },
  filterPop: {
    position: "absolute",
    top: 44,
    left: 14,
    background: "var(--paper)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: 12,
    width: 280,
    zIndex: 20,
    boxShadow: "0 16px 36px -10px rgba(0,0,0,.18)",
  },
  searchPop: {
    position: "absolute",
    top: 44,
    left: 90,
    background: "var(--paper)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "8px 10px",
    width: 320,
    zIndex: 20,
    boxShadow: "0 16px 36px -10px rgba(0,0,0,.18)",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  filterLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "var(--muted)",
    marginBottom: 6,
    marginTop: 8,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 8px",
    border: "1px solid var(--border)",
    borderRadius: 999,
    fontSize: 11.5,
    color: "var(--ink-2)",
    cursor: "pointer",
    marginRight: 4,
    marginBottom: 4,
    background: "var(--paper)",
  },
  chipOn: {
    background: "var(--accent-bg)",
    borderColor: "var(--accent-border)",
    color: "var(--accent-ink)",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(20,20,20,.28)",
    backdropFilter: "blur(2px)",
    display: "grid",
    placeItems: "center",
    zIndex: 60,
  },
  modal: {
    background: "var(--paper)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    width: 440,
    boxShadow: "0 30px 80px -20px rgba(0,0,0,.35)",
    overflow: "hidden",
  },
  modalHead: {
    padding: "16px 20px 12px 20px",
    borderBottom: "1px solid var(--border)",
  },
  modalTitle: { fontSize: 15, fontWeight: 600, letterSpacing: -0.2 },
  modalSub: { fontSize: 12, color: "var(--muted)", marginTop: 2 },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    padding: "10px 20px",
  },
  flabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "var(--muted)",
  },
  input: {
    border: "1px solid var(--border)",
    borderRadius: 7,
    padding: "8px 10px",
    fontSize: 13,
    background: "var(--paper)",
    color: "var(--ink)",
    outline: "none",
    fontFamily: "inherit",
  },
  modalFoot: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    padding: "14px 20px",
    borderTop: "1px solid var(--border)",
    marginTop: 6,
  },
};

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  const hues = [25, 55, 130, 180, 220, 280, 340];
  const hue = hues[Math.abs(h) % hues.length];
  return {
    bg: `oklch(0.93 0.03 ${hue})`,
    fg: `oklch(0.38 0.08 ${hue})`,
    border: `oklch(0.86 0.04 ${hue})`,
  };
}

interface CheckProps {
  on?: boolean;
  half?: boolean;
  onClick?: () => void;
}

function Check({ on, half, onClick }: CheckProps) {
  return (
    <div
      style={{ ...tableStyles.check, ...(on || half ? tableStyles.checkOn : {}) }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {on && (
        <span style={{ width: 10, height: 10, display: "grid", placeItems: "center" }}>
          {Icons.check}
        </span>
      )}
      {half && !on && (
        <span style={{ width: 8, height: 1.5, background: "var(--paper)" }} />
      )}
    </div>
  );
}

function StatusPill({ status }: { status: ContactStatus }) {
  const m = STATUS_META[status];
  return (
    <span style={{ ...tableStyles.status, background: m.bg, color: m.fg }}>
      <span style={{ ...tableStyles.statusDot, background: m.dot }} />
      {m.label}
    </span>
  );
}

interface TableRowProps {
  c: Contact;
  selected: boolean;
  onToggle: (id: number) => void;
  density: Density;
}

function TableRow({ c, selected, onToggle, density }: TableRowProps) {
  const [hover, setHover] = useState(false);
  const av = avatarColor(c.name);
  const initials = c.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const rowStyle: CSSProperties = {
    ...tableStyles.td,
    ...(hover ? tableStyles.rowHover : {}),
    ...(selected ? tableStyles.rowSelected : {}),
    height: density === "compact" ? 38 : 48,
  };
  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onToggle(c.id)}
      style={{ cursor: "pointer" }}
    >
      <td style={{ ...rowStyle, ...tableStyles.tdCheck }}>
        <Check on={selected} onClick={() => onToggle(c.id)} />
      </td>
      <td style={rowStyle}>
        <div style={tableStyles.nameCell}>
          <div
            style={{
              ...tableStyles.avatar,
              background: av.bg,
              color: av.fg,
              border: `1px solid ${av.border}`,
            }}
          >
            {initials}
          </div>
          <span style={{ fontWeight: 500, color: "var(--ink)" }}>{c.name}</span>
          {c.tags.includes("board") && (
            <span style={{ color: "var(--warn)" }}>{Icons.star}</span>
          )}
        </div>
      </td>
      <td style={{ ...rowStyle, color: "var(--ink-2)" }}>{c.company}</td>
      <td style={{ ...rowStyle, color: "var(--ink-2)" }}>{c.position}</td>
      <td style={{ ...rowStyle, color: "var(--ink-2)" }}>{c.city}</td>
      <td style={rowStyle}>
        <StatusPill status={c.status} />
      </td>
    </tr>
  );
}

type SortCol = "name" | "company" | "position" | "city" | "status";
interface SortState {
  col: SortCol;
  dir: "asc" | "desc";
}

interface SortHeaderProps {
  label: string;
  col: SortCol;
  sort: SortState;
  setSort: Dispatch<SetStateAction<SortState>>;
  w: string;
  first?: boolean;
}

function SortHeader({ label, col, sort, setSort, w, first }: SortHeaderProps) {
  const active = sort.col === col;
  const [h, setH] = useState(false);
  const onClick = () => {
    if (sort.col === col)
      setSort({ col, dir: sort.dir === "asc" ? "desc" : "asc" });
    else setSort({ col, dir: "asc" });
  };
  return (
    <th
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        ...tableStyles.th,
        ...(first ? { paddingLeft: 14 } : {}),
        width: w,
        color: active ? "var(--ink)" : h ? "var(--ink-2)" : "var(--muted)",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {label}
        {(active || h) && (
          <span
            style={{
              opacity: active ? 1 : 0.5,
              transform:
                active && sort.dir === "desc" ? "rotate(180deg)" : "none",
              display: "grid",
              placeItems: "center",
            }}
          >
            {Icons.up}
          </span>
        )}
      </span>
    </th>
  );
}

interface FilterState {
  status?: ContactStatus[];
  tag?: ContactTag[];
}

interface FilterPopoverProps {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  onClose: () => void;
}

function FilterPopover({ filters, setFilters, onClose }: FilterPopoverProps) {
  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest("[data-filter-pop]")) onClose();
    };
    const id = window.setTimeout(() => window.addEventListener("click", close), 0);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("click", close);
    };
  }, [onClose]);

  const toggleStatus = (val: ContactStatus) => {
    const cur = filters.status ?? [];
    setFilters({
      ...filters,
      status: cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val],
    });
  };
  const toggleTag = (val: ContactTag) => {
    const cur = filters.tag ?? [];
    setFilters({
      ...filters,
      tag: cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val],
    });
  };

  return (
    <div data-filter-pop style={tableStyles.filterPop}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Filter</div>
      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>Narrow this view</div>

      <div style={tableStyles.filterLabel}>Status</div>
      <div>
        {(Object.keys(STATUS_META) as ContactStatus[]).map((k) => (
          <span
            key={k}
            style={{
              ...tableStyles.chip,
              ...((filters.status ?? []).includes(k) ? tableStyles.chipOn : {}),
            }}
            onClick={() => toggleStatus(k)}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: STATUS_META[k].dot,
              }}
            />
            {STATUS_META[k].label}
          </span>
        ))}
      </div>

      <div style={tableStyles.filterLabel}>Tag</div>
      <div>
        {TAG_OPTIONS.map((t) => (
          <span
            key={t}
            style={{
              ...tableStyles.chip,
              ...((filters.tag ?? []).includes(t) ? tableStyles.chipOn : {}),
            }}
            onClick={() => toggleTag(t)}
          >
            #{t}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
          paddingTop: 10,
          borderTop: "1px solid var(--border)",
        }}
      >
        <button
          style={{ ...tableStyles.ghostBtn, padding: "4px 8px" }}
          onClick={() => setFilters({})}
        >
          Clear
        </button>
        <button
          style={{ ...tableStyles.primaryBtn, padding: "4px 10px" }}
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
}

interface SearchPopoverProps {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  onClose: () => void;
}

function SearchPopover({ query, setQuery, onClose }: SearchPopoverProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest("[data-search-pop]")) onClose();
    };
    const id = window.setTimeout(() => window.addEventListener("click", close), 0);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("click", close);
    };
  }, [onClose]);
  return (
    <div data-search-pop style={tableStyles.searchPop}>
      <span style={{ color: "var(--muted)", display: "grid", placeItems: "center" }}>
        {Icons.search}
      </span>
      <input
        ref={ref}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, company, city…"
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          fontSize: 13,
          background: "transparent",
          color: "var(--ink)",
          fontFamily: "inherit",
        }}
      />
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10.5,
          color: "var(--muted)",
          border: "1px solid var(--border)",
          padding: "1px 5px",
          borderRadius: 4,
        }}
      >
        ESC
      </span>
    </div>
  );
}

function NewContactModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={tableStyles.modalBackdrop} onClick={onClose}>
      <div style={tableStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={tableStyles.modalHead}>
          <div style={tableStyles.modalTitle}>New contact</div>
          <div style={tableStyles.modalSub}>
            Add someone to your network. You can enrich later.
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            padding: "4px 0 12px 0",
          }}
        >
          <div style={tableStyles.field}>
            <span style={tableStyles.flabel}>First name</span>
            <input style={tableStyles.input} defaultValue="Ava" />
          </div>
          <div style={tableStyles.field}>
            <span style={tableStyles.flabel}>Last name</span>
            <input style={tableStyles.input} defaultValue="Martell" />
          </div>
          <div style={{ ...tableStyles.field, gridColumn: "1 / -1" }}>
            <span style={tableStyles.flabel}>Company</span>
            <input style={tableStyles.input} placeholder="e.g. Northwind Paper" />
          </div>
          <div style={tableStyles.field}>
            <span style={tableStyles.flabel}>Role</span>
            <input style={tableStyles.input} placeholder="Role" />
          </div>
          <div style={tableStyles.field}>
            <span style={tableStyles.flabel}>City</span>
            <input style={tableStyles.input} placeholder="City" />
          </div>
        </div>
        <div style={tableStyles.modalFoot}>
          <button style={tableStyles.ghostBtn} onClick={onClose}>
            Cancel
          </button>
          <button style={tableStyles.primaryBtn} onClick={onClose}>
            <span style={{ display: "grid", placeItems: "center" }}>{Icons.plus}</span>
            Add contact
          </button>
        </div>
      </div>
    </div>
  );
}

function BulkBar({ n, onClear }: { n: number; onClear: () => void }) {
  return (
    <div style={tableStyles.bulkBar}>
      <div style={tableStyles.bulkClose} onClick={onClear}>
        {Icons.x}
      </div>
      <span style={tableStyles.bulkCount}>
        Selected<span style={tableStyles.bulkCountNum}>{n}</span>
      </span>
      <div style={tableStyles.bulkSep} />
      <div style={tableStyles.bulkBtn} title="Tag">
        {Icons.tag}
      </div>
      <div style={tableStyles.bulkBtn} title="Share">
        {Icons.share}
      </div>
      <div style={tableStyles.bulkBtn} title="Archive">
        {Icons.archive}
      </div>
      <div style={tableStyles.bulkBtn} title="Delete">
        {Icons.trash}
      </div>
      <div style={tableStyles.bulkSep} />
      <div style={tableStyles.bulkBtn} title="More">
        {Icons.dots}
      </div>
    </div>
  );
}

type TabId = "default" | "priority" | "new";

interface ContactsViewProps {
  density: Density;
}

export function ContactsView({ density }: ContactsViewProps) {
  const [tab, setTab] = useState<TabId>("default");
  const [selected, setSelected] = useState<Set<number>>(new Set([4, 9, 16]));
  const [sort, setSort] = useState<SortState>({ col: "name", dir: "asc" });
  const [filters, setFilters] = useState<FilterState>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);

  const rows = useMemo(() => {
    let r = CONTACTS.slice();
    if (tab === "priority")
      r = r.filter((x) => x.status === "priority" || x.tags.includes("board"));
    if (tab === "new") r = r.filter((x) => x.status === "new");
    if (filters.status?.length)
      r = r.filter((x) => filters.status!.includes(x.status));
    if (filters.tag?.length)
      r = r.filter((x) => x.tags.some((t) => filters.tag!.includes(t)));
    if (query) {
      const q = query.toLowerCase();
      r = r.filter(
        (x) =>
          x.name.toLowerCase().includes(q) ||
          x.company.toLowerCase().includes(q) ||
          x.city.toLowerCase().includes(q) ||
          x.position.toLowerCase().includes(q),
      );
    }
    r.sort((a, b) => {
      const av = (a[sort.col] || "").toString().toLowerCase();
      const bv = (b[sort.col] || "").toString().toLowerCase();
      return (av < bv ? -1 : av > bv ? 1 : 0) * (sort.dir === "asc" ? 1 : -1);
    });
    return r;
  }, [tab, sort, filters, query]);

  const allVisibleSelected =
    rows.length > 0 && rows.every((r) => selected.has(r.id));
  const someSelected = rows.some((r) => selected.has(r.id));

  const toggle = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };
  const toggleAll = () => {
    const next = new Set(selected);
    if (allVisibleSelected) {
      rows.forEach((r) => next.delete(r.id));
    } else {
      rows.forEach((r) => next.add(r.id));
    }
    setSelected(next);
  };

  const tabs: Array<{ id: TabId; label: string; count: number }> = [
    { id: "default", label: "All", count: CONTACTS.length },
    {
      id: "priority",
      label: "Priority",
      count: CONTACTS.filter(
        (c) => c.status === "priority" || c.tags.includes("board"),
      ).length,
    },
    {
      id: "new",
      label: "Recently added",
      count: CONTACTS.filter((c) => c.status === "new").length,
    },
  ];

  const filterCount =
    (filters.status?.length ?? 0) + (filters.tag?.length ?? 0);

  return (
    <div style={tableStyles.host}>
      <div style={tableStyles.topbar}>
        <div style={tableStyles.tabs}>
          {tabs.map((t) => (
            <div
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                ...tableStyles.tab,
                ...(tab === t.id ? tableStyles.tabActive : {}),
              }}
            >
              <span>{t.label}</span>
              <span style={tableStyles.tabCount}>{t.count}</span>
            </div>
          ))}
          <div style={tableStyles.tabAdd}>{Icons.plus}</div>
        </div>
        <div style={tableStyles.topActions}>
          <button style={tableStyles.ghostBtn}>
            <span style={{ display: "grid", placeItems: "center" }}>
              {Icons.share}
            </span>
            Share
          </button>
          <button
            style={tableStyles.primaryBtn}
            onClick={() => setModal(true)}
          >
            <span style={{ display: "grid", placeItems: "center" }}>
              {Icons.plus}
            </span>
            New contact
          </button>
          <button style={tableStyles.iconBtn}>{Icons.dots}</button>
        </div>
      </div>

      <StatsRow />

      <div style={{ position: "relative" }}>
        <div style={tableStyles.toolbar}>
          <div style={tableStyles.toolLeft}>
            <div
              style={{
                ...tableStyles.toolBtn,
                background: filterOpen ? "var(--hover)" : "transparent",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setFilterOpen((v) => !v);
                setSearchOpen(false);
              }}
            >
              <span
                style={{ color: "var(--muted)", display: "grid", placeItems: "center" }}
              >
                {Icons.filter}
              </span>
              Filters
              {filterCount > 0 && (
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--accent-ink)",
                    background: "var(--accent-bg)",
                    border: "1px solid var(--accent-border)",
                    padding: "0 5px",
                    borderRadius: 3,
                  }}
                >
                  {filterCount}
                </span>
              )}
            </div>
            <div
              style={tableStyles.searchWrap}
              onClick={(e) => {
                e.stopPropagation();
                setSearchOpen((v) => !v);
                setFilterOpen(false);
              }}
            >
              <span style={{ display: "grid", placeItems: "center" }}>
                {Icons.search}
              </span>
              <span style={{ fontSize: 12.5 }}>
                {query ? (
                  <span style={{ color: "var(--ink)" }}>&quot;{query}&quot;</span>
                ) : (
                  "Search"
                )}
              </span>
            </div>
          </div>
          <div style={tableStyles.customize}>
            <span style={{ display: "grid", placeItems: "center" }}>
              {Icons.sliders}
            </span>
            Customize view
          </div>
        </div>

        {filterOpen && (
          <FilterPopover
            filters={filters}
            setFilters={setFilters}
            onClose={() => setFilterOpen(false)}
          />
        )}
        {searchOpen && (
          <SearchPopover
            query={query}
            setQuery={setQuery}
            onClose={() => setSearchOpen(false)}
          />
        )}
      </div>

      <div style={tableStyles.tableWrap}>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              <th style={{ ...tableStyles.th, ...tableStyles.thCheck }}>
                <Check
                  on={allVisibleSelected}
                  half={!allVisibleSelected && someSelected}
                  onClick={toggleAll}
                />
              </th>
              <SortHeader
                label="Name"
                col="name"
                sort={sort}
                setSort={setSort}
                w="24%"
                first
              />
              <SortHeader
                label="Company"
                col="company"
                sort={sort}
                setSort={setSort}
                w="20%"
              />
              <SortHeader
                label="Role"
                col="position"
                sort={sort}
                setSort={setSort}
                w="22%"
              />
              <SortHeader
                label="City"
                col="city"
                sort={sort}
                setSort={setSort}
                w="16%"
              />
              <SortHeader
                label="Status"
                col="status"
                sort={sort}
                setSort={setSort}
                w="12%"
              />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <TableRow
                key={c.id}
                c={c}
                selected={selected.has(c.id)}
                onToggle={toggle}
                density={density}
              />
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: 60,
                    textAlign: "center",
                    color: "var(--muted)",
                  }}
                >
                  No contacts match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {selected.size > 0 && (
          <BulkBar n={selected.size} onClear={() => setSelected(new Set())} />
        )}
      </div>

      {modal && <NewContactModal onClose={() => setModal(false)} />}
    </div>
  );
}
