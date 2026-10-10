// Quiz Flow, Board-Class Selection, Test Engine & Instant Local Sync

let selectedBoard = "";
let selectedClass = "";
let selectedSubject = "";
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = {};
let quizTimerInterval = null;
let remainingSeconds = 0;
let perQuestionTimerInterval = null;
let perQuestionRemaining = 0;

function getQuizStorageData(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setQuizStorageData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
}

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
  clearInterval(quizTimerInterval);
  clearInterval(perQuestionTimerInterval);
  document.getElementById("dynamicView").innerHTML = "";
}

function selectBoard(board) {
  selectedBoard = board;
  const classes = ["Play", "Nur", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];

  let classHtml = classes.map(c => {
    let icon = "fa-graduation-cap";
    let isPrePrimary = ["Play", "Nur", "LKG", "UKG"].includes(c);
    if (isPrePrimary) icon = "fa-shapes fa-bounce";
    
    return `
      <div class="section-card" style="margin-bottom:8px; cursor:pointer;" onclick="selectClass('${c}')">
        <div class="section-left">
          <div class="section-icon" style="background:${isPrePrimary ? '#fce7f3' : '#e0f2fe'}; color:${isPrePrimary ? '#ec4899' : '#0284c7'};">
            <i class="fas ${icon}"></i>
          </div>
          <div class="section-info">
            <h3>${c}</h3>
            <p>${isPrePrimary ? 'Foundation Learning' : 'Academic Standard Test'}</p>
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

function selectClass(className) {
  selectedClass = className;
  const subjects = ["Science", "Math", "Hindi", "English", "S.St", "G.K", "Computer", "Urdu", "History", "Geography", "Economics", "Civics"];

  let subHtml = subjects.map(s => `
    <div class="section-card" style="margin-bottom:8px; cursor:pointer;" onclick="loadQuizListing('${s}')">
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

async function loadQuizListing(subject) {
  selectedSubject = subject;
  const dynamicView = document.getElementById("dynamicView");
  
  // 1. Direct Local Sync (Teacher panel me jo bani hai use turant filter karein)
  const allTeacherQuizzes = getQuizStorageData("ak_teacher_quizzes", []);
  
  let matchedQuizzes = allTeacherQuizzes.filter(q => {
    const bMatch = (!q.board || q.board.toLowerCase() === selectedBoard.toLowerCase());
    const cMatch = (!q.className || q.className.toLowerCase() === selectedClass.toLowerCase());
    const sMatch = (!q.subject || q.subject.toLowerCase() === selectedSubject.toLowerCase());
    return bMatch && cMatch && sMatch;
  });

  // 2. Cloud Fallback if available
  if (typeof API !== "undefined" && API.get) {
    try {
      const res = await API.get("getQuizzes", {
        board: selectedBoard,
        className: selectedClass,
        subject: selectedSubject
      });
      if (res && res.data && res.data.length > 0) {
        const cloudQuizzes = res.data;
        const map = new Map();
        [...matchedQuizzes, ...cloudQuizzes].forEach(item => map.set(item.id || item.title, item));
        matchedQuizzes = Array.from(map.values());
      }
    } catch (e) {
      console.warn("Using local storage list", e);
    }
  }

  if (matchedQuizzes.length === 0) {
    dynamicView.innerHTML = `
      <div class="modal-overlay" style="display:flex;">
        <div class="modal-card" style="text-align:center;">
          <div class="modal-header">
            <h3>${subject} (${selectedClass})</h3>
            <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
          </div>
          <p style="margin:20px 0; color:var(--text-muted);">Is class aur subject me abhi koi quiz live nahi mili.</p>
          <button class="btn-primary" onclick="selectClass('${selectedClass}')">Back</button>
        </div>
      </div>
    `;
    return;
  }

  let listHtml = matchedQuizzes.map(q => {
    let isDraft = (q.status === "draft");
    return `
      <div class="section-card" style="margin-bottom:12px; ${isDraft ? 'opacity:0.65; border-left:4px solid #94a3b8;' : 'border-left:4px solid #16a34a;'}">
        <div style="flex:1;">
          <h3 style="font-size:1rem; color:var(--primary-navy);">${q.title}</h3>
          <small style="color:var(--text-muted);">
            ${q.questions ? q.questions.length : 0} Questions 
            ${q.timerType === 'per_question' ? `• ⏱️ ${q.timerValue}s/Q` : q.timerType === 'full' ? `• ⏳ ${q.timerValue}m` : ''}
            ${q.negativeMarking > 0 ? `• ⚠️ -${q.negativeMarking}` : ''}
            ${q.isRewarding ? '• 🎁 Rewarding' : ''}
          </small>
          ${isDraft ? '<span style="display:inline-block; font-size:0.75rem; background:#cbd5e1; padding:2px 6px; border-radius:4px; margin-left:6px; font-weight:700;">Coming Soon</span>' : ''}
          
          <div style="margin-top:8px; display:flex; gap:8px;">
            ${!isDraft ? `<button class="btn-primary" style="padding:6px 12px; font-size:0.85rem; width:auto; margin:0;" onclick='openQuizEntryModal(${JSON.stringify(q)})'>Start Test</button>` : '<span style="font-size:0.8rem; color:#64748b; font-weight:600;">Teacher dwara jald publish kiya jayega</span>'}
            <button onclick="shareQuizWhatsApp('${q.title}')" style="background:#25d366; color:white; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;"><i class="fab fa-whatsapp"></i></button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  dynamicView.innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card">
        <div class="modal-header">
          <h3>${selectedBoard} ${selectedClass} - ${subject}</h3>
          <button class="close-btn" onclick="selectClass('${selectedClass}')"><i class="fas fa-arrow-left"></i></button>
        </div>
        <div style="max-height:60vh; overflow-y:auto;">
          ${listHtml}
        </div>
      </div>
    </div>
  `;
}

function shareQuizWhatsApp(title) {
  const text = encodeURIComponent(
    `🎯 *AK Learning Point Test Alert!*\nTopic: ${title}\nClass: ${selectedClass} (${selectedBoard})\nAbhi attempt karein:\n${window.location.origin}${window.location.pathname}`
  );
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

function openQuizEntryModal(quiz) {
  currentQuiz = quiz;

  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Start: ${quiz.title}</h3>
          <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
        </div>
        
        <div style="background:#f8fafc; padding:10px; border-radius:8px; margin-bottom:12px; font-size:0.85rem; border:1px solid #e2e8f0;">
          <div>⏱️ <strong>Timer Mode:</strong> ${quiz.timerType === 'per_question' ? `${quiz.timerValue} Seconds Per Question` : quiz.timerType === 'full' ? `${quiz.timerValue} Minutes Total` : 'No Time Limit'}</div>
          <div>⚠️ <strong>Negative Marking:</strong> ${quiz.negativeMarking > 0 ? `-${quiz.negativeMarking} per wrong answer` : 'None'}</div>
        </div>

        <form onsubmit="handleStartQuiz(event)">
          <div class="form-group">
            <label>Student Full Name</label>
            <input type="text" id="qzStudentName" required placeholder="Aapka pura naam">
          </div>
          <div class="form-group">
            <label>WhatsApp Number</label>
            <input type="tel" id="qzMobile" required pattern="[0-9]{10}" placeholder="10-digit number">
          </div>
          ${quiz.isRewarding ? `
            <div class="form-group">
              <label>🎁 Rewarding Passkey</label>
              <input type="text" id="qzPasskey" required placeholder="Enter passkey given by teacher">
            </div>
          ` : ''}
          <button type="submit" class="btn-primary">Enter Exam Hall</button>
        </form>
      </div>
    </div>
  `;
}

function handleStartQuiz(e) {
  e.preventDefault();
  const name = document.getElementById("qzStudentName").value.trim();
  const mob = document.getElementById("qzMobile").value.trim();

  if (currentQuiz.isRewarding) {
    const inputKey = document.getElementById("qzPasskey").value.trim();
    if (inputKey !== String(currentQuiz.passkey).trim()) {
      alert("Galat Passkey! Teacher dwara diya gaya sahi code bharein.");
      return;
    }
  }

  currentQuiz.participantName = name;
  currentQuiz.participantMobile = mob;
  startActualExam();
}

function startActualExam() {
  currentQuestionIndex = 0;
  userAnswers = {};

  if (typeof SecurityShield !== "undefined" && SecurityShield.activate) {
    SecurityShield.activate(() => {
      submitQuizNow(true);
    });
  }

  if (currentQuiz.timerType === "per_question") {
    startPerQuestionTimer();
  } else if (currentQuiz.timerType === "full") {
    remainingSeconds = (currentQuiz.timerValue || 15) * 60;
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

  renderExamScreen();
}

function startPerQuestionTimer() {
  clearInterval(perQuestionTimerInterval);
  perQuestionRemaining = currentQuiz.timerValue || 30;

  perQuestionTimerInterval = setInterval(() => {
    perQuestionRemaining--;
    const tEl = document.getElementById("perQuestionTimerDisplay");
    if (tEl) {
      tEl.innerText = `${perQuestionRemaining}s`;
    }
    if (perQuestionRemaining <= 0) {
      clearInterval(perQuestionTimerInterval);
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        renderExamScreen();
        startPerQuestionTimer();
      } else {
        submitQuizNow(false);
      }
    }
  }, 1000);
}

function renderExamScreen() {
  const q = currentQuiz.questions[currentQuestionIndex];
  const totalQ = currentQuiz.questions.length;

  let timerDisplayHtml = "";
  if (currentQuiz.timerType === "per_question") {
    timerDisplayHtml = `⏱️ <span id="perQuestionTimerDisplay" style="color:#f59e0b; font-weight:800;">${perQuestionRemaining}s</span>`;
  } else if (currentQuiz.timerType === "full") {
    timerDisplayHtml = `⏳ <span id="quizTimerDisplay">--:--</span>`;
  } else {
    timerDisplayHtml = `<span>No Limit</span>`;
  }

  document.getElementById("dynamicView").innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:white; z-index:3000; display:flex; flex-direction:column;">
      
      <div style="height:55px; background:var(--primary-navy); color:white; display:flex; align-items:center; justify-content:space-between; padding:0 16px;">
        <strong style="color:var(--brand-gold);">${currentQuiz.title}</strong>
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="background:rgba(255,255,255,0.15); padding:4px 8px; border-radius:4px; font-weight:700;">
            ${timerDisplayHtml}
          </span>
          <button onclick="submitQuizNow(false)" style="background:#dc2626; color:white; border:none; padding:6px 12px; border-radius:6px; font-weight:600; cursor:pointer;">Submit</button>
        </div>
      </div>

      <div style="flex:1; overflow-y:auto; padding:20px; max-width:700px; margin:0 auto; width:100%;">
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-weight:700; color:var(--text-muted);">
          <span>Question ${currentQuestionIndex + 1} of ${totalQ}</span>
          ${currentQuiz.negativeMarking > 0 ? `<span style="color:#ef4444; font-size:0.85rem;">Penalty: -${currentQuiz.negativeMarking}</span>` : ''}
        </div>

        <h3 style="font-size:1.15rem; margin-bottom:15px; color:var(--text-dark);">${q.question}</h3>

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
    if (currentQuiz.timerType === "per_question") startPerQuestionTimer();
    renderExamScreen();
  }
}

function nextQuestion() {
  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    currentQuestionIndex++;
    if (currentQuiz.timerType === "per_question") startPerQuestionTimer();
    renderExamScreen();
  }
}

function submitQuizNow(isAutoSubmit = false) {
  clearInterval(quizTimerInterval);
  clearInterval(perQuestionTimerInterval);
  if (typeof SecurityShield !== "undefined" && SecurityShield.deactivate) {
    SecurityShield.deactivate();
  }

  let correctCount = 0;
  let wrongCount = 0;
  const totalQ = currentQuiz.questions.length;
  const negMark = parseFloat(currentQuiz.negativeMarking || 0);

  currentQuiz.questions.forEach((q, idx) => {
    const ans = userAnswers[idx];
    if (ans !== undefined) {
      if (ans === q.correctAnswer) correctCount++;
      else wrongCount++;
    }
  });

  const deduction = (wrongCount * negMark);
  const netScore = Math.max(0, (correctCount - deduction)).toFixed(2);
  const pct = ((netScore / totalQ) * 100).toFixed(1);

  const attemptRecord = {
    id: "att_" + Date.now(),
    quizId: currentQuiz.id,
    quizTitle: currentQuiz.title,
    studentName: currentQuiz.participantName || "Anonymous",
    mobile: currentQuiz.participantMobile || "",
    correctCount: correctCount,
    wrongCount: wrongCount,
    score: netScore,
    totalMarks: totalQ,
    percentage: pct,
    answers: userAnswers,
    timestamp: new Date().toISOString()
  };

  // 1. Save in local attempts ledger (Instant leaderboard and scorecard sync)
  let allAttempts = getQuizStorageData("ak_student_attempts", []);
  allAttempts.unshift(attemptRecord);
  setQuizStorageData("ak_student_attempts", allAttempts);

  // 2. Cloud sync in background
  if (typeof API !== "undefined" && API.post) {
    API.post("submitQuizAttempt", attemptRecord);
  }

  renderScorecardView(netScore, totalQ, pct, correctCount, wrongCount, deduction);
}

function renderScorecardView(netScore, totalMarks, pct, correct, wrong, deduction) {
  document.getElementById("dynamicView").innerHTML = `
    <div class="modal-overlay" style="display:flex;">
      <div class="modal-card" style="text-align:center; max-width:480px;">
        <div class="modal-header">
          <h3>Test Result & Scorecard</h3>
          <button class="close-btn" onclick="closeDynamicView()"><i class="fas fa-times"></i></button>
        </div>

        <div style="background:var(--primary-navy); color:white; padding:20px; border-radius:12px; margin-bottom:15px;">
          <h2 style="color:var(--brand-gold); margin-bottom:4px;">AK Learning Point</h2>
          <p style="font-size:0.85rem; opacity:0.8;">Student: <strong>${currentQuiz.participantName}</strong></p>
          <hr style="border:none; border-top:1px solid rgba(255,255,255,0.2); margin:12px 0;">
          <div style="font-size:2.2rem; font-weight:800; color:#4ade80;">${netScore} / ${totalMarks}</div>
          <div style="font-size:0.95rem; font-weight:600; margin-top:4px;">Accuracy: ${pct}%</div>
          
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; margin-top:12px; font-size:0.8rem; background:rgba(255,255,255,0.1); padding:8px; border-radius:6px;">
            <div style="color:#86efac;">✅ Correct: ${correct}</div>
            <div style="color:#fca5a5;">❌ Wrong: ${wrong}</div>
            <div style="color:#fde047;">⚠️ Penalty: -${deduction.toFixed(2)}</div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          <button class="btn-primary" style="background:#25d366;" onclick="shareResultWhatsApp('${netScore}', '${totalMarks}', '${pct}')">
            <i class="fab fa-whatsapp"></i> Share on WhatsApp
          </button>
          <button class="btn-primary" style="background:#1e50b4;" onclick="openSolutionVerification()">
            <i class="fas fa-check-circle"></i> Verify Answers
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
    `🏆 *AK Learning Point Scorecard!*\nTopic: ${currentQuiz.title}\nScore: ${score}/${total} (${pct}% Accuracy)\nApp: ${window.location.origin}${window.location.pathname}`
  );
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

function openSolutionVerification() {
  let solHtml = currentQuiz.questions.map((q, idx) => {
    const userChoice = userAnswers[idx];
    const isCorrect = (userChoice === q.correctAnswer);
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
