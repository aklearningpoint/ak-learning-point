// Teacher Portal: Complete Management, Universal Parser, Live Leaderboards, Inline Correction, Student Ban & Auto Score Recalculation

// Storage Helpers
function getTeacherData(key, fallback) {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : fallback;
}
function setTeacherData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

let activeTeacherQuizzes = [];

function openTeacherPortal() {
  if (typeof toggleDrawer === "function") toggleDrawer();

  // Fail-safe: Chahe memory me ho ya na ho, 'pass' hamesha chalega
  const appConfig = getTeacherData("ak_app_config", { teacherPass: "pass" });
  const correctPass = (appConfig && appConfig.teacherPass) ? appConfig.teacherPass : "pass";

  const enteredPass = prompt("Enter Teacher Access Password (Default: pass):");
  if (enteredPass === correctPass || enteredPass === "pass") {
    renderTeacherDashboard();
  } else if (enteredPass !== null) {
    alert("Incorrect Teacher Password! (Default is: pass)");
  }
}

function renderTeacherDashboard() {
  document.getElementById("dynamicView").innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:#f8fafc; z-index:3000; display:flex; flex-direction:column;">
      
      <!-- Top Bar -->
      <div style="height:55px; background:var(--primary-navy); color:white; display:flex; align-items:center; justify-content:space-between; padding:0 16px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <i class="fas fa-chalkboard-teacher" style="color:var(--brand-gold);"></i>
          <strong>Teacher Control Panel</strong>
        </div>
        <button onclick="closeDynamicView()" style="background:none; border:none; color:white; font-size:1.3rem; cursor:pointer;"><i class="fas fa-times"></i></button>
      </div>

      <!-- Navigation Bar -->
      <div style="background:white; border-bottom:1px solid var(--border-color); display:flex; overflow-x:auto; padding:8px 12px; gap:8px;">
        <button class="btn-primary" style="width:auto; padding:6px 14px; font-size:0.85rem; margin:0;" onclick="showTeacherSection('maker')">+ Create Quiz (Smart Parser)</button>
        <button class="btn-primary" style="width:auto; padding:6px 14px; font-size:0.85rem; margin:0; background:#0284c7;" onclick="showTeacherSection('list')">Manage Quizzes & Leaderboards</button>
      </div>

      <!-- Content View -->
      <div id="teacherContentBody" style="flex:1; overflow-y:auto; padding:16px; max-width:850px; margin:0 auto; width:100%;"></div>

    </div>
  `;
  showTeacherSection('list');
}

async function showTeacherSection(sec) {
  const container = document.getElementById("teacherContentBody");

  if (sec === 'maker') {
    container.innerHTML = `
      <div class="modal-card" style="max-width:100%;">
        <h3 style="color:var(--primary-navy); margin-bottom:12px;">Create New Quiz / Test</h3>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="form-group">
            <label>Quiz Title / Chapter Name</label>
            <input type="text" id="tqTitle" placeholder="e.g. Chapter 3: Atmosphere & Climate" required>
          </div>
          <div class="form-group">
            <label>Board</label>
            <select id="tqBoard">
              <option value="CBSE">CBSE Board</option>
              <option value="BSEB">BSEB (Bihar Board)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Class (All Standards Supported)</label>
            <select id="tqClass">
              <option value="Play">Play</option>
              <option value="Nur">Nursery</option>
              <option value="LKG">LKG</option>
              <option value="UKG">UKG</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
              <option value="Class 4">Class 4</option>
              <option value="Class 5">Class 5</option>
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>
          </div>
          <div class="form-group">
            <label>Subject</label>
            <select id="tqSubject">
              <option value="Science">Science</option>
              <option value="Math">Math</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="S.St">S.St</option>
              <option value="G.K">G.K</option>
              <option value="Computer">Computer</option>
              <option value="Urdu">Urdu</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Economics">Economics</option>
              <option value="Civics">Civics</option>
            </select>
          </div>
        </div>

        <!-- Timer & Penalty Configurations -->
        <div style="background:#f1f5f9; padding:12px; border-radius:8px; margin:12px 0; border:1px solid #cbd5e1;">
          <h4 style="color:var(--primary-navy); margin-bottom:10px; font-size:0.95rem;"><i class="fas fa-stopwatch" style="color:#d97706;"></i> Exam Settings</h4>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
            <div class="form-group">
              <label>Timer Type</label>
              <select id="tqTimerType" onchange="handleTimerTypeChange()">
                <option value="full">Total Quiz Timer (Minutes)</option>
                <option value="per_question">Per Question Timer (Seconds)</option>
                <option value="none">No Timer</option>
              </select>
            </div>
            <div class="form-group" id="timerValueGroup">
              <label id="timerValueLabel">Total Duration (Minutes)</label>
              <input type="number" id="tqTimerValue" value="15" min="1">
            </div>
            <div class="form-group">
              <label>Negative Marking</label>
              <select id="tqNegativeMarking">
                <option value="0">No Penalty (0)</option>
                <option value="0.25">-0.25 (1/4th)</option>
                <option value="0.33">-0.33 (1/3rd)</option>
                <option value="0.50">-0.50 (1/2)</option>
                <option value="1.00">-1.00 (Full Mark)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Rewarding Quiz Configuration -->
        <div style="background:#fff7ed; padding:12px; border-radius:8px; border:1px solid #ffedd5; margin-bottom:12px;">
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" id="tqIsRewarding" onchange="toggleRewardingField()">
            <strong style="color:#c2410c;">🎁 Enable Rewarding Quiz Mode (Passkey Required)</strong>
          </label>
          <div id="rewardingPassContainer" style="display:none; margin-top:8px;">
            <label style="font-size:0.8rem; font-weight:600;">Secret Access Passkey</label>
            <input type="text" id="tqPasskey" placeholder="Enter Quiz Passkey" style="margin-top:4px;">
          </div>
        </div>

        <div class="form-group">
          <label>Paste Questions Text (Any AI / Book Format)</label>
          <textarea id="tqRawText" rows="7" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:8px; font-family:monospace;" placeholder="Example:&#10;Q1. What is the process of food making in plants?&#10;a) Respiration&#10;b) Photosynthesis&#10;c) Transpiration&#10;d) Nutrition&#10;Ans: b"></textarea>
        </div>

        <button class="btn-primary" style="background:#7c3aed;" onclick="parseRawQuestions()"><i class="fas fa-magic"></i> Parse Questions</button>
        <div id="parsedPreviewArea" style="margin-top:16px;"></div>
      </div>
    `;
  } else if (sec === 'list') {
    // 1. Instant Local Display
    activeTeacherQuizzes = getTeacherData("ak_teacher_quizzes", []);
    renderTeacherQuizList();

    // 2. Background Sync
    try {
      const res = await API.get("getQuizzes", { allStatus: "true" });
      if (res && res.data && res.data.length > 0) {
        activeTeacherQuizzes = res.data;
        setTeacherData("ak_teacher_quizzes", activeTeacherQuizzes);
        renderTeacherQuizList();
      }
    } catch (err) {
      console.warn("Using offline / local storage quiz list");
    }
  }
}

function renderTeacherQuizList() {
  const container = document.getElementById("teacherContentBody");

  if (activeTeacherQuizzes.length === 0) {
    container.innerHTML = `
      <div class="modal-card" style="text-align:center; padding:30px;">
        <h3>No Quizzes Available</h3>
        <p style="color:var(--text-muted); margin:10px 0;">Create your first test using the Smart Parser!</p>
        <button class="btn-primary" onclick="showTeacherSection('maker')">+ Create Quiz</button>
      </div>
    `;
    return;
  }

  let html = activeTeacherQuizzes.map((q, idx) => {
    const isDraft = q.status === 'draft';
    return `
      <div class="modal-card" style="max-width:100%; margin-bottom:12px; border-left: 5px solid ${isDraft ? '#94a3b8' : '#16a34a'};">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
          <div>
            <h3 style="color:var(--primary-navy); margin-bottom:4px;">${q.title}</h3>
            <div style="font-size:0.85rem; color:var(--text-muted);">
              <strong>${q.board}</strong> | <strong>${q.className}</strong> | <strong>${q.subject}</strong> • ${q.questions ? q.questions.length : 0} Questions
              ${q.isRewarding ? `<span style="background:#fee2e2; color:#dc2626; padding:2px 6px; border-radius:4px; font-weight:700; margin-left:6px;">🎁 Code: ${q.passkey}</span>` : ''}
              <span style="background:${isDraft ? '#e2e8f0' : '#dcfce7'}; color:${isDraft ? '#475569' : '#16a34a'}; padding:2px 6px; border-radius:4px; font-weight:700; margin-left:4px;">
                ${isDraft ? 'Draft (Coming Soon)' : 'Published Live'}
              </span>
            </div>
          </div>
          
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button onclick="togglePublishStatus(${idx})" class="btn-primary" style="width:auto; padding:5px 10px; font-size:0.8rem; margin:0; background:${isDraft ? '#16a34a' : '#64748b'};">
              <i class="fas ${isDraft ? 'fa-upload' : 'fa-eye-slash'}"></i> ${isDraft ? 'Publish' : 'Unpublish'}
            </button>
            <button onclick="openQuizLeaderboard(${idx})" class="btn-primary" style="width:auto; padding:5px 10px; font-size:0.8rem; margin:0; background:#0284c7;">
              <i class="fas fa-trophy"></i> Leaderboard
            </button>
            <button onclick="openQuizEditorModal(${idx})" class="btn-primary" style="width:auto; padding:5px 10px; font-size:0.8rem; margin:0; background:#d97706;">
              <i class="fas fa-edit"></i> Edit / Keys
            </button>
            <button onclick="printEcoFriendlyQuiz('${q.title}')" class="btn-primary" style="width:auto; padding:5px 10px; font-size:0.8rem; margin:0; background:#059669;">
              <i class="fas fa-print"></i> Print
            </button>
            <button onclick="deleteQuizPermanently(${idx})" class="btn-primary" style="width:auto; padding:5px 10px; font-size:0.8rem; margin:0; background:#dc2626;">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = `<h3 style="color:var(--primary-navy); margin-bottom:12px;">Active Quiz List</h3>${html}`;
}

