document.addEventListener("DOMContentLoaded", function() {


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'applyCSS') {
    // Ваш код для внедрения CSS стилей здесь
    // Например, для добавления красного фона на страницу:
console.log("test");
    document.body.style.backgroundColor = 'red';
  }
});

});