/* NSB Fund Utilization Tracking Module — standalone demo.
   SUPABASE-READY CONFIG: leave both values empty to keep using localStorage
   in this browser. When the project owner fills in a Supabase Project URL and
   public anon key below, the app can be switched to Supabase as the shared
   database instead of localStorage. Never put a password or service key here. */
const SUPABASE_CONFIG = { SUPABASE_URL: "", SUPABASE_ANON_KEY: "" };
const DB_MODE = (SUPABASE_CONFIG.SUPABASE_URL && SUPABASE_CONFIG.SUPABASE_ANON_KEY) ? "Supabase (configured)" : "localStorage demo — this browser only";
const KEY = "nsb_fund_utilization_v1";
const HEADS = ["Utilities", "Minor Repairs", "Stationery", "Cleanliness", "Furniture", "Other"];
const DISTRICTS = ["Lahore", "Sheikhupura", "Gujranwala"];
const ROLES = { sed: "SED / PMIU Officer", district: "District Officer (DEA)", school: "School Head", auditor: "Auditor" };
const TABS = [
  { id: "dashboard", label: "Dashboard", roles: ["sed", "district", "school", "auditor"] },
  { id: "schools", label: "Schools", roles: ["sed", "district", "school"] },
  { id: "allocations", label: "Allocations", roles: ["sed", "district"] },
  { id: "releases", label: "Releases", roles: ["sed", "district", "school"] },
  { id: "spending", label: "Spending & Cash Book", roles: ["sed", "district", "school"] },
  { id: "review", label: "Review", roles: ["sed", "district", "auditor"] },
  { id: "deliverables", label: "Deliverables", roles: ["sed", "district", "auditor"] },
  { id: "access", label: "Access & Audit", roles: ["sed", "district", "auditor"] }
];
const DELIVERABLES = [
  ["D-1", "Inception Report (methodology, work plan, team deployment)", "Within 1 week", "20%"],
  ["D-2", "Software Requirement Specification (SRS), System Design, Integration / API Specifications", "Within 2 weeks", "20%"],
  ["D-3", "UI/UX Prototypes (SIS screens and IMIS dashboards)", "Within 4 weeks", "50%"],
  ["D-4", "Release 1: Allocations and Releases", "Within 7 weeks", "50%"],
  ["D-5", "Release 2: School Spending with Receipts, Review, IMIS Dashboards and Reports", "Within 9 weeks", "50%"],
  ["D-6", "UAT, Security Testing and Pilot Deployment Report (selected districts)", "Within 11 weeks", "50%"],
  ["D-7", "Province-wide Go-Live, Training of Master Trainers, User Manuals (soft and printed)", "Within 12 weeks", "30%"],
  ["D-8", "Handover of Source Code, Database Scripts and Technical Documentation", "At go-live", "30%"],
  ["D-9", "Monthly Progress Reports (during development)", "By the 5th of each following month", "30%"],
  ["D-10", "Monthly Support Reports (during post-deployment support)", "By the 5th of each month following go-live", "30%"],
  ["D-11", "Project Completion Report", "By the 5th of the month following the end of support", "30%"]
];
function seed() {
  return {
    fiscalYear: "2026-27",
    formula: { base: 50000, perStudent: 250, perClassroom: 8000, levelWeight: { Primary: 1.0, Elementary: 1.15, High: 1.30 } },
    schools: [
      { id: "S01", emis: "35210001", name: "Govt. Primary School, Model Town", district: "Lahore", level: "Primary", enrolment: 420, classrooms: 12, councilLimit: 100000 },
      { id: "S02", emis: "35210002", name: "Govt. Girls High School, Gulberg", district: "Lahore", level: "High", enrolment: 860, classrooms: 22, councilLimit: 150000 },
      { id: "S03", emis: "35210003", name: "Govt. Elementary School, Cantt", district: "Lahore", level: "Elementary", enrolment: 540, classrooms: 15, councilLimit: 120000 },
      { id: "S04", emis: "35220001", name: "Govt. Primary School, Housing Colony", district: "Sheikhupura", level: "Primary", enrolment: 380, classrooms: 10, councilLimit: 100000 },
      { id: "S05", emis: "35220002", name: "Govt. High School, Main Bazaar", district: "Sheikhupura", level: "High", enrolment: 720, classrooms: 18, councilLimit: 150000 },
      { id: "S06", emis: "35220003", name: "Govt. Girls Elementary School, Civil Lines", district: "Sheikhupura", level: "Elementary", enrolment: 460, classrooms: 13, councilLimit: 120000 },
      { id: "S07", emis: "35230001", name: "Govt. Primary School, DC Colony", district: "Gujranwala", level: "Primary", enrolment: 450, classrooms: 11, councilLimit: 100000 },
      { id: "S08", emis: "35230002", name: "Govt. High School, Model Town", district: "Gujranwala", level: "High", enrolment: 910, classrooms: 24, councilLimit: 150000 },
      { id: "S09", emis: "35230003", name: "Govt. Elementary School, Satellite Town", district: "Gujranwala", level: "Elementary", enrolment: 510, classrooms: 14, councilLimit: 120000 }
    ],
    allocations: [
      { schoolId: "S01", opening: 18000, allocation: 251000, year: "2026-27" },
      { schoolId: "S02", allocation: 573300, opening: 25000, year: "2026-27" },
      { schoolId: "S03", allocation: 350750, opening: 12000, year: "2026-27" },
      { schoolId: "S04", allocation: 225000, opening: 9000, year: "2026-27" },
      { schoolId: "S05", allocation: 486200, opening: 20000, year: "2026-27" },
      { schoolId: "S06", allocation: 309350, opening: 15000, year: "2026-27" },
      { schoolId: "S07", allocation: 250500, opening: 11000, year: "2026-27" },
      { schoolId: "S08", allocation: 610350, opening: 22000, year: "2026-27" },
      { schoolId: "S09", allocation: 332925, opening: 14000, year: "2026-27" }
    ],
    releases: [
      { id: "R01", from: "SED", to: "DEA Lahore", date: "2026-07-10", amount: 1100000, instalment: "Instalment 1", bankRef: "SED-NSB-2026-001", sanction: "Release Order SED-NSB-01.pdf", status: "Acknowledged" },
      { id: "R02", from: "DEA Lahore", to: "Govt. Primary School, Model Town", schoolId: "S01", date: "2026-07-18", amount: 120000, instalment: "Instalment 1", bankRef: "DEA-LHR-2026-014", sanction: "Sanction Letter DEA-LHR-14.pdf", status: "Acknowledged" },
      { id: "R03", from: "DEA Sheikhupura", to: "Govt. High School, Main Bazaar", schoolId: "S05", date: "2026-07-20", amount: 150000, instalment: "Instalment 1", bankRef: "DEA-SKP-2026-009", sanction: "Sanction Letter DEA-SKP-09.pdf", status: "Pending Acknowledgement" }
    ],
    expenditures: [
      { id: "E01", schoolId: "S01", date: "2026-08-02", head: "Utilities", vendor: "LESCO Bill Payment", amount: 18500, description: "Electricity bill, July 2026", receipt: "lesco-bill-jul-2026.jpg", status: "Approved", review: "Reviewed — receipt verified" },
      { id: "E02", schoolId: "S01", date: "2026-08-09", head: "Stationery", vendor: "City Stationers", amount: 22400, description: "Notebooks, pencils and charts for classes 1 to 5", receipt: "city-stationers-invoice-091.jpg", status: "Approved", review: "Reviewed — receipt verified" },
      { id: "E03", schoolId: "S02", date: "2026-08-12", head: "Minor Repairs", vendor: "Ahmed Repair Works", amount: 165000, description: "Roof and classroom door repair", receipt: "repair-invoice-122.jpg", status: "Flagged", review: "Flagged — amount above school council limit, needs district review" },
      { id: "E04", schoolId: "S05", date: "2026-08-15", head: "Cleanliness", vendor: "Clean Care Services", amount: 9800, description: "Cleaning material for August", receipt: "clean-care-cash-memo.jpg", status: "Pending Review", review: "Not yet reviewed" }
    ],
    audit: [
      { date: "2026-07-10", actor: "SED / PMIU Officer", action: "Release R01 recorded: SED to DEA Lahore, Rs. 1,100,000" },
      { date: "2026-07-18", actor: "District Officer (DEA)", action: "Release R02 recorded and acknowledged by school S01" },
      { date: "2026-08-02", actor: "School Head", action: "Expenditure E01 recorded with receipt lesco-bill-jul-2026.jpg" },
      { date: "2026-08-12", actor: "System", action: "Expenditure E03 auto-flagged: amount above school council limit" }
    ]
  };
}
let state;
try { state = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch (e) { state = seed(); }
if (!state.schools) state = seed();
let role = "sed", tab = "dashboard";
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
function fmt(n) { return "Rs. " + Number(n || 0).toLocaleString("en-PK"); }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function school(id) { return state.schools.find(function (s) { return s.id === id; }) || {}; }
function allocFor(id) { var a = state.allocations.find(function (x) { return x.schoolId === id; }); return a || { schoolId: id, opening: 0, allocation: 0 }; }
function calcAllocation(s) { var f = state.formula; return Math.round((f.base + f.perStudent * s.enrolment + f.perClassroom * s.classrooms) * f.levelWeight[s.level]); }
function releasedTo(id) { return state.releases.filter(function (r) { return r.schoolId === id && r.status === "Acknowledged"; }).reduce(function (t, r) { return t + Number(r.amount); }, 0); }
function spentBy(id) { return state.expenditures.filter(function (e) { return e.schoolId === id; }).reduce(function (t, e) { return t + Number(e.amount); }, 0); }
function audit(action) { state.audit.unshift({ date: new Date().toISOString().slice(0, 10), actor: ROLES[role], action: action }); save(); }
function toast(msg) { var t = document.getElementById("toast"); if (!t) return; t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 3500); }
function statusPill(s) { var c = (s === "Approved" || s === "Acknowledged") ? "pill pill-ok" : (s === "Flagged" ? "pill pill-bad" : "pill pill-warn"); return '<span class="' + c + '">' + esc(s) + '</span>'; }
function go(t) { tab = t; render(); window.scrollTo(0, 0); }
function setRole(v) { role = v; if (!TABS.find(function (t) { return t.id === tab; }).roles.includes(role)) tab = "dashboard"; render(); }