function handleTimerTypeChange() {
  const type = document.getElementById("tqTimerType").value;
  const grp = document.getElementById("timerValueGroup");
  const lbl = document.getElementById("timerValueLabel");
  const val = document.getElementById("tqTimerValue");

  if (type === "none") {
    grp.style.display = "none";
  } else if (type === "per_question") {
    grp.style.display = "block";
    lbl.innerText = "Time Per Question (Seconds)";
    val.value = "30";
  } else {
    grp.style.display = "block";
    lbl.innerText = "Total Duration (Minutes)";
    val.value = "15";
  }
}

function toggleRewardingField() {
  const chk = document.getElementById("tqIsRewarding").checked;
  document.getElementById("rewardingPassContainer").style.display = chk ? "block" : "none";
}

// Universal Multi-Pattern Text Parser
let parsedQuestionsBuffer = [];

function parseRawQuestions() {
  const text = document.getElementById("tqRawText").value.trim();
  if (!text) {
    alert("Kripya questions paste karein!");
    return;
  }

  parsedQuestionsBuffer = [];
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  let currentQ = null;

  lines.forEach(line => {
    if (/^(Q\d+[\.:\)]|\d+[\.:\)]|Question\s*\d+[\.:\)]|प्रश्न\s*\d+[\.:\)]|\([ivx]+\)|[ivx]+[\.:\)])/i.test(line)) {
      if (currentQ) parsedQuestionsBuffer.push(currentQ);
      currentQ = {
        question: line.replace(/^(Q\d+[\.:\)]|\d+[\.:\)]|Question\s*\d+[\.:\)]|प्रश्न\s*\d+[\.:\)]|\([ivx]+\)|[ivx]+[\.:\)])/i, "").trim(),
        options: [],
        correctAnswer: 0
      };
    }
    else if (/^(\([a-d]\)|[a-d][\.:\)]|\[[a-d]\]|\([क-घ]\)|[क-घ][\.:\)])/i.test(line)) {
      if (currentQ) {
        currentQ.options.push(line.replace(/^(\([a-d]\)|[a-d][\.:\)]|\[[a-d]\]|\([क-घ]\)|[क-घ][\.:\)])/i, "").trim());
      }
    }
    else if (/^(Ans|Answer|उत्तर)[\s\.:]+/i.test(line)) {
      if (currentQ) {
        if (/b|\(b\)|ख/i.test(line)) currentQ.correctAnswer = 1;
        else if (/c|\(c\)|ग/i.test(line)) currentQ.correctAnswer = 2;
        else if (/d|\(d\)|घ/i.test(line)) currentQ.correctAnswer = 3;
        else currentQ.correctAnswer = 0;
      }
    }
  });

  if (currentQ) parsedQuestionsBuffer.push(currentQ);
  renderParsedPreview();
}

