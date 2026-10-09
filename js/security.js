// Anti-Cheat & Malicious Activity Shield for AK Learning Point

const SecurityShield = {
  isActive: false,

  activate(onViolationCallback) {
    this.isActive = true;

    // 1. Fullscreen Request
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }

    // 2. Disable Text Selection & Right-Click Context Menu
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    document.addEventListener("contextmenu", this.blockEvent);
    document.addEventListener("copy", this.blockEvent);
    document.addEventListener("cut", this.blockEvent);

    // 3. Prevent DevTools & Shortcut Keys (F12, Ctrl+U, Ctrl+Shift+I, PrintScreen)
    window.addEventListener("keydown", (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "u") ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        return false;
      }
    });

    // 4. Tab Switch / Screen Minimize / Window Blur Detection -> AUTO SUBMIT
    window.addEventListener("blur", () => {
      if (this.isActive && onViolationCallback) {
        alert("Security Violation: Screen minimize ya tab switch detect hua hai! Aapka quiz auto-submit kiya ja raha hai.");
        onViolationCallback();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.isActive && onViolationCallback) {
        alert("Security Violation: Window change karne ke karan quiz submit kiya ja raha hai!");
        onViolationCallback();
      }
    });
  },

  blockEvent(e) {
    e.preventDefault();
    return false;
  },

  deactivate() {
    this.isActive = false;
    document.body.style.userSelect = "auto";
    document.body.style.webkitUserSelect = "auto";
    document.removeEventListener("contextmenu", this.blockEvent);
    document.removeEventListener("copy", this.blockEvent);
    document.removeEventListener("cut", this.blockEvent);

    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }
};
