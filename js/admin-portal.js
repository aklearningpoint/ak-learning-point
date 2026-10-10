// Admin Master Dashboard: Image Upload Logo, Real Passwords, Ledger & Promo Slide Store

// Storage Helper
function getStoredData(key, fallback) {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : fallback;
}
function setStoredData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Global App Settings
let appConfig = getStoredData("ak_app_config", {
  adminPass: "password",
  teacherPass: "pass",
  tuitionPass: "pass",
  logoData: ""
});

// Promotional Banner Store
let promoBanners = getStoredData("ak_promo_banners", []);

// Tuition Students Ledger
let tuitionLedger = getStoredData("ak_tuition_ledger", [
  {
    id: "stu_1",
    name: "Aarav Kumar",
    mobile: "9876543210",
    monthlyFee: 1000,
    startDate: "2026-09-10",
    paidMonths: 0,
    history: []
  }
]);

// Initialize Logo on Load
window.addEventListener("DOMContentLoaded", () => {
  if (appConfig.logoData) {
    const el = document.getElementById("appLogo");
    if (el) el.src = appConfig.logoData;
  }
});

function openAdminPortal() {
  toggleDrawer();
  const enteredPass = prompt("Enter Master Admin Password:");
  if (enteredPass === appConfig.adminPass) {
    renderAdminDashboard();
  } else if (enteredPass !== null) {
    alert("Incorrect Admin Password!");
  }
}

