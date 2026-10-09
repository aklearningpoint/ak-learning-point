// Modules for Result Lookup, Rewarding Quiz, Online Coaching & Flip-Book Reader

// ==========================================
// 1. RESULT TAB (Mobile Lookup & History)
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
            <label>Registered Mobile Number</label>
            <input type="tel" id="resLookupMobile" required pattern="[0-9]{10}" placeholder="Enter 10-digit mobile number">
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
  const mob = document.getElementById("resLookupMobile").value;
  const listContainer = document.getElementById("resultLookupList");
  listContainer.innerHTML = `<p style="text-align:center; color:var(--text-muted);"><i class="fas fa-spinner fa-spin"></i> Searching scorecards...</p>`;

  const res = await API.get("getStudentResults", { mobile: mob });
  const attempts = res.data || [];

  if (attempts.length === 0) {
    listContainer.innerHTML = `<p style="text-align:center; color:#dc2626; padding:10px;">Is number se koi attempt record nahi mila!</p>`;
    return;
  }

  listContainer.innerHTML = attempts.map(att => `
    <div class="section-card" style="margin-bottom:8px; padding:12px;" onclick='viewHistoricalScorecard(${JSON.stringify(att)})'>
      <div style="flex:1;">
        <h4 style="font-size:0.95rem; color:var(--primary-navy);">${att.quizTitle}</h4>
        <small style="color:var(--text-muted);">Score: <strong>${att.score}/${att.totalMarks}</strong> (${att.percentage}%)</small>
        <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">Attempted: ${new Date(att.timestamp).toLocaleDateString()}</div>
      </div>
      <button class="btn-primary" style="width:auto; padding:5px 10px; font-size:0.8rem; background:#d97706; margin:0;">View</button>
    </div>
  `).join("");
}

function viewHistoricalScorecard(att) {
  let appreciation = "Shandar Prayas! Rozana abhyas karte rahein.";
  const pct = parseFloat(att.percentage);
  if (pct >= 80) appreciation = "🌟 Adbhut Pradarshan! Aap ek champion hain!";
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

  const res = await API.get("getQuizzes", { rewardingOnly: "true" });
  const quizzes = res.data || [];

  if (quizzes.length === 0) {
    dynamicView.innerHTML = `
      <div class="modal-overlay" style="display:flex;">
        <div class="modal-card" style="text-align:center;">
          <div class="modal-header">
            <h3>🎁 Rewarding Quizzes</h3>
            <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
          </div>
          <p style="margin:20px 0; color:var(--text-muted);">Filhaal koi naya Rewarding Quiz live nahi hai. Jaldi hi teacher panel se code aayega!</p>
          <button class="btn-primary" onclick="closeDynamicView()">Back</button>
        </div>
      </div>
    `;
    return;
  }

  const listHtml = quizzes.map(q => `
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
  const enteredPass = prompt("Enter Tuition Access Passkey (Default: pass):");
  if (enteredPass === "pass") {
    playInAppVideo("Tuition Special Lecture: Mathematics Concept", "https://www.youtube.com/embed/dQw4w9WgXcQ");
  } else if (enteredPass !== null) {
    alert("Galat passkey! Kripya sahi tuition passkey dalein.");
  }
}

function openGeneralVideoSection() {
  playInAppVideo("General Lecture: Science Experiment Demo", "https://www.youtube.com/embed/dQw4w9WgXcQ");
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
  { pageNo: 3, title: "Important Key Points", content: "Chlorophyll helps leaves capture energy from sunlight. Solar energy is stored as food in leaves. Without photosynthesis, life would not be possible on earth!" }
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
      
      <!-- Flip Book Header -->
      <div style="height:55px; background:var(--primary-navy); color:white; display:flex; align-items:center; justify-content:space-between; padding:0 16px;">
        <div><strong>📖 ${p.title}</strong></div>
        <button onclick="closeDynamicView()" style="background:none; border:none; color:white; font-size:1.3rem; cursor:pointer;"><i class="fas fa-times"></i></button>
      </div>

      <!-- Realistic Flip Page Container -->
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
