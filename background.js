let requests = [];

chrome.webRequest.onCompleted.addListener(
  (details) => {
    // Skip requests from the extension itself
    const isExtensionRequest =
      details.initiator?.startsWith("chrome-extension://") ||
      details.initiator?.startsWith("edge-extension://") ||
      details.url.startsWith("chrome-extension://") ||
      details.url.startsWith("edge-extension://");

    if (isExtensionRequest) {
      return; // Don't log requests from your extension
    }

    requests.push({
      url: details.url,
      method: details.method,
      statusCode: details.statusCode,
      type: details.type,
      timeStamp: new Date(details.timeStamp).toLocaleTimeString(),
    });

    if (requests.length > 100) requests.shift();

    chrome.storage.local.set({ requests });
  },
  { urls: ["<all_urls>"] }
);