function renderAdminDashboard() {
  document.getElementById("dynamicView").innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:#f8fafc; z-index:3000; display:flex; flex-direction:column;">
      
      <!-- Admin Top Nav -->
      <div style="height:55px; background:var(--primary-navy); color:white; display:flex; align-items:center; justify-content:space-between; padding:0 16px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <i class="fas fa-user-shield" style="color:var(--brand-gold);"></i>
          <strong>Admin Control Panel</strong>
        </div>
        <button onclick="closeDynamicView()" style="background:none; border:none; color:white; font-size:1.3rem; cursor:pointer;"><i class="fas fa-times"></i></button>
      </div>

      <!-- Navigation Tabs -->
      <div style="background:white; border-bottom:1px solid var(--border-color); display:flex; overflow-x:auto; padding:8px 12px; gap:8px;">
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.85rem; margin:0;" onclick="showAdminSection('branding')">Logo & Security</button>
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.85rem; margin:0; background:#0284c7;" onclick="showAdminSection('ledger')">Tuition Ledger</button>
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.85rem; margin:0; background:#7c3aed;" onclick="showAdminSection('banners')">Promo Slides Store</button>
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.85rem; margin:0; background:#059669;" onclick="showAdminSection('leads')">Student Leads</button>
      </div>

      <div id="adminContentBody" style="flex:1; overflow-y:auto; padding:16px; max-width:900px; margin:0 auto; width:100%;"></div>

    </div>
  `;
  showAdminSection('branding');
}

function showAdminSection(sec) {
  const container = document.getElementById("adminContentBody");

  if (sec === 'branding') {
    container.innerHTML = `
      <div class="modal-card" style="max-width:100%;">
        <h3 style="color:var(--primary-navy); margin-bottom:12px;">App Logo & Passwords</h3>
        
        <div class="form-group">
          <label>Direct Upload App Logo (Instant Display)</label>
          <input type="file" id="adminLogoFileInput" accept="image/*" onchange="previewAndStoreLogo(this)">
          <div style="margin-top:8px;">
            <img id="logoPreviewImg" src="${appConfig.logoData || 'https://via.placeholder.com/60'}" style="width:60px; height:60px; border-radius:8px; border:2px solid #cbd5e1; object-fit:cover;">
          </div>
        </div>

        <div class="form-group">
          <label>Admin Master Password</label>
          <input type="text" id="cfgAdminPass" value="${appConfig.adminPass}">
        </div>
        <div class="form-group">
          <label>Teacher Access Password</label>
          <input type="text" id="cfgTeacherPass" value="${appConfig.teacherPass}">
        </div>
        <div class="form-group">
          <label>Tuition Section Passkey</label>
          <input type="text" id="cfgTuitionPass" value="${appConfig.tuitionPass}">
        </div>

        <button class="btn-primary" onclick="saveAdminSecurityConfig()">Save & Lock Changes</button>
      </div>
    `;
  } else if (sec === 'ledger') {
    renderTuitionLedgerSection(container);
  } else if (sec === 'banners') {
    renderPromoBannersSection(container);
  } else if (sec === 'leads') {
    container.innerHTML = `
      <div class="modal-card" style="max-width:100%;">
        <h3 style="color:var(--primary-navy); margin-bottom:12px;">Community Leads</h3>
        <p style="color:var(--text-muted); font-size:0.85rem;">Registered student inquiries appear here.</p>
        <div id="adminLeadsList">
          <div style="padding:10px; border:1px solid #e2e8f0; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong>Sample Student</strong> (Class 10) - Bihar<br>
              <small style="color:#64748b;">Mob: 9876543210</small>
            </div>
            <a href="https://wa.me/919876543210" target="_blank" style="background:#25d366; color:white; padding:6px 12px; border-radius:6px; text-decoration:none; font-size:0.85rem;"><i class="fab fa-whatsapp"></i> Chat</a>
          </div>
        </div>
      </div>
    `;
  }
}

// 1. Direct Image Logo Upload
function previewAndStoreLogo(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      appConfig.logoData = e.target.result;
      document.getElementById("logoPreviewImg").src = e.target.result;
      const mainLogo = document.getElementById("appLogo");
      if (mainLogo) mainLogo.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function saveAdminSecurityConfig() {
  appConfig.adminPass = document.getElementById("cfgAdminPass").value.trim() || "password";
  appConfig.teacherPass = document.getElementById("cfgTeacherPass").value.trim() || "pass";
  appConfig.tuitionPass = document.getElementById("cfgTuitionPass").value.trim() || "pass";
  setStoredData("ak_app_config", appConfig);
  alert("Security settings and passwords saved successfully!");
}

// 2. Comprehensive Tuition Ledger Engine
function calculateStudentFinancials(student) {
  const start = new Date(student.startDate);
  const today = new Date();
  
  // Calculate completed month cycles based on specific start date
  let totalMonthsDue = (today.getFullYear() - start.getFullYear()) * 12 + (today.getMonth() - start.getMonth());
  if (today.getDate() >= start.getDate()) {
    totalMonthsDue += 1;
  }
  totalMonthsDue = Math.max(1, totalMonthsDue);

  const totalFeeObligation = totalMonthsDue * student.monthlyFee;
  let totalPaid = 0;
  (student.history || []).forEach(h => totalPaid += h.amount);

  const pendingBalance = Math.max(0, totalFeeObligation - totalPaid);
  return { totalMonthsDue, totalPaid, pendingBalance };
}

function renderTuitionLedgerSection(container) {
  // Aggregate Metrics
  let totalMonthlyPotential = 0;
  let totalOutstandingDues = 0;
  let monthlyCollectionMap = {};

  tuitionLedger.forEach(s => {
    totalMonthlyPotential += Number(s.monthlyFee);
    const fin = calculateStudentFinancials(s);
    totalOutstandingDues += fin.pendingBalance;

    (s.history || []).forEach(h => {
      const mKey = h.monthName || "General";
      monthlyCollectionMap[mKey] = (monthlyCollectionMap[mKey] || 0) + Number(h.amount);
    });
  });

  let collectionCardsHtml = Object.keys(monthlyCollectionMap).map(m => `
    <span style="background:#e0f2fe; color:#0369a1; padding:4px 8px; border-radius:6px; font-weight:700; margin-right:6px;">${m}: ₹${monthlyCollectionMap[m]}</span>
  `).join("") || "<span>No payments yet</span>";

  container.innerHTML = `
    <!-- 3-Style Metric Summary -->
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:14px;">
      <div style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #cbd5e1; text-align:center;">
        <small style="color:#64748b;">Monthly Potential</small>
        <div style="font-size:1.3rem; font-weight:800; color:#0284c7;">₹${totalMonthlyPotential}</div>
      </div>
      <div style="background:#fef2f2; padding:12px; border-radius:8px; border:1px solid #fecaca; text-align:center;">
        <small style="color:#dc2626;">Total Pending Dues</small>
        <div style="font-size:1.3rem; font-weight:800; color:#dc2626;">₹${totalOutstandingDues}</div>
      </div>
      <div style="background:#f0fdf4; padding:12px; border-radius:8px; border:1px solid #bbf7d0; text-align:center;">
        <small style="color:#16a34a;">Monthly Collection</small>
        <div style="font-size:0.85rem; margin-top:4px;">${collectionCardsHtml}</div>
      </div>
    </div>

    <!-- Controls -->
    <div class="modal-card" style="max-width:100%;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 style="color:var(--primary-navy); margin:0;">Enrolled Tuition Students</h3>
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.8rem; margin:0;" onclick="openAddEditStudentModal()">+ Add Student</button>
      </div>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
          <thead>
            <tr style="background:#f1f5f9; text-align:left; border-bottom:2px solid #cbd5e1;">
              <th style="padding:8px;">Name / Mob</th>
              <th style="padding:8px;">Start Cycle</th>
              <th style="padding:8px;">Monthly Fee</th>
              <th style="padding:8px;">Balance Due</th>
              <th style="padding:8px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tuitionLedger.map((s, idx) => {
              const fin = calculateStudentFinancials(s);
              const cycleDay = new Date(s.startDate).getDate();
              return `
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="padding:8px;">
                    <strong>${s.name}</strong><br>
                    <small style="color:#64748b;">${s.mobile}</small>
                  </td>
                  <td style="padding:8px;">${cycleDay}th of Month<br><small style="color:#64748b;">From ${s.startDate}</small></td>
                  <td style="padding:8px; font-weight:700;">₹${s.monthlyFee}</td>
                  <td style="padding:8px; font-weight:800; color:${fin.pendingBalance > 0 ? '#dc2626' : '#16a34a'};">
                    ₹${fin.pendingBalance}
                  </td>
                  <td style="padding:8px;">
                    <div style="display:flex; gap:4px; flex-wrap:wrap;">
                      <button onclick="recordFeePayment(${idx})" style="background:#0284c7; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" title="Add Received Fee"><i class="fas fa-hand-holding-usd"></i> Pay</button>
                      <button onclick="sendDueReminderWhatsApp(${idx})" style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" title="Send Reminder"><i class="fab fa-whatsapp"></i> Due</button>
                      <button onclick="openAddEditStudentModal(${idx})" style="background:#64748b; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" title="Edit Student"><i class="fas fa-edit"></i></button>
                      <button onclick="deleteTuitionStudent(${idx})" style="background:#fee2e2; color:#dc2626; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" title="Delete Student"><i class="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openAddEditStudentModal(idx = null) {
  const student = idx !== null ? tuitionLedger[idx] : { name: "", mobile: "", monthlyFee: "", startDate: new Date().toISOString().split("T")[0] };

  document.getElementById("dynamicView").innerHTML += `
    <div class="modal-overlay" style="display:flex; z-index:3500;" id="tuitionModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>${idx !== null ? 'Edit Student Details' : 'Add New Tuition Student'}</h3>
          <button class="close-btn" onclick="document.getElementById('tuitionModal').remove()"><i class="fas fa-times"></i></button>
        </div>
        <form onsubmit="handleSaveTuitionStudent(event, ${idx})">
          <div class="form-group">
            <label>Student Name</label>
            <input type="text" id="tsName" value="${student.name}" required>
          </div>
          <div class="form-group">
            <label>WhatsApp Number</label>
            <input type="tel" id="tsMobile" pattern="[0-9]{10}" value="${student.mobile}" required>
          </div>
          <div class="form-group">
            <label>Monthly Fee (₹)</label>
            <input type="number" id="tsFee" value="${student.monthlyFee}" required>
          </div>
          <div class="form-group">
            <label>Cycle Start Date (Billing Cycle)</label>
            <input type="date" id="tsStartDate" value="${student.startDate}" required>
          </div>
          <button type="submit" class="btn-primary">Save Student</button>
        </form>
      </div>
    </div>
  `;
}

function handleSaveTuitionStudent(e, idx) {
  e.preventDefault();
  const data = {
    id: idx !== null ? tuitionLedger[idx].id : "stu_" + Date.now(),
    name: document.getElementById("tsName").value.trim(),
    mobile: document.getElementById("tsMobile").value.trim(),
    monthlyFee: Number(document.getElementById("tsFee").value),
    startDate: document.getElementById("tsStartDate").value,
    history: idx !== null ? tuitionLedger[idx].history : []
  };

  if (idx !== null) {
    tuitionLedger[idx] = data;
  } else {
    tuitionLedger.push(data);
  }

  setStoredData("ak_tuition_ledger", tuitionLedger);
  document.getElementById("tuitionModal").remove();
  showAdminSection('ledger');
}

function deleteTuitionStudent(idx) {
  if (confirm(`Kya aap ${tuitionLedger[idx].name} ko permanently delete karna chahte hain?`)) {
    tuitionLedger.splice(idx, 1);
    setStoredData("ak_tuition_ledger", tuitionLedger);
    showAdminSection('ledger');
  }
}

function recordFeePayment(idx) {
  const student = tuitionLedger[idx];
  const amount = prompt(`Enter amount received from ${student.name} (Monthly Fee: ₹${student.monthlyFee}):`, student.monthlyFee);
  if (!amount) return;

  const monthName = prompt("Enter Month Name for this fee (e.g. October 2026):", "October 2026");
  
  student.history.push({
    amount: Number(amount),
    monthName: monthName || "General",
    date: new Date().toISOString()
  });

  setStoredData("ak_tuition_ledger", tuitionLedger);
  showAdminSection('ledger');

  // Trigger Thank-You Note on WhatsApp
  const fin = calculateStudentFinancials(student);
  const text = encodeURIComponent(
    `✅ *AK Learning Point - Tuition Fee Receipt & Thank You Note*\n` +
    `Dear ${student.name},\n` +
    `Aapki fee amount ₹${amount} (${monthName}) ke liye safaltapurvak prapt ho gayi hai. Dhanyawad!\n` +
    `Remaining Balance Due: ₹${fin.pendingBalance}\n\n` +
    `"Gyan ki nayi shuruat, har vidyarthi ke vikas ke saath!"\n` +
    `App Link: ${window.location.origin}${window.location.pathname}`
  );
  window.open(`https://api.whatsapp.com/send?phone=91${student.mobile}&text=${text}`, '_blank');
}

