// Navigation Drawer Toggle
function toggleDrawer() {
  const overlay = document.getElementById('drawerOverlay');
  overlay.classList.toggle('open');
}

// WhatsApp App Share
function shareAppWhatsApp() {
  const text = encodeURIComponent(
    "🌟 *AK Learning Point* 🌟\n" +
    "Empowering Every Student from Play to 12th Grade (CBSE & BSEB)!\n\n" +
    "🎯 Interactive Quizzes & Instant Scorecards\n" +
    "🎁 Rewarding Challenges\n" +
    "📚 Free Study Materials & Video Classes\n\n" +
    "👉 Join our official WhatsApp Community here:\n" +
    "https://chat.whatsapp.com/CXwYDb3tRIZ8gSsDuQey0I?s=cl&p=a&mlu=4&ilr=4"
  );
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

// Community Modal Handlers
function openCommunityModal() {
  document.getElementById('communityModal').style.display = 'flex';
}

function closeCommunityModal() {
  document.getElementById('communityModal').style.display = 'none';
}

async function handleLeadSubmit(e) {
  e.preventDefault();
  const data = {
    name: document.getElementById('leadName').value,
    state: document.getElementById('leadState').value,
    mobile: document.getElementById('leadMobile').value,
    className: document.getElementById('leadClass').value
  };

  // Save to Google Sheet via API
  API.post("saveLead", data);

  // Direct Redirect to WhatsApp Community Group Link
  window.location.href = "https://chat.whatsapp.com/CXwYDb3tRIZ8gSsDuQey0I?s=cl&p=a&mlu=4&ilr=4";
}

// Auto Flipping Ads Logic
const motivationalQuotes = [
  { title: "✨ Daily Practice Makes Perfect!", quote: "\"Gyan ki nayi shuruat, har vidyarthi ke vikas ke saath!\"" },
  { title: "🏆 Participate in Rewarding Quizzes!", quote: "\"Padhai ab bojh nahi, ek mazedaar safar hai!\"" },
  { title: "🎯 CBSE & BSEB Complete Test Engine", quote: "\"Shiksha sabse shaktishali hathiyar hai.\"" }
];

let adIndex = 0;
setInterval(() => {
  adIndex = (adIndex + 1) % motivationalQuotes.length;
  const titleEl = document.getElementById('appAdTitle');
  const quoteEl = document.getElementById('appAdQuote');
  if (titleEl && quoteEl) {
    titleEl.innerText = motivationalQuotes[adIndex].title;
    quoteEl.innerText = motivationalQuotes[adIndex].quote;
  }
}, 4000);
