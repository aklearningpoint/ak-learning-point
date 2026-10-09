// Quiz Flow, Board-Class Selection, Test Engine & Scorecard

let selectedBoard = "";
let selectedClass = "";
let selectedSubject = "";
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = {};
let quizTimerInterval = null;
let remainingSeconds = 0;

// Step 1: Open Board Selection Modal (CBSE vs BSEB)
function openBoardSelectModal() {
  const dynamicView = document.getElementById("dynamicView");
  dynamicView.innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card" style="text-align:center;">
        <div class="modal-header">
          <h3>Choose Your Board</h3>
          <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
        </div>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:15px;">Apna Board chuniye aur test shuru kijiye:</p>
        <div style="display:flex; gap:12px; justify-content:center;">
          <button class="btn-primary" style="background:#1e50b4;" onclick="selectBoard('CBSE')">CBSE Board</button>
          <button class="btn-primary" style="background:#d97706;" onclick="selectBoard('BSEB')">BSEB (Bihar Board)</button>
        </div>
      </div>
    </div>
  `;
}

function closeDynamicView() {
  document.getElementById("dynamicView").innerHTML = "";
}

// Step 2: Show Class Cards (CBSE: Play to 12th | BSEB: Class 1 to 12th)
function selectBoard(board) {
  selectedBoard = board;
  let classes = [];

  if (board === "CBSE") {
    classes = ["Play", "Nur", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 12"];
  } else {
    classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 12"];
  }

  let classHtml = classes.map(c => {
    // Visual indicators
    let icon = "fa-graduation-cap";
    let isPrePrimary = ["Play", "Nur", "LKG", "UKG"].includes(c);
    if (isPrePrimary) icon = "fa-shapes fa-bounce";
    
    return `
      <div class="section-card" style="margin-bottom:8px;" onclick="selectClass('${c}')">
        <div class="section-left">
          <div class="section-icon" style="background:${isPrePrimary ? '#fce7f3' : '#e0f2fe'}; color:${isPrePrimary ? '#ec4899' : '#0284c7'};">
            <i class="fas ${icon}"></i>
          </div>
          <div class="section-info">
            <h3>${c}</h3>
            <p>${isPrePrimary ? 'Animated Visual Learning' : 'Academic Standard Test'}</p>
          </div>
        </div>
        <i class="fas fa-chevron-right text-muted"></i>
      </div>
    `;
  }).join("");

  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card">
        <div class="modal-header">
          <h3>${board} - Select Class</h3>
          <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
        </div>
        <div style="max-height:60vh; overflow-y:auto;">
          ${classHtml}
        </div>
      </div>
    </div>
  `;
}