function sendDueReminderWhatsApp(idx) {
  const student = tuitionLedger[idx];
  const fin = calculateStudentFinancials(student);

  const text = encodeURIComponent(
    `🔔 *AK Learning Point - Tuition Fee Reminder*\n` +
    `Dear Parent / ${student.name},\n` +
    `Aapki tuition fee cycle update ho chuki hai. Kripya pending fee samay par jama karein.\n\n` +
    `• Monthly Fee: ₹${student.monthlyFee}\n` +
    `• Total Outstanding Balance: *₹${fin.pendingBalance}*\n\n` +
    `"Gyan ki nayi shuruat, har vidyarthi ke vikas ke saath!"\n` +
    `App: ${window.location.origin}${window.location.pathname}`
  );
  window.open(`https://api.whatsapp.com/send?phone=91${student.mobile}&text=${text}`, '_blank');
}

// 3. Promotional Slide Store
function renderPromoBannersSection(container) {
  container.innerHTML = `
    <div class="modal-card" style="max-width:100%;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 style="color:var(--primary-navy); margin:0;">Promotional Slide Store</h3>
        <label class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.8rem; margin:0; cursor:pointer;">
          + Upload Banner <input type="file" accept="image/*" style="display:none;" onchange="uploadPromoBanner(this)">
        </label>
      </div>
      <p style="color:var(--text-muted); font-size:0.85rem;">Phone se banaye gaye banners yahan upload karein. WhatsApp share karte waqt inme se banner chun sakte hain.</p>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:12px; margin-top:14px;">
        ${promoBanners.map((b, idx) => `
          <div style="border:1px solid #cbd5e1; border-radius:8px; overflow:hidden; background:white; position:relative;">
            <img src="${b.imageData}" style="width:100%; height:120px; object-fit:cover;">
            <div style="padding:6px; display:flex; justify-content:space-between; align-items:center;">
              <small style="font-weight:700;">${b.title || 'Banner ' + (idx + 1)}</small>
              <button onclick="deletePromoBanner(${idx})" style="background:#fee2e2; color:#dc2626; border:none; padding:2px 6px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function uploadPromoBanner(input) {
  if (input.files && input.files[0]) {
    const title = prompt("Banner Title / Name:", "Offer Poster");
    const reader = new FileReader();
    reader.onload = function(e) {
      promoBanners.push({
        id: "b_" + Date.now(),
        title: title || "Offer Banner",
        imageData: e.target.result
      });
      setStoredData("ak_promo_banners", promoBanners);
      showAdminSection('banners');
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function deletePromoBanner(idx) {
  promoBanners.splice(idx, 1);
  setStoredData("ak_promo_banners", promoBanners);
  showAdminSection('banners');
}

// 4. Smart Share Interceptor
function triggerSmartShare(customText = "") {
  if (drawerOverlay && drawerOverlay.classList.contains("open")) {
    toggleDrawer();
  }

  let baseMessage = customText || `🎯 *AK Learning Point - Gyan ki nayi shuruat!*\nBSEB & CBSE Online Quizzes, Notes aur Tuition Classes.\nApp Link: ${window.location.origin}${window.location.pathname}`;

  if (promoBanners.length === 0) {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(baseMessage)}`, '_blank');
    return;
  }

  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Promotional Ad Attach Karein?</h3>
          <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">Kya aap share message ke sath koi poster attach karna chahte hain?</p>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; max-height:220px; overflow-y:auto; margin-bottom:12px;">
          ${promoBanners.map(b => `
            <div onclick="shareWithSelectedBanner('${encodeURIComponent(baseMessage)}', '${b.title}')" style="border:2px solid #cbd5e1; border-radius:8px; padding:6px; cursor:pointer; text-align:center;">
              <img src="${b.imageData}" style="width:100%; height:70px; object-fit:cover; border-radius:4px;">
              <small style="font-weight:700; display:block; margin-top:4px;">${b.title}</small>
            </div>
          `).join("")}
        </div>

        <button class="btn-primary" style="background:#64748b;" onclick="window.open('https://api.whatsapp.com/send?text=${encodeURIComponent(baseMessage)}', '_blank'); closeDynamicView();">
          Bina Poster Ke Direct Share Karein
        </button>
      </div>
    </div>
  `;
}

function shareWithSelectedBanner(encodedBaseMsg, bannerTitle) {
  const fullText = decodeURIComponent(encodedBaseMsg) + `\n\n📢 *Special Attachment: [${bannerTitle}]*`;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`, '_blank');
  closeDynamicView();
}
