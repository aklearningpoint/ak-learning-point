// Teacher Portal: Universal Multi-Format Parser, Quiz Maker (Timer & Negative Marking) & Eco-Friendly Print

function openTeacherPortal() {
  toggleDrawer();
  const enteredPass = prompt("Enter Teacher Access Password (Default: pass):");
  if (enteredPass === "pass") {
    renderTeacherDashboard();
  } else if (enteredPass !== null) {
    alert("Incorrect Teacher Password!");
  }
}

function renderTeacherDashboard() {
  document.getElementById("dynamicView").innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:#f8fafc; z-index:3000; display:flex; flex-direction:column;">
      
      <!-- Teacher Top Nav -->
      <div style="height:55px; background:var(--primary-navy); color:white; display:flex; align-items:center; justify-content:space-between; padding:0 16px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <i class="fas fa-chalkboard-teacher" style="color:var(--brand-gold);"></i>
          <strong>Teacher Portal</strong>
        </div>
        <button onclick="closeDynamicView()" style="background:none; border:none; color:white; font-size:1.3rem; cursor:pointer;"><i class="fas fa-times"></i></button>
      </div>

      <!-- Teacher Navigation -->
      <div style="background:white; border-bottom:1px solid var(--border-color); display:flex; padding:8px 12px; gap:8px;">
        <button class="btn-primary" style="width:auto; padding:6px 14px; font-size:0.85rem; margin:0;" onclick="showTeacherSection('maker')">+ Create Quiz (Smart Parser)</button>
        <button class="btn-primary" style="width:auto; padding:6px 14px; font-size:0.85rem; margin:0; background:#0284c7;" onclick="showTeacherSection('list')">Quiz List & Print</button>
      </div>

      <!-- Teacher Content Body -->
      <div id="teacherContentBody" style="flex:1; overflow-y:auto; padding:16px; max-width:800px; margin:0 auto; width:100%;">
        <!-- Dynamic Screen -->
      </div>

    </div>
  `;
  showTeacherSection('maker');
}

function showTeacherSection(sec) {
  const container = document.getElementById("teacherContentBody");

  if (sec === 'maker') {
    container.innerHTML = `
      <div class="modal-card" style="max-width:100%;">
        <h3 style="color:var(--primary-navy); margin-bottom:12px;">Smart Quiz Maker & Parser</h3>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="form-group">
            <label>Quiz Title / Chapter Name</label>
            <input type="text" id="tqTitle" placeholder="e.g. Chapter 3: Atmosphere" required>
          </div>
          <div class="form-group">
            <label>Board</label>
            <select id="tqBoard">
              <option value="CBSE">CBSE</option>
              <option value="BSEB">BSEB (Bihar Board)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Class</label>
            <select id="tqClass">
              <option value="Class 10">Class 10</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 12">Class 12</option>
              <option value="Play">Play</option>
              <option value="Nur">Nursery</option>
              <option value="LKG">LKG</option>
              <option value="UKG">UKG</option>
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
            </select>
          </div>
        </div>

        <!-- NEW: Timer Mode & Negative Marking Settings -->
        <div style="background:#f1f5f9; padding:12px; border-radius:8px; margin:12px 0; border:1px solid #cbd5e1;">
          <h4 style="color:var(--primary-navy); margin-bottom:10px; font-size:0.95rem;"><i class="fas fa-stopwatch" style="color:#d97706;"></i> Exam Rules & Timer Configuration</h4>
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
                <option value="0">No Negative Marking (0)</option>
                <option value="0.25">-0.25 (1/4th Mark)</option>
                <option value="0.33">-0.33 (1/3rd Mark)</option>
                <option value="0.50">-0.50 (1/2 Mark)</option>
                <option value="1.00">-1.00 (Full Mark)</option>
              </select>
            </div>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:15px; margin:10px 0;">
          <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
            <input type="checkbox" id="tqIsRewarding" onchange="toggleRewardingField()"> <strong>🎁 Mark as Rewarding Quiz</strong>
          </label>
          <input type="text" id="tqPasskey" placeholder="Enter Quiz Passkey" style="display:none; padding:6px; border:1px solid #cbd5e1; border-radius:6px;">
        </div>

        <div class="form-group">
          <label>Paste Questions Text (Any AI / Book Format)</label>
          <textarea id="tqRawText" rows="7" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:8px; font-family:monospace;" placeholder="Example Format:&#10;Q1. What is the capital of India?&#10;a) Mumbai&#10;b) New Delhi&#10;c) Kolkata&#10;d) Chennai&#10;Ans: b"></textarea>
        </div>

        <div style="display:flex; gap:10px;">
          <button class="btn-primary" style="background:#7c3aed;" onclick="parseRawQuestions()"><i class="fas fa-magic"></i> Parse Questions</button>
        </div>

        <div id="parsedPreviewArea" style="margin-top:16px;"></div>
      </div>
    `;
  } else if (sec === 'list') {
    container.innerHTML = `
      <div class="modal-card" style="max-width:100%;">
        <h3 style="color:var(--primary-navy); margin-bottom:12px;">Active Quizzes & Print Center</h3>
        <div class="section-card" style="margin-bottom:10px;">
          <div style="flex:1;">
            <h4>Sample Class 10 Science Quiz</h4>
            <small style="color:var(--text-muted);">10 Questions • CBSE</small>
            <div style="margin-top:8px; display:flex; gap:8px;">
              <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.8rem; margin:0; background:#059669;" onclick="printEcoFriendlyQuiz('Class 10 Science Quiz')">
                <i class="fas fa-print"></i> Eco-Friendly A4 Print
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
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
  document.getElementById("tqPasskey").style.display = chk ? "inline-block" : "none";
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
    // Detect question start: Q1., 1., 1), Question 1:, प्रश्न 1.
    if (/^(Q\d+[\.:\)]|\d+[\.:\)]|Question\s*\d+[\.:\)]|प्रश्न\s*\d+[\.:\)]|\([ivx]+\)|[ivx]+[\.:\)])/i.test(line)) {
      if (currentQ) parsedQuestionsBuffer.push(currentQ);
      currentQ = {
        question: line.replace(/^(Q\d+[\.:\)]|\d+[\.:\)]|Question\s*\d+[\.:\)]|प्रश्न\s*\d+[\.:\)]|\([ivx]+\)|[ivx]+[\.:\)])/i, "").trim(),
        options: [],
        correctAnswer: 0
      };
    }
    // Detect options: a), (a), [a], A., (क), (ख)
    else if (/^(\([a-d]\)|[a-d][\.:\)]|\[[a-d]\]|\([क-घ]\)|[क-घ][\.:\)])/i.test(line)) {
      if (currentQ) {
        currentQ.options.push(line.replace(/^(\([a-d]\)|[a-d][\.:\)]|\[[a-d]\]|\([क-घ]\)|[क-घ][\.:\)])/i, "").trim());
      }
    }
    // Detect answer line: Ans: b, Answer: (b), उत्तर: ख
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
    container.innerHTML = `<p style="color:#dc2626;">Koi questions parse nahi ho sake! Check format.</p>`;
    return;
  }

  container.innerHTML = `
    <div style="background:#f1f5f9; padding:12px; border-radius:8px;">
      <h4 style="color:#16a34a; margin-bottom:8px;">✅ Successfully Parsed ${parsedQuestionsBuffer.length} Questions:</h4>
      ${parsedQuestionsBuffer.map((q, idx) => `
        <div style="padding:8px 0; border-bottom:1px solid #cbd5e1; font-size:0.9rem;">
          <strong>Q${idx + 1}:${q.question}</strong><br>
          <small>Options: ${q.options.join(" \vert{} ")} (Correct: Opt ${q.correctAnswer + 1})</small>
        </div>
      `).join("")}
      <div style="display:flex; gap:10px; margin-top:12px;">
        <button class="btn-primary" style="background:#0284c7;" onclick="saveParsedQuiz('draft')">Save as Draft (Upcoming)</button>
        <button class="btn-primary" style="background:#16a34a;" onclick="saveParsedQuiz('published')">Publish Live Now</button>
      </div>
    </div>
  `;
}

async function saveParsedQuiz(status) {
  const payload = {
    title: document.getElementById("tqTitle").value || "Untitled Quiz",
    board: document.getElementById("tqBoard").value,
    className: document.getElementById("tqClass").value,
    subject: document.getElementById("tqSubject").value,
    timerType: document.getElementById("tqTimerType").value,
    timerValue: parseInt(document.getElementById("tqTimerValue") ? document.getElementById("tqTimerValue").value : 0),
    negativeMarking: parseFloat(document.getElementById("tqNegativeMarking").value),
    isRewarding: document.getElementById("tqIsRewarding").checked,
    passkey: document.getElementById("tqPasskey").value,
    status: status,
    questions: parsedQuestionsBuffer
  };

  await API.post("saveQuiz", payload);
  alert(`Quiz successfully saved as ${status} with customized timer & negative marking!`);
  showTeacherSection('list');
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