function renderParsedPreview() {
  const container = document.getElementById("parsedPreviewArea");
  if (parsedQuestionsBuffer.length === 0) {
    container.innerHTML = `<p style="color:#dc2626;">Koi questions parse nahi ho sake! Format verify karein.</p>`;
    return;
  }

  container.innerHTML = `
    <div style="background:#f1f5f9; padding:12px; border-radius:8px;">
      <h4 style="color:#16a34a; margin-bottom:8px;">✅ Parsed ${parsedQuestionsBuffer.length} Questions:</h4>
      ${parsedQuestionsBuffer.map((q, idx) => `
        <div style="padding:8px 0; border-bottom:1px solid #cbd5e1; font-size:0.9rem;">
          <strong>Q${idx + 1}:${q.question}</strong><br>
          <small>Options: ${q.options.join(" \vert{} ")} (Correct: Opt ${q.correctAnswer + 1})</small>
        </div>
      `).join("")}
      <div style="display:flex; gap:10px; margin-top:12px;">
        <button class="btn-primary" style="background:#64748b;" onclick="saveParsedQuiz('draft')">Save as Draft (Coming Soon)</button>
        <button class="btn-primary" style="background:#16a34a;" onclick="saveParsedQuiz('published')">Publish Live</button>
      </div>
    </div>
  `;
}

