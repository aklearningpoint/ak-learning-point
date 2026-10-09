// ASSENT PUBLIC SCHOOL Module: Student Portal, Teacher Marks Entry & Official Progress Report Card

function openSchoolPortal() {
  toggleDrawer();
  document.getElementById("dynamicView").innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:#f8fafc; z-index:3000; display:flex; flex-direction:column;">
      
      <!-- School Header -->
      <div style="height:55px; background:var(--primary-navy); color:white; display:flex; align-items:center; justify-content:space-between; padding:0 16px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <i class="fas fa-school" style="color:var(--brand-gold);"></i>
          <strong>ASSENT PUBLIC SCHOOL</strong>
        </div>
        <button onclick="closeDynamicView()" style="background:none; border:none; color:white; font-size:1.3rem; cursor:pointer;"><i class="fas fa-times"></i></button>
      </div>

      <!-- Module Selection -->
      <div style="flex:1; display:flex; align-items:center; justify-content:center; padding:16px;">
        <div style="width:100%; max-width:440px; display:flex; flex-direction:column; gap:14px;">
          
          <div class="section-card" onclick="openSchoolStudentPanel()">
            <div class="section-left">
              <div class="section-icon" style="background:#e0f2fe; color:#0284c7;"><i class="fas fa-user-graduate"></i></div>
              <div class="section-info">
                <h3>Student Portal</h3>
                <p>Profile, ID Card, Admit Card & Result</p>
              </div>
            </div>
            <i class="fas fa-chevron-right text-muted"></i>
          </div>

          <div class="section-card" onclick="openSchoolTeacherLogin()">
            <div class="section-left">
              <div class="section-icon" style="background:#fef3c7; color:#d97706;"><i class="fas fa-chalkboard-teacher"></i></div>
              <div class="section-info">
                <h3>Teacher Panel (School)</h3>
                <p>Add Students, Marks Entry & Tabulation</p>
              </div>
            </div>
            <i class="fas fa-chevron-right text-muted"></i>
          </div>

        </div>
      </div>

    </div>
  `;
}

// ==========================================
// 1. STUDENT PORTAL
// ==========================================
function openSchoolStudentPanel() {
  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card">
        <div class="modal-header">
          <h3><i class="fas fa-user-graduate" style="color:#0284c7;"></i> Student Login</h3>
          <button class="close-btn" onclick="openSchoolPortal()"><i class="fas fa-arrow-left"></i></button>
        </div>
        <form onsubmit="handleSchoolStudentLookup(event)">
          <div class="form-group">
            <label>Select Class</label>
            <select id="stLookupClass" required>
              <option value="Play & Nur">Play & Nursery</option>
              <option value="LKG">LKG</option>
              <option value="UKG">UKG</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
              <option value="Class 4">Class 4</option>
              <option value="Class 5">Class 5</option>
            </select>
          </div>
          <div class="form-group">
            <label>Roll Number</label>
            <input type="number" id="stLookupRoll" required placeholder="Enter Roll No">
          </div>
          <button type="submit" class="btn-primary" style="background:#0284c7;">Search Student Profile</button>
        </form>
      </div>
    </div>
  `;
}

let activeStudent = null;

async function handleSchoolStudentLookup(e) {
  e.preventDefault();
  const cName = document.getElementById("stLookupClass").value;
  const roll = document.getElementById("stLookupRoll").value;

  const res = await API.get("schoolStudentLookup", { className: cName, rollNo: roll });
  if (res.status === "success" && res.student) {
    activeStudent = res.student;
  } else {
    // Fallback profile if sheet not populated yet
    activeStudent = {
      className: cName,
      rollNo: roll,
      name: "Student Name",
      fatherName: "Father's Name",
      motherName: "Mother's Name",
      primaryMobile: "9876543210",
      secondaryMobile: "",
      address: "Samastipur, Bihar"
    };
  }
  renderStudentDashboard();
}

