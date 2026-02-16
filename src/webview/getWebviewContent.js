function getWebviewContent(nonce) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src 'unsafe-inline' 'nonce-${nonce}'; script-src 'nonce-${nonce}'; img-src data:;">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JSON Visualizer</title>
  <style nonce="${nonce}">
  :root {
    --canvas-bg: #f3f4f6;
    --canvas-dot: #cbd5e1;
    --bg: #e5e7eb;
    --node-bg: #ffffff;
    --node-header-bg: #f8fafc;
    --node-border: #d1d5db;
    --accent: #7538f8;
    --accent-hover: #8741ff;
    --key-color: #7c3aed;
    --string-color: #059669;
    --number-color: #d97706;
    --muted: #64748b;
    --line-color: #94a3b8;
    --sidebar-bg: #ffffff;
    --sidebar-header: #f8fafc;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --hover-bg: #f8fafc;
    --collapse-btn-bg: #e2e8f0;
    --collapse-btn-hover: #cbd5e1;
    --transition-speed: 0.3s;
    --nested-border: #e2e8f0;
    --type-badge-bg: #e0e7ff;
    --type-badge-color: #4338ca;
    --scrollbar-thumb: #cbd5e1;
    --scrollbar-thumb-hover: #94a3b8;
    --colon-color: #94a3b8;
    --connector-dot: #94a3b8;
  }

  [data-theme="dark"] {
    --canvas-bg: #0b0e14;
    --canvas-dot: #1e293b;
    --bg: #1e293b;
    --node-bg: #161b22;
    --node-header-bg: #0d1117;
    --node-border: #30363d;
    --accent: #6230cd;
    --accent-hover: #8741ff;
    --key-color: #c084fc;
    --string-color: #4ade80;
    --number-color: #fb923c;
    --muted: #8b949e;
    --line-color: #484f58;
    --sidebar-bg: #0d1117;
    --sidebar-header: #161b22;
    --text-primary: #e6edf3;
    --text-secondary: #7d8590;
    --hover-bg: #21262d;
    --collapse-btn-bg: #21262d;
    --collapse-btn-hover: #30363d;
    --transition-speed: 0.3s;
    --nested-border: #30363d;
    --type-badge-bg: #1e1b4b;
    --type-badge-color: #a78bfa;
    --scrollbar-thumb: #30363d;
    --scrollbar-thumb-hover: #484f58;
    --colon-color: #484f58;
    --connector-dot: #484f58;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: background-color var(--transition-speed) ease,
                border-color var(--transition-speed) ease,
                color var(--transition-speed) ease,
                stroke var(--transition-speed) ease;
  }

  html, body {
    height: 100%;
    overflow: hidden;
    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  }

  body {
    display: flex;
    flex-direction: column;
    background: var(--canvas-bg);
  }

  /* ---- Logo Bar ---- */
  .logo-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 14px;
    background: var(--sidebar-header);
    border-bottom: 1px solid var(--node-border);
    flex-shrink: 0;
    z-index: 100;
    height: 40px;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-icon {
    width: 24px;
    height: 24px;
    border-radius: 4px;
  }

  .logo-text {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }

  .logo-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ---- Main Container ---- */
  .main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* ---- Sidebar ---- */
  .canvas-sidebar {
    width: 360px;
    min-width: 360px;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--node-border);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    z-index: 10;
    transition: width 0.3s ease, min-width 0.3s ease, opacity 0.3s ease;
    overflow: hidden;
  }

  .canvas-sidebar.collapsed {
    width: 0;
    min-width: 0;
    border-right: none;
  }

  .sidebar-header {
    padding: 12px 16px;
    background: var(--sidebar-header);
    border-bottom: 1px solid var(--node-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 360px;
  }

  .sidebar-header h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }

  .sidebar-collapse-btn {
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    color: var(--muted);
    padding: 4px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sidebar-collapse-btn:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
  }

  /* Sidebar expand button (shown when collapsed) */
  .sidebar-expand-btn {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: 15;
    border: none;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--node-border);
    border-top: 1px solid var(--node-border);
    border-bottom: 1px solid var(--node-border);
    border-radius: 0 8px 8px 0;
    cursor: pointer;
    color: var(--muted);
    padding: 12px 4px;
    transition: all 0.2s;
    display: none;
  }

  .sidebar-expand-btn:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
  }

  .sidebar-expand-btn.visible {
    display: flex;
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: auto;
    padding: 16px;
    font-family: ui-monospace, 'SF Mono', 'Cascadia Code', monospace;
    font-size: 13px;
  }

  .sidebar-content::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  .sidebar-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .sidebar-content::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 4px;
  }

  .sidebar-content::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
  }

  .sidebar-footer {
    padding: 16px 20px;
    border-top: 1px solid var(--node-border);
    background: var(--sidebar-header);
  }

  .sidebar-links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .sidebar-link {
    padding: 8px 10px;
    border: 1px solid var(--node-border);
    border-radius: 8px;
    text-align: center;
    text-decoration: none;
    color: var(--text-primary);
    font-size: 12px;
    font-weight: 600;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
  }

  .sidebar-link:hover {
    background: var(--hover-bg);
    border-color: var(--accent);
  }

  /* ---- Input Panel ---- */
  .input-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .input-label {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: system-ui, sans-serif;
  }

  .input-panel textarea {
    width: 100%;
    min-height: 200px;
    resize: vertical;
    background: var(--node-bg);
    border: 1px solid var(--node-border);
    color: var(--text-primary);
    border-radius: 8px;
    padding: 12px;
    font-family: ui-monospace, 'SF Mono', 'Cascadia Code', monospace;
    font-size: 13px;
    line-height: 1.5;
    outline: none;
    transition: border-color 0.2s;
  }

  .input-panel textarea:focus {
    border-color: var(--accent);
  }

  .input-panel textarea::placeholder {
    color: var(--muted);
  }

  .input-panel input[type="text"] {
    width: 100%;
    padding: 10px 12px;
    background: var(--node-bg);
    border: 1px solid var(--node-border);
    color: var(--text-primary);
    border-radius: 8px;
    font-size: 13px;
    font-family: ui-monospace, monospace;
    outline: none;
    transition: border-color 0.2s;
  }

  .input-panel input[type="text"]:focus {
    border-color: var(--accent);
  }

  .input-panel input[type="text"]::placeholder {
    color: var(--muted);
  }

  .or-divider {
    text-align: center;
    color: var(--muted);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    position: relative;
    font-family: system-ui, sans-serif;
  }

  .or-divider::before,
  .or-divider::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 38%;
    height: 1px;
    background: var(--node-border);
  }

  .or-divider::before { left: 0; }
  .or-divider::after { right: 0; }

  .visualize-btn {
    padding: 12px 24px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
    font-family: system-ui, sans-serif;
  }

  .visualize-btn:hover {
    background: var(--accent-hover);
  }

  .visualize-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-message {
    display: none;
    color: #dc2626;
    font-size: 13px;
    padding: 8px 12px;
    background: rgba(220, 38, 38, 0.08);
    border-radius: 6px;
    font-family: system-ui, sans-serif;
  }

  /* ---- View Panel ---- */
  .view-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .edit-btn {
    padding: 10px 16px;
    background: transparent;
    color: var(--accent);
    border: 1px solid var(--accent);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: system-ui, sans-serif;
    margin-top: 10px;
  }

  .edit-btn:hover {
    background: var(--accent);
    color: white;
  }

  /* ---- JSON Tree (sidebar view mode) ---- */
  .json-tree {
    line-height: 1.6;
  }

  .json-item {
    padding: 4px 0;
    transition: background 0.15s;
    border-radius: 6px;
    margin: 2px 0;
  }

  .json-item:hover {
    background: var(--hover-bg);
  }

  .json-key-complex {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 6px;
    transition: background 0.15s;
  }

  .json-key-complex:hover {
    background: var(--hover-bg);
  }

  .expand-icon {
    flex-shrink: 0;
    transition: transform 0.2s;
    color: var(--muted);
  }

  .json-item.collapsed .expand-icon {
    transform: rotate(0deg);
  }

  .json-item:not(.collapsed) .expand-icon {
    transform: rotate(90deg);
  }

  .json-item.collapsed .json-nested {
    display: none;
  }

  .json-nested {
    margin-left: 8px;
    border-left: 2px solid var(--nested-border);
    padding-left: 8px;
  }

  .json-item .key {
    font-weight: 600;
    color: var(--key-color);
  }

  .json-item .value {
    color: var(--text-secondary);
  }

  .json-item .value.string {
    color: var(--string-color);
  }

  .json-item .value.number {
    color: var(--number-color);
  }

  .json-item .value.boolean {
    color: #dc2626;
    font-weight: 600;
  }

  .json-item .value.null {
    color: var(--muted);
    font-style: italic;
  }

  .type-badge {
    display: inline-block;
    padding: 2px 8px;
    background: var(--type-badge-bg);
    color: var(--type-badge-color);
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* ---- Theme Toggle ---- */
  .theme-toggle-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: var(--node-bg);
    border: 1px solid var(--node-border);
    border-radius: 8px;
    margin-bottom: 12px;
  }

  .theme-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .theme-toggle-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
  }

  .toggle-track {
    width: 36px;
    height: 18px;
    background: #cbd5e1;
    border-radius: 9px;
    position: relative;
    transition: background 0.3s;
  }

  [data-theme="dark"] .toggle-track {
    background: #3b82f6;
  }

  .toggle-thumb {
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  [data-theme="dark"] .toggle-thumb {
    transform: translateX(18px);
  }

  .toggle-thumb svg {
    width: 9px;
    height: 9px;
  }

  .sun-icon {
    color: #f59e0b;
  }

  .moon-icon {
    color: #3b82f6;
  }

  /* ---- Canvas ---- */
  .canvas-wrap {
    position: relative;
    flex: 1;
    overflow: hidden;
    cursor: grab;
    background-color: var(--canvas-bg);
    background-image: radial-gradient(var(--canvas-dot) 1.5px, transparent 1.5px);
    background-size: 32px 32px;
    user-select: none;
    transition: background-color 0.3s ease;
  }

  .canvas-wrap:active {
    cursor: grabbing;
  }

  .workspace {
    position: absolute;
    background: transparent;
    border: none;
    transform-origin: 0 0;
    transition: transform 0.1s ease-out;
  }

  /* ---- Nodes ---- */
  .node {
    position: absolute;
    width: fit-content;
    max-width: 550px;
    min-width: 220px;
    background: var(--node-bg);
    border: 1px solid var(--node-border);
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06);
    font-size: 13px;
    user-select: none;
    z-index: 10;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .node:hover {
    box-shadow: 0 8px 16px -2px rgb(0 0 0 / 0.15), 0 4px 8px -2px rgb(0 0 0 / 0.08);
  }

  .node .header {
    padding: 10px 14px;
    background: var(--node-header-bg);
    border-bottom: 1px solid var(--node-border);
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .node .title {
    font-weight: 700;
    color: var(--text-primary);
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.05em;
  }

  .collapse-btn {
    border: none;
    background: var(--collapse-btn-bg);
    border-radius: 4px;
    cursor: pointer;
    color: var(--muted);
    padding: 2px 8px;
    font-size: 10px;
    transition: all 0.2s;
  }

  .collapse-btn:hover {
    background: var(--collapse-btn-hover);
  }

  .node-body {
    max-height: 1000px;
    opacity: 1;
    padding: 12px;
    overflow-y: auto;
    overflow-x: hidden;
    transition: all 0.5s cubic-bezier(1, 0, 0.2, 1);
  }

  .node-body::-webkit-scrollbar {
    display: none;
  }

  .node-body.collapsed {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
    pointer-events: none;
  }

  .data-row {
    display: flex;
    font-family: ui-monospace, monospace;
    margin-bottom: 8px;
  }

  .data-key {
    font-weight: bold;
    color: var(--key-color);
    margin-bottom: 2px;
  }

  .data-key::after {
    content: ":";
    color: var(--colon-color);
  }

  .data-value {
    padding-left: 4px;
    color: var(--string-color);
    word-break: break-all;
  }

  .data-value.string { color: var(--string-color); }
  .data-value.number { color: var(--number-color); }
  .data-value.ref {
    color: var(--accent);
    font-style: italic;
    font-weight: 600;
  }

  /* ---- SVG Connections ---- */
  #connections {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
    z-index: 1;
  }

  .connector {
    fill: none;
    stroke: var(--line-color);
    stroke-width: 2px;
    vector-effect: non-scaling-stroke;
    transition: stroke var(--transition-speed) ease;
  }

  .connector-dot {
    fill: var(--connector-dot);
    transition: fill var(--transition-speed) ease;
  }

  /* ---- Reset View Button ---- */
  .reset-view-btn {
    position: absolute;
    bottom: 16px;
    right: 16px;
    z-index: 20;
    padding: 10px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .reset-view-btn:hover {
    background: var(--accent-hover);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    transform: translateY(-1px);
  }

  .reset-view-btn:active {
    transform: translateY(0);
  }

  /* ---- Empty State ---- */
  .empty-state {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    gap: 12px;
    text-align: center;
    padding: 40px;
    pointer-events: none;
    z-index: 5;
  }

  .empty-state-icon {
    opacity: 0.3;
  }

  .empty-state p {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0;
  }

  .empty-state span {
    font-size: 13px;
    color: var(--muted);
  }
  </style>
</head>
<body>

  <!-- Top Bar -->
  <div class="logo-bar">
    <div class="logo-section">
      <img class="logo-icon" src="data:image/png;base64,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" alt="Logo">
      <span class="logo-text">JSON Graph Visualizer</span>
    </div>
    <div class="logo-actions">
      <button class="theme-toggle-btn" id="themeToggle" data-theme="light">
        <div class="toggle-track">
          <div class="toggle-thumb">
            <svg class="sun-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="2" fill="currentColor"/>
              <path d="M6 1v1M6 10v1M11 6h-1M2 6H1M9.5 2.5l-.7.7M3.2 8.8l-.7.7M9.5 9.5l-.7-.7M3.2 3.2l-.7-.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <svg class="moon-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" style="display:none;">
              <path d="M10 6.5a4.5 4.5 0 0 1-8.5 2A4.5 4.5 0 0 0 8 2a4.5 4.5 0 0 1 2 4.5Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </button>
    </div>
  </div>

  <!-- Main Layout -->
  <div class="main-container">

    <!-- Left Sidebar -->
    <div class="canvas-sidebar">
      <div class="sidebar-header">
        <h3 id="sidebarTitle">Input</h3>
        <button class="sidebar-collapse-btn" id="sidebarCollapseBtn" title="Collapse Sidebar">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="sidebar-content">

        <!-- Input Mode -->
        <div class="input-panel" id="inputPanel">
          <label class="input-label">Paste JSON Data</label>
          <textarea id="jsonInput" placeholder='{ "name": "John", "age": 30, "address": { "city": "NYC" } }'></textarea>
          <div class="or-divider">OR</div>
          <label class="input-label">Fetch from API</label>
          <input type="text" id="apiUrlInput" placeholder="https://jsonplaceholder.typicode.com/users/1">
          <button class="visualize-btn" id="visualizeBtn">Visualize</button>
          <div class="error-message" id="errorMsg"></div>
        </div>

        <!-- View Mode (hidden initially) -->
        <div class="view-panel" id="viewPanel" style="display:none">
          <button class="edit-btn" id="editBtn">Edit Input</button>
          <div id="jsonTreeContainer"></div>
        </div>

      </div>
      <div class="sidebar-footer">
        <div class="sidebar-links">
          <a href="https://ratneshkumawat.vercel.app/" class="sidebar-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 22C14.2091 22 16 17.5228 16 12C16 6.47715 14.2091 2 12 2C9.79086 2 8 6.47715 8 12C8 17.5228 9.79086 22 12 22Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M2 12H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Portfolio
          </a>
          <a href="https://github.com/RatneshDesign/Json-Graph-Visualizer" class="sidebar-link">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.167c-3.22 0-5.833 2.612-5.833 5.833 0 2.577 1.672 4.762 3.992 5.537.292.053.398-.127.398-.281 0-.14-.005-.598-.008-1.085-1.623.353-1.965-.686-1.965-.686-.265-.675-.648-.854-.648-.854-.53-.362.04-.355.04-.355.586.042.895.602.895.602.521.893 1.368.635 1.701.486.053-.378.204-.636.371-.782-1.298-.148-2.664-.649-2.664-2.889 0-.638.228-1.16.602-1.569-.06-.148-.261-.743.057-1.548 0 0 .491-.157 1.607.6a5.579 5.579 0 0 1 1.463-.197c.496.002.996.067 1.463.197 1.115-.757 1.605-.6 1.605-.6.32.805.118 1.4.058 1.548.375.409.601.931.601 1.569 0 2.246-1.368 2.738-2.671 2.883.21.181.397.538.397 1.084 0 .782-.007 1.413-.007 1.604 0 .156.105.337.4.28a5.838 5.838 0 0 0 3.989-5.536c0-3.22-2.613-5.833-5.833-5.833Z" fill="currentColor"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>

    <!-- Right Canvas -->
    <div class="canvas-wrap" id="canvasWrap">
      <button class="sidebar-expand-btn" id="sidebarExpandBtn" title="Expand Sidebar">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="workspace" id="workspace" style="width:9000px;height:6000px">
        <svg id="connections" xmlns="http://www.w3.org/2000/svg"></svg>
      </div>
      <button class="reset-view-btn" id="resetViewBtn" title="Reset View (Fit to Screen)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <!-- Empty State -->
      <div class="empty-state" id="emptyState">
        <svg class="empty-state-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="10" y="10" width="44" height="44" rx="6" stroke="currentColor" stroke-width="2"/>
          <path d="M10 22h44M22 10v44" stroke="currentColor" stroke-width="2"/>
        </svg>
        <p>No data visualized yet</p>
        <span>Paste JSON or enter an API URL to get started</span>
      </div>
    </div>

  </div>

  <script nonce="${nonce}">
  (function() {
    // ---- VS Code API ----
    const vscode = acquireVsCodeApi();

    // ---- Runtime State ----
    const runtime = {
      container: null,
      workspace: null,
      svg: null,
      state: { x: 0, y: 0, scale: 0.7 },
      connectionList: []
    };

    // ---- Utility: escapeHTML ----
    function escapeHTML(str) {
      var s = String(str);
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    // ---- DOM: createNode ----
    function createNode(title, x, y, data) {
      var node = document.createElement("div");
      node.className = "node";
      node.style.left = x + "px";
      node.style.top = y + "px";

      node.innerHTML =
        '<div class="header">' +
          '<div class="title">' + escapeHTML(title) + '</div>' +
          '<button class="collapse-btn">\\u2212</button>' +
        '</div>' +
        '<div class="node-body"></div>';

      var body = node.querySelector(".node-body");

      Object.entries(data).forEach(function(entry) {
        var k = entry[0], v = entry[1];
        var row = document.createElement("div");
        row.className = "data-row";

        var val = v;
        var type = typeof v;

        if (v && typeof v === "object") {
          val = Array.isArray(v) ? "Array(" + v.length + ")" : "Object";
          type = "ref";
        }

        row.innerHTML =
          '<span class="data-key">' + escapeHTML(k) + '</span>' +
          '<span class="data-value ' + type + '">' + escapeHTML(val) + '</span>';

        body.appendChild(row);
      });

      runtime.workspace.appendChild(node);

      var btn = node.querySelector(".collapse-btn");
      btn.onclick = function(e) {
        e.stopPropagation();
        var isCollapsed = body.classList.toggle("collapsed");
        btn.textContent = isCollapsed ? "+" : "\\u2212";

        var startTime = performance.now();
        var animateLines = function(now) {
          runtime.connectionList.forEach(function(fn) { fn(); });
          if (now - startTime < 350) {
            requestAnimationFrame(animateLines);
          }
        };
        requestAnimationFrame(animateLines);
      };

      return node;
    }

    // ---- DOM: connect (matches core exactly) ----
    function connect(a, b) {
      var ns = "http://www.w3.org/2000/svg";

      var path = document.createElementNS(ns, "path");
      path.setAttribute("class", "connector");

      var sC = document.createElementNS(ns, "circle");
      var eC = document.createElementNS(ns, "circle");
      [sC, eC].forEach(function(c) {
        c.setAttribute("r", "5");
        c.setAttribute("class", "connector-dot");
        runtime.svg.appendChild(c);
      });
      runtime.svg.appendChild(path);

      var update = function() {
        var x1 = a.offsetLeft + (a.offsetWidth || 250);
        var y1 = a.offsetTop + 20;
        var x2 = b.offsetLeft;
        var y2 = b.offsetTop + 20;

        var cp = Math.max(Math.abs(x2 - x1) * 0.5, 40);
        path.setAttribute("d", "M " + x1 + " " + y1 + " C " + (x1 + cp) + " " + y1 + ", " + (x2 - cp) + " " + y2 + ", " + x2 + " " + y2);
        sC.setAttribute("cx", x1); sC.setAttribute("cy", y1);
        eC.setAttribute("cx", x2); eC.setAttribute("cy", y2);
      };

      runtime.connectionList.push(update);
      requestAnimationFrame(update);
    }

    // ---- Visualization: applyTransform ----
    function applyTransform() {
      var x = runtime.state.x;
      var y = runtime.state.y;
      var scale = runtime.state.scale;

      runtime.workspace.style.transform = "translate(" + x + "px, " + y + "px) scale(" + scale + ")";

      var bgX = x % (32 * scale);
      var bgY = y % (32 * scale);
      runtime.container.style.backgroundPosition = bgX + "px " + bgY + "px";
      runtime.container.style.backgroundSize = (32 * scale) + "px " + (32 * scale) + "px";

      runtime.connectionList.forEach(function(fn) { fn(); });
    }

    // ---- Visualization: centerView ----
    function centerView() {
      var nodes = runtime.workspace.querySelectorAll(".node");
      if (nodes.length === 0) return;

      var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      nodes.forEach(function(n) {
        minX = Math.min(minX, n.offsetLeft);
        minY = Math.min(minY, n.offsetTop);
        maxX = Math.max(maxX, n.offsetLeft + n.offsetWidth);
        maxY = Math.max(maxY, n.offsetTop + n.offsetHeight);
      });

      var contentW = maxX - minX;
      var contentH = maxY - minY;
      var cx = minX + contentW / 2;
      var cy = minY + contentH / 2;

      var rect = runtime.container.getBoundingClientRect();
      var pad = 100;

      var scale = Math.max(0.1, Math.min(1, Math.min(
        (rect.width - pad * 2) / contentW,
        (rect.height - pad * 2) / contentH
      )));

      runtime.state.scale = scale;
      runtime.state.x = (rect.width / 2) - (cx * scale);
      runtime.state.y = (rect.height / 2) - (cy * scale);

      applyTransform();
    }

    // ---- Sidebar: buildJSONTree ----
    function buildJSONTree(obj, level, seen) {
      var html = '<div class="json-tree">';

      var entries = Object.entries(obj);
      for (var i = 0; i < entries.length; i++) {
        var key = entries[i][0];
        var value = entries[i][1];
        var isObject = typeof value === 'object' && value !== null;
        var isArray = Array.isArray(value);

        if (isObject) {
          if (seen.has(value)) {
            html +=
              '<div class="json-item" style="padding-left: ' + (level * 4) + 'px">' +
                '<span class="key">' + escapeHTML(key) + ':</span> ' +
                '<span class="value" style="color: var(--muted); font-style: italic;">[Circular]</span>' +
              '</div>';
            continue;
          }
          seen.add(value);

          html +=
            '<div class="json-item" style="padding-left: ' + (level * 4) + 'px">' +
              '<div class="json-key-complex">' +
                '<svg class="expand-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">' +
                  '<path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
                '</svg>' +
                '<span class="key">' + escapeHTML(key) + '</span>' +
                '<span class="type-badge">' + (isArray ? 'array' : 'object') + '</span>' +
              '</div>' +
              '<div class="json-nested">' +
                buildJSONTree(value, level + 1, seen) +
              '</div>' +
            '</div>';
        } else {
          var valueType = typeof value;
          var displayValue = value === null ? 'null' :
            valueType === 'string' ? '"' + value + '"' :
            String(value);

          html +=
            '<div class="json-item" style="padding-left: ' + (level * 4) + 'px">' +
              '<span class="key">' + escapeHTML(key) + ':</span> ' +
              '<span class="value ' + valueType + '">' + escapeHTML(displayValue) + '</span>' +
            '</div>';
        }
      }

      html += '</div>';
      return html;
    }

    // ---- Sidebar: updateSidebarWithData ----
    function updateSidebarWithData(data) {
      var container = document.getElementById('jsonTreeContainer');
      if (!container) return;
      var seen = new WeakSet();
      container.innerHTML = buildJSONTree(data, 0, seen);
    }

    // ---- Visualization: visualize ----
    function visualize(data) {
      // Clear previous nodes
      runtime.workspace.querySelectorAll(".node").forEach(function(n) { n.remove(); });
      // Clear SVG children safely (innerHTML can break SVG namespace)
      while (runtime.svg.lastChild) {
        runtime.svg.removeChild(runtime.svg.lastChild);
      }
      runtime.connectionList.length = 0;

      // Update sidebar tree
      updateSidebarWithData(data);

      // Hide empty state
      var emptyState = document.getElementById('emptyState');
      if (emptyState) emptyState.style.display = 'none';

      var X_OFFSET = 600;
      var Y_GAP = 60;
      var visited = new WeakSet();

      // Pass 1: walk - create nodes and measure heights
      function walk(obj, label, x) {
        if (visited.has(obj)) {
          var circularNode = createNode(label, x, 0, { "[circular]": "ref" });
          var circularHeight = circularNode.offsetHeight;
          return { nodeEl: circularNode, actualHeight: circularHeight, branchHeight: circularHeight, children: [] };
        }
        visited.add(obj);

        var entries = Object.entries(obj);
        var primitives = entries.filter(function(e) { return typeof e[1] !== 'object' || e[1] === null; });
        var complexes = entries.filter(function(e) { return typeof e[1] === 'object' && e[1] !== null; });

        var nodeEl = createNode(label, x, 0, Object.fromEntries(primitives));
        var actualHeight = nodeEl.offsetHeight;

        var totalHeightOfChildren = 0;
        var children = complexes.map(function(entry) {
          var result = walk(entry[1], entry[0], x + X_OFFSET);
          totalHeightOfChildren += result.branchHeight + Y_GAP;
          return result;
        });

        if (totalHeightOfChildren > 0) totalHeightOfChildren -= Y_GAP;

        var branchHeight = Math.max(actualHeight, totalHeightOfChildren);

        return { nodeEl: nodeEl, actualHeight: actualHeight, branchHeight: branchHeight, children: children };
      }

      // Pass 2: position
      function position(info, y) {
        var nodeY = y + (info.branchHeight / 2) - (info.actualHeight / 2);
        info.nodeEl.style.top = nodeY + "px";

        var currentY = y;
        info.children.forEach(function(child) {
          position(child, currentY);
          connect(info.nodeEl, child.nodeEl);
          currentY += child.branchHeight + Y_GAP;
        });
      }

      var startX = 5000;
      var startY = 5000;
      var tree = walk(data, "Root", startX);
      position(tree, startY);

      // Center view
      centerView();
    }

    // ---- Interactions: pan/zoom ----
    function setupInteractions() {
      var isDragging = false;
      var lastPos = { x: 0, y: 0 };

      runtime.container.onpointerdown = function(e) {
        if (e.target.closest('.collapse-btn') || e.target.closest('.node') || e.target.closest('button')) return;
        isDragging = true;
        lastPos = { x: e.clientX, y: e.clientY };
        runtime.container.setPointerCapture(e.pointerId);
      };

      runtime.container.onpointermove = function(e) {
        if (!isDragging) return;
        var dx = e.clientX - lastPos.x;
        var dy = e.clientY - lastPos.y;
        runtime.state.x += dx;
        runtime.state.y += dy;
        lastPos = { x: e.clientX, y: e.clientY };
        applyTransform();
      };

      runtime.container.onpointerup = function() { isDragging = false; };

      runtime.container.addEventListener("wheel", function(e) {
        e.preventDefault();

        var rect = runtime.container.getBoundingClientRect();
        var cursorX = e.clientX - rect.left;
        var cursorY = e.clientY - rect.top;

        var worldX = (cursorX - runtime.state.x) / runtime.state.scale;
        var worldY = (cursorY - runtime.state.y) / runtime.state.scale;

        var delta = e.deltaY < 0 ? 1.1 : 0.9;
        var newScale = Math.min(3, Math.max(0.1, runtime.state.scale * delta));

        runtime.state.x = cursorX - worldX * newScale;
        runtime.state.y = cursorY - worldY * newScale;
        runtime.state.scale = newScale;

        applyTransform();
      }, { passive: false });

      // JSON tree collapse delegation
      document.addEventListener('click', function(e) {
        var keyComplex = e.target.closest('.json-key-complex');
        if (keyComplex) {
          var item = keyComplex.parentElement;
          item.classList.toggle('collapsed');
        }
      });
    }

    // ---- Initialization ----
    runtime.container = document.getElementById('canvasWrap');
    runtime.workspace = document.getElementById('workspace');
    runtime.svg = document.getElementById('connections');

    // Ensure workspace and SVG dimensions are set via JS
    // (CSP may block inline style attributes in HTML)
    runtime.workspace.style.width = '9000px';
    runtime.workspace.style.height = '6000px';

    var inputPanel = document.getElementById('inputPanel');
    var viewPanel = document.getElementById('viewPanel');
    viewPanel.style.display = 'none'; // ensure hidden on init
    var jsonInput = document.getElementById('jsonInput');
    var apiUrlInput = document.getElementById('apiUrlInput');
    var visualizeBtn = document.getElementById('visualizeBtn');
    var editBtn = document.getElementById('editBtn');
    var errorMsg = document.getElementById('errorMsg');
    var resetViewBtn = document.getElementById('resetViewBtn');
    var sidebarTitle = document.getElementById('sidebarTitle');
    var themeToggle = document.getElementById('themeToggle');

    // Setup canvas interactions
    setupInteractions();
    applyTransform();

    // ---- Mode Management ----
    var currentData = null;

    function showInputMode() {
      inputPanel.style.display = 'flex';
      viewPanel.style.display = 'none';
      sidebarTitle.textContent = 'Input';
      errorMsg.style.display = 'none';
    }

    function showViewMode() {
      if (!currentData) return;
      inputPanel.style.display = 'none';
      viewPanel.style.display = 'block';
      sidebarTitle.textContent = 'JSON Structure';
      clearError();
    }

    function showError(msg) {
      if (!msg) return;
      errorMsg.textContent = msg;
      errorMsg.style.display = 'block';
    }

    function clearError() {
      errorMsg.textContent = '';
      errorMsg.style.display = 'none';
    }

    function processData(data) {
      var safeData = data;
      if (data === null || data === undefined) {
        safeData = { value: String(data) };
      } else if (typeof data !== 'object') {
        safeData = { value: data };
      }

      currentData = safeData;
      visualize(safeData);
      showViewMode();

      // Save state
      vscode.setState({ data: currentData });
    }

    // ---- Visualize Button ----
    visualizeBtn.addEventListener('click', function() {
      clearError();

      var jsonText = jsonInput.value.trim();
      var apiUrl = apiUrlInput.value.trim();

      if (!jsonText && !apiUrl) {
        showError('Please paste JSON data or enter an API URL.');
        return;
      }

      // Prefer JSON input if both filled
      if (jsonText) {
        try {
          var data = JSON.parse(jsonText);
          processData(data);
        } catch (e) {
          showError('Invalid JSON: ' + e.message);
        }
        return;
      }

      // API URL mode
      if (apiUrl) {
        try {
          new URL(apiUrl);
        } catch (e) {
          showError('Invalid URL format.');
          return;
        }

        visualizeBtn.disabled = true;
        visualizeBtn.textContent = 'Fetching...';
        vscode.postMessage({ type: 'fetchApi', url: apiUrl });
      }
    });

    // ---- Edit Button ----
    editBtn.addEventListener('click', function() {
      showInputMode();
    });

    // ---- Reset View ----
    resetViewBtn.addEventListener('click', function() {
      centerView();
    });

    // ---- Messages from Extension Host ----
    window.addEventListener('message', function(event) {
      var message = event.data;

      switch (message.type) {
        case 'apiResponse':
          visualizeBtn.disabled = false;
          visualizeBtn.textContent = 'Visualize';
          processData(message.data);
          break;

        case 'apiError':
          visualizeBtn.disabled = false;
          visualizeBtn.textContent = 'Visualize';
          showError('API Error: ' + message.error);
          break;
      }
    });

    // ---- Theme Toggle ----
    themeToggle.addEventListener('click', function() {
      var current = themeToggle.getAttribute('data-theme');
      var next = current === 'light' ? 'dark' : 'light';
      themeToggle.setAttribute('data-theme', next);
      document.documentElement.setAttribute('data-theme', next);

      var sunIcon = themeToggle.querySelector('.sun-icon');
      var moonIcon = themeToggle.querySelector('.moon-icon');
      sunIcon.style.display = next === 'dark' ? 'none' : 'block';
      moonIcon.style.display = next === 'dark' ? 'block' : 'none';
    });

    // ---- Sidebar Toggle ----
    var sidebar = document.querySelector('.canvas-sidebar');
    var sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    var sidebarExpandBtn = document.getElementById('sidebarExpandBtn');

    sidebarCollapseBtn.addEventListener('click', function() {
      sidebar.classList.add('collapsed');
      sidebarExpandBtn.classList.add('visible');
    });

    sidebarExpandBtn.addEventListener('click', function() {
      sidebar.classList.remove('collapsed');
      sidebarExpandBtn.classList.remove('visible');
    });

    // ---- Restore Previous State ----
    var previousState = vscode.getState();
    if (previousState && previousState.data) {
      processData(previousState.data);
    }

  })();
  </script>
</body>
</html>`;
}

module.exports = { getWebviewContent };
