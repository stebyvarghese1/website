/* ==========================================================================
   ThreatLens Cyber Simulator & Explainability Engine
   Interactive live threat demonstrations and 5-point "Why?" Engine modal
   ========================================================================== */

(function () {
  'use strict';

  // Scenario definitions
  const SCENARIOS = {
    powershell_obfuscated: {
      id: 'powershell_obfuscated',
      name: 'Encoded PowerShell Stager',
      score: 52,
      scoreColor: '#f59e0b',
      cpu: '64%',
      ram: '41%',
      gpu: '12%',
      net: '1.4 MB/s',
      events: [
        { time: '19:14:02', badge: 'info', type: 'info', msg: 'msedge.exe saved untrusted script invoice.vbs to Downloads\\' },
        { time: '19:14:06', badge: 'warn', type: 'warning', msg: 'cscript.exe spawned powershell.exe with -enc JABjAGwAaQBl...' },
        { time: '19:14:07', badge: 'crit', type: 'critical', msg: 'CyberNLP: Obfuscation evasion flags detected (-enc, bypass, IEX)' },
        { time: '19:14:08', badge: 'info', type: 'info', msg: 'Process Lineage Sentinel: Child tree PID 8192 paused' }
      ],
      lineage: [
        { name: 'msedge.exe', class: '' },
        { name: 'explorer.exe', class: '' },
        { name: 'cscript.exe', class: '' },
        { name: 'powershell.exe [PID 8192]', class: 'threat' },
        { name: 'Terminated & Contained', class: 'action' }
      ],
      why: {
        title: 'CyberNLP Explainability: Encoded PowerShell Execution',
        what: 'PowerShell executed a hidden Base64-encoded command string launched by a Visual Basic script.',
        who: 'powershell.exe (PID: 8192), child of cscript.exe (PID: 4110), origin in msedge.exe.',
        where: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
        whyMatter: 'Encoded commands are standard adversarial tradecraft to bypass perimeter string filters and load in-memory payloads without saving executables to disk.',
        action: 'Process tree terminated (PID 8192 & 4110). Binary SHA-256 isolated into XOR Vault. Network connection blocked via NetSh.'
      }
    },

    canary_ransomware: {
      id: 'canary_ransomware',
      name: 'Ransomware Canary Tripwire',
      score: 24,
      scoreColor: '#ef4444',
      cpu: '89%',
      ram: '58%',
      gpu: '34%',
      net: '3.8 MB/s',
      events: [
        { time: '19:15:20', badge: 'warn', type: 'warning', msg: 'Rapid mass byte modification detected in Documents\\' },
        { time: '19:15:21', badge: 'crit', type: 'critical', msg: 'TRIPWIRE ALERT: Honeypot decoy .threatlens_canary.docx altered' },
        { time: '19:15:22', badge: 'crit', type: 'critical', msg: 'Shannon Entropy: Calculated 7.84 (>7.4 threshold = encrypted payload)' },
        { time: '19:15:22', badge: 'info', type: 'info', msg: 'Emergency Quarantine: cryptor_test.exe isolated into XOR Vault' }
      ],
      lineage: [
        { name: 'explorer.exe', class: '' },
        { name: 'cryptor_test.exe [PID 12940]', class: 'threat' },
        { name: 'Canary Honeypot Locked', class: 'action' },
        { name: 'XOR Vault Encrypted', class: 'action' }
      ],
      why: {
        title: 'Tripwire Alert: Canary Ransomware Decoy Triggered',
        what: 'An untrusted executable attempted unauthorized bulk file encryption and touched ThreatLens decoy tripwires.',
        who: 'cryptor_test.exe (PID: 12940), unverified binary without digital Authenticode signature.',
        where: 'C:\\Users\\TargetUser\\AppData\\Local\\Temp\\cryptor_test.exe',
        whyMatter: 'ThreatLens Canary tripwires are hidden decoys designed to be attacked first. Any modification triggers instantaneous system defense before personal files are encrypted.',
        action: 'Emergency process kill executed. Executable scrambled with reversible XOR key in vault. All outbound sockets severed.'
      }
    },

    persistence_registry: {
      id: 'persistence_registry',
      name: 'Unauthorized Registry Persistence',
      score: 68,
      scoreColor: '#f59e0b',
      cpu: '28%',
      ram: '33%',
      gpu: '5%',
      net: '120 KB/s',
      events: [
        { time: '19:16:01', badge: 'info', type: 'info', msg: 'Registry Watchdog: Write on HKCU\\Software\\Microsoft\\...\\Run' },
        { time: '19:16:02', badge: 'warn', type: 'warning', msg: 'Suspicious key: SystemSecurityUpdate pointing to AppData\\Roaming' },
        { time: '19:16:03', badge: 'crit', type: 'critical', msg: 'MITRE ATT&CK T1547.001: Boot Persistence evasion detected' },
        { time: '19:16:04', badge: 'info', type: 'info', msg: 'Remediation: Entry removed from Run key with zero system disruption' }
      ],
      lineage: [
        { name: 'setup_helper.exe [PID 6304]', class: 'threat' },
        { name: 'winreg::RegSetValueExW', class: '' },
        { name: 'HKCU\\...\\Run\\SystemSecurityUpdate', class: '' },
        { name: 'Persistence Neutralized', class: 'action' }
      ],
      why: {
        title: 'Forensic Audit: Startup Registry Persistence Tampering',
        what: 'An unsigned executable attempted to register an auto-start Run key to achieve reboot persistence.',
        who: 'setup_helper.exe (PID: 6304), executed from temporary download cache.',
        where: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\SystemSecurityUpdate',
        whyMatter: 'Persistence keys guarantee unauthorized malware execution every time the user logs in, surviving application restarts.',
        action: 'Startup entry deleted from registry hive. Executable quarantined for offline forensic dropzone audit.'
      }
    },

    crypto_clipboard: {
      id: 'crypto_clipboard',
      name: 'Clipboard Crypto Clipper',
      score: 45,
      scoreColor: '#ef4444',
      cpu: '22%',
      ram: '30%',
      gpu: '3%',
      net: '45 KB/s',
      events: [
        { time: '19:17:10', badge: 'info', type: 'info', msg: 'User copied cryptocurrency address: bc1qxy2kgdyg... to clipboard' },
        { time: '19:17:11', badge: 'crit', type: 'critical', msg: 'Clipboard Sentry: svchost_updater.exe swapped address to bc1q999hacker...' },
        { time: '19:17:11', badge: 'info', type: 'info', msg: 'Intervention: Hijacked address blocked, original Bitcoin address restored' },
        { time: '19:17:12', badge: 'crit', type: 'critical', msg: 'MITRE ATT&CK T1115: Process PID 9024 terminated immediately' }
      ],
      lineage: [
        { name: 'svchost_updater.exe [PID 9024]', class: 'threat' },
        { name: 'GetClipboardData Hook', class: '' },
        { name: 'Address Hijack Intercepted', class: 'action' },
        { name: 'Original Restored', class: 'action' }
      ],
      why: {
        title: 'Sentry Defense: Crypto Address Swap Hijack Blocked',
        what: 'A background trojan attempted to silently swap a copied Bitcoin wallet address with an attacker-owned address.',
        who: 'svchost_updater.exe (PID: 9024), masquerading as a legitimate Windows service host.',
        where: 'Windows Clipboard API buffer & AppData\\Roaming\\svchost_updater.exe',
        whyMatter: 'Clipper trojans silently intercept crypto transactions in real time, tricking users into transferring funds to cybercriminals.',
        action: 'Malicious process terminated (PID 9024). Original crypto address preserved in buffer. Windows Defender alert forwarded.'
      }
    }
  };

  // State
  let currentScenario = 'powershell_obfuscated';

  // DOM Elements
  const gaugeCircle = document.getElementById('gauge-progress');
  const gaugeValue = document.getElementById('gauge-score-value');
  const simStatusPill = document.getElementById('sim-status-pill');
  const simHwCpu = document.getElementById('hw-cpu-val');
  const simHwCpuBar = document.getElementById('hw-cpu-bar');
  const simHwRam = document.getElementById('hw-ram-val');
  const simHwRamBar = document.getElementById('hw-ram-bar');
  const simHwGpu = document.getElementById('hw-gpu-val');
  const simHwGpuBar = document.getElementById('hw-gpu-bar');
  const simHwNet = document.getElementById('hw-net-val');
  const feedContainer = document.getElementById('sim-feed-stream');
  const lineageContainer = document.getElementById('sim-lineage-chain');
  const scenarioButtons = document.querySelectorAll('.scenario-btn');
  const resetBtn = document.getElementById('sim-reset-btn');

  // Modal DOM
  const modalOverlay = document.getElementById('why-modal-overlay');
  const modalCloseBtn = document.getElementById('why-modal-close');
  const modalTitle = document.getElementById('modal-why-title');
  const modalWhat = document.getElementById('modal-why-what');
  const modalWho = document.getElementById('modal-why-who');
  const modalWhere = document.getElementById('modal-why-where');
  const modalWhyMatter = document.getElementById('modal-why-matter');
  const modalAction = document.getElementById('modal-why-action');

  // Update Gauge SVG
  function updateGauge(score, color) {
    if (!gaugeCircle || !gaugeValue) return;
    const circumference = 2 * Math.PI * 40; // r=40
    const offset = circumference - (score / 100) * circumference;
    gaugeCircle.style.strokeDashoffset = offset;
    gaugeCircle.style.stroke = color;
    gaugeValue.textContent = score;
    gaugeValue.style.color = color;
  }

  // Load Scenario into UI
  function loadScenario(scenarioKey) {
    const data = SCENARIOS[scenarioKey];
    if (!data) return;
    currentScenario = scenarioKey;

    // Update active button state
    scenarioButtons.forEach(btn => {
      if (btn.getAttribute('data-scenario') === scenarioKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Gauge
    updateGauge(data.score, data.scoreColor);

    // Update status text
    if (simStatusPill) {
      if (data.score >= 80) {
        simStatusPill.textContent = 'SYSTEM SECURE';
        simStatusPill.style.color = 'var(--accent-emerald)';
        simStatusPill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      } else if (data.score >= 50) {
        simStatusPill.textContent = 'ELEVATED RISK DETECTED';
        simStatusPill.style.color = 'var(--accent-amber)';
        simStatusPill.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      } else {
        simStatusPill.textContent = 'CRITICAL THREAT ISOLATED';
        simStatusPill.style.color = 'var(--accent-rose)';
        simStatusPill.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      }
    }

    // Update hardware telemetry
    if (simHwCpu) simHwCpu.textContent = data.cpu;
    if (simHwCpuBar) simHwCpuBar.style.width = data.cpu;
    if (simHwRam) simHwRam.textContent = data.ram;
    if (simHwRamBar) simHwRamBar.style.width = data.ram;
    if (simHwGpu) simHwGpu.textContent = data.gpu;
    if (simHwGpuBar) simHwGpuBar.style.width = data.gpu;
    if (simHwNet) simHwNet.textContent = data.net;

    // Render Event Stream
    if (feedContainer) {
      feedContainer.innerHTML = '';
      data.events.forEach((ev, idx) => {
        const item = document.createElement('div');
        item.className = `feed-event-item ${ev.type}`;
        item.style.animationDelay = `${idx * 0.08}s`;

        item.innerHTML = `
          <div class="feed-event-left">
            <span class="feed-time">${ev.time}</span>
            <span class="feed-badge ${ev.badge}">${ev.badge.toUpperCase()}</span>
            <span class="feed-msg">${ev.msg}</span>
          </div>
          <button class="feed-why-btn" data-scenario="${scenarioKey}">💡 WHY?</button>
        `;
        feedContainer.appendChild(item);
      });

      // Bind Why buttons
      feedContainer.querySelectorAll('.feed-why-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          openWhyModal(scenarioKey);
        });
      });
    }

    // Render Process Lineage
    if (lineageContainer) {
      lineageContainer.innerHTML = '';
      data.lineage.forEach((node, i) => {
        const nodeEl = document.createElement('div');
        nodeEl.className = `lineage-node ${node.class}`;
        nodeEl.textContent = node.name;
        lineageContainer.appendChild(nodeEl);

        if (i < data.lineage.length - 1) {
          const arrowEl = document.createElement('span');
          arrowEl.className = 'lineage-arrow';
          arrowEl.textContent = '➔';
          lineageContainer.appendChild(arrowEl);
        }
      });
    }
  }

  // Reset to Baseline
  function resetSimulator() {
    scenarioButtons.forEach(btn => btn.classList.remove('active'));
    updateGauge(100, '#10b981');

    if (simStatusPill) {
      simStatusPill.textContent = 'ALL SENSORS GREEN';
      simStatusPill.style.color = 'var(--accent-emerald)';
      simStatusPill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    }

    if (simHwCpu) simHwCpu.textContent = '4%';
    if (simHwCpuBar) simHwCpuBar.style.width = '4%';
    if (simHwRam) simHwRam.textContent = '22%';
    if (simHwRamBar) simHwRamBar.style.width = '22%';
    if (simHwGpu) simHwGpu.textContent = '1%';
    if (simHwGpuBar) simHwGpuBar.style.width = '1%';
    if (simHwNet) simHwNet.textContent = '12 KB/s';

    if (feedContainer) {
      feedContainer.innerHTML = `
        <div class="feed-event-item" style="border-left-color: var(--accent-emerald);">
          <div class="feed-event-left">
            <span class="feed-time">19:18:00</span>
            <span class="feed-badge info">ONLINE</span>
            <span class="feed-msg">System baseline restored. 9 Active Defense shields patrolling endpoint telemetry.</span>
          </div>
          <button class="feed-why-btn" data-scenario="powershell_obfuscated">💡 WHY?</button>
        </div>
      `;
      feedContainer.querySelector('.feed-why-btn').addEventListener('click', () => {
        openWhyModal('powershell_obfuscated');
      });
    }

    if (lineageContainer) {
      lineageContainer.innerHTML = `
        <div class="lineage-node action">System Idle · Normal Kernel Dispatch</div>
      `;
    }
  }

  // Modal Open/Close
  function openWhyModal(scenarioKey) {
    const data = SCENARIOS[scenarioKey];
    if (!data || !modalOverlay) return;

    modalTitle.textContent = data.why.title;
    modalWhat.textContent = data.why.what;
    modalWho.textContent = data.why.who;
    modalWhere.textContent = data.why.where;
    modalWhyMatter.textContent = data.why.whyMatter;
    modalAction.textContent = data.why.action;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeWhyModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event Listeners
  scenarioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const scenarioKey = btn.getAttribute('data-scenario');
      loadScenario(scenarioKey);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', resetSimulator);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeWhyModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeWhyModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeWhyModal();
    }
  });

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    loadScenario('powershell_obfuscated');
  });

  // Export to window for global triggers if needed
  window.ThreatLensSim = {
    loadScenario,
    resetSimulator,
    openWhyModal
  };

})();