// Step 3: Show Subject Cards
function selectClass(className) {
  selectedClass = className;
  let subjects = [];

  if (className === "Class 12") {
    subjects = ["Hindi", "English", "Urdu", "History", "Civics", "Geography", "Economics", "Home Science"];
  } else {
    subjects = ["Hindi", "English", "Math", "Science", "S.St", "G.K", "Computer"];
  }

  let subHtml = subjects.map(s => `
    <div class="section-card" style="margin-bottom:8px;" onclick="loadQuizListing('${s}')">
      <div class="section-left">
        <div class="section-icon"><i class="fas fa-book"></i></div>
        <div class="section-info">
          <h3>${s}</h3>
          <p>Explore Tests</p>
        </div>
      </div>
      <i class="fas fa-chevron-right text-muted"></i>
    </div>
  `).join("");

  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card">
        <div class="modal-header">
          <h3>${selectedBoard} - ${className} Subjects</h3>
          <button class="close-btn" onclick="selectBoard('${selectedBoard}')"><i class="fas fa-arrow-left"></i></button>
        </div>
        <div style="max-height:60vh; overflow-y:auto;">
          ${subHtml}
        </div>
      </div>
    </div>
  `;
}

// Step 4: Load Quiz Listing (New to Old Filter)
async function loadQuizListing(subject) {
  selectedSubject = subject;
  const dynamicView = document.getElementById("dynamicView");
  dynamicView.innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card" style="text-align:center;">
        <i class="fas fa-spinner fa-spin fa-2x" style="color:var(--brand-blue);"></i>
        <p style="margin-top:10px;">Loading quizzes...</p>
      </div>
    </div>
  `;

  const res = await API.get("getQuizzes", {
    board: selectedBoard,
    className: selectedClass,
    subject: selectedSubject
  });

  const quizzes = res.data || [];

  if (quizzes.length === 0) {
    dynamicView.innerHTML = `
      <div class="modal-overlay" style="display:flex;">
        <div class="modal-card" style="text-align:center;">
          <div class="modal-header">
            <h3>${subject} Quizzes</h3>
            <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
          </div>
          <p style="margin:20px 0; color:var(--text-muted);">Abhi is subject me koi live quiz nahi hai. Jaldi hi upload hoga!</p>
          <button class="btn-primary" onclick="selectClass('${selectedClass}')">Back</button>
        </div>
      </div>
    `;
    return;
  }

  let listHtml = quizzes.map(q => {
    let isDraft = q.status === "draft";
    return `
      <div class="section-card" style="margin-bottom:12px; ${isDraft ? 'opacity:0.6;' : ''}">
        <div style="flex:1;">
          <h3 style="font-size:1rem; color:var(--primary-navy);">${q.title}</h3>
          <small style="color:var(--text-muted);">${q.questions ? q.questions.length : 0} Questions ${q.isRewarding ? '• 🎁 Rewarding' : ''}</small>
          ${isDraft ? '<span style="display:inline-block; font-size:0.75rem; background:#cbd5e1; padding:2px 6px; border-radius:4px; margin-left:6px;">Upcoming</span>' : ''}
          
          <div style="margin-top:8px; display:flex; gap:8px;">
            ${!isDraft ? `<button class="btn-primary" style="padding:6px 12px; font-size:0.85rem; width:auto; margin:0;" onclick='openQuizEntryModal(${JSON.stringify(q)})'>Start Test</button>` : ''}
            <button onclick="shareQuizWhatsApp('${q.title}')" style="background:#25d366; color:white; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;"><i class="fab fa-whatsapp"></i></button>
            <button onclick="copyQuizLink('${q.id}')" style="background:#64748b; color:white; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;"><i class="fas fa-copy"></i></button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  dynamicView.innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card">
        <div class="modal-header">
          <h3>${subject} Quizzes</h3>
          <button class="close-btn" onclick="selectClass('${selectedClass}')"><i class="fas fa-arrow-left"></i></button>
        </div>
        <div style="max-height:60vh; overflow-y:auto;">
          ${listHtml}
        </div>
      </div>
    </div>
  `;
}

// Sharing Helpers
function shareQuizWhatsApp(title) {
  const text = encodeURIComponent(
    `🎯 *AK Learning Point Quiz Challenge!*\n` +
    `Topic: ${title}\n` +
    `Class: ${selectedClass} (${selectedBoard})\n\n` +
    `"Gyan ki nayi shuruat, har vidyarthi ke vikas ke saath!"\n` +
    `Attempt this test online & verify answers:\n${window.location.href}\n\n` +
    `Official Community Join: https://chat.whatsapp.com/CXwYDb3tRIZ8gSsDuQey0I?s=cl&p=a&mlu=4&ilr=4`
  );
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

function copyQuizLink(quizId) {
  navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?quizId=${quizId}`);
  alert("Quiz link copied to clipboard!");
}

// Step 5: Quiz Entry Modal (Student Mode vs Teacher Test Mode)
function openQuizEntryModal(quiz) {
  currentQuiz = quiz;
  const isRewarding = quiz.isRewarding;

  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Start: ${quiz.title}</h3>
          <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
        </div>
        
        <form onsubmit="handleStartQuiz(event)">
          <div class="form-group">
            <label>Student Name</label>
            <input type="text" id="qzStudentName" required placeholder="Aapka pura naam">
          </div>
          <div class="form-group">
            <label>WhatsApp Number</label>
            <input type="tel" id="qzMobile" required pattern="[0-9]{10}" placeholder="10-digit number">
          </div>
          ${isRewarding ? `
            <div class="form-group">
              <label>🎁 Rewarding Passkey / Code</label>
              <input type="text" id="qzPasskey" required placeholder="Enter passkey given by teacher">
            </div>
          ` : ''}
          <button type="submit" class="btn-primary">Enter Fullscreen Test</button>
        </form>

        <hr style="margin:16px 0; border:none; border-top:1px solid var(--border-color);">

        <!-- Teacher Test Mode Override -->
        <div style="text-align:center;">
          <button type="button" onclick="teacherTestModeLogin()" style="background:none; border:none; color:var(--brand-blue); font-weight:600; cursor:pointer;">
            <i class="fas fa-key"></i> Teacher Test Mode
          </button>
        </div>
      </div>
    </div>
  `;
}

function teacherTestModeLogin() {
  const pass = prompt("Enter Teacher Access Password:");
  if (pass === "pass") { // Default teacher password
    document.getElementById("qzStudentName").value = "Teacher Test Account";
    document.getElementById("qzMobile").value = "9999999999";
    startActualExam();
  } else if (pass !== null) {
    alert("Incorrect teacher password!");
  }
}

function handleStartQuiz(e) {
  e.preventDefault();
  const name = document.getElementById("qzStudentName").value;
  const mob = document.getElementById("qzMobile").value;

  if (currentQuiz.isRewarding) {
    const inputKey = document.getElementById("qzPasskey").value;
    if (inputKey !== currentQuiz.passkey) {
      alert("Invalid Rewarding Quiz Passkey! Kripya sahi code dalein.");
      return;
    }
  }

  currentQuiz.participantName = name;
  currentQuiz.participantMobile = mob;
  startActualExam();
}

// Step 6: Fullscreen Exam Engine
function startActualExam() {
  currentQuestionIndex = 0;
  userAnswers = {};

  // Activate Anti-Cheat Engine
  SecurityShield.activate(() => {
    submitQuizNow(true); // Auto submit on violation
  });

  remainingSeconds = (currentQuiz.totalTimer || 15) * 60;
  renderExamScreen();

  clearInterval(quizTimerInterval);
  quizTimerInterval = setInterval(() => {
    remainingSeconds--;
    const tEl = document.getElementById("quizTimerDisplay");
    if (tEl) {
      const mins = Math.floor(remainingSeconds / 60);
      const secs = remainingSeconds % 60;
      tEl.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    if (remainingSeconds <= 0) {
      clearInterval(quizTimerInterval);
      alert("Time Up! Test submit ho raha hai.");
      submitQuizNow(false);
    }
  }, 1000);
}

function renderExamScreen() {
  const q = currentQuiz.questions[currentQuestionIndex];
  const totalQ = currentQuiz.questions.length;

  document.getElementById("dynamicView").innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:white; z-index:3000; display:flex; flex-direction:column;">
      
      <!-- Exam Header -->
      <div style="height:55px; background:var(--primary-navy); color:white; display:flex; align-items:center; justify-content:space-between; padding:0 16px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <strong style="color:var(--brand-gold);">${currentQuiz.title}</strong>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="background:rgba(255,255,255,0.15); padding:4px 8px; border-radius:4px; font-weight:700;">
            ⏳ <span id="quizTimerDisplay">--:--</span>
          </span>
          <button onclick="submitQuizNow(false)" style="background:#dc2626; color:white; border:none; padding:6px 12px; border-radius:6px; font-weight:600; cursor:pointer;">Submit</button>
        </div>
      </div>

      <!-- Question Body -->
      <div style="flex:1; overflow-y:auto; padding:20px; max-width:700px; margin:0 auto; width:100%;">
        <div style="margin-bottom:15px; font-weight:700; color:var(--text-muted);">
          Question ${currentQuestionIndex + 1} of ${totalQ}
        </div>

        <h3 style="font-size:1.15rem; margin-bottom:15px; color:var(--text-dark);">${q.question}</h3>
        
        ${q.imageUrl ? `<img src="${q.imageUrl}" style="max-width:100%; max-height:220px; border-radius:8px; margin-bottom:15px; display:block;">` : ''}

        <!-- Options List -->
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${q.options.map((opt, oIdx) => {
            const isChecked = userAnswers[currentQuestionIndex] === oIdx;
            return `
              <div onclick="selectQuizOption(${oIdx})" style="padding:12px 14px; border:2px solid ${isChecked ? 'var(--brand-blue)' : 'var(--border-color)'}; background:${isChecked ? '#eff6ff' : 'white'}; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:10px;">
                <input type="radio" name="optRadio" ${isChecked ? 'checked' : ''} style="cursor:pointer;">
                <span>${opt}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Exam Bottom Navigation -->
      <div style="height:60px; border-top:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; padding:0 16px;">
        <button class="btn-primary" style="width:auto; background:#64748b;" ${currentQuestionIndex === 0 ? 'disabled style="opacity:0.5;"' : ''} onclick="prevQuestion()">Previous</button>
        ${currentQuestionIndex === totalQ - 1 
          ? `<button class="btn-primary" style="width:auto; background:#16a34a;" onclick="submitQuizNow(false)">Finish & Submit</button>`
          : `<button class="btn-primary" style="width:auto;" onclick="nextQuestion()">Next</button>`
        }
      </div>

    </div>
  `;
}

function selectQuizOption(optIndex) {
  userAnswers[currentQuestionIndex] = optIndex;
  renderExamScreen();
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderExamScreen();
  }
}

function nextQuestion() {
  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    currentQuestionIndex++;
    renderExamScreen();
  }
}

// Step 7: Submit Quiz & Show Instant Scorecard
function submitQuizNow(isAutoSubmit = false) {
  clearInterval(quizTimerInterval);
  SecurityShield.deactivate();

  // Evaluate marks
  let score = 0;
  const totalQ = currentQuiz.questions.length;
  currentQuiz.questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctAnswer) {
      score++;
    }
  });

  const pct = ((score / totalQ) * 100).toFixed(1);

  // Send attempt to Google Sheet
  API.post("submitQuizAttempt", {
    quizId: currentQuiz.id,
    quizTitle: currentQuiz.title,
    studentName: currentQuiz.participantName || "Anonymous",
    mobile: currentQuiz.participantMobile || "",
    score: score,
    totalMarks: totalQ,
    percentage: pct,
    accuracy: `${pct}%`,
    answers: userAnswers
  });

  // Render Scorecard Presentation View
  renderScorecardView(score, totalQ, pct, isAutoSubmit);
}

function renderScorecardView(score, totalMarks, pct, isAutoSubmit) {
  let appreciation = "Shandar Prayas! Rozana abhyas karte rahein.";
  if (pct >= 80) appreciation = "🌟 Adbhut Pradarshan! Aap ek champion hain!";
  else if (pct >= 50) appreciation = "👍 Bahut Acha! Agli baar 90% ka target rakhein!";

  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card" style="text-align:center; max-width:480px;">
        <div class="modal-header">
          <h3>Test Result & Scorecard</h3>
          <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
        </div>

        <div style="background:var(--primary-navy); color:white; padding:20px; border-radius:12px; margin-bottom:15px;">
          <h2 style="color:var(--brand-gold); margin-bottom:4px;">AK Learning Point</h2>
          <p style="font-size:0.85rem; opacity:0.8;">Performance Certificate</p>
          <hr style="border:none; border-top:1px solid rgba(255,255,255,0.2); margin:12px 0;">
          <div style="font-size:2.2rem; font-weight:800; color:#4ade80;">${score} / ${totalMarks}</div>
          <div style="font-size:1rem; font-weight:600; margin-top:4px;">Accuracy: ${pct}%</div>
          <p style="font-style:italic; font-size:0.9rem; margin-top:10px; color:#e2e8f0;">"${appreciation}"</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          <button class="btn-primary" style="background:#25d366;" onclick="shareResultWhatsApp('${score}', '${totalMarks}', '${pct}')">
            <i class="fab fa-whatsapp"></i> Share Result on WhatsApp
          </button>
          <button class="btn-primary" style="background:#1e50b4;" onclick="openSolutionVerification()">
            <i class="fas fa-check-circle"></i> Verify Answers & Solutions
          </button>
          <button class="btn-primary" style="background:#64748b;" onclick="closeDynamicView()">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  `;
}

function shareResultWhatsApp(score, total, pct) {
  const text = encodeURIComponent(
    `🏆 *AK Learning Point Quiz Scorecard!*\n` +
    `Topic: ${currentQuiz.title}\n` +
    `Score: ${score}/${total} (${pct}% Accuracy)\n\n` +
    `"Gyan ki nayi shuruat, har vidyarthi ke vikas ke saath!"\n` +
    `Attempt online tests here:\n${window.location.href}\n\n` +
    `Join Community: https://chat.whatsapp.com/CXwYDb3tRIZ8gSsDuQey0I?s=cl&p=a&mlu=4&ilr=4`
  );
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

// Step 8: Solution Verification View
function openSolutionVerification() {
  let solHtml = currentQuiz.questions.map((q, idx) => {
    const userChoice = userAnswers[idx];
    const isCorrect = userChoice === q.correctAnswer;
    return `
      <div style="padding:12px; border-bottom:1px solid var(--border-color); text-align:left;">
        <strong>Q${idx + 1}: ${q.question}</strong>
        <div style="margin-top:6px; font-size:0.9rem;">
          <p style="color:${isCorrect ? '#16a34a' : '#dc2626'};">Aapka Answer: ${userChoice !== undefined ? q.options[userChoice] : 'Not Attempted'}</p>
          <p style="color:#16a34a; font-weight:600;">Sahi Answer: ${q.options[q.correctAnswer]}</p>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card" style="max-height:85vh; overflow-y:auto;">
        <div class="modal-header">
          <h3>Answer Solutions</h3>
          <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
        </div>
        ${solHtml}
        <button class="btn-primary" style="margin-top:15px;" onclick="closeDynamicView()">Close</button>
      </div>
    </div>
  `;
}
