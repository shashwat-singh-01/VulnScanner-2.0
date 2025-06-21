// Wraps entire dashboard layout with sidebar + content
"use client";
import { Shield, Home, Grid, MessageCircle, CheckCircle } from "lucide-react";

export default function Layout({ children }) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Shield className="icon active" />
        <Home className="icon" />
        <Grid className="icon" />
        <MessageCircle className="icon" />
        <CheckCircle className="icon" />
      </aside>
      <main className="main-content">{children}</main>
      <style jsx>{`
        .dashboard { display: flex; height: 100vh; background: #0f111a; }
        .sidebar { width: 72px; background: #161a2b; display: flex; flex-direction: column; align-items: center; padding: 16px 0; }
        .icon { margin: 24px 0; width: 28px; height: 28px; color: #576070; cursor: pointer; }
        .active { color: #3fa9f5; }
        .main-content { flex:1; display:flex; flex-direction:column; }
      `}</style>
    </div>
  );
}
