"use client";
import { Globe, Lock, Folder, Database, Mail, Search } from "lucide-react";

export default function ResultCard({ item }) {
  const getIcon = s => {
    const svc = s?.toLowerCase()||"";
    if (svc.includes("http")) return <Globe />;
    if (svc.includes("ssh")) return <Lock />;
    if (svc.includes("ftp")) return <Folder />;
    if (svc.includes("mysql")||svc.includes("sql")) return <Database />;
    if (svc.includes("mail")||svc.includes("smtp")) return <Mail />;
    return <Search />;
  };
  const badge = lvl => {
    const colors = {
      high: {bg:"#5f1b1b",text:"#f27575"},
      medium:{bg:"#4a422a",text:"#e6c97b"},
      low:{bg:"#23321f",text:"#8ecf8e"}
    }[lvl]||{bg:"#222",text:"#888"};
    return <span style={{
      background:colors.bg,color:colors.text,padding:"4px 8px",borderRadius:"4px",fontSize:"0.75rem"
    }}>{lvl.charAt(0).toUpperCase()+lvl.slice(1)} Risk</span>;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div><strong>{item.port}/tcp</strong></div>
        <div>{badge(item.risk)}</div>
      </div>
      <div className="card-body">
        <div className="svc-line">{getIcon(item.service)} {item.service || "N/A"}</div>
        <div>Product: <strong>{item.product||"--"}</strong></div>
        <div>Version: <strong>{item.version||"--"}</strong></div>
        {item.vulnerability?.length >0 &&
          <div className="vulns">Vulnerabilities:
            <ul>{item.vulnerability.map((v,i)=>(
              <li key={i}>
                <strong>{v.id}</strong> {v.title} {v.cvss && (<span>(CVSS: {v.cvss})</span>)}
              </li>
            ))}</ul>
          </div>}
      </div>
      <style jsx>{`
        .card { background:#1b2030; border:1px solid #2c3246; border-radius:6px; padding:16px; box-shadow:0 2px 8px rgba(0,0,0,0.4); }
        .card-header { display:flex; justify-content:space-between; margin-bottom:8px; }
        .svc-line { display:flex; align-items:center; margin-bottom:4px; color:#9ba3b4; }
        .svc-line :global(svg) { margin-right:6px; }
        .vulns { margin-top:8px; font-size:0.85rem; }
        .vulns ul { padding-left:18px; margin-top:4px; }
        .vulns li + li { margin-top:4px; }
      `}</style>
    </div>
  );
}
