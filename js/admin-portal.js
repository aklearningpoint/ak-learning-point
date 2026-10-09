// Admin Master Dashboard, Accounting Ledger, Ads & Leads Tracker

function openAdminPortal() {
  toggleDrawer();
  const enteredPass = prompt("Enter Master Admin Password (Default: password):");
  if (enteredPass === "password") {
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

      <!-- Admin Tabs Navigation -->
      <div style="background:white; border-bottom:1px solid var(--border-color); display:flex; overflow-x:auto; padding:8px 12px; gap:8px;">
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.85rem; margin:0;" onclick="showAdminSection('branding')">Branding & App</button>
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.85rem; margin:0; background:#0284c7;" onclick="showAdminSection('ledger')">Tuition Ledger</button>
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.85rem; margin:0; background:#d97706;" onclick="showAdminSection('ads')">Ads & Banners</button>
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.85rem; margin:0; background:#059669;" onclick="showAdminSection('leads')">Student Leads</button>
      </div>

      <!-- Admin Content Container -->
      <div id="adminContentBody" style="flex:1; overflow-y:auto; padding:16px; max-width:800px; margin:0 auto; width:100%;">
        <!-- Default Content -->
      </div>

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
          <label>Update App Logo Image URL</label>
          <input type="url" id="adminLogoUrl" placeholder="https://example.com/logo.png">
        </div>
        <div class="form-group">
          <label>Admin Master Password</label>
          <input type="text" id="adminNewPass" value="password">
        </div>
        <div class="form-group">
          <label>Teacher Access Password</label>
          <input type="text" id="adminTeacherPass" value="pass">
        </div>
        <div class="form-group">
          <label>Tuition Section Passkey</label>
          <input type="text" id="adminTuitionPass" value="pass">
        </div>
        <button class="btn-primary" onclick="saveAdminBranding()">Save Changes</button>
      </div>
    `;
  } else if (sec === 'ledger') {
    container.innerHTML = `
      <div class="modal-card" style="max-width:100%;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="color:var(--primary-navy); margin:0;">Automated Tuition Ledger</h3>
          <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.8rem; margin:0;" onclick="addNewTuitionStudentPrompt()">+ Add Student</button>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
            <thead>
              <tr style="background:#f1f5f9; text-align:left; border-bottom:2px solid #cbd5e1;">
                <th style="padding:8px;">Name</th>
                <th style="padding:8px;">Mobile</th>
                <th style="padding:8px;">Cycle Day</th>
                <th style="padding:8px;">Monthly Fee</th>
                <th style="padding:8px;">Balance</th>
                <th style="padding:8px;">Actions</th>
              </tr>
            </thead>
            <tbody id="tuitionTableBody">
              <tr>
                <td style="padding:8px;">Aarav Kumar</td>
                <td style="padding:8px;">9876543210</td>
                <td style="padding:8px;">10th of Month</td>
                <td style="padding:8px;">₹1000</td>
                <td style="padding:8px; color:#dc2626; font-weight:700;">₹1000 Due</td>
                <td style="padding:8px;">
                  <button onclick="sendTuitionWhatsApp('Aarav Kumar', '9876543210', 1000, 'due')" style="background:#25d366; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" title="Send Due Reminder"><i class="fab fa-whatsapp"></i> Due Alert</button>
                  <button onclick="sendTuitionWhatsApp('Aarav Kumar', '9876543210', 1000, 'received')" style="background:#0284c7; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" title="Send Receipt"><i class="fas fa-receipt"></i> Receipt</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (sec === 'ads') {
    container.innerHTML = `
      <div class="modal-card" style="max-width:100%;">
        <h3 style="color:var(--primary-navy); margin-bottom:12px;">Commercial & App Ads Controller</h3>
        <div class="form-group">
          <label>Commercial Ads Status</label>
          <select id="adStatus"><option value="enabled">Active (Google Ads + Local)</option><option value="disabled">Paused</option></select>
        </div>
        <div class="form-group">
          <label>WhatsApp Contact for Ads</label>
          <input type="tel" value="9999999999" placeholder="Admin WhatsApp number">
        </div>
        <button class="btn-primary" onclick="alert('Ads settings updated!')">Save Ad Settings</button>
      </div>
    `;
  } else if (sec === 'leads') {
    container.innerHTML = `
      <div class="modal-card" style="max-width:100%;">
        <h3 style="color:var(--primary-navy); margin-bottom:12px;">Community Leads & Shares Tracker</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">Students who registered through the WhatsApp community form:</p>
        <div id="adminLeadsList">
          <div style="padding:10px; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
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

function saveAdminBranding() {
  const logoUrl = document.getElementById("adminLogoUrl").value;
  if (logoUrl) {
    document.getElementById("appLogo").src = logoUrl;
  }
  alert("Settings updated successfully!");
}

function addNewTuitionStudentPrompt() {
  const name = prompt("Student Name:");
  const mob = prompt("WhatsApp Number:");
  const fee = prompt("Monthly Fee (₹):");
  if (name && mob && fee) {
    const tbody = document.getElementById("tuitionTableBody");
    tbody.innerHTML += `
      <tr>
        <td style="padding:8px;">${name}</td>
        <td style="padding:8px;">${mob}</td>
        <td style="padding:8px;">10th of Month</td>
        <td style="padding:8px;">₹${fee}</td>
        <td style="padding:8px; color:#16a34a; font-weight:700;">₹0 Due</td>
        <td style="padding:8px;">
          <button onclick="sendTuitionWhatsApp('${name}', '${mob}', ${fee}, 'due')" style="background:#25d366; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;"><i class="fab fa-whatsapp"></i> Due Alert</button>
          <button onclick="sendTuitionWhatsApp('${name}', '${mob}', ${fee}, 'received')" style="background:#0284c7; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;"><i class="fas fa-receipt"></i> Receipt</button>
        </td>
      </tr>
    `;
  }
}

function sendTuitionWhatsApp(name, mobile, amount, type) {
  let text = "";
  if (type === 'due') {
    text = encodeURIComponent(
      `🔔 *AK Learning Point - Tuition Fee Reminder*\n` +
      `Dear Parent / ${name},\n` +
      `Aapki monthly tuition fee ₹${amount} due ho chuki hai. Kripya samay par jama karein.\n\n` +
      `"Gyan ki nayi shuruat, har vidyarthi ke vikas ke saath!"\n` +
      `App Link: ${window.location.origin}${window.location.pathname}`
    );
  } else {
    text = encodeURIComponent(
      `✅ *AK Learning Point - Fee Received Receipt*\n` +
      `Dear ${name},\n` +
      `Aapki fee ₹${amount} successfully prapt ho gayi hai. Dhanyawad!\n\n` +
      `App Link: ${window.location.origin}${window.location.pathname}`
    );
  }
  window.open(`https://api.whatsapp.com/send?phone=91${mobile}&text=${text}`, '_blank');
}
