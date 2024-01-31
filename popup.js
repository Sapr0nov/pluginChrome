document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('apply-button').addEventListener('click', applyCSS);
});


function applyCSS() {
    cssString = 'body { background-color: black!important; color: lightgrey!important; } pre { background-color: darkgrey!important;}';
    chrome.tabs.query({active: true}, (tabs) => {
        const tab = tabs[0];
        if (tab) {
            chrome.scripting.executeScript(
                {
                    target:{tabId: tab.id, allFrames: true},
                    func:setCSS,
                    args: [cssString]
                },
                onResult
            )
        } else {
            alert("There are no active tabs")
        }
    })
}
function setCSS(data) {
    var style = document.createElement("style");
    style.innerHTML = data;
    document.head.appendChild(style);

    return 'upate styles';
}

function onResult(frames) {
    // Возврат данных в popup
    console.log('onResult', frames);
}