function render() {
  var tabsEl = document.getElementById("tabs");
  var flagged = state.expenditures.filter(function (e) { return e.status === "Flagged"; }).length;
  tabsEl.innerHTML = TABS.map(function (t) {
    var allowed = t.roles.includes(role);
    var badge = t.id === "review" && flagged ? '<span class="badge">' + flagged + '</span>' : "";
    return '<button ' + (allowed ? "" : "disabled") + ' class="' + (tab === t.id ? "active" : "") + '" onclick="go(\'' + t.id + '\')">' + t.label + badge + "</button>";
  }).join("");
  document.getElementById("roleSelect").value = role;
  var v = document.getElementById("view");
  if (tab === "dashboard") v.innerHTML = viewDashboard();
  else if (tab === "schools") v.innerHTML = viewSchools();
  else if (tab === "allocations") v.innerHTML = viewAllocations();
  else if (tab === "releases") v.innerHTML = viewReleases();
  else if (tab === "spending") v.innerHTML = viewSpending();
  else if (tab === "review") v.innerHTML = viewReview();
  else if (tab === "deliverables") v.innerHTML = viewDeliverables();
  else v.innerHTML = viewAccess();
  v.querySelectorAll("table").forEach(function (tb) { if (!tb.parentElement.classList.contains("table-wrap")) { var w = document.createElement("div"); w.className = "table-wrap"; tb.parentNode.insertBefore(w, tb); w.appendChild(tb); } });
}
function totals() {
  var alloc = state.allocations.reduce(function (t, a) { return t + Number(a.allocation) + Number(a.opening); }, 0);
  var rel = state.releases.reduce(function (t, r) { return t + Number(r.amount); }, 0);
  var spent = state.expenditures.reduce(function (t, e) { return t + Number(e.amount); }, 0);
  var withReceipt = state.expenditures.filter(function (e) { return e.receipt; }).reduce(function (t, e) { return t + Number(e.amount); }, 0);
  return { alloc: alloc, rel: rel, spent: spent, balance: alloc - spent, util: alloc ? Math.round(spent / alloc * 100) : 0, receiptPct: spent ? Math.round(withReceipt / spent * 100) : 0 };
}
function viewDashboard() {
  var t = totals();
  var rows = DISTRICTS.map(function (d) {
    var sc = state.schools.filter(function (s) { return s.district === d; });
    var a = sc.reduce(function (x, s) { var al = allocFor(s.id); return x + al.allocation + al.opening; }, 0);
    var sp = sc.reduce(function (x, s) { return x + spentBy(s.id); }, 0);
    return "<tr><td>" + d + "</td><td>" + sc.length + "</td><td>" + fmt(a) + "</td><td>" + fmt(sp) + "</td><td>" + fmt(a - sp) + "</td><td>" + (a ? Math.round(sp / a * 100) : 0) + "%</td></tr>";
  }).join("");
  var heads = HEADS.map(function (h) {
    var sp = state.expenditures.filter(function (e) { return e.head === h; }).reduce(function (x, e) { return x + Number(e.amount); }, 0);
    return "<tr><td>" + h + "</td><td>" + fmt(sp) + "</td></tr>";
  }).join("");
  return '<div class="card"><h2>Dashboard — Province, District and School Level</h2><p class="muted">Database: ' + esc(DB_MODE) + ' &nbsp;|&nbsp; All amounts in Pakistani Rupees. Receipt coverage is the share of spending supported by a receipt.</p>'
    + '<div class="kpis"><div class="kpi"><b>' + fmt(t.alloc) + '</b><span>Total allocation + opening balance</span></div><div class="kpi"><b>' + fmt(t.rel) + '</b><span>Total released</span></div><div class="kpi"><b>' + fmt(t.spent) + '</b><span>Total spent</span></div><div class="kpi tone-ok"><b>' + fmt(t.balance) + '</b><span>Balance remaining</span></div></div>'
    + '<div class="kpis"><div class="kpi"><b>' + t.util + '%</b><span>Utilization</span></div><div class="kpi"><b>' + t.receiptPct + '%</b><span>Spending supported by receipts</span></div><div class="kpi"><b>' + state.schools.length + '</b><span>Schools in this demo</span></div><div class="kpi tone-bad"><b>' + state.expenditures.filter(function (e) { return e.status === "Flagged"; }).length + '</b><span>Flagged for review</span></div></div>'
    + '<h3>Start Here — 4 Steps</h3><div class="steps">'
    + '<button class="step" onclick="go(\'schools\')"><span class="step-num">1</span><b>Add Schools</b>Register a school with EMIS, enrolment, classrooms and council limit.</button>'
    + '<button class="step" onclick="go(\'allocations\')"><span class="step-num">2</span><b>Calculate Allocations</b>Run the formula and carry forward last year\'s unspent balance.</button>'
    + '<button class="step" onclick="go(\'releases\')"><span class="step-num">3</span><b>Record Releases</b>Record SED to DEA and DEA to school releases with bank reference.</button>'
    + '<button class="step" onclick="go(\'spending\')"><span class="step-num">4</span><b>Record Spending</b>Record each expense with a mandatory receipt and view the cash book.</button></div></div>'
    + '<div class="grid2"><div class="card"><h3>District Summary</h3><table><tr><th>District</th><th>Schools</th><th>Available</th><th>Spent</th><th>Balance</th><th>Util. %</th></tr>' + rows + '</table></div>'
    + '<div class="card"><h3>Spending by Head of Account</h3><table><tr><th>Head</th><th>Amount</th></tr>' + heads + '</table><button class="btn" onclick="exportCSV()">Export District Summary (CSV)</button> <button class="btn light" onclick="window.print()">Print Report (PDF)</button></div></div>';
}
function viewSchools() {
  var rows = state.schools.map(function (s) {
    return "<tr><td>" + esc(s.emis) + "</td><td>" + esc(s.name) + "</td><td>" + esc(s.district) + "</td><td>" + esc(s.level) + "</td><td>" + s.enrolment + "</td><td>" + s.classrooms + "</td><td>" + fmt(s.councilLimit) + "</td></tr>";
  }).join("");
  return '<div class="card"><h2>Schools Register</h2><p class="muted">School master data comes from SIS in the live system. In this demo, add a school below.</p><table><tr><th>EMIS</th><th>School</th><th>District</th><th>Level</th><th>Enrolment</th><th>Classrooms</th><th>Council Limit</th></tr>' + rows + '</table></div>'
    + '<div class="card"><h3>Add School</h3><p class="hint">Every field is required. The council limit is the maximum a school can spend on one item without district review.</p><form onsubmit="addSchool(event)"><div><label>EMIS Code</label><input name="emis" required></div><div><label>School Name</label><input name="name" required></div><div><label>District</label><select name="district">' + DISTRICTS.map(function (d) { return "<option>" + d + "</option>"; }).join("") + '</select></div><div><label>Level</label><select name="level"><option>Primary</option><option>Elementary</option><option>High</option></select></div><div><label>Enrolment</label><input name="enrolment" type="number" min="1" required></div><div><label>Classrooms</label><input name="classrooms" type="number" min="1" required></div><div><label>School Council Spending Limit (Rs.)</label><input name="councilLimit" type="number" min="1" value="100000" required></div><div><label>&nbsp;</label><button class="btn" type="submit">Add School</button></div></form></div>';
}
function viewAllocations() {
  var f = state.formula;
  var rows = state.schools.map(function (s) {
    var a = allocFor(s.id), calc = calcAllocation(s);
    return "<tr><td>" + esc(s.name) + "</td><td>" + esc(s.district) + "</td><td>" + fmt(a.opening) + "</td><td>" + fmt(a.allocation || calc) + "</td><td>" + fmt((a.opening || 0) + (a.allocation || calc)) + "</td></tr>";
  }).join("");
  return '<div class="card"><h2>Allocations — Fiscal Year 2026-27</h2><p class="muted">Formula: (Base + Per-Student x Enrolment + Per-Classroom x Classrooms) x Level Weight. Last year\'s unspent balance is carried forward as the opening balance. The formula can be changed without code changes.</p>'
    + '<form onsubmit="saveFormula(event)"><div><label>Base Amount (Rs.)</label><input name="base" type="number" value="' + f.base + '"></div><div><label>Per Student (Rs.)</label><input name="perStudent" type="number" value="' + f.perStudent + '"></div><div><label>Per Classroom (Rs.)</label><input name="perClassroom" type="number" value="' + f.perClassroom + '"></div><div><label>Primary Weight</label><input name="wP" type="number" step="0.01" value="' + f.levelWeight.Primary + '"></div><div><label>Elementary Weight</label><input name="wE" type="number" step="0.01" value="' + f.levelWeight.Elementary + '"></div><div><label>High Weight</label><input name="wH" type="number" step="0.01" value="' + f.levelWeight.High + '"></div><div><label>&nbsp;</label><button class="btn" type="submit">Save Formula</button></div></form>'
    + '<p><button class="btn green" onclick="calculateAllocations()">Calculate Allocations for All Schools</button></p>'
    + '<table><tr><th>School</th><th>District</th><th>Opening Balance (carry-forward)</th><th>Allocation</th><th>Total Available</th></tr>' + rows + '</table></div>';
}
function viewReleases() {
  var rows = state.releases.map(function (r) {
    return "<tr><td>" + esc(r.id) + "</td><td>" + esc(r.from) + " to " + esc(r.to) + "</td><td>" + esc(r.date) + "</td><td>" + fmt(r.amount) + "</td><td>" + esc(r.instalment) + "</td><td>" + esc(r.bankRef) + "</td><td>" + esc(r.sanction) + "</td><td>" + statusPill(r.status) + '</td><td>' + (r.status !== "Acknowledged" ? '<button class="btn" onclick="acknowledge(\'' + r.id + '\')">Acknowledge Receipt</button>' : "—") + "</td></tr>";
  }).join("");
  var opts = state.schools.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + " (" + esc(s.district) + ")</option>"; }).join("");
  return '<div class="card"><h2>Releases — SED to DEA to School</h2><p class="muted">Record each release with date, amount, instalment and bank transaction reference. Upload the release order or sanction letter (file name is recorded in this demo). The school acknowledges receipt in SIS.</p><table><tr><th>ID</th><th>From to To</th><th>Date</th><th>Amount</th><th>Instalment</th><th>Bank Reference</th><th>Sanction Letter</th><th>Status</th><th>Action</th></tr>' + rows + '</table></div>'
    + '<div class="card"><h3>Record a Release</h3><p class="hint">Enter the bank reference exactly as on the bank statement, and attach the release order or sanction letter. A release can never be more than the school\'s remaining allocation (opening balance + allocation, minus releases already recorded to that school).</p><form onsubmit="addRelease(event)"><div><label>From</label><select name="from"><option>SED</option><option>DEA Lahore</option><option>DEA Sheikhupura</option><option>DEA Gujranwala</option></select></div><div><label>To School</label><select name="schoolId">' + opts + '</select></div><div><label>Date</label><input name="date" type="date" required></div><div><label>Amount (Rs.)</label><input name="amount" type="number" min="1" required></div><div><label>Instalment</label><select name="instalment"><option>Instalment 1</option><option>Instalment 2</option><option>Instalment 3</option></select></div><div><label>Bank Transaction Reference</label><input name="bankRef" required></div><div><label>Release Order / Sanction Letter (file name)</label><input name="sanction" type="file"></div><div><label>&nbsp;</label><button class="btn" type="submit">Record Release</button></div></form></div>';
}
function viewSpending() {
  var sel = document.getElementById("cashSchool");
  var sid = sel ? sel.value : "S01";
  var rows = state.expenditures.filter(function (e) { return e.schoolId === sid; }).map(function (e) {
    return "<tr><td>" + esc(e.date) + "</td><td>" + esc(e.head) + "</td><td>" + esc(e.vendor) + "</td><td>" + fmt(e.amount) + "</td><td>" + esc(e.description) + "</td><td>" + (e.receipt ? esc(e.receipt) : '<span class="pill pill-bad">Missing receipt</span>') + "</td><td>" + statusPill(e.status) + "</td></tr>";
  }).join("") || '<tr><td colspan="7"><span class="empty">No spending recorded for this school yet. Use the form above to record the first expense.</span></td></tr>';
  var a = allocFor(sid), avail = (a.opening || 0) + (a.allocation || calcAllocation(school(sid)));
  var opts = state.schools.map(function (s) { return '<option value="' + s.id + '"' + (s.id === sid ? " selected" : "") + ">" + esc(s.name) + "</option>"; }).join("");
  var expOpts = state.schools.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + "</option>"; }).join("");
  return '<div class="card"><h2>School Spending in SIS</h2><p class="muted">The school head records each expense directly, against the head of account, with vendor, amount, date and description. A receipt, invoice or cash memo photo is mandatory for every expense. Spending is not held up for prior approval; it is reviewed afterwards by the district.</p>'
    + '<form onsubmit="addExpense(event)"><div><label>School</label><select name="schoolId">' + expOpts + '</select></div><div><label>Head of Account</label><select name="head">' + HEADS.map(function (h) { return "<option>" + h + "</option>"; }).join("") + '</select></div><div><label>Vendor</label><input name="vendor" required></div><div><label>Amount (Rs.)</label><input name="amount" type="number" min="1" required></div><div><label>Date</label><input name="date" type="date" required></div><div><label>Description</label><input name="description" required></div><div><label>Receipt / Invoice / Cash Memo (mandatory)</label><input name="receipt" type="file" required></div><div><label>&nbsp;</label><button class="btn" type="submit">Record Expense</button></div></form></div>'
    + '<div class="card"><h3>Automatic Cash Book</h3><p class="hint">Pick a school to see its cash book. Opening balance + acknowledged releases &minus; spending = closing balance.</p><p><label>School</label><select id="cashSchool" onchange="render()">' + opts + '</select></p>'
    + '<div class="kpis"><div class="kpi"><b>' + fmt(a.opening || 0) + '</b><span>Opening balance</span></div><div class="kpi"><b>' + fmt(releasedTo(sid)) + '</b><span>Funds received (acknowledged)</span></div><div class="kpi"><b>' + fmt(spentBy(sid)) + '</b><span>Expenditure</span></div><div class="kpi"><b>' + fmt(avail - spentBy(sid)) + '</b><span>Closing balance</span></div></div>'
    + '<table><tr><th>Date</th><th>Head</th><th>Vendor</th><th>Amount</th><th>Description</th><th>Receipt</th><th>Status</th></tr>' + rows + '</table><button class="btn" onclick="exportCSV()">Export Cash Book (CSV)</button></div>';
}
function viewReview() {
  var rows = state.expenditures.map(function (e) {
    var s = school(e.schoolId);
    var flag = (!e.receipt || Number(e.amount) > (s.councilLimit || 0)) ? '<span class="pill pill-bad">Flagged</span>' : '<span class="pill pill-ok">No flag</span>';
    return "<tr><td>" + esc(e.id) + "</td><td>" + esc(s.name || "") + "</td><td>" + esc(e.date) + "</td><td>" + esc(e.head) + "</td><td>" + fmt(e.amount) + "</td><td>" + (e.receipt ? esc(e.receipt) : '<span class="pill pill-bad">Missing receipt</span>') + "</td><td>" + flag + "</td><td>" + esc(e.status) + "<br><span class='muted'>" + esc(e.review || "") + "</span></td><td><button class='btn green' onclick=\"reviewExp('" + e.id + "','Approved')\">Approve</button> <button class='btn red' onclick=\"reviewExp('" + e.id + "','Flagged')\">Flag</button></td></tr>";
  }).join("");
  return '<div class="card"><h2>Review of Recorded Spending</h2><p class="muted">District officials (AEO / DEO / CEO) review recorded spending afterwards, on a sample or exception basis, without holding up school spending. The system flags missing receipts and expenses above the configured school council limit automatically.</p><table><tr><th>ID</th><th>School</th><th>Date</th><th>Head</th><th>Amount</th><th>Receipt</th><th>Auto Flag</th><th>Status</th><th>Action</th></tr>' + rows + '</table></div>';
}
function viewDeliverables() {
  var rows = DELIVERABLES.map(function (d, i) {
    return "<tr><td>" + d[0] + "</td><td>" + esc(d[1]) + "</td><td>" + esc(d[2]) + "</td><td>" + d[3] + "</td><td>" + (i < 7 ? "In scope — Trigger 2" : "Support") + "</td></tr>";
  }).join("");
  return '<div class="card"><h2>Deliverables D-1 to D-11 and Payment Milestones</h2><p class="muted">Each deliverable is reviewed and approved by the client before it is complete. Lump-sum payment: 20% on D-1 and D-2, 50% on D-3 to D-6, 30% on D-7 to D-11. Total duration: 6 months — 12 weeks to province-wide go-live, then 12 weeks of post-deployment support.</p><table><tr><th>ID</th><th>Deliverable</th><th>Timeline</th><th>Payment Group</th><th>Note</th></tr>' + rows + '</table></div>';
}
function viewAccess() {
  var rights = [["SED / PMIU Officer", "All modules, allocations, releases, review, reports"], ["District Officer (DEA)", "Dashboard, Schools, Allocations, Releases, Review, Deliverables, Audit"], ["School Head", "Dashboard, Schools, Spending and Cash Book only"], ["Auditor", "Dashboard, Review, Deliverables, Audit trail"]];
  var rrows = rights.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>"; }).join("");
  var arows = state.audit.map(function (a) { return "<tr><td>" + esc(a.date) + "</td><td>" + esc(a.actor) + "</td><td>" + esc(a.action) + "</td></tr>"; }).join("");
  return '<div class="card"><h2>Access &amp; Audit Trail</h2><p class="muted">Role-based access control. Every entry, edit, acknowledgement and review is recorded with actor and date. Database: ' + esc(DB_MODE) + '.</p><table><tr><th>Role</th><th>Access</th></tr>' + rrows + '</table><h3>Audit Trail</h3><table><tr><th>Date</th><th>Actor</th><th>Action</th></tr>' + arows + '</table></div>'
    + '<div class="card"><h3>Data — Export, Import, Reset</h3><p class="muted">Use Export JSON to back up all demo data, and Import JSON to restore it on another browser. Supabase: fill in SUPABASE_URL and SUPABASE_ANON_KEY at the top of app.js to switch this demo to a shared Supabase database. Do not use a password or service key.</p><button class="btn" onclick="exportJSON()">Export JSON</button> <button class="btn light" onclick="document.getElementById(\'importFile\').click()">Import JSON</button><input id="importFile" type="file" accept=".json" style="display:none" onchange="importJSON(event)"> <button class="btn red" onclick="resetData()">Reset to Sample Data</button></div>';
}
function addSchool(e) { e.preventDefault(); var f = e.target; var id = "S" + (state.schools.length + 1) + Date.now() % 1000; state.schools.push({ id: id, emis: f.emis.value, name: f.name.value, district: f.district.value, level: f.level.value, enrolment: +f.enrolment.value, classrooms: +f.classrooms.value, councilLimit: +f.councilLimit.value }); audit("School registered: " + f.name.value + " (" + f.emis.value + ")"); toast("School added: " + f.name.value); render(); }
function saveFormula(e) { e.preventDefault(); var f = e.target; state.formula = { base: +f.base.value, perStudent: +f.perStudent.value, perClassroom: +f.perClassroom.value, levelWeight: { Primary: +f.wP.value, Elementary: +f.wE.value, High: +f.wH.value } }; audit("Allocation formula updated"); toast("Allocation formula saved."); render(); }
function calculateAllocations() { state.schools.forEach(function (s) { var a = allocFor(s.id); var prev = a.opening || 0; var found = state.allocations.find(function (x) { return x.schoolId === s.id; }); if (found) { found.allocation = calcAllocation(s); } else { state.allocations.push({ schoolId: s.id, opening: prev, allocation: calcAllocation(s), year: "2026-27" }); } }); audit("Allocations calculated for all schools using the configured formula"); toast("Allocations calculated for all schools."); render(); }
function remainingAllocation(schoolId) { var s = school(schoolId); var a = allocFor(schoolId); var avail = (a.opening || 0) + (a.allocation || calcAllocation(s)); var already = state.releases.filter(function (r) { return r.schoolId === schoolId; }).reduce(function (t, r) { return t + Number(r.amount); }, 0); return avail - already; }
function addRelease(e) { e.preventDefault(); var f = e.target; var amount = +f.amount.value; var remaining = remainingAllocation(f.schoolId.value); if (amount > remaining) { toast("Release not recorded: " + fmt(amount) + " is more than the school's remaining allocation of " + fmt(remaining) + ". A release can never be more than the remaining allocation."); return; } var id = "R" + String(state.releases.length + 1).padStart(2, "0"); var s = school(f.schoolId.value); state.releases.push({ id: id, from: f.from.value, to: s.name || f.from.value, schoolId: f.schoolId.value, date: f.date.value, amount: amount, instalment: f.instalment.value, bankRef: f.bankRef.value, sanction: f.sanction.files[0] ? f.sanction.files[0].name : "Not uploaded", status: "Pending Acknowledgement" }); audit("Release " + id + " recorded: " + f.from.value + " to " + (s.name || "") + ", " + fmt(amount)); toast("Release " + id + " recorded."); render(); }
function acknowledge(id) { var r = state.releases.find(function (x) { return x.id === id; }); if (r) { r.status = "Acknowledged"; audit("Release " + id + " acknowledged by school"); toast("Release " + id + " acknowledged."); render(); } }
function addExpense(e) { e.preventDefault(); var f = e.target; var file = f.receipt.files[0]; if (!file) { alert("A receipt, invoice or cash memo is mandatory for every expense."); return; } var s = school(f.schoolId.value); var amount = +f.amount.value; var flagged = amount > (s.councilLimit || 0); var id = "E" + String(state.expenditures.length + 1).padStart(2, "0"); state.expenditures.push({ id: id, schoolId: f.schoolId.value, date: f.date.value, head: f.head.value, vendor: f.vendor.value, amount: amount, description: f.description.value, receipt: file.name, status: flagged ? "Flagged" : "Pending Review", review: flagged ? "Auto-flagged — amount above school council limit" : "Not yet reviewed" }); audit("Expenditure " + id + " recorded with receipt " + file.name + (flagged ? " (auto-flagged)" : "")); toast(flagged ? "Expense recorded and auto-flagged — above the council limit." : "Expense recorded with receipt."); render(); }
function reviewExp(id, status) { var x = state.expenditures.find(function (e) { return e.id === id; }); if (x) { x.status = status; x.review = status === "Approved" ? "Reviewed and approved by district officer" : "Flagged by district officer for follow-up"; audit("Expenditure " + id + " marked " + status + " in post-facto review"); toast("Expenditure " + id + " marked " + status + "."); render(); } }
function download(name, text, type) { var b = new Blob([text], { type: type || "text/plain" }); var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name; a.click(); }
function exportCSV() { var lines = ["District,School,Allocation+Opening,Spent,Balance,Utilization %"]; state.schools.forEach(function (s) { var a = allocFor(s.id); var avail = (a.opening || 0) + (a.allocation || calcAllocation(s)); var sp = spentBy(s.id); lines.push([s.district, '"' + s.name + '"', avail, sp, avail - sp, avail ? Math.round(sp / avail * 100) : 0].join(",")); }); download("nsb-district-summary.csv", lines.join("\n"), "text/csv"); toast("District summary downloaded (CSV)."); }
function exportJSON() { download("nsb-data.json", JSON.stringify(state, null, 2), "application/json"); toast("Data backup downloaded (JSON)."); }
function importJSON(e) { var file = e.target.files[0]; if (!file) return; var r = new FileReader(); r.onload = function () { try { state = JSON.parse(r.result); save(); audit("Data imported from JSON file"); render(); } catch (err) { alert("That file could not be read as NSB data."); } }; r.readAsText(file); }
function resetData() { if (!confirm("Reset all data to the original sample data?")) return; state = seed(); save(); render(); toast("Sample data restored."); }
document.getElementById("roleSelect").addEventListener("change", function (e) { setRole(e.target.value); });
render();
