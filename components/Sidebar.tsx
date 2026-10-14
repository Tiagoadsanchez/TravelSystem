"use client";

import Link from "next/link";
import { Compass, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NAV_GROUPS, isNavItemActive } from "@/components/nav";

interface SidebarProps {
  pathname: string;
  email: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onNavigate: () => void;
  onSignOut: () => void;
}

export default function Sidebar({
  pathname,
  email,
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onNavigate,
  onSignOut,
}: SidebarProps) {
  const className =
    "sidebar" + (collapsed ? " collapsed" : "") + (mobileOpen ? " open" : "");

  return (
    <aside className={className}>
      <div className="sidebar-header">
        <Link href="/" className="sidebar-brand" onClick={onNavigate}>
          <Compass size={26} aria-hidden="true" />
          <span className="sidebar-label">Rumbo</span>
        </Link>
        <button
          type="button"
          className="icon-btn sidebar-collapse-btn"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
          title={collapsed ? "Expandir menú" : "Contraer menú"}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Principal">
        {NAV_GROUPS.map((group, i) => (
          <div key={group.title ?? i}>
            {group.title && <div className="sidebar-group-title">{group.title}</div>}
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isNavItemActive(item, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={"sidebar-link" + (active ? " active" : "")}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  onClick={onNavigate}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-avatar" aria-hidden="true">
          {email.charAt(0) || "?"}
        </div>
        <div className="sidebar-email" title={email}>
          {email}
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={onSignOut}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