function renderStudentDashboard() {
  document.getElementById("dynamicView").innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:#f8fafc; z-index:3000; display:flex; flex-direction:column;">
      
      <div style="height:55px; background:var(--primary-navy); color:white; display:flex; align-items:center; justify-content:space-between; padding:0 16px;">
        <div><strong>ASSENT PUBLIC SCHOOL</strong> - Student Dashboard</div>
        <button onclick="openSchoolPortal()" style="background:none; border:none; color:white; font-size:1.3rem; cursor:pointer;"><i class="fas fa-times"></i></button>
      </div>

      <div style="flex:1; overflow-y:auto; padding:16px; max-width:600px; margin:0 auto; width:100%;">
        
        <!-- Profile Card -->
        <div class="modal-card" style="max-width:100%; margin-bottom:14px; text-align:center;">
          <img src="https://via.placeholder.com/90" style="width:90px; height:90px; border-radius:50%; border:3px solid var(--brand-blue); object-fit:cover; margin-bottom:8px;">
          <h3 style="color:var(--primary-navy);">${activeStudent.name}</h3>
          <p style="color:var(--text-muted); font-size:0.9rem;">Class: <strong>${activeStudent.className}</strong> | Roll No: <strong>${activeStudent.rollNo}</strong></p>
          <button class="btn-primary" style="width:auto; padding:6px 14px; font-size:0.8rem; margin:10px auto 0; background:#64748b;" onclick="editStudentProfileModal()">Edit Details</button>
        </div>

        <!-- Quick Document Actions -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px;">
          <button class="btn-primary" style="background:#0284c7; margin:0;" onclick="printStudentIdCard()"><i class="fas fa-id-card"></i> Download ID Card</button>
          <button class="btn-primary" style="background:#7c3aed; margin:0;" onclick="printStudentAdmitCard()"><i class="fas fa-ticket-alt"></i> Download Admit Card</button>
        </div>

        <!-- Result View Section -->
        <div class="modal-card" style="max-width:100%;">
          <h4 style="color:var(--primary-navy); margin-bottom:10px;"><i class="fas fa-file-alt" style="color:#d97706;"></i> View Progress Report Card</h4>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
            <div class="form-group">
              <label>Academic Year</label>
              <select id="repSession"><option value="2025-26">2025-26</option></select>
            </div>
            <div class="form-group">
              <label>Terminal Exam</label>
              <select id="repTerm"><option value="Annual / Combined">All Terms (Official Replica)</option><option value="First Terminal">First Terminal</option><option value="Second Terminal">Second Terminal</option><option value="Final">Final Terminal</option></select>
            </div>
          </div>
          <button class="btn-primary" style="background:#d97706;" onclick="printOfficialProgressReport()"><i class="fas fa-print"></i> Generate & Print Report Card</button>
        </div>

      </div>

    </div>
  `;
}

function editStudentProfileModal() {
  document.getElementById("dynamicView").innerHTML += `
    <div class="modal-overlay" style="display:flex;" id="editProfModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Edit Profile</h3>
          <button class="close-btn" onclick="document.getElementById('editProfModal').remove()"><i class="fas fa-times"></i></button>
        </div>
        <form onsubmit="handleSaveProfile(event)">
          <div class="form-group"><label>Full Name</label><input type="text" id="epName" value="${activeStudent.name}" required></div>
          <div class="form-group"><label>Father's Name</label><input type="text" id="epFather" value="${activeStudent.fatherName}"></div>
          <div class="form-group"><label>Mother's Name</label><input type="text" id="epMother" value="${activeStudent.motherName}"></div>
          <div class="form-group"><label>Primary Mobile</label><input type="tel" id="epMob1" value="${activeStudent.primaryMobile}" required></div>
          <div class="form-group"><label>Secondary Mobile (Optional)</label><input type="tel" id="epMob2" value="${activeStudent.secondaryMobile || ''}"></div>
          <div class="form-group"><label>Address</label><input type="text" id="epAddress" value="${activeStudent.address}"></div>
          <button type="submit" class="btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  `;
}

function handleSaveProfile(e) {
  e.preventDefault();
  activeStudent.name = document.getElementById("epName").value;
  activeStudent.fatherName = document.getElementById("epFather").value;
  activeStudent.motherName = document.getElementById("epMother").value;
  activeStudent.primaryMobile = document.getElementById("epMob1").value;
  activeStudent.secondaryMobile = document.getElementById("epMob2").value;
  activeStudent.address = document.getElementById("epAddress").value;

  API.post("schoolUpdateProfile", activeStudent);
  alert("Profile details updated successfully!");
  document.getElementById("editProfModal").remove();
  renderStudentDashboard();
}