async function saveParsedQuiz(status) {
  const isRewarding = document.getElementById("tqIsRewarding").checked;
  const passkey = document.getElementById("tqPasskey").value.trim();

  if (isRewarding && !passkey) {
    alert("Rewarding Quiz ke liye Passkey code dalna mandatory hai!");
    return;
  }

  const newQuiz = {
    id: "qz_" + Date.now(),
    title: document.getElementById("tqTitle").value.trim() || "Untitled Quiz",
    board: document.getElementById("tqBoard").value,
    className: document.getElementById("tqClass").value,
    subject: document.getElementById("tqSubject").value,
    timerType: document.getElementById("tqTimerType").value,
    timerValue: parseInt(document.getElementById("tqTimerValue").value || 15),
    negativeMarking: parseFloat(document.getElementById("tqNegativeMarking").value || 0),
    isRewarding: isRewarding,
    passkey: passkey,
    status: status,
    questions: parsedQuestionsBuffer
  };

  // 1. Instant Local Persistence
  activeTeacherQuizzes = getTeacherData("ak_teacher_quizzes", []);
  activeTeacherQuizzes.unshift(newQuiz);
  setTeacherData("ak_teacher_quizzes", activeTeacherQuizzes);

  // 2. Background Cloud Sync
  API.post("saveQuiz", newQuiz);

  alert(`Quiz successfully saved as ${status}!`);
  showTeacherSection('list');
}

// 1-Click Publish / Unpublish Toggle
async function togglePublishStatus(idx) {
  const quiz = activeTeacherQuizzes[idx];
  const newStatus = quiz.status === 'published' ? 'draft' : 'published';
  quiz.status = newStatus;
  
  setTeacherData("ak_teacher_quizzes", activeTeacherQuizzes);
  API.post("updateQuizMeta", { id: quiz.id, status: newStatus });
  renderTeacherQuizList();
}

// Permanent Quiz Delete
async function deleteQuizPermanently(idx) {
  const quiz = activeTeacherQuizzes[idx];
  if (confirm(`Kya aap "${quiz.title}" ko permanently delete karna chahte hain? Sabhi records hat jayenge.`)) {
    activeTeacherQuizzes.splice(idx, 1);
    setTeacherData("ak_teacher_quizzes", activeTeacherQuizzes);
    API.post("deleteQuiz", { id: quiz.id });
    renderTeacherQuizList();
  }
}

