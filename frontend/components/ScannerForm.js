"use client"

import { useEffect, useState } from "react"
import {
  Shield,
  Home,
  Grid3X3,
  MessageSquare,
  CheckCircle,
  ChevronDown,
  Download,
  Target,
} from "lucide-react"

export default function ScannerForm() {
  const [ip, setIp] = useState("")
  const [customPorts, setCustomPorts] = useState("")
  const [useUDP, setUseUDP] = useState(false)
  const [timing, setTiming] = useState("T4")
  const [script, setScript] = useState("vulners")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [advancedOpen, setAdvancedOpen] = useState(true)

  const handleScan = async () => {
    if (!ip.trim()) return
    setLoading(true)
    setError("")
    setResults([])

    try {
      const res = await fetch(
        `http://localhost:8000/scan?ip=${ip}&ports=${customPorts}&udp=${useUDP}&timing=${timing}&script=${script}`
      )
      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResults(
          Array.isArray(data.results)
            ? data.results.map((r) => ({ ...r, showVulns: false }))
            : []
        )
      }
    } catch (err) {
      setError("❌ Server not reachable or scan failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0f1419] text-white font-mono">
      {/* 🔵 Background Bubble + Dots */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="particles-bg"></div>
        <div className="particles-bg"></div>
        <div className="particles-bg"></div>
        <div className="particles-bg"></div>
        <div className="particles-bg"></div>
        <div className="particles-bg"></div>
        <div className="glow-bubble"></div>
      </div>

      {/* 🧱 Layout */}
      <div className="relative flex h-screen w-full pl-[72px]">
       {/* Sidebar */}
        <div className="fixed top-0 left-0 w-[72px] h-screen z-40 bg-[#1a2332]/30 backdrop-blur-sm border-r border-[#2a3441] flex flex-col items-center py-11 space-y-10">
          {[Shield, Home, Grid3X3, MessageSquare, CheckCircle].map((Icon, i) => (
            <div
              key={i}
              className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#2a3441]"
            >
              <Icon className="w-5 h-5 text-[#38bdf8] glow-icon transition-all duration-300" />
            </div>
          ))}

        </div>





        {/* Main Content */}
        <div className="flex-1 flex h-full overflow-hidden">
          {/* Form Section */}
          <div className="flex flex-col justify-between px-12 py-10 max-w-[600px] w-full">
            <div className="overflow-y-auto pr-2 space-y-8">
              {/* Header */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#0ea5e9] bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-[#0ea5e9]" />
                </div>
                <h1 className="text-[32px] font-bold text-white tracking-tight glow">
                  VulnScanner
                </h1>
              </div>

              {/* IP Input & Scan */}
              <div className="flex space-x-4">
                <input
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleScan()
                    }
                  }}
                  type="text"
                  placeholder="Enter IP or Domain"
                  className="w-full h-[52px] bg-[#1e2936] border border-[#374151] rounded-lg px-4 text-white text-[16px]"
                />
                <button
                  onClick={handleScan}
                  disabled={loading}
                  className="bg-[#0ea5e9] border border-[#38bdf8]/40 hover:border-[#38bdf8] hover:shadow-[0_0_18px_#38bdf8cc] hover:bg-[#0ea5e9]/50 transition-all duration-300 flex items-center space-x-3 text-white px-8 h-[52px] rounded-lg text-[16px] font-medium"
                >
                  {loading ? "Scanning..." : "Scan"}
                </button>
              </div>

              {/* Advanced Options */}
              <div className="bg-[#1a2332] bg-opacity-60 rounded-xl border border-[#2a3441] p-6">
                <button
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  className="flex items-center justify-between w-full text-white text-[18px] font-medium mb-4"
                >
                  Advanced Options
                  <ChevronDown className={`w-5 h-5 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
                </button>

                {advancedOpen && (
                  <div className="space-y-5">
                    <div>
                      <label className="text-[#94a3b8] text-[14px] font-medium mb-1 block">Custom Ports</label>
                      <input
                        value={customPorts}
                        onChange={(e) => setCustomPorts(e.target.value)}
                        type="text"
                        placeholder="21,22,80"
                        className="w-full h-[44px] bg-[#0f1419] border border-[#374151] rounded-lg px-4 text-white text-[14px]"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={useUDP}
                        onChange={(e) => setUseUDP(e.target.checked)}
                        className="accent-[#0ea5e9]"
                      />
                      <label className="text-white text-[15px] font-medium">Include UDP Scan (-sU)</label>
                    </div>
                    <div>
                      <label className="text-[#94a3b8] text-[14px] font-medium mb-1 block">Timing</label>
                      <select
                        value={timing}
                        onChange={(e) => setTiming(e.target.value)}
                        className="w-full h-[44px] bg-[#0f1419] border border-[#374151] rounded-lg px-4 text-white text-[14px]"
                      >
                        <option value="T1">T1 - Slow</option>
                        <option value="T3">T3 - Normal</option>
                        <option value="T4">T4 - Fast</option>
                        <option value="T5">T5 - Aggressive</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[#94a3b8] text-[14px] font-medium mb-1 block">Nmap Script Category</label>
                      <input
                        value={script}
                        onChange={(e) => setScript(e.target.value)}
                        type="text"
                        placeholder="e.g. vulners, ssl*"
                        className="w-full h-[44px] bg-[#0f1419] border border-[#374151] rounded-lg px-4 text-white text-[14px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Download Button */}
            <div className="mt-4">
              {results.length > 0 && (
                <div className="absolute right-[32px] top-1/2 transform -translate-y-1/2 z-50 w-[400px] flex justify-center">
                <button
                  type="button"
                  onClick={async () => {
                    if (!ip || results.length === 0) return

                    const res = await fetch("http://localhost:8000/generate_report", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ target: ip, results }),
                    })

                    if (!res.ok) {
                      alert("❌ Failed to generate report.")
                      return
                    }

                    const blob = await res.blob()
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement("a")
                    link.href = url
                    link.download = `${ip}_report.pdf`
                    link.click()
                    window.URL.revokeObjectURL(url)
                  }}
                  className="px-8 py-4 text-white text-[17px] font-semibold rounded-xl bg-[#0ea5e9] border border-[#38bdf8]/40 hover:border-[#38bdf8] hover:shadow-[0_0_18px_#38bdf8cc] hover:bg-[#0ea5e9]/50 transition-all duration-300 flex items-center space-x-3"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
                </div>
              )}
            </div>

          </div>

          {/* Scan Results Panel */}
          <div className="w-[380px] bg-[#1a2332] bg-opacity-40 backdrop-blur-sm border-l border-[#2a3441] p-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-[#dc2626] bg-opacity-20 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-[#dc2626]" />
              </div>
              <h2 className="text-[20px] font-bold text-white">Scan Results</h2>
            </div>

            <div className="space-y-4">
              {loading && <p className="text-white animate-pulse">🔄 Scan may take time. Please wait...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {results.map((r, i) => (
                <div key={i} className="bg-[#1e2936] rounded-lg p-4 border border-[#374151]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-medium text-[15px]">Port: {r.port}/tcp</span>
                    <span className={`px-2 py-1 rounded text-[12px] font-medium ${
                      r.risk === "high"
                        ? "bg-[#dc2626] bg-opacity-20 text-[#fca5a5]"
                        : "bg-[#059669] bg-opacity-20 text-[#6ee7b7]"
                    }`}>
                      {r.risk ? `${r.risk[0].toUpperCase()}${r.risk.slice(1)} Risk` : "Low Risk"}
                    </span>
                  </div>
                  <div className="text-[13px] space-y-1">
                    <div className="flex justify-between"><span className="text-[#94a3b8]">Service:</span><span className="text-[#0ea5e9]">{r.service || "N/A"}</span></div>
                    <div className="flex justify-between"><span className="text-[#94a3b8]">Product:</span><span className="text-[#e2e8f0]">{r.product || "N/A"}</span></div>
                    <div className="flex justify-between"><span className="text-[#94a3b8]">Version:</span><span className="text-[#e2e8f0]">{r.version || "N/A"}</span></div>
                    {r.vulnerability?.length > 0 && (
                      <div className="pt-2 border-t border-[#374151]">
                        <button
                          onClick={() => {
                            const updated = [...results]
                            updated[i].showVulns = !updated[i].showVulns
                            setResults(updated)
                          }}
                          className="text-[#94a3b8] text-left text-[14px] font-medium hover:text-white transition-colors"
                        >
                          {r.showVulns ? "Hide Vulnerabilities ▲" : "Show Vulnerabilities ▼"}
                        </button>

                        {r.showVulns && (
                          <ul className="ml-4 list-disc text-[#fbbf24] text-[12px] mt-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                            {Array.isArray(r.vulnerability)
                              ? r.vulnerability.map((vul, vi) => (
                                  <li key={vi}>
                                    {vul.id} {vul.cvss && `(CVSS: ${vul.cvss})`}
                                  </li>
                                ))
                              : <li>{r.vulnerability || "No vulnerabilities reported."}</li>}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
