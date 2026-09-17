/* ==========================================================================
   ThreatLens — simulator.js
   Interactive Cyber Threat Simulator + 5-point "Why?" Modal
   ========================================================================== */
(function () {
  'use strict';

  // ── Scenario Data ──────────────────────────────────────────────────────────
  const SCENARIOS = {
    powershell_obfuscated: {
      score: 52, scoreColor: '#f59e0b',
      cpu: '64%', ram: '41%', gpu: '12%', net: '1.4 MB/s',
      statusText: 'ELEVATED RISK DETECTED',
      statusColor: '#f59e0b', statusBorder: 'rgba(245,158,11,.4)',
      events: [
        { ts: '19:14:02', type: 'info', msg: 'msedge.exe saved untrusted invoice.vbs to Downloads\\' },
        { ts: '19:14:06', type: 'warn', msg: 'cscript.exe spawned powershell.exe with -enc JABjAGwAaQBl...' },
        { ts: '19:14:07', type: 'crit', msg: 'CyberNLP: Obfuscation flags detected — -enc, bypass, IEX' },
        { ts: '19:14:08', type: 'info', msg: 'Process Lineage Sentinel: Child tree PID 8192 paused for review' }
      ],
      lineage: [
        { name: 'msedge.exe', cls: '' },
        { name: 'cscript.exe', cls: '' },
        { name: 'powershell.exe [PID 8192]', cls: 'threat' },
        { name: 'Terminated', cls: 'ok' }
      ],
      why: {
        title: 'CyberNLP Analysis: Encoded PowerShell Stager',
        what: 'PowerShell executed a hidden Base64-encoded command string launched by a Visual Basic script originating from the browser.',
        who: 'powershell.exe (PID: 8192), child of cscript.exe (PID: 4110), origin traced to msedge.exe.',
        where: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
        why: 'Encoded commands are standard adversarial tradecraft to bypass perimeter string filters and load in-memory payloads without writing files to disk.',
        action: 'Process tree terminated (PID 8192 & 4110). SHA-256 hash isolated into XOR Vault. Outbound socket blocked via NetSh.'
      }
    },
    canary_ransomware: {
      score: 24, scoreColor: '#ef4444',
      cpu: '89%', ram: '58%', gpu: '34%', net: '3.8 MB/s',
      statusText: 'CRITICAL THREAT ISOLATED',
      statusColor: '#ef4444', statusBorder: 'rgba(239,68,68,.4)',
      events: [
        { ts: '19:15:20', type: 'warn', msg: 'Rapid mass byte-modification detected in Documents\\' },
        { ts: '19:15:21', type: 'crit', msg: 'TRIPWIRE: Canary .threatlens_canary.docx modified — ransomware confirmed' },
        { ts: '19:15:22', type: 'crit', msg: 'Shannon Entropy: 7.84 on encrypted payload (threshold >7.4)' },
        { ts: '19:15:22', type: 'info', msg: 'Emergency Quarantine: cryptor_test.exe isolated to XOR Vault' }
      ],
      lineage: [
        { name: 'explorer.exe', cls: '' },
        { name: 'cryptor_test.exe [PID 12940]', cls: 'threat' },
        { name: 'Canary Triggered', cls: '' },
        { name: 'XOR Vault', cls: 'ok' }
      ],
      why: {
        title: 'Tripwire Alert: Canary Ransomware Decoy Triggered',
        what: 'An untrusted executable attempted unauthorized bulk file encryption and triggered hidden ThreatLens honeypot canary files.',
        who: 'cryptor_test.exe (PID: 12940), unverified binary without a valid Authenticode signature.',
        where: 'C:\\Users\\TargetUser\\AppData\\Local\\Temp\\cryptor_test.exe',
        why: 'Canary tripwires are placed before real personal files. Any ransomware must encrypt the decoy first — triggering instantaneous containment before real data is lost.',
        action: 'Emergency process kill issued. Binary scrambled with XOR key in quarantine vault. All outbound sockets severed via NetSh.'
      }
    },
    persistence_registry: {
      score: 68, scoreColor: '#f59e0b',
      cpu: '28%', ram: '33%', gpu: '5%', net: '120 KB/s',
      statusText: 'ELEVATED RISK DETECTED',
      statusColor: '#f59e0b', statusBorder: 'rgba(245,158,11,.4)',
      events: [
        { ts: '19:16:01', type: 'info', msg: 'Registry Watchdog: Write detected on HKCU\\...\\Run' },
        { ts: '19:16:02', type: 'warn', msg: 'Suspicious key: SystemSecurityUpdate → AppData\\Roaming\\updater.exe' },
        { ts: '19:16:03', type: 'crit', msg: 'MITRE T1547.001: Auto-boot persistence evasion detected' },
        { ts: '19:16:04', type: 'info', msg: 'Remediation: Startup entry removed with zero system disruption' }
      ],
      lineage: [
        { name: 'setup_helper.exe [PID 6304]', cls: 'threat' },
        { name: 'RegSetValueExW', cls: '' },
        { name: 'HKCU\\...\\Run\\SecurityUpdate', cls: '' },
        { name: 'Persistence Removed', cls: 'ok' }
      ],
      why: {
        title: 'Forensic Audit: Registry Auto-Boot Persistence',
        what: 'An unsigned executable registered an auto-start Run key to survive machine reboots without user knowledge.',
        who: 'setup_helper.exe (PID: 6304), executed from temporary download cache.',
        where: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\SystemSecurityUpdate',
        why: 'Persistence keys guarantee unauthorized malware execution on every user login, surviving manual application termination and system restarts.',
        action: 'Startup entry deleted from registry hive. Executable quarantined. Audit log exported to CSV for forensic review.'
      }
    },
    crypto_clipboard: {
      score: 45, scoreColor: '#ef4444',
      cpu: '22%', ram: '30%', gpu: '3%', net: '45 KB/s',
      statusText: 'CRITICAL THREAT ISOLATED',
      statusColor: '#ef4444', statusBorder: 'rgba(239,68,68,.4)',
      events: [
        { ts: '19:17:10', type: 'info', msg: 'User copied crypto address: bc1qxy2kgdyg... to clipboard' },
        { ts: '19:17:11', type: 'crit', msg: 'Clipboard Sentry: svchost_updater.exe swapped to bc1q999hacker...' },
        { ts: '19:17:11', type: 'info', msg: 'Intervention: Hijacked address blocked · Original Bitcoin address restored' },
        { ts: '19:17:12', type: 'crit', msg: 'MITRE T1115: Clipper process PID 9024 terminated immediately' }
      ],
      lineage: [
        { name: 'svchost_updater.exe [PID 9024]', cls: 'threat' },
        { name: 'GetClipboardData Hook', cls: '' },
        { name: 'Address Hijack Blocked', cls: 'ok' },
        { name: 'Original Restored', cls: 'ok' }
      ],
      why: {
        title: 'Sentry Defense: Crypto Address Hijack Intercepted',
        what: 'A background trojan silently swapped a copied Bitcoin wallet address with an attacker-controlled address.',
        who: 'svchost_updater.exe (PID: 9024), masquerading as a legitimate Windows service host process.',
        where: 'Windows Clipboard API buffer & AppData\\Roaming\\svchost_updater.exe',
        why: 'Clipper trojans intercept real-time crypto transactions — the victim sees their own address, sends funds, but the money goes to the attacker. Completely invisible without a clipboard sentinel.',
        action: 'Malicious process terminated (PID 9024). Original crypto address preserved in buffer. PID blocklisted in persistent memory.'
      }
    }
  };

  // ── DOM Refs ───────────────────────────────────────────────────────────────
  const gaugeFg      = document.getElementById('gauge-fg');
  const gaugeNum     = document.getElementById('gauge-num');
  const statusPill   = document.getElementById('sim-status-pill');
  const hwCpuVal     = document.getElementById('hw-cpu-val');
  const hwCpuBar     = document.getElementById('hw-cpu-bar');
  const hwRamVal     = document.getElementById('hw-ram-val');
  const hwRamBar     = document.getElementById('hw-ram-bar');
  const hwGpuVal     = document.getElementById('hw-gpu-val');
  const hwGpuBar     = document.getElementById('hw-gpu-bar');
  const hwNetVal     = document.getElementById('hw-net-val');
  const feedStream   = document.getElementById('sim-feed-stream');
  const lineageChain = document.getElementById('sim-lineage-chain');
  const resetBtn     = document.getElementById('sim-reset-btn');
  const scBtns       = document.querySelectorAll('.scenario-btn');

  // Modal
  const modalBg    = document.getElementById('modal-bg');
  const modalClose = document.getElementById('modal-close');
  const mTitle     = document.getElementById('modal-title');
  const mWhat      = document.getElementById('m-what');
  const mWho       = document.getElementById('m-who');
  const mWhere     = document.getElementById('m-where');
  const mWhy       = document.getElementById('m-why');
  const mAction    = document.getElementById('m-action');

  // ── Helpers ────────────────────────────────────────────────────────────────
  const CIRC = 251.3;

  function setGauge(score, color) {
    if (!gaugeFg) return;
    const offset = CIRC - (score / 100) * CIRC;
    gaugeFg.style.strokeDashoffset = offset;
    gaugeFg.style.stroke = color;
    if (gaugeNum) { gaugeNum.textContent = score; gaugeNum.style.color = color; }
  }

  function openModal(key) {
    const d = SCENARIOS[key];
    if (!d || !modalBg) return;
    if (mTitle) mTitle.textContent = d.why.title;
    if (mWhat) mWhat.textContent = d.why.what;
    if (mWho) mWho.textContent = d.why.who;
    if (mWhere) mWhere.textContent = d.why.where;
    if (mWhy) mWhy.textContent = d.why.why;
    if (mAction) mAction.textContent = d.why.action;
    modalBg.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modalBg) modalBg.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Load Scenario ──────────────────────────────────────────────────────────
  function loadScenario(key) {
    const d = SCENARIOS[key];
    if (!d) return;

    scBtns.forEach(b => b.classList.toggle('active', b.dataset.scenario === key));

    setGauge(d.score, d.scoreColor);

    if (statusPill) {
      statusPill.textContent = d.statusText;
      statusPill.style.color = d.statusColor;
      statusPill.style.borderColor = d.statusBorder;
      statusPill.style.background = d.statusBorder.replace('.4', '.12');
    }

    if (hwCpuVal) hwCpuVal.textContent = d.cpu;
    if (hwCpuBar) hwCpuBar.style.width = d.cpu;
    if (hwRamVal) hwRamVal.textContent = d.ram;
    if (hwRamBar) hwRamBar.style.width = d.ram;
    if (hwGpuVal) hwGpuVal.textContent = d.gpu;
    if (hwGpuBar) hwGpuBar.style.width = d.gpu;
    if (hwNetVal) hwNetVal.textContent = d.net;

    // Events
    if (feedStream) {
      feedStream.innerHTML = '';
      d.events.forEach((ev, i) => {
        const row = document.createElement('div');
        row.className = `feed-event ${ev.type}`;
        row.style.animationDelay = `${i * 0.07}s`;

        const badgeMap = { crit: 'badge-crit', warn: 'badge-warn', info: 'badge-med' };
        const badgeLbl = { crit: 'CRIT', warn: 'WARN', info: 'INFO' };

        row.innerHTML = `
          <div class="feed-left">
            <span class="feed-ts">${ev.ts}</span>
            <span class="${badgeMap[ev.type] || 'badge-med'}">${badgeLbl[ev.type] || 'INFO'}</span>
            <span class="feed-msg">${ev.msg}</span>
          </div>
          <button class="why-btn" data-key="${key}">💡 WHY?</button>
        `;
        feedStream.appendChild(row);

        row.querySelector('.why-btn').addEventListener('click', e => {
          e.stopPropagation();
          openModal(e.target.dataset.key);
        });
      });
    }

    // Lineage
    if (lineageChain) {
      lineageChain.innerHTML = '';
      d.lineage.forEach((node, i) => {
        const el = document.createElement('div');
        el.className = `l-node ${node.cls}`;
        el.textContent = node.name;
        lineageChain.appendChild(el);

        if (i < d.lineage.length - 1) {
          const arrow = document.createElement('span');
          arrow.className = 'l-arrow';
          arrow.textContent = '→';
          lineageChain.appendChild(arrow);
        }
      });
    }
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  function reset() {
    scBtns.forEach(b => b.classList.remove('active'));
    setGauge(100, '#10b981');

    if (statusPill) {
      statusPill.textContent = 'ALL SENSORS GREEN';
      statusPill.style.color = '#10b981';
      statusPill.style.borderColor = 'rgba(16,185,129,.4)';
      statusPill.style.background = 'rgba(16,185,129,.1)';
    }

    if (hwCpuVal) hwCpuVal.textContent = '4%';
    if (hwCpuBar) hwCpuBar.style.width = '4%';
    if (hwRamVal) hwRamVal.textContent = '22%';
    if (hwRamBar) hwRamBar.style.width = '22%';
    if (hwGpuVal) hwGpuVal.textContent = '1%';
    if (hwGpuBar) hwGpuBar.style.width = '1%';
    if (hwNetVal) hwNetVal.textContent = '12 KB/s';

    if (feedStream) {
      feedStream.innerHTML = `
        <div class="feed-event" style="border-left-color:#10b981">
          <div class="feed-left">
            <span class="feed-ts">19:18:00</span>
            <span class="badge-med" style="background:#10b981">OK</span>
            <span class="feed-msg">System baseline restored. 9 active defense shields patrolling endpoint telemetry.</span>
          </div>
        </div>`;
    }

    if (lineageChain) {
      lineageChain.innerHTML = `<div class="l-node ok">System Idle · Normal Kernel Dispatch</div>`;
    }
  }

  // ── Event Listeners ────────────────────────────────────────────────────────
  scBtns.forEach(btn => btn.addEventListener('click', () => loadScenario(btn.dataset.scenario)));
  resetBtn && resetBtn.addEventListener('click', reset);
  modalClose && modalClose.addEventListener('click', closeModal);
  modalBg && modalBg.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ── Init ───────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => loadScenario('powershell_obfuscated'));

})();