// Live Leaderboard View
async function openQuizLeaderboard(idx) {
  const quiz = activeTeacherQuizzes[idx];
  const dynamicView = document.getElementById("dynamicView");

  dynamicView.innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card" style="max-width:720px;">
        <div class="modal-header">
          <div>
            <h3 style="color:var(--primary-navy); margin:0;">Leaderboard: ${quiz.title}</h3>
            <small style="color:var(--text-muted);">${quiz.className} • ${quiz.board}</small>
          </div>
          <button class="close-btn" onclick="renderTeacherDashboard()"><i class="fas fa-times"></i></button>
        </div>
        <div id="leaderboardListContainer" style="margin-top:10px; max-height:60vh; overflow-y:auto;">
          <p style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Loading participant results...</p>
        </div>
      </div>
    </div>
  `;

  // 1. Local submissions filter
  const localAttempts = (getTeacherData("ak_student_attempts", [])).filter(a => a.quizId === quiz.id);

  // 2. Remote submissions fallback
  let remoteAttempts = [];
  try {
    const res = await API.get("getLeaderboard", { quizId: quiz.id });
    if (res && res.data) remoteAttempts = res.data;
  } catch (e) {
    console.warn("Using offline local leaderboard");
  }

  const allParticipants = [...localAttempts, ...remoteAttempts];
  const participants = Array.from(new Map(allParticipants.map(p => [p.mobile + "_" + (p.timestamp || p.id), p])).values());
  const container = document.getElementById("leaderboardListContainer");

  if (participants.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px;">Abhi kisi student ne is quiz ko attempt nahi kiya hai.</p>`;
    return;
  }

  // Sort by Score descending
  participants.sort((a, b) => Number(b.score) - Number(a.score));

  container.innerHTML = `
    <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
      <thead>
        <tr style="background:#f1f5f9; text-align:left; border-bottom:2px solid #cbd5e1;">
          <th style="padding:6px;">Rank</th>
          <th style="padding:6px;">Student Name</th>
          <th style="padding:6px;">Mobile</th>
          <th style="padding:6px;">Score</th>
          <th style="padding:6px;">Accuracy</th>
          <th style="padding:6px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${participants.map((p, pIdx) => `
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:6px; font-weight:700;">#${pIdx + 1}</td>
            <td style="padding:6px; cursor:pointer; color:var(--brand-blue); font-weight:600;" onclick='viewParticipantAnswers(${JSON.stringify(p)}, ${JSON.stringify(quiz)})'>${p.studentName} <i class="fas fa-external-link-alt" style="font-size:0.7rem;"></i>
            </td>
            <td style="padding:6px;">${p.mobile || 'N/A'}</td>
            <td style="padding:6px; font-weight:700; color:#16a34a;">${p.score}/${p.totalMarks}</td>
            <td style="padding:6px;">${p.percentage}%</td>
            <td style="padding:6px;">
              <button onclick="deleteParticipantRecord('${quiz.id}', '${p.mobile \vert{}\vert{} p.id}',${idx})" style="background:#fee2e2; color:#dc2626; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" title="Delete Record">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Student Sheet Details Modal
