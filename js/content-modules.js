// Complete Content Modules: Result Lookup, Rewarding Contests, Video Coaching, Flip-Book & A4 100-Q OMR Engine

// Storage Helper
function getModuleData(key, fallback) {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : fallback;
}
function setModuleData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ==========================================
// 1. RESULT TAB (Mobile Lookup & Deep Scorecard)
// ==========================================
function openResultLookupModal() {
  const dynamicView = document.getElementById("dynamicView");
  dynamicView.innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card">
        <div class="modal-header">
          <h3><i class="fas fa-poll" style="color:#d97706;"></i> Student Result Lookup</h3>
          <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
        </div>
        <form onsubmit="handleResultSearch(event)">
          <div class="form-group">
            <label>Registered 10-Digit Mobile Number</label>
            <input type="tel" id="resLookupMobile" required pattern="[0-9]{10}" placeholder="Enter mobile number">
          </div>
          <button type="submit" class="btn-primary" style="background:#d97706;">Search Attempted Tests</button>
        </form>
        <div id="resultLookupList" style="margin-top:15px; max-height:50vh; overflow-y:auto;"></div>
      </div>
    </div>
  `;
}

async function handleResultSearch(e) {
  e.preventDefault();
  const mob = document.getElementById("resLookupMobile").value.trim();
  const listContainer = document.getElementById("resultLookupList");
  listContainer.innerHTML = `<p style="text-align:center; color:var(--text-muted);"><i class="fas fa-spinner fa-spin"></i> Searching scorecards...</p>`;

  // 1. Check Local Submissions First (Instant)
  const localAttempts = getModuleData("ak_student_attempts", []).filter(a => String(a.mobile).trim() === mob);

  // 2. Network Fetch Fallback
  let networkAttempts = [];
  try {
    const res = await API.get("getStudentResults", { mobile: mob });
    if (res && res.data) networkAttempts = res.data;
  } catch (err) {
    console.warn("Offline or API Error, using local results:", err);
  }

  // Combine and deduplicate
  const allAttempts = [...localAttempts, ...networkAttempts];
  const uniqueAttempts = Array.from(new Map(allAttempts.map(item => [item.timestamp || item.id, item])).values());

  if (uniqueAttempts.length === 0) {
    listContainer.innerHTML = `<p style="text-align:center; color:#dc2626; padding:10px;">Is mobile number se koi attempt record nahi mila!</p>`;
    return;
  }

  listContainer.innerHTML = uniqueAttempts.map(att => `
    <div class="section-card" style="margin-bottom:8px; padding:12px; cursor:pointer;" onclick='viewHistoricalScorecard(${JSON.stringify(att)})'>
      <div style="flex:1;">
        <h4 style="font-size:0.95rem; color:var(--primary-navy);">${att.quizTitle}</h4>
        <small style="color:var(--text-muted);">Score: <strong>${att.score}/${att.totalMarks}</strong> (${att.percentage}%)</small>
        <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">Attempted: ${new Date(att.timestamp || Date.now()).toLocaleDateString()}</div>
      </div>
      <button class="btn-primary" style="width:auto; padding:5px 10px; font-size:0.8rem; background:#d97706; margin:0;">View</button>
    </div>
  `).join("");
}

function viewHistoricalScorecard(att) {
  let appreciation = "Shandar Prayas! Rozana abhyas karte rahein.";
  const pct = parseFloat(att.percentage || 0);
  if (pct >= 80) appreciation = "🌟 Adbhut Pradarshan! Champion performance!";
  else if (pct >= 50) appreciation = "👍 Bahut Acha! Agli baar 90% ka target rakhein!";

  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card" style="text-align:center; max-width:480px;">
        <div class="modal-header">
          <h3>Test Scorecard</h3>
          <button class="close-btn" onclick="openResultLookupModal()"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div style="background:var(--primary-navy); color:white; padding:20px; border-radius:12px; margin-bottom:15px;">
          <h2 style="color:var(--brand-gold); margin-bottom:4px;">AK Learning Point</h2>
          <p style="font-size:0.85rem; opacity:0.8;">Student: <strong>${att.studentName}</strong></p>
          <hr style="border:none; border-top:1px solid rgba(255,255,255,0.2); margin:12px 0;">
          <div style="font-size:2.2rem; font-weight:800; color:#4ade80;">${att.score} / ${att.totalMarks}</div>
          <div style="font-size:1rem; font-weight:600; margin-top:4px;">Accuracy: ${att.percentage}%</div>
          <p style="font-style:italic; font-size:0.85rem; margin-top:10px; color:#e2e8f0;">"${appreciation}"</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          <button class="btn-primary" style="background:#25d366;" onclick="shareResultWhatsApp('${att.score}', '${att.totalMarks}', '${att.percentage}')">
            <i class="fab fa-whatsapp"></i> Share on WhatsApp
          </button>
          <button class="btn-primary" style="background:#64748b;" onclick="closeDynamicView()">Close</button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 2. REWARDING QUIZ TAB
// ==========================================
async function openRewardingQuizzes() {
  const dynamicView = document.getElementById("dynamicView");
  dynamicView.innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card" style="text-align:center;">
        <i class="fas fa-spinner fa-spin fa-2x" style="color:#dc2626;"></i>
        <p style="margin-top:10px;">Loading Rewarding Contests...</p>
      </div>
    </div>
  `;

  // Get from local store and API
  let localQuizzes = getModuleData("ak_teacher_quizzes", []).filter(q => q.isRewarding && q.status === "published");
  
  try {
    const res = await API.get("getQuizzes", { rewardingOnly: "true" });
    if (res && res.data && res.data.length > 0) {
      localQuizzes = res.data;
    }
  } catch (e) {
    console.warn("Using local rewarding contests");
  }

  if (localQuizzes.length === 0) {
    dynamicView.innerHTML = `
      <div class="modal-overlay" style="display:flex;">
        <div class="modal-card" style="text-align:center;">
          <div class="modal-header">
            <h3>🎁 Rewarding Quizzes</h3>
            <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
          </div>
          <p style="margin:20px 0; color:var(--text-muted);">Filhaal koi naya Rewarding Quiz live nahi hai. Teacher panel se jald hi code announce hoga!</p>
          <button class="btn-primary" onclick="closeDynamicView()">Back</button>
        </div>
      </div>
    `;
    return;
  }

  const listHtml = localQuizzes.map(q => `
    <div class="section-card" style="margin-bottom:12px; border-left: 4px solid #dc2626;">
      <div style="flex:1;">
        <h3 style="font-size:1rem; color:var(--primary-navy);">${q.title}</h3>
        <small style="color:var(--text-muted);">${q.className} • ${q.subject}</small>
        <div style="margin-top:8px;">
          <button class="btn-primary" style="padding:6px 14px; font-size:0.85rem; width:auto; background:#dc2626;" onclick='openQuizEntryModal(${JSON.stringify(q)})'>
            <i class="fas fa-lock"></i> Enter with Passkey
          </button>
        </div>
      </div>
    </div>
  `).join("");

  dynamicView.innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card">
        <div class="modal-header">
          <h3>🎁 Active Rewarding Contests</h3>
          <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
        </div>
        <div style="max-height:60vh; overflow-y:auto;">
          ${listHtml}
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 3. ONLINE COACHING TAB (In-App Player)
// ==========================================
function openOnlineCoachingModal() {
  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card" style="text-align:center;">
        <div class="modal-header">
          <h3><i class="fas fa-video" style="color:#7c3aed;"></i> Online Coaching</h3>
          <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
        </div>
        <p style="color:var(--text-muted); margin-bottom:16px;">Kripya section chuniye:</p>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div class="section-card" onclick="openTuitionSection()">
            <div class="section-left">
              <div class="section-icon" style="background:#ede9fe; color:#7c3aed;"><i class="fas fa-user-lock"></i></div>
              <div class="section-info">
                <h3>Tuition Classes</h3>
                <p>Passkey Protected Enrolled Batches</p>
              </div>
            </div>
            <i class="fas fa-chevron-right text-muted"></i>
          </div>

          <div class="section-card" onclick="openGeneralVideoSection()">
            <div class="section-left">
              <div class="section-icon" style="background:#e0f2fe; color:#0284c7;"><i class="fas fa-globe"></i></div>
              <div class="section-info">
                <h3>General Classes</h3>
                <p>Free Lectures & Concept Videos</p>
              </div>
            </div>
            <i class="fas fa-chevron-right text-muted"></i>
          </div>
        </div>
      </div>
    </div>
  `;
}

function openTuitionSection() {
  const currentTuitionPass = (getModuleData("ak_app_config", {})).tuitionPass || "pass";
  const enteredPass = prompt("Enter Tuition Access Passkey:");
  if (enteredPass === currentTuitionPass) {
    playInAppVideo("Tuition Special Lecture: Mathematics & Science Concepts", "https://www.youtube.com/embed/dQw4w9WgXcQ");
  } else if (enteredPass !== null) {
    alert("Galat passkey! Kripya sahi tuition passkey dalein.");
  }
}

function openGeneralVideoSection() {
  playInAppVideo("General Lecture: Concept Explanations", "https://www.youtube.com/embed/dQw4w9WgXcQ");
}

function playInAppVideo(title, embedUrl) {
  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card" style="max-width:600px; padding:12px;">
        <div class="modal-header" style="margin-bottom:8px;">
          <h4 style="font-size:0.95rem; color:var(--primary-navy);">${title}</h4>
          <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
        </div>
        <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:8px;">
          <iframe src="${embedUrl}?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%;"></iframe>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 4. STUDY MATERIAL FLIP-BOOK READER
// ==========================================
const sampleFlipPages = [
  { pageNo: 1, title: "Chapter 1: Nutrition in Plants", content: "All living organisms require food. Plants can synthesize food for themselves but animals including humans cannot. The mode of nutrition in which organisms make food themselves from simple substances is called autotrophic nutrition." },
  { pageNo: 2, title: "Photosynthesis Process", content: "Leaves are the food factories of plants. The synthesis of food occurs in leaves. Water and minerals present in the soil are absorbed by roots and transported to the leaves through vessels. Carbon dioxide from air is taken in through stomata." },
  { pageNo: 3, title: "Key Examination Takeaways", content: "Chlorophyll helps leaves capture energy from sunlight. Solar energy is stored as food in leaves. Without photosynthesis, life would not be possible on earth!" }
];

let currentFlipIndex = 0;

function openStudyMaterialModal() {
  currentFlipIndex = 0;
  renderFlipBookScreen();
}

function renderFlipBookScreen() {
  const p = sampleFlipPages[currentFlipIndex];
  const totalP = sampleFlipPages.length;

  document.getElementById("dynamicView").innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:#f1f5f9; z-index:3000; display:flex; flex-direction:column;">
      
      <div style="height:55px; background:var(--primary-navy); color:white; display:flex; align-items:center; justify-content:space-between; padding:0 16px;">
        <div><strong>📖 ${p.title}</strong></div>
        <button onclick="closeDynamicView()" style="background:none; border:none; color:white; font-size:1.3rem; cursor:pointer;"><i class="fas fa-times"></i></button>
      </div>

      <div style="flex:1; display:flex; align-items:center; justify-content:center; padding:16px;">
        <div style="background:white; width:100%; max-width:550px; min-height:400px; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.12); padding:26px; border:1px solid #cbd5e1; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="text-align:right; font-size:0.8rem; color:var(--text-muted); font-weight:700;">Page ${p.pageNo} of ${totalP}</div>
            <h3 style="color:var(--brand-blue); margin:12px 0;">${p.title}</h3>
            <p style="font-size:1.05rem; line-height:1.7; color:#334155;">${p.content}</p>
          </div>
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; border-top:1px solid #e2e8f0; padding-top:14px;">
            <button class="btn-primary" style="width:auto; padding:8px 16px; background:#64748b;" ${currentFlipIndex === 0 ? 'disabled style="opacity:0.4;"' : ''} onclick="prevFlipPage()"><i class="fas fa-chevron-left"></i> Previous</button>
            <button class="btn-primary" style="width:auto; padding:8px 16px; background:var(--brand-blue);" ${currentFlipIndex === totalP - 1 ? 'disabled style="opacity:0.4;"' : ''} onclick="nextFlipPage()">Next <i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>

    </div>
  `;
}

function prevFlipPage() {
  if (currentFlipIndex > 0) {
    currentFlipIndex--;
    renderFlipBookScreen();
  }
}

function nextFlipPage() {
  if (currentFlipIndex < sampleFlipPages.length - 1) {
    currentFlipIndex++;
    renderFlipBookScreen();
  }
}

// =========================================================================
// 5. OMR PRINTABLE SHEET ENGINE (A4 100 Questions with Configurable Headers)
// =========================================================================
function openOmrPrintModal() {
  if (typeof toggleDrawer === "function") toggleDrawer();

  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card">
        <div class="modal-header">
          <h3><i class="fas fa-dot-circle" style="color:#d97706;"></i> Print OMR Answer Sheet</h3>
          <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
        </div>
        
        <div class="form-group">
          <label>Header Title (Bold)</label>
          <input type="text" id="omrHeaderTitle" value="ASSENT PUBLIC SCHOOL / AK LEARNING POINT">
        </div>
        <div class="form-group">
          <label>Address / Sub-heading (Optional)</label>
          <input type="text" id="omrAddress" value="Singhiya Khurd, Samastipur, Bihar">
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="form-group">
            <label>Total Questions (Max 100)</label>
            <input type="number" id="omrTotalQ" value="100" min="10" max="100">
          </div>
          <div class="form-group">
            <label>Full Marks</label>
            <input type="number" id="omrFullMarks" value="100">
          </div>
        </div>

        <button class="btn-primary" style="background:#059669;" onclick="generateA4OmrSheet()">
          <i class="fas fa-print"></i> Generate & Print A4 OMR Sheet
        </button>
      </div>
    </div>
  `;
}

function generateA4OmrSheet() {
  const title = document.getElementById("omrHeaderTitle").value;
  const address = document.getElementById("omrAddress").value;
  const totalQ = parseInt(document.getElementById("omrTotalQ").value) || 100;
  const fullMarks = document.getElementById("omrFullMarks").value || 100;

  const win = window.open("", "_blank");
  
  // 4 columns layout for 100 questions (25 per column)
  let columnsHtml = "";
  const cols = 4;
  const qPerCol = Math.ceil(totalQ / cols);

  for (let c = 0; c < cols; c++) {
    let colRows = "";
    for (let i = 1; i <= qPerCol; i++) {
      const qNum = c * qPerCol + i;
      if (qNum <= totalQ) {
        colRows += `
          <div class="omr-row">
            <span class="q-num">${qNum < 10 ? '0' + qNum : qNum}.</span>
            <span class="bubble">A</span>
            <span class="bubble">B</span>
            <span class="bubble">C</span>
            <span class="bubble">D</span>
          </div>
        `;
      }
    }
    columnsHtml += `<div class="omr-column">${colRows}</div>`;
  }

  win.document.write(`
    <html>
    <head>
      <title>OMR Sheet - ${title}</title>
      <style>
        @page { size: A4 portrait; margin: 8mm; }
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #111; }
        .omr-container { border: 2px solid #141e37; padding: 10px; height: 98vh; box-sizing: border-box; position: relative; }
        .watermark { position: absolute; top: 38%; left: 16%; font-size: 50pt; color: rgba(0,0,0,0.04); transform: rotate(-30deg); font-weight: bold; pointer-events: none; }
        .header { text-align: center; border-bottom: 2px solid #141e37; padding-bottom: 6px; }
        .header h2 { margin: 0; font-size: 16pt; font-weight: 900; }
        .header p { margin: 2px 0 0; font-size: 9pt; color: #444; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 9.5pt; margin: 8px 0; border-bottom: 1.5px solid #141e37; padding-bottom: 8px; }
        .meta-item { border-bottom: 1px dotted #333; height: 18px; }
        .rules-bar { display: flex; justify-content: space-between; font-size: 8pt; background: #f1f5f9; padding: 4px; margin-bottom: 8px; border: 1px solid #cbd5e1; }
        .omr-grid { display: flex; justify-content: space-between; gap: 6px; }
        .omr-column { flex: 1; border: 1px solid #94a3b8; padding: 4px; border-radius: 4px; }
        .omr-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px; font-size: 8pt; }
        .q-num { font-weight: bold; width: 22px; }
        .bubble { display: inline-flex; width: 14px; height: 14px; border: 1px solid #141e37; border-radius: 50%; align-items: center; justify-content: center; font-size: 7pt; font-weight: bold; }
        .footer-signs { display: flex; justify-content: space-between; margin-top: 20px; font-size: 9pt; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="omr-container">
        <div class="watermark">AK LEARNING POINT</div>
        <div class="header">
          <h2>${title}</h2>
          ${address ? `<p>${address}</p>` : ''}
          <div style="font-size:10pt; font-weight:bold; margin-top:4px;">OMR ANSWER SHEET • FULL MARKS: ${fullMarks}</div>
        </div>

        <div class="meta-grid">
          <div><strong>Candidate Name:</strong> <div class="meta-item"></div></div>
          <div><strong>Class:</strong> <div class="meta-item"></div></div>
          <div><strong>Roll No:</strong> <div class="meta-item"></div></div>
          <div><strong>Subject:</strong> <div class="meta-item"></div></div>
          <div><strong>Date:</strong> <div class="meta-item"></div></div>
          <div><strong>Invigilator Sign:</strong> <div class="meta-item"></div></div>
        </div>

        <div class="rules-bar">
          <span>• Use Blue / Black Ball Point Pen only.</span>
          <span>• Darken completely: ●</span>
          <span>• Do not fold or make stray marks.</span>
        </div>

        <div class="omr-grid">
          ${columnsHtml}
        </div>

        <div class="footer-signs">
          <span>Signature of Candidate</span>
          <span>Controller of Examinations</span>
        </div>
      </div>
      <script>window.print();<\/script>
    </body>
    </html>
  `);
}

// ==========================================
// 6. WHATSAPP COMMUNITY LEAD HANDLER
// ==========================================
function openCommunityModal() {
  const modal = document.getElementById("communityModal");
  if (modal) modal.style.display = "flex";
}

function closeCommunityModal() {
  const modal = document.getElementById("communityModal");
  if (modal) modal.style.display = "none";
}

function handleLeadSubmit(e) {
  e.preventDefault();
  const leadData = {
    name: document.getElementById("leadName").value.trim(),
    state: document.getElementById("leadState").value.trim(),
    mobile: document.getElementById("leadMobile").value.trim(),
    className: document.getElementById("leadClass").value
  };

  // Store in Local Lead Ledger
  let leads = getModuleData("ak_community_leads", []);
  leads.push({ ...leadData, timestamp: new Date().toISOString() });
  setModuleData("ak_community_leads", leads);

  // Background API call
  API.post("submitLead", leadData);

  alert("Shukriya! Aapka registration prapt ho gaya hai. Ab aap official group me jud sakte hain.");
  closeCommunityModal();

  // Redirect to official WhatsApp Group
  window.open("https://chat.whatsapp.com/CXwYDb3tRIZ8gSsDuQey0I?s=cl&p=a&mlu=4&ilr=4", "_blank");
}
