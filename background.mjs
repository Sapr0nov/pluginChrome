//import { CustomCSS } from './classes/CustomCSS.js';
//const customCSS = new CustomCSS();
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log("Обновлен URL вкладки sss: " + tab.url);
    if (tab.url) {
      // TODO автоматическое применение стилей для обновленной страницы
      console.log(customCSS);
    }
  });
  
  chrome.tabs.onCreated.addListener(function(tab) {
    console.log("Открыта новая вкладка sss: " + tab.url);
    if (tab.url) {
      // TODO автоматическое применение стилей для открытой страницы
      console.log(customCSS);
    }
  });