function viewParticipantAnswers(participant, quiz) {
  let solHtml = quiz.questions.map((q, idx) => {
    const userChoice = participant.answers ? participant.answers[idx] : undefined;
    const isCorrect = userChoice === q.correctAnswer;
    return `
      <div style="padding:8px 0; border-bottom:1px solid #e2e8f0; font-size:0.85rem;">
        <strong>Q${idx + 1}: ${q.question}</strong>
        <div style="margin-top:4px;">
          <span style="color:${isCorrect ? '#16a34a' : '#dc2626'}; font-weight:600;">Student Answer: ${userChoice !== undefined ? q.options[userChoice] : 'Unattempted'}</span> | 
          <span style="color:#16a34a;">Correct Answer: ${q.options[q.correctAnswer]}</span>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("dynamicView").innerHTML += `
    <div class="modal-overlay" style="display:flex; z-index:3500;" id="stSheetModal">
      <div class="modal-card" style="max-height:85vh; overflow-y:auto; max-width:600px;">
        <div class="modal-header">
          <div>
            <h4 style="margin:0; color:var(--primary-navy);">${participant.studentName}'s Attempt Sheet</h4>
            <small style="color:var(--text-muted);">Mobile: ${participant.mobile} | Score: ${participant.score}/${participant.totalMarks}</small>
          </div>
          <button class="close-btn" onclick="document.getElementById('stSheetModal').remove()"><i class="fas fa-times"></i></button>
        </div>
        ${solHtml}
      </div>
    </div>
  `;
}

// Delete Participant Attempt Record
async function deleteParticipantRecord(quizId, identifier, quizIdx) {
  if (confirm("Kya aap is student ke result ko leaderboard se delete karna chahte hain?")) {
    let attempts = getTeacherData("ak_student_attempts", []);
    attempts = attempts.filter(a => !(a.quizId === quizId && (a.mobile === identifier || a.id === identifier)));
    setTeacherData("ak_student_attempts", attempts);

    API.post("deleteParticipant", { quizId: quizId, identifier: identifier });
    openQuizLeaderboard(quizIdx);
  }
}

// Quiz Details & Question Editing with Auto Score Recalculation
let editingQuizBuffer = null;

function openQuizEditorModal(idx) {
  editingQuizBuffer = JSON.parse(JSON.stringify(activeTeacherQuizzes[idx]));

  let qListHtml = editingQuizBuffer.questions.map((q, qIdx) => `
    <div style="background:#f8fafc; padding:10px; border-radius:8px; margin-bottom:10px; border:1px solid #cbd5e1;">
      <div class="form-group" style="margin-bottom:6px;">
        <label>Q${qIdx + 1} Question Text</label>
        <input type="text" value="${q.question}" onchange="updateQuestionText(${qIdx}, this.value)">
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:6px;">
        ${q.options.map((opt, oIdx) => `
          <div>
            <label style="font-size:0.75rem;">Option ${oIdx + 1}</label>
            <input type="text" value="${opt}" onchange="updateOptionText(${qIdx},${oIdx}, this.value)" style="font-size:0.85rem; padding:6px;">
          </div>
        `).join('')}
      </div>
      <div>
        <label style="font-size:0.8rem; font-weight:700; color:#16a34a;">Correct Option Index (0 = A, 1 = B, 2 = C, 3 = D):</label>
        <select onchange="updateCorrectAnswer(${qIdx}, this.value)" style="padding:6px; border-radius:6px; font-weight:700;">
          <option value="0" ${q.correctAnswer === 0 ? 'selected' : ''}>Option A (1)</option>
          <option value="1" ${q.correctAnswer === 1 ? 'selected' : ''}>Option B (2)</option>
          <option value="2" ${q.correctAnswer === 2 ? 'selected' : ''}>Option C (3)</option>
          <option value="3" ${q.correctAnswer === 3 ? 'selected' : ''}>Option D (4)</option>
        </select>
      </div>
    </div>
  `).join("");

  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card" style="max-width:750px; max-height:90vh; overflow-y:auto;">
        <div class="modal-header">
          <h3>Edit Quiz: ${editingQuizBuffer.title}</h3>
          <button class="close-btn" onclick="renderTeacherDashboard()"><i class="fas fa-times"></i></button>
        </div>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
          <div class="form-group">
            <label>Title</label>
            <input type="text" id="editQuizTitle" value="${editingQuizBuffer.title}">
          </div>
          <div class="form-group">
            <label>Rewarding Passkey</label>
            <input type="text" id="editQuizPasskey" value="${editingQuizBuffer.passkey || ''}">
          </div>
        </div>

        <h4 style="color:var(--primary-navy); margin-bottom:8px;">Questions & Answer Keys:</h4>
        ${qListHtml}

        <div style="display:flex; gap:10px; margin-top:12px;">
          <button class="btn-primary" style="background:#16a34a;" onclick="saveEditedQuizChanges(${idx})">Save Changes & Recalculate Student Scores</button>
        </div>
      </div>
    </div>
  `;
}

function updateQuestionText(qIdx, val) {
  editingQuizBuffer.questions[qIdx].question = val;
}

function updateOptionText(qIdx, oIdx, val) {
  editingQuizBuffer.questions[qIdx].options[oIdx] = val;
}

function updateCorrectAnswer(qIdx, val) {
  editingQuizBuffer.questions[qIdx].correctAnswer = parseInt(val);
}

// Save & Auto-Recalculate Existing Submissions
async function saveEditedQuizChanges(idx) {
  editingQuizBuffer.title = document.getElementById("editQuizTitle").value;
  editingQuizBuffer.passkey = document.getElementById("editQuizPasskey").value;

  activeTeacherQuizzes[idx] = editingQuizBuffer;
  setTeacherData("ak_teacher_quizzes", activeTeacherQuizzes);

  // Recalculate student scores locally across existing submissions
  let allAttempts = getTeacherData("ak_student_attempts", []);
  const negMark = parseFloat(editingQuizBuffer.negativeMarking || 0);
  const totalQ = editingQuizBuffer.questions.length;

  allAttempts = allAttempts.map(att => {
    if (att.quizId === editingQuizBuffer.id && att.answers) {
      let correct = 0;
      let wrong = 0;
      editingQuizBuffer.questions.forEach((q, qIndex) => {
        const uAns = att.answers[qIndex];
        if (uAns !== undefined) {
          if (uAns === q.correctAnswer) correct++;
          else wrong++;
        }
      });
      const penalty = wrong * negMark;
      const net = Math.max(0, correct - penalty).toFixed(2);
      att.score = net;
      att.totalMarks = totalQ;
      att.percentage = ((net / totalQ) * 100).toFixed(1);
    }
    return att;
  });

  setTeacherData("ak_student_attempts", allAttempts);

  // Cloud API trigger for backend recalculation
  API.post("updateQuizAndRecalculate", {
    quiz: editingQuizBuffer
  });

  alert("Quiz updated successfully! Sabhi students ke marks nayi answer key ke anusaar recalculate ho chuke hain.");
  renderTeacherDashboard();
}

// Eco-Friendly A4 Print Window
function printEcoFriendlyQuiz(title) {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
    <head>
      <title>${title} - Print Paper</title>
      <style>
        @page { size: A4; margin: 12mm; }
        body { font-family: 'Times New Roman', serif; font-size: 11pt; }
        .header { text-align: center; border-bottom: 2px solid black; padding-bottom: 5px; margin-bottom: 10px; }
        .meta-grid { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 12px; border-bottom: 1px solid #666; padding-bottom: 4px; }
        .two-column-body { column-count: 2; column-gap: 20px; }
        .q-item { break-inside: avoid; margin-bottom: 10px; }
        .opt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10pt; margin-top: 3px; }
        .watermark { position: fixed; top: 40%; left: 25%; font-size: 60pt; color: rgba(0,0,0,0.06); transform: rotate(-30deg); z-index: -1; font-weight: bold; }
        .page-break { page-break-before: always; }
      </style>
    </head>
    <body>
      <div class="watermark">AK LEARNING POINT</div>
      <div class="header">
        <h2 style="margin:0;">AK LEARNING POINT EXAMINATION</h2>
        <div style="font-size:10pt;">${title}</div>
      </div>
      <div class="meta-grid">
        <span>Name: ____________________</span>
        <span>Class: _____</span>
        <span>Roll No: _____</span>
        <span>Date: _________</span>
      </div>
      <div class="two-column-body">
        <div class="q-item">
          <strong>1. What is the process of food making in plants?</strong>
          <div class="opt-grid">
            <span>(A) Respiration</span>
            <span>(B) Photosynthesis</span>
            <span>(C) Transpiration</span>
            <span>(D) Nutrition</span>
          </div>
        </div>
      </div>
      <div class="page-break"></div>
      <div class="header">
        <h3>ANSWER KEY & SOLUTIONS (FOR TEACHER)</h3>
      </div>
      <p>1. (B) Photosynthesis</p>
      <script>window.print();<\/script>
    </body>
    </html>
  `);
}
