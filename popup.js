// получаем доступ к кнопке
const start = document.getElementById("start");

// когда кнопка нажата — находим активную вкладку и запускаем нужную функцию
start.addEventListener("click", async () => {
  // получаем доступ к активной вкладке
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.insertCSS({
        target : {tabId : tab.id },
        files: ["style.css"]
    });

    const timeLimit = document.querySelector("#timeLimit").value;
    chrome.tabs.sendMessage(tab.id, {"timeLimit": timeLimit}, function(response) {
      if (!chrome.runtime.lastError) {
        console.log('response', response);
      }else{
        console.log(chrome.runtime.lastError);
      }
    });


    // выполняем скрипт
    chrome.scripting.executeScript({
  	    // скрипт будет выполняться во вкладке, которую нашли на предыдущем этапе
        target: { tabId: tab.id },
        // вызываем функцию
        files : [ "script.js" ],
    })
});
