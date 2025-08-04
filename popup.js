let allRequests = [];

function getMethodColor(method) {
  switch (method.toUpperCase()) {
    case "GET":
      return "green";
    case "POST":
      return "orange";
    case "PATCH":
      return "blue";
    case "DELETE":
      return "red";
    default:
      return "#0078D7";
  }
}

function renderRequests(requests) {
  const container = document.getElementById("log");
  const selectedMethod = document.getElementById("methodFilter").value;
  container.innerHTML = "";

  const filtered =
    selectedMethod === "ALL" ? requests : requests.filter((req) => req.method.toUpperCase() === selectedMethod);

  filtered.reverse().forEach((req) => {
    const el = document.createElement("div");
    el.className = "log-item";
    el.style.borderLeft = `5px solid ${getMethodColor(req.method)}`;
    el.innerHTML = `
      <strong>${req.method}</strong> ${req.statusCode} <br/>
      <code>${req.url}</code><br/>
      <small>${req.timeStamp} - ${req.type}</small>
    `;
    container.appendChild(el);
  });
}

// Initial load
chrome.storage.local.get("requests", (data) => {
  allRequests = data.requests || [];
  renderRequests(allRequests);
});

// Real-time updates
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.requests) {
    allRequests = changes.requests.newValue || [];
    renderRequests(allRequests);
  }
});

// Handle method filter change
document.getElementById("methodFilter").addEventListener("change", () => {
  renderRequests(allRequests);
});

// Clear logs
document.getElementById("clearBtn").addEventListener("click", () => {
  chrome.storage.local.set({ requests: [] }, () => {
    allRequests = [];
    renderRequests([]);
  });
});