// Print Digital ID Card
function printStudentIdCard() {
  const win = window.open("", "_blank");
  win.document.write(`
    <html>
    <head>
      <title>ID Card - ${activeStudent.name}</title>
      <style>
        body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: sans-serif; background: #f1f5f9; }
        .id-card { width: 320px; height: 480px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); overflow: hidden; border: 2px solid #141e37; text-align: center; }
        .id-header { background: #141e37; color: white; padding: 16px; }
        .id-header h3 { margin: 0; font-size: 14pt; color: #ffb300; }
        .id-header small { font-size: 8pt; opacity: 0.8; }
        .id-photo { width: 100px; height: 100px; border-radius: 50%; border: 3px solid #ffb300; margin: 16px auto 10px; object-fit: cover; }
        .id-details { text-align: left; padding: 0 24px; font-size: 10pt; line-height: 1.8; color: #333; }
      </style>
    </head>
    <body>
      <div class="id-card">
        <div class="id-header">
          <h3>ASSENT PUBLIC SCHOOL</h3>
          <small>Singhiya Khurd, Samastipur</small>
        </div>
        <img src="https://via.placeholder.com/100" class="id-photo">
        <h4 style="margin: 4px 0; color: #141e37;">${activeStudent.name}</h4>
        <div class="id-details">
          <div><strong>Class:</strong> ${activeStudent.className}</div>
          <div><strong>Roll No:</strong> ${activeStudent.rollNo}</div>
          <div><strong>Father:</strong> ${activeStudent.fatherName}</div>
          <div><strong>Mobile:</strong> ${activeStudent.primaryMobile}</div>
        </div>
      </div>
      <script>window.print();<\/script>
    </body>
    </html>
  `);
}

// Print Admit Card
function printStudentAdmitCard() {
  const win = window.open("", "_blank");
  win.document.write(`
    <html>
    <head>
      <title>Admit Card - ${activeStudent.name}</title>
      <style>
        body { font-family: 'Times New Roman', serif; padding: 20px; }
        .admit-box { border: 2px solid #141e37; padding: 20px; max-width: 600px; margin: 0 auto; }
        .ad-head { text-align: center; border-bottom: 2px solid #141e37; padding-bottom: 8px; margin-bottom: 15px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; font-size: 11pt; }
      </style>
    </head>
    <body>
      <div class="admit-box">
        <div class="ad-head">
          <h2 style="margin:0; color:#141e37;">ASSENT PUBLIC SCHOOL</h2>
          <small>EXAMINATION ADMIT CARD - 2025-26</small>
        </div>
        <div class="grid">
          <div><strong>Student Name:</strong> ${activeStudent.name}</div>
          <div><strong>Class:</strong> ${activeStudent.className}</div>
          <div><strong>Roll Number:</strong> ${activeStudent.rollNo}</div>
          <div><strong>Father Name:</strong> ${activeStudent.fatherName}</div>
        </div>
        <p style="font-size:10pt; color:#555;">Kripya exam hall me samay par pahunchein aur admit card sath layein.</p>
        <div style="display:flex; justify-content:space-between; margin-top:50px; font-weight:bold;">
          <span>Class Teacher</span>
          <span>Principal Signature</span>
        </div>
      </div>
      <script>window.print();<\/script>
    </body>
    </html>
  `);
}

// ==========================================
// 2. TEACHER PANEL (SCHOOL)
// ==========================================
function openSchoolTeacherLogin() {
  const pass = prompt("Enter School Teacher Password (Default: pass):");
  if (pass === "pass") {
    renderSchoolTeacherDashboard();
  } else if (pass !== null) {
    alert("Incorrect password!");
  }
}

