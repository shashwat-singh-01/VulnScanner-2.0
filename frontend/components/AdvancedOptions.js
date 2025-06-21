"use client";
export default function AdvancedOptions({
  customPorts, setCustomPorts,
  useUDP, setUseUDP,
  timing, setTiming,
  script, setScript
}) {
  return (
    <div className="advanced-panel">
      <label>Custom Ports<input value={customPorts} onChange={e=>setCustomPorts(e.target.value)} placeholder="e.g. 21,22,443" /></label>
      <label><input type="checkbox" checked={useUDP} onChange={()=>setUseUDP(!useUDP)} /> Include UDP Scan</label>
      <label>Timing<select value={timing} onChange={e=>setTiming(e.target.value)}>
        {["T1","T3","T4","T5"].map(t=>(
          <option key={t} value={t}>{t}</option>
        ))}
      </select></label>
      <label>Script<input value={script} onChange={e=>setScript(e.target.value)} placeholder="e.g. vulners" /></label>
      <style jsx>{`
        .advanced-panel { background:#1b2030; padding:16px; border:1px solid #2c3246; border-radius:6px; display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; margin-top:12px; }
        label { display:flex; flex-direction:column; color:#9ba3b4; font-size:0.875rem; }
        input, select { margin-top:4px; padding:6px 10px; background:#161a2b; border:1px solid #2c3246; border-radius:4px; color:#ffffff; }
        input[type=checkbox] { width:auto; margin:0; margin-right:4px; }
      `}</style>
    </div>
  );
}
