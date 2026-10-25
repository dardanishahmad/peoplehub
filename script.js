
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const pageContent = $("#page-content");
  const modalRoot = $("#modal-root");
  const toastRoot = $("#toast-root");
  const breadcrumbTitle = $("#breadcrumb-title");

  const currentUser = {
    name: "Alex Smith",
    initials: "AS",
    role: "Product Designer",
    department: "Product & Design",
    email: "alex.smith@peoplehub.demo",
    employeeId: "PH-2048",
    manager: "Jordan Lee",
    location: "New York, NY",
    startDate: "May 15, 2022"
  };

  const team = [
    { name: "Jordan Lee", initials: "JL", role: "Design Manager", department: "Product & Design", email: "jordan.lee@peoplehub.demo", location: "New York", color: "avatar-purple", status: "Present" },
    { name: "Maya Patel", initials: "MP", role: "UX Researcher", department: "Product & Design", email: "maya.patel@peoplehub.demo", location: "Remote", color: "avatar-green", status: "Remote" },
    { name: "Ethan Chen", initials: "EC", role: "Frontend Engineer", department: "Engineering", email: "ethan.chen@peoplehub.demo", location: "New York", color: "avatar-blue", status: "Present" },
    { name: "Sofia Garcia", initials: "SG", role: "Product Manager", department: "Product", email: "sofia.garcia@peoplehub.demo", location: "Austin", color: "avatar-pink", status: "On leave" },
    { name: "Noah Williams", initials: "NW", role: "Visual Designer", department: "Product & Design", email: "noah.williams@peoplehub.demo", location: "Remote", color: "avatar-orange", status: "Remote" },
    { name: "Ava Thompson", initials: "AT", role: "People Partner", department: "People", email: "ava.thompson@peoplehub.demo", location: "New York", color: "avatar-purple", status: "Present" }
  ];

  const leaves = [
    { type: "Annual leave", from: "2026-11-09", to: "2026-11-13", days: 5, status: "Approved", reason: "Personal time off" },
    { type: "Sick leave", from: "2026-09-18", to: "2026-09-18", days: 1, status: "Approved", reason: "Medical appointment" },
    { type: "Annual leave", from: "2026-10-29", to: "2026-10-30", days: 2, status: "Pending", reason: "Family commitment" }
  ];

  const activities = [
    { icon: "calendar-check", title: "Leave request approved", description: "Your annual leave request was approved.", time: "Yesterday", tone: "green" },
    { icon: "file-check", title: "Payslip available", description: "Your September payslip is ready to view.", time: "2 days ago", tone: "blue" },
    { icon: "clock-3", title: "Attendance reminder", description: "Remember to clock out at the end of your day.", time: "3 days ago", tone: "orange" }
  ];

  const documents = [
    { name: "Employee Handbook 2026.pdf", type: "PDF", size: "2.4 MB", date: "Jan 12, 2026", category: "Company policy" },
    { name: "Benefits Overview.pdf", type: "PDF", size: "1.1 MB", date: "Jan 10, 2026", category: "Benefits" },
    { name: "Q3 Performance Review.docx", type: "DOC", size: "384 KB", date: "Oct 02, 2026", category: "Performance" },
    { name: "Design Team Goals.xlsx", type: "XLS", size: "256 KB", date: "Sep 22, 2026", category: "Team documents" }
  ];

  const assets = [
    { name: "MacBook Pro 14-inch", category: "Laptop", id: "AST-1042", assigned: "May 15, 2022", status: "Active", icon: "laptop" },
    { name: "Dell UltraSharp 27-inch", category: "Monitor", id: "AST-1178", assigned: "May 16, 2022", status: "Active", icon: "monitor" },
    { name: "Logitech MX Master 3S", category: "Accessories", id: "AST-1235", assigned: "May 16, 2022", status: "Active", icon: "mouse" }
  ];

  const performanceGoals = [
    { title: "Improve design system adoption", detail: "Partner with engineering to increase reusable component adoption.", progress: 75, status: "In progress" },
    { title: "Lead user research sessions", detail: "Run at least six customer research sessions this quarter.", progress: 100, status: "Completed" },
    { title: "Ship onboarding improvements", detail: "Collaborate with product to improve new-user activation.", progress: 55, status: "In progress" }
  ];

  const timeEntries = [
    { date: "2026-10-23", project: "PeopleHub redesign", task: "Dashboard UI", hours: 7.5, status: "Approved" },
    { date: "2026-10-22", project: "Design system", task: "Component library", hours: 8, status: "Approved" },
    { date: "2026-10-21", project: "PeopleHub redesign", task: "Prototype review", hours: 7, status: "Approved" },
    { date: "2026-10-20", project: "Research", task: "Usability testing", hours: 6.5, status: "Pending" }
  ];

  const state = {
    page: "Dashboard",
    clockedIn: false,
    clockInAt: null,
    attendance: [],
    leaves,
    activities,
    documents,
    assets,
    goals: performanceGoals,
    timeEntries,
    notificationsRead: false,
    search: ""
  };

  const icon = (name, extra = "") => `<i data-lucide="${escapeAttr(name)}" ${extra}></i>`;
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
  const escapeAttr = escapeHTML;
  const initials = (name) => String(name).split(/\s+/).slice(0, 2).map(s => s[0] || "").join("").toUpperCase();
  const avatarClass = (index) => ["avatar-blue", "avatar-purple", "avatar-green", "avatar-orange", "avatar-pink"][index % 5];
  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const dateLabel = (date, options = { month: "short", day: "numeric", year: "numeric" }) => {
    if (!date) return "—";
    const d = new Date(`${date}T12:00:00`);
    return Number.isNaN(d.getTime()) ? escapeHTML(date) : d.toLocaleDateString(undefined, options);
  };
  const timeLabel = (date = new Date()) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const hoursBetween = (start, end = new Date()) => Math.max(0, (end - start) / 3600000);
  const statusClass = (status) => {
    const key = String(status || "").toLowerCase().replace(/\s+/g, "-");
    return ["approved", "present", "completed", "active", "pending", "in-progress", "upcoming", "rejected", "absent", "overdue", "remote", "info"].includes(key) ? key : "info";
  };
  const badge = (status) => `<span class="status ${statusClass(status)}">${escapeHTML(status)}</span>`;
  const personCell = (person, index = 0) => `
    <div class="person-cell">
      <span class="avatar ${person.color || avatarClass(index)}">${escapeHTML(person.initials || initials(person.name))}</span>
      <span><strong>${escapeHTML(person.name)}</strong><small>${escapeHTML(person.role || person.department || "")}</small></span>
    </div>`;
  const pageHeading = (title, description, actions = "") => `
    <div class="page-heading">
      <div><div class="eyebrow">PeopleHub workspace</div><h1>${title}</h1><p>${description}</p></div>
      ${actions ? `<div class="heading-actions">${actions}</div>` : ""}
    </div>`;
  const panelHeader = (title, subtitle = "", action = "") => `
    <div class="panel-header"><div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ""}</div>${action}</div>`;
  const statCard = (label, value, iconName, color, foot, trend = "") => `
    <article class="stat-card">
      <div class="stat-top"><span class="stat-label">${label}</span><span class="stat-icon ${color}">${icon(iconName)}</span></div>
      <p class="stat-value">${value}</p><div class="stat-foot">${trend ? `<span class="trend">${trend}</span>` : ""}<span>${foot}</span></div>
    </article>`;
  const table = (headers, rows, empty = "Nothing to show yet.") => `
    <div class="data-table-wrap"><table class="data-table"><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.length ? rows.join("") : `<tr><td colspan="${headers.length}"><div class="empty-state">${icon("inbox")}${empty}</div></td></tr>`}</tbody></table></div>`;
  const activityList = (items) => `<div class="activity-list">${items.map(item => `
    <div class="activity-item"><span class="activity-icon">${icon(item.icon || "bell")}</span>
      <div class="activity-copy"><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.description)}</p><time>${escapeHTML(item.time)}</time></div>
    </div>`).join("") || `<div class="empty-state">${icon("bell-off")}You're all caught up.</div>`}</div>`;
  const emptyPage = (title, description, glyph = "construction") => `
    ${pageHeading(title, description)}
    <div class="panel"><div class="empty-state">${icon(glyph)}<strong>Nothing here just yet</strong><p>This demo section is ready for your organization's data.</p></div></div>`;

  function render() {
    if (!pageContent) return;
    const renderers = {
      "Dashboard": renderDashboard,
      "Attendance": renderAttendance,
      "Leaves": renderLeaves,
      "My Team": renderTeam,
      "Time": renderTime,
      "Finances": renderFinances,
      "Performance": renderPerformance,
      "Documents": renderDocuments,
      "Assets": renderAssets
    };
    const renderer = renderers[state.page] || renderDashboard;
    pageContent.innerHTML = renderer();
    if (breadcrumbTitle) breadcrumbTitle.textContent = state.page;
    $$(".nav-item").forEach(button => {
      const active = button.dataset.page === state.page;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();
    bindPageEvents();
  }

  function renderDashboard() {
    const date = new Date();
    const hour = date.getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const approvedDays = state.leaves.filter(l => l.status === "Approved").reduce((sum, l) => sum + l.days, 0);
    const pendingLeaves = state.leaves.filter(l => l.status === "Pending").length;
    const attendanceRows = [
      { day: "Mon", hours: 8.0 }, { day: "Tue", hours: 7.5 }, { day: "Wed", hours: 8.2 },
      { day: "Thu", hours: 7.0 }, { day: "Fri", hours: 6.5 }, { day: "Sat", hours: 0 }, { day: "Sun", hours: 0 }
    ];
    return `
      <section class="welcome-card">
        <div class="welcome-copy"><div class="eyebrow">Sunday, ${dateLabel(todayISO(), { month: "long", day: "numeric" })}</div>
          <h1>${greeting}, ${escapeHTML(currentUser.name.split(" ")[0])} ${icon("sun")}</h1>
          <p>Here's what's happening in your workspace today.</p>
          <button class="btn btn-primary" data-page="Attendance">${icon("clock-3")} View attendance</button>
        </div><div class="welcome-art">${icon("layers")}</div>
      </section>
      <div class="stats-grid">
        ${statCard("Attendance this month", "96.8%", "clock-3", "purple", "On-time attendance", "↑ 2.4%")}
        ${statCard("Available leave", Math.max(0, 20 - approvedDays) + " days", "calendar-days", "blue", "Annual leave balance")}
        ${statCard("Pending requests", String(pendingLeaves), "calendar-clock", "orange", "Awaiting review")}
        ${statCard("Hours this week", "37.5h", "timer", "green", "Of 40 weekly hours", "93.8%")}
      </div>
      <div class="quick-actions">
        <button class="quick-action" data-action="clock"><span class="stat-icon purple">${icon(state.clockedIn ? "log-out" : "log-in")}</span><span><strong>${state.clockedIn ? "Clock out" : "Clock in"}</strong><small>${state.clockedIn ? "Finish your workday" : "Start your workday"}</small></span></button>
        <button class="quick-action" data-action="leave-request"><span class="stat-icon blue">${icon("calendar-plus")}</span><span><strong>Request leave</strong><small>Plan time off</small></span></button>
        <button class="quick-action" data-page="Time"><span class="stat-icon green">${icon("timer")}</span><span><strong>Log time</strong><small>Record project hours</small></span></button>
        <button class="quick-action" data-page="Documents"><span class="stat-icon orange">${icon("folder-open")}</span><span><strong>My documents</strong><small>Find your files</small></span></button>
      </div>
      <div class="dashboard-grid">
        <div class="stack">
          <section class="panel">
            ${panelHeader("Weekly overview", "Your work hours at a glance", `<select id="chart-period" aria-label="Chart period"><option value="week">This week</option><option value="last">Last week</option></select>`)}
            <div class="chart-legend"><span class="legend-item"><i class="legend-dot"></i>Hours worked</span><span class="legend-item"><i class="legend-dot alt"></i>Target: 8 hours</span></div>
            <div class="chart-wrap">${renderChart(attendanceRows)}</div>
          </section>
          <section class="panel">
            ${panelHeader("Recent attendance", "Your latest clock records", `<button class="text-link" data-page="Attendance">View all ${icon("arrow-up-right")}</button>`)}
            ${table(["Date", "Clock in", "Clock out", "Hours", "Status"], state.attendance.slice(-4).reverse().map(entry => `
              <tr><td>${dateLabel(entry.date)}</td><td>${entry.in}</td><td>${entry.out || "—"}</td><td>${entry.hours || "In progress"}</td><td>${badge(entry.out ? "Present" : "Pending")}</td></tr>`), "Your clock records will appear here.")}
          </section>
        </div>
        <div class="stack">
          <section class="panel">
            ${panelHeader("Attendance summary", "Your daily overview")}
            <div class="attendance-summary">
              <div class="summary-tile"><span>Today's status</span><strong>${state.clockedIn ? "Working" : "Not started"}</strong><small>${state.clockedIn ? "Clocked in at " + timeLabel(state.clockInAt) : "Remember to clock in"}</small></div>
              <div class="summary-tile"><span>Hours this week</span><strong>37.5h</strong><small>93.8% of weekly target</small><div class="progress-track"><div class="progress-fill green" style="width:93.8%"></div></div></div>
            </div>
            <button class="btn btn-primary" style="width:100%;margin-top:14px" data-action="clock">${icon(state.clockedIn ? "log-out" : "log-in")}${state.clockedIn ? "Clock out" : "Clock in now"}</button>
          </section>
          <section class="panel">
            ${panelHeader("Recent activity", "Latest updates from your workspace", `<button class="text-link" data-action="notifications">See all</button>`)}
            ${activityList(state.activities.slice(0, 4))}
          </section>
          <section class="panel">
            ${panelHeader("Upcoming time off", "Your next planned days away", `<button class="text-link" data-page="Leaves">View all</button>`)}
            <div class="calendar-list">${state.leaves.filter(l => l.status === "Approved" && l.to >= todayISO()).slice(0, 2).map(l => {
              const d = new Date(`${l.from}T12:00:00`);
              return `<div class="calendar-item"><div class="date-block"><strong>${d.getDate()}</strong><small>${d.toLocaleDateString([], { month: "short" })}</small></div><div class="calendar-copy"><strong>${escapeHTML(l.type)}</strong><p>${dateLabel(l.from, { month: "short", day: "numeric" })} – ${dateLabel(l.to, { month: "short", day: "numeric" })} · ${l.days} day(s)</p></div>${badge(l.status)}</div>`;
            }).join("") || `<div class="empty-state">${icon("calendar") }No upcoming approved leave.</div>`}</div>
          </section>
        </div>
      </div>`;
  }

  function renderChart(rows) {
    const width = 560, height = 205, left = 34, right = 14, top = 14, bottom = 30;
    const chartW = width - left - right, chartH = height - top - bottom, max = 10;
    const x = i => left + (chartW * i / (rows.length - 1));
    const y = v => top + chartH * (1 - v / max);
    const line = rows.map((r, i) => `${i ? "L" : "M"} ${x(i)} ${y(r.hours)}`).join(" ");
    const area = `${line} L ${x(rows.length - 1)} ${top + chartH} L ${x(0)} ${top + chartH} Z`;
    const grid = [0, 2, 4, 6, 8, 10].map(v => `<line class="chart-gridline" x1="${left}" y1="${y(v)}" x2="${width - right}" y2="${y(v)}"/><text class="chart-label" x="${left - 9}" y="${y(v) + 3}" text-anchor="end">${v}h</text>`).join("");
    const labels = rows.map((r, i) => `<text class="chart-label" x="${x(i)}" y="${height - 8}" text-anchor="middle">${r.day}</text>`).join("");
    const points = rows.map((r, i) => r.hours > 0 ? `<circle class="chart-point" cx="${x(i)}" cy="${y(r.hours)}" r="4"/>` : "").join("");
    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Weekly work hours chart">
      <defs><linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7778ee" stop-opacity=".22"/><stop offset="100%" stop-color="#7778ee" stop-opacity=".01"/></linearGradient></defs>
      ${grid}<line x1="${left}" y1="${y(8)}" x2="${width-right}" y2="${y(8)}" stroke="#c6c8fa" stroke-dasharray="4 4"/>
      <path class="chart-area" d="${area}"/><path class="chart-line" d="${line}"/>${points}${labels}</svg>`;
  }

  function renderAttendance() {
    const rows = state.attendance.slice().reverse().map(entry => `
      <tr><td>${dateLabel(entry.date)}</td><td>${entry.in}</td><td>${entry.out || "—"}</td><td>${entry.hours || "In progress"}</td><td>${badge(entry.out ? "Present" : "Pending")}</td></tr>`);
    const isTodayClocked = state.clockedIn;
    return `${pageHeading("Attendance", "Track your workday, review your clock records, and stay on schedule.", `<button class="btn btn-primary" data-action="clock">${icon(isTodayClocked ? "log-out" : "log-in")}${isTodayClocked ? "Clock out" : "Clock in"}</button>`)}
      <div class="metric-row">
        <div class="metric-card"><span>Today's status</span><strong>${isTodayClocked ? "Working" : "Not started"}</strong><small>${isTodayClocked ? `Started at ${timeLabel(state.clockInAt)}` : "No active session"}</small></div>
        <div class="metric-card"><span>Hours this week</span><strong>37.5h</strong><small>Target: 40 hours</small></div>
        <div class="metric-card"><span>Attendance rate</span><strong>96.8%</strong><small>Current month</small></div>
      </div>
      <div class="page-grid">
        <section class="panel">
          ${panelHeader("Clock records", "A history of your recorded work sessions")}
          ${table(["Date", "Clock in", "Clock out", "Total hours", "Status"], rows, "No clock records yet. Use Clock in to start a session.")}
        </section>
        <div class="stack">
          <section class="panel">
            ${panelHeader("Your workday", "Today's time tracking")}
            <div class="summary-tile"><span>Current status</span><strong>${isTodayClocked ? "Clocked in" : "Clocked out"}</strong><small>${isTodayClocked ? "Started " + timeLabel(state.clockInAt) : "You have not started a session today."}</small></div>
            <button class="btn btn-primary" style="width:100%;margin-top:14px" data-action="clock">${icon(isTodayClocked ? "log-out" : "log-in")}${isTodayClocked ? "Clock out" : "Clock in now"}</button>
          </section>
          <section class="panel">${panelHeader("Attendance tips")}<div class="activity-list">
            <div class="activity-item"><span class="activity-icon">${icon("alarm-clock")}</span><div class="activity-copy"><strong>Start on time</strong><p>Record your start time when you begin work.</p></div></div>
            <div class="activity-item"><span class="activity-icon">${icon("coffee")}</span><div class="activity-copy"><strong>Remember your breaks</strong><p>Follow your organization's break policy.</p></div></div>
            <div class="activity-item"><span class="activity-icon">${icon("check-circle")}</span><div class="activity-copy"><strong>End your session</strong><p>Clock out when your workday is complete.</p></div></div>
          </div></section>
        </div>
      </div>`;
  }

  function renderLeaves() {
    const rows = state.leaves.slice().sort((a, b) => b.from.localeCompare(a.from)).map((l, i) => `
      <tr><td><strong>${escapeHTML(l.type)}</strong><div style="margin-top:4px;color:var(--muted);font-size:10px">${escapeHTML(l.reason)}</div></td><td>${dateLabel(l.from)}</td><td>${dateLabel(l.to)}</td><td>${l.days}</td><td>${badge(l.status)}</td><td>${l.status === "Pending" ? `<button class="text-link" data-action="cancel-leave" data-index="${i}">Cancel</button>` : "—"}</td></tr>`);
    const used = state.leaves.filter(l => l.status === "Approved").reduce((sum, l) => sum + l.days, 0);
    return `${pageHeading("Leaves", "Manage time off, submit requests, and check your leave balance.", `<button class="btn btn-primary" data-action="leave-request">${icon("plus")} Request leave</button>`)}
      <div class="stats-grid">
        ${statCard("Annual leave balance", Math.max(0, 20 - used) + " days", "calendar-days", "purple", "Of 20 days per year")}
        ${statCard("Used this year", used + " days", "calendar-check", "blue", "Approved leave")}
        ${statCard("Pending requests", state.leaves.filter(l => l.status === "Pending").length, "calendar-clock", "orange", "Awaiting approval")}
        ${statCard("Sick leave balance", "8 days", "heart-pulse", "green", "Illustrative demo balance")}
      </div>
      <section class="panel">
        ${panelHeader("Leave history", "Review your submitted requests")}
        ${table(["Leave type", "Start date", "End date", "Days", "Status", "Action"], rows, "You haven't submitted any leave requests.")}
      </section>
      <div style="margin-top:18px" class="callout">${icon("info")}<div><strong>Demo information</strong><br>Leave balances and approval statuses are sample values. Requests made here are not sent to an HR system.</div></div>`;
  }

  function renderTeam() {
    const filtered = team.filter(p => `${p.name} ${p.role} ${p.department} ${p.email}`.toLowerCase().includes(state.search.toLowerCase()));
    return `${pageHeading("My Team", "Find colleagues, explore team roles, and view contact details.", `<button class="btn btn-outline" data-action="export-team">${icon("download")} Export team</button>`)}
      <div class="toolbar"><input class="toolbar-search" id="team-search" type="search" value="${escapeAttr(state.search)}" placeholder="Search by name, role, or department..." aria-label="Search team"><span class="toolbar-spacer"></span><span style="color:var(--muted);font-size:11px">${filtered.length} colleagues</span></div>
      <div class="team-grid">${filtered.map((p, i) => `
        <article class="team-card"><div class="team-card-top"><span class="avatar ${p.color}">${p.initials}</span>${badge(p.status)}</div>
          <h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.role)}</p>
          <div class="team-meta"><span>${icon("building-2")}${escapeHTML(p.department)}</span><span>${icon("map-pin")}${escapeHTML(p.location)}</span></div>
          <div style="display:flex;gap:8px;margin-top:14px"><button class="btn btn-outline btn-small" data-action="team-profile" data-email="${escapeAttr(p.email)}" style="flex:1">${icon("user-round")} View profile</button><button class="btn btn-light btn-small" data-action="email-person" data-email="${escapeAttr(p.email)}" aria-label="Email ${escapeAttr(p.name)}">${icon("mail")}</button></div>
        </article>`).join("") || `<div class="panel empty-state">${icon("users")}No colleagues match your search.</div>`}</div>`;
  }

  function renderTime() {
    const rows = state.timeEntries.slice().reverse().map(e => `<tr><td>${dateLabel(e.date)}</td><td>${escapeHTML(e.project)}</td><td>${escapeHTML(e.task)}</td><td>${e.hours.toFixed(1)}h</td><td>${badge(e.status)}</td></tr>`);
    const total = state.timeEntries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0);
    return `${pageHeading("Time", "Log project hours and review your submitted timesheets.", `<button class="btn btn-primary" data-action="log-time">${icon("plus")} Log time</button>`)}
      <div class="metric-row"><div class="metric-card"><span>Logged hours</span><strong>${total.toFixed(1)}h</strong><small>All demo entries</small></div><div class="metric-card"><span>Weekly target</span><strong>40h</strong><small>Standard work week</small></div><div class="metric-card"><span>Pending approval</span><strong>${state.timeEntries.filter(e => e.status === "Pending").length}</strong><small>Timesheet entries</small></div></div>
      <section class="panel">${panelHeader("Time entries", "Your recent project and task logs", `<button class="btn btn-outline btn-small" data-action="export-time">${icon("download")} Export CSV</button>`)}${table(["Date", "Project", "Task", "Hours", "Status"], rows, "No time entries recorded.")}</section>
      <div style="margin-top:18px" class="callout">${icon("info")}<div><strong>Timesheet reminder</strong><br>Keep your project hours up to date. Entries in this demo are stored only in page memory.</div></div>`;
  }

  function renderFinances() {
    const payslips = [
      { month: "September 2026", date: "2026-09-30", amount: "$5,250.00", status: "Available" },
      { month: "August 2026", date: "2026-08-31", amount: "$5,250.00", status: "Available" },
      { month: "July 2026", date: "2026-07-31", amount: "$5,100.00", status: "Available" }
    ];
    return `${pageHeading("Finances", "Access demo payslip information and review your compensation overview.")}
      <div class="callout" style="margin-bottom:20px">${icon("shield-check")}<div><strong>Sample financial information</strong><br>The figures on this page are fictional placeholders, not your actual payroll or financial records.</div></div>
      <div class="metric-row"><div class="metric-card"><span>Monthly gross pay</span><strong>$6,500</strong><small>Illustrative amount</small></div><div class="metric-card"><span>Estimated deductions</span><strong>$1,250</strong><small>Illustrative amount</small></div><div class="metric-card"><span>Net pay</span><strong>$5,250</strong><small>Illustrative amount</small></div></div>
      <section class="panel">${panelHeader("Payslips", "Example payroll history")}
        ${table(["Pay period", "Pay date", "Net amount", "Status", "Action"], payslips.map(p => `<tr><td><strong>${p.month}</strong></td><td>${dateLabel(p.date)}</td><td>${p.amount}</td><td>${badge("Available")}</td><td><button class="text-link" data-action="payslip" data-period="${escapeAttr(p.month)}">${icon("eye")} Preview</button></td></tr>`))}
      </section>`;
  }

  function renderPerformance() {
    return `${pageHeading("Performance", "Track your goals, reflect on progress, and prepare for check-ins.", `<button class="btn btn-primary" data-action="add-goal">${icon("plus")} Add goal</button>`)}
      <div class="metric-row"><div class="metric-card"><span>Active goals</span><strong>${state.goals.filter(g => g.status !== "Completed").length}</strong><small>Goals in progress</small></div><div class="metric-card"><span>Completed</span><strong>${state.goals.filter(g => g.status === "Completed").length}</strong><small>Goals completed</small></div><div class="metric-card"><span>Overall progress</span><strong>${Math.round(state.goals.reduce((s,g) => s + g.progress,0) / Math.max(state.goals.length,1))}%</strong><small>Average goal completion</small></div></div>
      <div class="stack">${state.goals.map((g, i) => `<section class="panel">
        <div class="panel-header"><div><h2>${escapeHTML(g.title)}</h2><p>${escapeHTML(g.detail)}</p></div>${badge(g.status)}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:11px"><span style="color:var(--muted)">Progress</span><strong>${g.progress}%</strong></div>
        <div class="progress-track" style="height:8px;margin-top:9px"><div class="progress-fill ${g.progress === 100 ? "green" : ""}" style="width:${g.progress}%"></div></div>
        <div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn btn-outline btn-small" data-action="edit-goal" data-index="${i}">${icon("pencil")} Update progress</button></div>
      </section>`).join("")}</div>
      <div style="margin-top:18px" class="callout">${icon("info")}<div><strong>Performance workspace</strong><br>These example goals are local demo data. Connect your organization's HR platform to use real review cycles.</div></div>`;
  }

  function renderDocuments() {
    const filtered = state.documents.filter(d => `${d.name} ${d.category} ${d.type}`.toLowerCase().includes(state.search.toLowerCase()));
    return `${pageHeading("Documents", "Find your HR documents, policies, and personal files.", `<button class="btn btn-primary" data-action="upload-document">${icon("upload")} Add document</button>`)}
      <div class="toolbar"><input class="toolbar-search" id="document-search" type="search" value="${escapeAttr(state.search)}" placeholder="Search documents..." aria-label="Search documents"><span class="toolbar-spacer"></span><span style="color:var(--muted);font-size:11px">${filtered.length} files</span></div>
      <section class="panel">${panelHeader("All documents", "Files available in this demo")}
        <div class="document-list">${filtered.map(d => `<div class="document-item"><span class="file-icon ${d.type === "DOC" ? "doc" : d.type === "XLS" ? "sheet" : "pdf"}">${icon(d.type === "XLS" ? "file-spreadsheet" : d.type === "DOC" ? "file-text" : "file-pdf")}</span><div class="document-copy"><strong>${escapeHTML(d.name)}</strong><small>${escapeHTML(d.category)} · ${escapeHTML(d.size)} · Added ${escapeHTML(d.date)}</small></div><button class="icon-btn" data-action="document-preview" data-name="${escapeAttr(d.name)}" title="Preview document">${icon("eye")}</button></div>`).join("") || `<div class="empty-state">${icon("folder-open")}No documents found.</div>`}</div>
      </section>
      <div style="margin-top:18px" class="callout">${icon("lock-keyhole")}<div><strong>Keep documents secure</strong><br>Do not upload confidential or personal files to this front-end demo.</div></div>`;
  }

  function renderAssets() {
    return `${pageHeading("Assets", "Review the company equipment assigned to you.", `<button class="btn btn-outline" data-action="report-asset">${icon("message-square-warning")} Report an issue</button>`)}
      <div class="metric-row"><div class="metric-card"><span>Assigned assets</span><strong>${state.assets.length}</strong><small>Across your workspace</small></div><div class="metric-card"><span>Active</span><strong>${state.assets.filter(a => a.status === "Active").length}</strong><small>Currently assigned</small></div><div class="metric-card"><span>Requests</span><strong>0</strong><small>No open requests in demo</small></div></div>
      <section class="panel">${panelHeader("My equipment", "Asset inventory and assignment details")}
        <div class="stack">${state.assets.map(a => `<div class="asset-card"><span class="asset-illustration">${icon(a.icon)}</span><div class="asset-copy"><strong>${escapeHTML(a.name)}</strong><p>${escapeHTML(a.category)} · Asset ID ${escapeHTML(a.id)}</p><small>Assigned ${escapeHTML(a.assigned)}</small></div>${badge(a.status)}<button class="icon-btn" data-action="asset-detail" data-id="${escapeAttr(a.id)}" title="View asset">${icon("chevron-right")}</button></div>`).join("")}</div>
      </section>`;
  }

  function bindPageEvents() {
    $$("[data-page]", pageContent).forEach(el => el.addEventListener("click", () => navigate(el.dataset.page)));
    $$("[data-action]", pageContent).forEach(el => el.addEventListener("click", () => handleAction(el.dataset.action, el)));
    const teamSearch = $("#team-search");
    if (teamSearch) teamSearch.addEventListener("input", () => {
      const start = teamSearch.selectionStart;
      state.search = teamSearch.value;
      const y = window.scrollY;
      render();
      const next = $("#team-search");
      if (next) { next.focus(); next.setSelectionRange(start, start); }
      window.scrollTo(0, y);
    });
    const docSearch = $("#document-search");
    if (docSearch) docSearch.addEventListener("input", () => {
      const start = docSearch.selectionStart;
      state.search = docSearch.value;
      const y = window.scrollY;
      render();
      const next = $("#document-search");
      if (next) { next.focus(); next.setSelectionRange(start, start); }
      window.scrollTo(0, y);
    });
    const chartPeriod = $("#chart-period");
    if (chartPeriod) chartPeriod.addEventListener("change", () => {
      const rows = chartPeriod.value === "last"
        ? [{day:"Mon",hours:7.5},{day:"Tue",hours:8},{day:"Wed",hours:6.5},{day:"Thu",hours:8},{day:"Fri",hours:7},{day:"Sat",hours:0},{day:"Sun",hours:0}]
        : [{day:"Mon",hours:8},{day:"Tue",hours:7.5},{day:"Wed",hours:8.2},{day:"Thu",hours:7},{day:"Fri",hours:6.5},{day:"Sat",hours:0},{day:"Sun",hours:0}];
      const wrap = $(".chart-wrap");
      if (wrap) wrap.innerHTML = renderChart(rows);
    });
  }

  function navigate(page) {
    if (!page) return;
    state.page = page;
    state.search = "";
    document.body.classList.remove("sidebar-open");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAction(action, element) {
    switch (action) {
      case "clock": toggleClock(); break;
      case "leave-request": openLeaveModal(); break;
      case "log-time": openTimeModal(); break;
      case "add-goal": openGoalModal(); break;
      case "edit-goal": openGoalModal(Number(element.dataset.index)); break;
      case "notifications": openNotifications(); break;
      case "profile": openProfile(); break;
      case "help": openHelp(); break;
      case "cancel-leave": cancelLeave(Number(element.dataset.index)); break;
      case "team-profile": {
        const person = team.find(p => p.email === element.dataset.email);
        if (person) openTeamProfile(person);
        break;
      }
      case "email-person": {
        const email = element.dataset.email || "";
        showToast("Contact colleague", `Demo contact: ${email}`);
        break;
      }
      case "export-team": exportCSV("peoplehub-team.csv", ["Name", "Role", "Department", "Email", "Location", "Status"], team.map(p => [p.name,p.role,p.department,p.email,p.location,p.status])); break;
      case "export-time": exportCSV("peoplehub-time-entries.csv", ["Date","Project","Task","Hours","Status"], state.timeEntries.map(e => [e.date,e.project,e.task,e.hours,e.status])); break;
      case "payslip": openPayslip(element.dataset.period); break;
      case "upload-document": openDocumentModal(); break;
      case "document-preview": openDocumentPreview(element.dataset.name); break;
      case "asset-detail": openAssetDetail(element.dataset.id); break;
      case "report-asset": openAssetIssueModal(); break;
      default: showToast("Coming soon", "This demo action is not connected to an HR system.");
    }
  }

  function toggleClock() {
    const today = todayISO();
    if (!state.clockedIn) {
      state.clockedIn = true;
      state.clockInAt = new Date();
      state.attendance.push({ date: today, in: timeLabel(state.clockInAt), out: "", hours: "" });
      state.activities.unshift({ icon: "log-in", title: "Clocked in", description: `Your work session started at ${timeLabel(state.clockInAt)}.`, time: "Just now" });
      showToast("Clocked in", `Your workday started at ${timeLabel(state.clockInAt)}.`);
    } else {
      const now = new Date();
      const last = [...state.attendance].reverse().find(entry => entry.date === today && !entry.out);
      if (last) {
        last.out = timeLabel(now);
        last.hours = `${hoursBetween(state.clockInAt, now).toFixed(2)}h`;
      }
      state.clockedIn = false;
      state.activities.unshift({ icon: "log-out", title: "Clocked out", description: `Your work session ended at ${timeLabel(now)}.`, time: "Just now" });
      showToast("Clocked out", "Your session has been recorded in this demo.");
    }
    render();
  }

  function openModal(title, subtitle, body, options = {}) {
    modalRoot.innerHTML = `<div class="modal-overlay" data-overlay>
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header class="modal-header"><div><h2 id="modal-title">${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ""}</div><button class="icon-btn modal-close" type="button" data-modal-close aria-label="Close dialog">${icon("x")}</button></header>
        <div class="modal-body">${body}</div>
      </section></div>`;
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    const overlay = $("[data-overlay]", modalRoot);
    overlay.addEventListener("click", event => { if (event.target === overlay) closeModal(); });
    $("[data-modal-close]", modalRoot).addEventListener("click", closeModal);
    const form = $("form", modalRoot);
    if (form && options.onSubmit) form.addEventListener("submit", event => {
      event.preventDefault();
      options.onSubmit(new FormData(form), form);
    });
    const focusTarget = $("input:not([type=hidden]), select, textarea, button", modalRoot);
    if (focusTarget) setTimeout(() => focusTarget.focus(), 0);
  }

  function closeModal() { modalRoot.innerHTML = ""; }

  function openLeaveModal() {
    const today = todayISO();
    const body = `<form id="leave-form"><div class="form-grid">
      <div class="form-field full"><label for="leave-type">Leave type</label><select id="leave-type" name="type" required><option value="Annual leave">Annual leave</option><option value="Sick leave">Sick leave</option><option value="Personal leave">Personal leave</option><option value="Unpaid leave">Unpaid leave</option></select></div>
      <div class="form-field"><label for="leave-from">Start date</label><input id="leave-from" name="from" type="date" min="${today}" required></div>
      <div class="form-field"><label for="leave-to">End date</label><input id="leave-to" name="to" type="date" min="${today}" required></div>
      <div class="form-field full"><label for="leave-reason">Reason / note</label><textarea id="leave-reason" name="reason" placeholder="Add a short note for your manager..." required></textarea><span class="form-help">This request stays in the local demo and is not sent to your manager.</span></div>
    </div><div class="form-actions"><button type="button" class="btn btn-outline" data-modal-close>Cancel</button><button type="submit" class="btn btn-primary">${icon("send")} Submit request</button></div></form>`;
    openModal("Request leave", "Provide the dates and details for your time off.", body, {
      onSubmit: (data) => {
        const from = data.get("from"), to = data.get("to");
        if (to < from) { showToast("Check your dates", "The end date must be on or after the start date.", "error"); return; }
        const days = Math.round((new Date(`${to}T12:00:00`) - new Date(`${from}T12:00:00`)) / 86400000) + 1;
        state.leaves.unshift({ type: data.get("type"), from, to, days, status: "Pending", reason: data.get("reason") });
        state.activities.unshift({ icon: "calendar-plus", title: "Leave request submitted", description: `${data.get("type")} · ${days} day(s).`, time: "Just now" });
        closeModal(); navigate("Leaves"); showToast("Request submitted", "Your leave request has been added to this demo.");
      }
    });
  }

  function openTimeModal() {
    const body = `<form id="time-form"><div class="form-grid">
      <div class="form-field"><label for="time-date">Date</label><input id="time-date" name="date" type="date" max="${todayISO()}" value="${todayISO()}" required></div>
      <div class="form-field"><label for="time-hours">Hours worked</label><input id="time-hours" name="hours" type="number" min="0.25" max="24" step="0.25" placeholder="7.5" required></div>
      <div class="form-field"><label for="time-project">Project</label><input id="time-project" name="project" placeholder="e.g. PeopleHub redesign" required></div>
      <div class="form-field"><label for="time-task">Task</label><input id="time-task" name="task" placeholder="e.g. UI implementation" required></div>
    </div><div class="form-actions"><button type="button" class="btn btn-outline" data-modal-close>Cancel</button><button type="submit" class="btn btn-primary">${icon("check")} Save entry</button></div></form>`;
    openModal("Log project time", "Add a work entry to your demo timesheet.", body, {
      onSubmit: data => {
        const hours = Number(data.get("hours"));
        if (!(hours > 0 && hours <= 24)) { showToast("Invalid hours", "Enter a value greater than 0 and no more than 24.", "error"); return; }
        state.timeEntries.push({ date: data.get("date"), project: data.get("project"), task: data.get("task"), hours, status: "Pending" });
        closeModal(); navigate("Time"); showToast("Time logged", `${hours.toFixed(2)} hours added to your demo timesheet.`);
      }
    });
  }

  function openGoalModal(index = null) {
    const goal = index === null ? { title: "", detail: "", progress: 0 } : state.goals[index];
    const body = `<form id="goal-form"><div class="form-grid">
      <div class="form-field full"><label for="goal-title">Goal title</label><input id="goal-title" name="title" value="${escapeAttr(goal.title)}" required placeholder="What do you want to achieve?"></div>
      <div class="form-field full"><label for="goal-detail">Description</label><textarea id="goal-detail" name="detail" required placeholder="Describe the outcome you are working toward.">${escapeHTML(goal.detail)}</textarea></div>
      <div class="form-field full"><label for="goal-progress">Progress (%)</label><input id="goal-progress" name="progress" type="number" min="0" max="100" step="5" value="${goal.progress}" required></div>
    </div><div class="form-actions"><button type="button" class="btn btn-outline" data-modal-close>Cancel</button><button type="submit" class="btn btn-primary">Save goal</button></div></form>`;
    openModal(index === null ? "Add performance goal" : "Update goal", "Keep your development goals up to date.", body, {
      onSubmit: data => {
        const progress = Number(data.get("progress"));
        if (progress < 0 || progress > 100) { showToast("Invalid progress", "Progress must be between 0 and 100.", "error"); return; }
        const updated = { title: data.get("title"), detail: data.get("detail"), progress, status: progress === 100 ? "Completed" : "In progress" };
        if (index === null) state.goals.push(updated); else state.goals[index] = updated;
        closeModal(); navigate("Performance"); showToast("Goal saved", "Your demo performance goal has been updated.");
      }
    });
  }

  function cancelLeave(index) {
    const pending = state.leaves.filter(l => l.status === "Pending");
    const target = pending[index];
    if (!target) { showToast("Request unavailable", "That pending request could not be found.", "error"); return; }
    if (!window.confirm(`Cancel this ${target.type.toLowerCase()} request?`)) return;
    const actualIndex = state.leaves.indexOf(target);
    state.leaves.splice(actualIndex, 1);
    render(); showToast("Request cancelled", "The pending request was removed from this demo.");
  }

  function openNotifications() {
    state.notificationsRead = true;
    $$(".notification-dot").forEach(dot => dot.style.display = "none");
    const body = `<div style="display:flex;justify-content:flex-end;margin-bottom:14px"><button class="text-link" id="clear-notifications">${icon("check-check")} Mark all as read</button></div>${activityList(state.activities)}`;
    openModal("Notifications", "Your latest PeopleHub updates.", body);
    const clear = $("#clear-notifications", modalRoot);
    if (clear) clear.addEventListener("click", () => { state.activities = []; closeModal(); showToast("All caught up", "Your demo notification list has been cleared."); });
  }

  function openProfile() {
    const body = `<div class="profile-detail"><span class="avatar avatar-blue">${currentUser.initials}</span><div><h2>${escapeHTML(currentUser.name)}</h2><p>${escapeHTML(currentUser.role)}</p></div></div>
      <div class="detail-list">
        <div class="detail-row"><span>Employee ID</span><strong>${currentUser.employeeId}</strong></div>
        <div class="detail-row"><span>Email</span><strong>${currentUser.email}</strong></div>
        <div class="detail-row"><span>Department</span><strong>${currentUser.department}</strong></div>
        <div class="detail-row"><span>Manager</span><strong>${currentUser.manager}</strong></div>
        <div class="detail-row"><span>Location</span><strong>${currentUser.location}</strong></div>
        <div class="detail-row"><span>Start date</span><strong>${currentUser.startDate}</strong></div>
      </div><div class="form-actions"><button class="btn btn-primary" id="profile-close">Done</button></div>`;
    openModal("My profile", "Your employee details (sample data).", body);
    $("#profile-close", modalRoot)?.addEventListener("click", closeModal);
  }

  function openHelp() {
    const body = `<form id="help-form"><div class="form-grid">
      <div class="form-field full"><label for="help-topic">What do you need help with?</label><select id="help-topic" name="topic"><option>Attendance</option><option>Leave request</option><option>Payroll and finances</option><option>Documents</option><option>IT equipment</option><option>Other</option></select></div>
      <div class="form-field full"><label for="help-message">How can we help?</label><textarea id="help-message" name="message" placeholder="Describe your question or issue..." required></textarea></div>
    </div><div class="form-actions"><button type="button" class="btn btn-outline" data-modal-close>Cancel</button><button type="submit" class="btn btn-primary">${icon("send")} Create demo ticket</button></div></form>`;
    openModal("Contact support", "Create a sample support request.", body, {
      onSubmit: data => {
        closeModal(); showToast("Demo ticket created", `${data.get("topic")}: your request is recorded locally for this demo.`);
      }
    });
  }

  function openTeamProfile(person) {
    const body = `<div class="profile-detail"><span class="avatar ${person.color}">${person.initials}</span><div><h2>${escapeHTML(person.name)}</h2><p>${escapeHTML(person.role)}</p></div></div>
      <div class="detail-list"><div class="detail-row"><span>Department</span><strong>${escapeHTML(person.department)}</strong></div><div class="detail-row"><span>Email</span><strong>${escapeHTML(person.email)}</strong></div><div class="detail-row"><span>Location</span><strong>${escapeHTML(person.location)}</strong></div><div class="detail-row"><span>Status</span><strong>${escapeHTML(person.status)}</strong></div></div>
      <div class="form-actions"><button class="btn btn-outline" data-modal-close>Close</button><button class="btn btn-primary" id="team-email">${icon("mail")} Contact</button></div>`;
    openModal("Colleague profile", "Sample directory information.", body);
    $("#team-email", modalRoot)?.addEventListener("click", () => { closeModal(); showToast("Contact colleague", `Demo contact: ${person.email}`); });
  }

  function openPayslip(period) {
    openModal("Payslip preview", period, `<div class="callout" style="margin-bottom:17px">${icon("info")}This is a fictional preview for the PeopleHub interface demo.</div>
      <div class="detail-list"><div class="detail-row"><span>Employee</span><strong>${currentUser.name}</strong></div><div class="detail-row"><span>Pay period</span><strong>${escapeHTML(period)}</strong></div><div class="detail-row"><span>Gross pay</span><strong>$6,500.00</strong></div><div class="detail-row"><span>Estimated deductions</span><strong>−$1,250.00</strong></div><div class="detail-row"><span>Net pay</span><strong>$5,250.00</strong></div></div>
      <div class="form-actions"><button class="btn btn-outline" data-modal-close>Close</button><button class="btn btn-primary" id="payslip-demo-download">${icon("download")} Demo export</button></div>`);
    $("#payslip-demo-download", modalRoot)?.addEventListener("click", () => {
      exportCSV(`sample-payslip-${String(period).replace(/\s+/g, "-").toLowerCase()}.csv`, ["Field", "Value"], [["Employee",currentUser.name],["Pay period",period],["Gross pay","6500.00"],["Estimated deductions","1250.00"],["Net pay","5250.00"]]);
      showToast("Sample exported", "A fictional payslip summary was exported as CSV.");
    });
  }

  function openDocumentPreview(name) {
    const doc = state.documents.find(d => d.name === name);
    openModal("Document preview", name, `<div class="empty-state">${icon("file-text")}<strong>${escapeHTML(name)}</strong><p>This demo does not contain the actual document file. Connect a document repository to preview or download real files.</p></div>
      <div class="detail-list"><div class="detail-row"><span>File type</span><strong>${escapeHTML(doc?.type || "Document")}</strong></div><div class="detail-row"><span>Category</span><strong>${escapeHTML(doc?.category || "—")}</strong></div><div class="detail-row"><span>File size</span><strong>${escapeHTML(doc?.size || "—")}</strong></div></div>
      <div class="form-actions"><button class="btn btn-primary" data-modal-close>Done</button></div>`);
  }

  function openDocumentModal() {
    const body = `<form id="document-form"><div class="form-grid">
      <div class="form-field full"><label for="document-name">Document name</label><input id="document-name" name="name" placeholder="e.g. Training certificate.pdf" required></div>
      <div class="form-field"><label for="document-type">File type</label><select id="document-type" name="type"><option value="PDF">PDF</option><option value="DOC">Word document</option><option value="XLS">Spreadsheet</option></select></div>
      <div class="form-field"><label for="document-category">Category</label><select id="document-category" name="category"><option>Personal documents</option><option>Benefits</option><option>Training</option><option>Performance</option><option>Company policy</option></select></div>
      <div class="form-field full"><span class="form-help">This creates a sample document entry only; no file is uploaded or stored.</span></div>
    </div><div class="form-actions"><button type="button" class="btn btn-outline" data-modal-close>Cancel</button><button type="submit" class="btn btn-primary">Add entry</button></div></form>`;
    openModal("Add document entry", "Add a placeholder to your demo document list.", body, {
      onSubmit: data => {
        state.documents.unshift({ name: data.get("name"), type: data.get("type"), size: "—", date: dateLabel(todayISO()), category: data.get("category") });
        state.search = ""; closeModal(); navigate("Documents"); showToast("Document entry added", "No file was uploaded.");
      }
    });
  }

  function openAssetDetail(id) {
    const asset = state.assets.find(a => a.id === id);
    if (!asset) return;
    openModal("Asset details", asset.name, `<div class="profile-detail"><span class="asset-illustration">${icon(asset.icon)}</span><div><h2>${escapeHTML(asset.name)}</h2><p>${escapeHTML(asset.category)}</p></div></div>
      <div class="detail-list"><div class="detail-row"><span>Asset ID</span><strong>${escapeHTML(asset.id)}</strong></div><div class="detail-row"><span>Assigned on</span><strong>${escapeHTML(asset.assigned)}</strong></div><div class="detail-row"><span>Status</span><strong>${escapeHTML(asset.status)}</strong></div><div class="detail-row"><span>Assigned to</span><strong>${currentUser.name}</strong></div></div>
      <div class="form-actions"><button class="btn btn-primary" data-modal-close>Done</button></div>`);
  }

  function openAssetIssueModal() {
    const body = `<form id="asset-issue-form"><div class="form-grid">
      <div class="form-field full"><label for="asset-select">Asset</label><select id="asset-select" name="asset">${state.assets.map(a => `<option value="${escapeAttr(a.id)}">${escapeHTML(a.name)} (${escapeHTML(a.id)})</option>`).join("")}</select></div>
      <div class="form-field full"><label for="asset-issue">Issue description</label><textarea id="asset-issue" name="issue" required placeholder="Describe the equipment issue..."></textarea></div>
    </div><div class="form-actions"><button type="button" class="btn btn-outline" data-modal-close>Cancel</button><button type="submit" class="btn btn-primary">${icon("send")} Submit report</button></div></form>`;
    openModal("Report an asset issue", "Create a local demo report.", body, {
      onSubmit: data => { closeModal(); showToast("Issue report created", `${data.get("asset")}: recorded locally in this demo.`); }
    });
  }

  function exportCSV(filename, headers, rows) {
    const quote = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map(row => row.map(quote).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove();
    URL.revokeObjectURL(url);
    showToast("Export ready", `${filename} has been generated.`);
  }

  function showToast(title, message, type = "success") {
    if (!toastRoot) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "error" : ""}`;
    toast.innerHTML = `${icon(type === "error" ? "alert-circle" : "check-circle")}<div><strong>${escapeHTML(title)}</strong><p>${escapeHTML(message)}</p></div>`;
    toastRoot.appendChild(toast);
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons({ nodes: [toast] });
    window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(5px)";
      window.setTimeout(() => toast.remove(), 200);
    }, 3600);
  }

  function setupGlobalEvents() {
    $("#main-nav")?.addEventListener("click", event => {
      const button = event.target.closest("[data-page]");
      if (button) navigate(button.dataset.page);
    });
    $("#work-nav")?.addEventListener("click", event => {
      const button = event.target.closest("[data-page]");
      if (button) navigate(button.dataset.page);
    });
    $(".brand")?.addEventListener("click", event => {
      event.preventDefault(); navigate("Dashboard");
    });
    $("#menu-toggle")?.addEventListener("click", () => document.body.classList.toggle("sidebar-open"));
    document.addEventListener("click", event => {
      if (document.body.classList.contains("sidebar-open") && !event.target.closest(".sidebar") && !event.target.closest("#menu-toggle")) {
        document.body.classList.remove("sidebar-open");
      }
      const action = event.target.closest("[data-action]");
      if (action && !pageContent.contains(action)) handleAction(action.dataset.action, action);
      const page = event.target.closest("[data-page]");
      if (page && !pageContent.contains(page) && !page.closest("#main-nav") && !page.closest("#work-nav") && !page.closest(".brand")) navigate(page.dataset.page);
      if (event.target.closest("[data-modal-close]")) closeModal();
    });
    const globalSearch = $("#global-search");
    if (globalSearch) {
      globalSearch.addEventListener("input", () => {
        state.search = globalSearch.value.trim();
        if (state.page !== "My Team" && state.page !== "Documents") {
          if (state.search) navigate("My Team");
          else return;
        } else render();
        const target = state.page === "Documents" ? $("#document-search") : $("#team-search");
        if (target) { target.value = state.search; target.focus(); }
      });
      globalSearch.addEventListener("keydown", event => {
        if (event.key === "Escape") { globalSearch.value = ""; state.search = ""; globalSearch.blur(); render(); }
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); globalSearch.focus(); }
      });
    }
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeModal();
        document.body.classList.remove("sidebar-open");
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); globalSearch?.focus();
      }
    });
  }

  setupGlobalEvents();
  render();
})();