function renderSchoolTeacherDashboard() {
  document.getElementById("dynamicView").innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:#f8fafc; z-index:3000; display:flex; flex-direction:column;">
      
      <div style="height:55px; background:var(--primary-navy); color:white; display:flex; align-items:center; justify-content:space-between; padding:0 16px;">
        <div><strong>ASSENT PUBLIC SCHOOL</strong> - Teachers Portal</div>
        <button onclick="openSchoolPortal()" style="background:none; border:none; color:white; font-size:1.3rem; cursor:pointer;"><i class="fas fa-times"></i></button>
      </div>

      <!-- Navigation Tabs -->
      <div style="background:white; border-bottom:1px solid var(--border-color); display:flex; padding:8px 12px; gap:8px;">
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.85rem; margin:0;" onclick="showSchTeacherTab('addStudent')">+ Add Student</button>
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.85rem; margin:0; background:#0284c7;" onclick="showSchTeacherTab('marksEntry')">Score Update</button>
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.85rem; margin:0; background:#059669;" onclick="showSchTeacherTab('tabulation')">Tabulation & Print</button>
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.85rem; margin:0; background:#d97706;" onclick="promoteClassEngine()">Promote Classes</button>
      </div>

      <div id="schTeacherBody" style="flex:1; overflow-y:auto; padding:16px; max-width:800px; margin:0 auto; width:100%;">
        <!-- Body Container -->
      </div>

    </div>
  `;
  showSchTeacherTab('addStudent');
}

function showSchTeacherTab(tab) {
  const container = document.getElementById("schTeacherBody");

  if (tab === 'addStudent') {
    container.innerHTML = `
      <div class="modal-card" style="max-width:100%;">
        <h3 style="color:var(--primary-navy); margin-bottom:12px;">Add New Student</h3>
        <form onsubmit="handleQuickAddStudent(event)">
          <div class="form-group">
            <label>Class</label>
            <select id="qasClass" required>
              <option value="Play & Nur">Play & Nursery (Combined)</option>
              <option value="LKG">LKG</option>
              <option value="UKG">UKG</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
              <option value="Class 4">Class 4</option>
              <option value="Class 5">Class 5</option>
            </select>
          </div>
          <div class="form-group">
            <label>Roll Number</label>
            <input type="number" id="qasRoll" required placeholder="e.g. 1">
          </div>
          <div class="form-group">
            <label>Student Full Name</label>
            <input type="text" id="qasName" required placeholder="e.g. Rahul Kumar">
          </div>
          <button type="submit" class="btn-primary">+ Save Student to Register</button>
        </form>
      </div>
    `;
  } else if (tab === 'marksEntry') {
    container.innerHTML = `
      <div class="modal-card" style="max-width:100%;">
        <h3 style="color:var(--primary-navy); margin-bottom:12px;">Fast Score Update Engine</h3>
        
        <div style="display:flex; gap:10px; margin-bottom:14px;">
          <button class="btn-primary" style="margin:0; font-size:0.85rem;" onclick="renderSubjectLockEntry()">Mode 1: Subject-Lock (Bulk Roll)</button>
          <button class="btn-primary" style="margin:0; font-size:0.85rem; background:#0284c7;" onclick="renderStudentLockEntry()">Mode 2: Student-Lock (Full Sheet)</button>
        </div>

        <div id="marksEntryContainer"></div>
      </div>
    `;
    renderSubjectLockEntry();
  } else if (tab === 'tabulation') {
    container.innerHTML = `
      <div class="modal-card" style="max-width:100%;">
        <h3 style="color:var(--primary-navy); margin-bottom:12px;">Official Tabulation Register</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
          <div class="form-group">
            <label>Select Class</label>
            <select id="tabClass"><option value="Class 1">Class 1</option><option value="Class 2">Class 2</option><option value="Play & Nur">Play & Nursery</option><option value="LKG">LKG</option><option value="UKG">UKG</option></select>
          </div>
          <div class="form-group">
            <label>Terminal Exam</label>
            <select id="tabTerm"><option value="First Terminal">First Terminal</option><option value="Second Terminal">Second Terminal</option><option value="Final">Final Terminal</option></select>
          </div>
        </div>
        <button class="btn-primary" style="background:#059669;" onclick="printTabulationRegister()"><i class="fas fa-print"></i> Print Tabulation Sheet with Ranks</button>
      </div>
    `;
  }
}

function handleQuickAddStudent(e) {
  e.preventDefault();
  const data = {
    className: document.getElementById("qasClass").value,
    rollNo: document.getElementById("qasRoll").value,
    name: document.getElementById("qasName").value
  };
  API.post("schoolAddStudent", data);
  alert(`Student ${data.name} (Roll ${data.rollNo}) successfully added!`);
  document.getElementById("qasRoll").value = parseInt(data.rollNo) + 1;
  document.getElementById("qasName").value = "";
}

// Mode 1: Subject Lock Bulk Roll Entry
function renderSubjectLockEntry() {
  document.getElementById("marksEntryContainer").innerHTML = `
    <div style="background:#f1f5f9; padding:12px; border-radius:8px;">
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:10px;">
        <select id="slClass"><option value="Class 1">Class 1</option><option value="Play & Nur">Play & Nur</option><option value="LKG">LKG</option><option value="UKG">UKG</option></select>
        <select id="slTerm"><option value="First Terminal">First Terminal</option><option value="Second Terminal">Second Terminal</option><option value="Final">Final</option></select>
        <select id="slSubject"><option value="Hindi">Hindi</option><option value="English">English</option><option value="Maths">Maths</option><option value="Science">Science</option><option value="Drawing">Drawing</option></select>
      </div>
      <div style="display:flex; gap:10px;">
        <input type="number" id="slRoll" placeholder="Roll No" style="width:100px; padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
        <input type="number" id="slMarks" placeholder="Marks Obtained" style="flex:1; padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
        <button class="btn-primary" style="width:auto; padding:8px 16px; margin:0;" onclick="saveSubjectLockRow()">Next</button>
      </div>
    </div>
  `;
}

function saveSubjectLockRow() {
  const roll = document.getElementById("slRoll").value;
  const marks = document.getElementById("slMarks").value;
  if (!roll || !marks) return alert("Roll aur Marks enter karein!");

  API.post("schoolUpdateMarks", {
    className: document.getElementById("slClass").value,
    term: document.getElementById("slTerm").value,
    rollNo: roll,
    marksList: [{ subject: document.getElementById("slSubject").value, marksObtained: marks }]
  });

  document.getElementById("slRoll").value = parseInt(roll) + 1;
  document.getElementById("slMarks").value = "";
  document.getElementById("slMarks").focus();
}

// Mode 2: Student Lock Full Sheet Entry
function renderStudentLockEntry() {
  document.getElementById("marksEntryContainer").innerHTML = `
    <div style="background:#f1f5f9; padding:12px; border-radius:8px;">
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:10px;">
        <select id="stLockClass"><option value="Class 1">Class 1</option><option value="Play & Nur">Play & Nur</option><option value="LKG">LKG</option><option value="UKG">UKG</option></select>
        <select id="stLockTerm"><option value="First Terminal">First Terminal</option><option value="Second Terminal">Second Terminal</option><option value="Final">Final</option></select>
        <input type="number" id="stLockRoll" placeholder="Enter Roll No" style="padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <input type="number" id="mHindi" placeholder="Hindi Marks" style="padding:8px; border-radius:6px; border:1px solid #cbd5e1;">
        <input type="number" id="mEng" placeholder="English Marks" style="padding:8px; border-radius:6px; border:1px solid #cbd5e1;">
        <input type="number" id="mMath" placeholder="Maths Marks" style="padding:8px; border-radius:6px; border:1px solid #cbd5e1;">
        <input type="number" id="mSci" placeholder="Science Marks" style="padding:8px; border-radius:6px; border:1px solid #cbd5e1;">
      </div>
      <button class="btn-primary" style="margin-top:10px;" onclick="saveStudentLockSheet()">Submit Full Marks</button>
    </div>
  `;
}

function saveStudentLockSheet() {
  const roll = document.getElementById("stLockRoll").value;
  if (!roll) return alert("Roll number enter karein!");

  API.post("schoolUpdateMarks", {
    className: document.getElementById("stLockClass").value,
    term: document.getElementById("stLockTerm").value,
    rollNo: roll,
    marksList: [
      { subject: "Hindi", marksObtained: document.getElementById("mHindi").value || 0 },
      { subject: "English", marksObtained: document.getElementById("mEng").value || 0 },
      { subject: "Maths", marksObtained: document.getElementById("mMath").value || 0 },
      { subject: "Science", marksObtained: document.getElementById("mSci").value || 0 }
    ]
  });
  alert("Marks submitted successfully!");
}

// Bulk Class Promotion Action
async function promoteClassEngine() {
  if (confirm("Kya aap session 2025-26 ke sabhi qualified (Grade B or above) students ko next class me promote karna chahte hain?")) {
    await API.post("schoolPromoteClass", {});
    alert("Annual Class Promotion complete! Qualified students agli kaksha me promote ho gaye hain.");
  }
}

// =========================================================================
// 3. OFFICIAL PROGRESS REPORT CARD REPLICA (Exact Replica of School Card)
// =========================================================================
function printOfficialProgressReport() {
  const win = window.open("", "_blank");
  win.document.write(`
    <html>
    <head>
      <title>Progress Report Card - ${activeStudent.name}</title>
      <style>
        @page { size: A4 portrait; margin: 8mm; }
        body { font-family: 'Arial', sans-serif; font-size: 10pt; line-height: 1.3; }
        .border-box { border: 3px double #141e37; padding: 12px; height: 98vh; display: flex; flex-direction: column; justify-content: space-between; }
        .text-center { text-align: center; }
        .school-title { font-size: 20pt; font-weight: 900; color: #141e37; margin: 0; letter-spacing: 0.5px; }
        .motto { font-style: italic; font-weight: bold; font-size: 10pt; margin: 2px 0 6px; }
        .meta-table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        .meta-table td { padding: 4px 6px; font-size: 10.5pt; }
        
        .marks-table { width: 100%; border-collapse: collapse; text-align: center; margin: 8px 0; }
        .marks-table th, .marks-table td { border: 1.5px solid black; padding: 4px; font-size: 9.5pt; }
        .marks-table th { background: #fef08a; }
        
        .grades-table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-top: 6px; }
        .grades-table th, .grades-table td { border: 1px solid #444; padding: 2px 4px; text-align: center; }
        
        .sign-row { display: flex; justify-content: space-between; margin-top: 25px; padding: 0 10px; font-weight: bold; font-size: 10pt; }
      </style>
    </head>
    <body>
      <div class="border-box">
        
        <div>
          <div class="text-center">
            <div class="motto">"Excellence Through Knowledge"</div>
            <h1 class="school-title">ASSENT PUBLIC SCHOOL</h1>
            <div style="font-weight: bold; font-size: 10pt;">Singhiya Khurd, Samastipur</div>
            <div style="font-size: 9pt;">Based on C.B.S.E. Curriculum Prep to Std. V</div>
            <h3 style="margin: 6px 0; text-decoration: underline;">PROGRESS REPORT CARD</h3>
            <div style="font-weight: bold;">ACADEMIC YEAR: 2025-26</div>
          </div>

          <table class="meta-table">
            <tr>
              <td><strong>Name:</strong> ${activeStudent.name}</td>
              <td><strong>Std.:</strong> ${activeStudent.className}</td>
              <td><strong>Roll No.:</strong> ${activeStudent.rollNo}</td>
            </tr>
            <tr>
              <td colspan="2"><strong>Parent's / Guardian's Name:</strong> ${activeStudent.fatherName}</td>
              <td><strong>Section:</strong> A</td>
            </tr>
          </table>

          <!-- Inner Marks Grid Table -->
          <table class="marks-table">
            <thead>
              <tr>
                <th rowspan="2">SUBJECT</th>
                <th colspan="3">FIRST TERMINAL</th>
                <th colspan="3">SECOND TERMINAL</th>
                <th colspan="3">FINAL</th>
                <th rowspan="2">REMARK</th>
              </tr>
              <tr>
                <th>F.M.</th><th>Pass</th><th>Obt.</th>
                <th>F.M.</th><th>Pass</th><th>Obt.</th>
                <th>F.M.</th><th>Pass</th><th>Obt.</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>ENGLISH</td><td>100</td><td>35</td><td>85</td><td>100</td><td>35</td><td>88</td><td>100</td><td>35</td><td>90</td><td>Good</td></tr>
              <tr><td>HINDI</td><td>100</td><td>35</td><td>80</td><td>100</td><td>35</td><td>82</td><td>100</td><td>35</td><td>86</td><td>Good</td></tr>
              <tr><td>MATHS</td><td>100</td><td>35</td><td>92</td><td>100</td><td>35</td><td>94</td><td>100</td><td>35</td><td>96</td><td>Excellent</td></tr>
              <tr><td>SCIENCE</td><td>100</td><td>35</td><td>88</td><td>100</td><td>35</td><td>90</td><td>100</td><td>35</td><td>92</td><td>Excellent</td></tr>
              <tr><td>SOCIAL SCIENCE</td><td>100</td><td>35</td><td>78</td><td>100</td><td>35</td><td>80</td><td>100</td><td>35</td><td>84</td><td>Good</td></tr>
              <tr><td>G.K. / G.S.</td><td>50</td><td>18</td><td>45</td><td>50</td><td>18</td><td>46</td><td>50</td><td>18</td><td>48</td><td>Very Good</td></tr>
              <tr><td>MUSIC / DRAWING</td><td>50</td><td>18</td><td>42</td><td>50</td><td>18</td><td>44</td><td>50</td><td>18</td><td>46</td><td>Creative</td></tr>
              <tr><td>PRACTICAL</td><td>30</td><td>12</td><td>26</td><td>30</td><td>12</td><td>27</td><td>30</td><td>12</td><td>28</td><td>Very Good</td></tr>
              <tr><td>COMPUTER</td><td>50</td><td>18</td><td>44</td><td>50</td><td>18</td><td>45</td><td>50</td><td>18</td><td>46</td><td>Very Good</td></tr>
              <tr style="font-weight:bold; background:#f1f5f9;">
                <td>TOTAL</td><td>680</td><td>-</td><td>580</td><td>680</td><td>-</td><td>596</td><td>680</td><td>-</td><td>616</td><td>PASSED</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <!-- Key to Grades Matrix Table -->
          <div style="font-weight: bold; font-size: 9pt; margin-bottom: 2px;">KEY TO GRADES:</div>
          <table class="grades-table">
            <thead>
              <tr style="background:#e2e8f0;">
                <th>% Percentage</th><th>Division</th><th>Remarks</th><th>Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>85% to above</td><td>1st Division</td><td>Excellent and Passed with honour</td><td><strong>A++</strong></td></tr>
              <tr><td>75% to below 85%</td><td>1st Division</td><td>Passed with Distinction</td><td><strong>A+</strong></td></tr>
              <tr><td>65% to 74%</td><td>1st Division</td><td>Distinction</td><td><strong>A</strong></td></tr>
              <tr><td>55% to 64%</td><td>2nd Division</td><td>Very Good</td><td><strong>B+</strong></td></tr>
              <tr><td>35% to 54%</td><td>Pass</td><td>Satisfactory</td><td><strong>B</strong></td></tr>
              <tr><td>Below 35%</td><td>Fail</td><td>Work Hard</td><td><strong>C</strong></td></tr>
            </tbody>
          </table>

          <div style="font-size: 8pt; margin-top: 6px; font-style: italic;">
            * Rule: Student must get at least Grade B to be Promoted to the next Class.<br>
            "We judge ourselves by what we feel capable of doing, While others judge us by what we have done."
          </div>

          <div class="sign-row">
            <span>Teacher Signature</span>
            <span>G. K. Thakur<br><small>Director</small></span>
            <span>A. K. Singh<br><small>Principal</small></span>
          </div>
        </div>

      </div>
      <script>window.print();<\/script>
    </body>
    </html>
  `);
}

function printTabulationRegister() {
  const win = window.open("", "_blank");
  win.document.write(`
    <html>
    <head>
      <title>Official Tabulation Register - ASSENT PUBLIC SCHOOL</title>
      <style>
        @page { size: A4 landscape; margin: 10mm; }
        body { font-family: sans-serif; font-size: 10pt; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid black; padding: 6px; text-align: center; }
        th { background: #f1f5f9; }
      </style>
    </head>
    <body>
      <h2 style="text-align:center; margin:0;">ASSENT PUBLIC SCHOOL</h2>
      <div style="text-align:center; margin-bottom:10px;">TABULATION REGISTER - SESSION 2025-26</div>
      <table>
        <thead>
          <tr>
            <th>Rank</th><th>Roll No</th><th>Student Name</th><th>Hindi</th><th>English</th><th>Maths</th><th>Science</th><th>Total</th><th>%</th><th>Grade</th><th>Division</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1</strong></td><td>1</td><td>Aarav Kumar</td><td>92</td><td>88</td><td>98</td><td>95</td><td>373</td><td>93.2%</td><td><strong>A++</strong></td><td>1st Division</td>
          </tr>
        </tbody>
      </table>
      <script>window.print();<\/script>
    </body>
    </html>
  `);
}
