import { Icon } from "./icons";
import {
  CATALOG,
  COMPANY,
  NAV_MAIN,
  WORKSPACE,
  type NavId,
  type NavItemSpec,
} from "../lib/data";

interface Props {
  active: NavId;
  onNavigate: (id: NavId) => void;
  brandName: string;
  brandMark: string;
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: NavItemSpec;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={"nav-item" + (active ? " active" : "")}
      onClick={onClick}
    >
      <span className="ic">
        <Icon name={item.icon} size={16} />
      </span>
      <span>{item.label}</span>
    </button>
  );
}

export function Sidebar({ active, onNavigate, brandName, brandMark }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-left">
          <div className="brand-mark">{brandMark}</div>
          <div className="brand-name">{brandName}</div>
          <span className="brand-chev">
            <Icon name="chevronDown" size={14} />
          </span>
        </div>
        <button type="button" className="brand-icon-btn" aria-label="Toggle sidebar">
          <Icon name="sidebar" size={15} />
        </button>
      </div>

      <div className="search">
        <Icon name="search" size={15} />
        <input placeholder="Search" aria-label="Search" />
        <span className="kbd">⌘K</span>
      </div>

      <div className="nav-group">
        {NAV_MAIN.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={active === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </div>

      <div className="nav-group">
        <div className="nav-label">Workspace</div>
        {WORKSPACE.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={active === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </div>

      <div className="nav-group">
        <div className="nav-label">Catalog</div>
        {CATALOG.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={active === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </div>

      <div className="nav-group">
        <div className="nav-label">Company</div>
        {COMPANY.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={active === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </div>

      <div className="sidebar-foot">
        <button type="button" className="foot-btn">
          <Icon name="send" size={13} /> Invite
        </button>
        <button type="button" className="foot-btn">
          <Icon name="book" size={13} /> Tutorials
        </button>
      </div>
    </aside>
  );
}
