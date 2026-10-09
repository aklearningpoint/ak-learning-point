// Central API Handler for AK Learning Point & Assent Public School
const API_URL = "https://script.google.com/u/0/home/projects/1Oc1qjIzSgyQYxuV8RUHR6mG_PifnXNIhMA9xazbHc9GYp2ID_gncjhzt/edit"; 

const API = {
  // GET Requests
  async get(action, params = {}) {
    const query = new URLSearchParams({ action, ...params }).toString();
    try {
      const res = await fetch(`${API_URL}?${query}`);
      return await res.json();
    } catch (err) {
      console.error("API GET Error:", err);
      return { status: "error", message: err.toString() };
    }
  },

  // POST Requests
  async post(action, data = {}) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        mode: "no-cors", // Google Apps Script Web App requirement
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data })
      });
      return { status: "success" };
    } catch (err) {
      console.error("API POST Error:", err);
      return { status: "error", message: err.toString() };
    }
  }
};
