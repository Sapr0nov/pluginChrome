class ChromeTab {

  async getActiveTab() {
    return new Promise((resolve, reject) => {
      chrome.tabs
      .query({ active: true, currentWindow: true }, function(tabs) {
        const activeTab = tabs[0];
        if (activeTab?.url) {
          resolve(activeTab);
        } else {
          reject(new Error('Active tab is not found'));
        }
      });
    });
  }


  insertCSS(tab, cssString, callback = () => console.log("CSS injected")) {
    chrome.scripting
    .insertCSS({
      target : {tabId : tab.id},
      css : cssString,
    },
    callback)
  }

  
  insertJS(tab, func, callback = () => console.log("JS injected"), args) {
    chrome.scripting
    .executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: func,
      args: [args]
    },
    callback)
  }
}
  
export { ChromeTab };