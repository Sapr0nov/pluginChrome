document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('apply-button').addEventListener('click', loadCSS);
    document.getElementById('save-button').addEventListener('click', saveCSS);
    document.getElementById('css-textarea').addEventListener('input', paintCSS);
    document.getElementById('css-textarea').addEventListener('keydown', paintCSS);
    document.getElementById('css-textarea').addEventListener('scroll', syncScroll);
});

const cssStringDefault = `
body {
    background-color: black!important;
    color: lightgrey!important;
}
pre { 
    background-color: darkgrey!important;
}
/* Добавьте здесь дополнительные стили, если необходимо */
`;

async function loadCSS() {
    const tab = await getActiveTab();
    const domain = (new URL(tab.url)).hostname;
    let cssString = '';
    
    if (domain) {
        try {
            cssString = await getCSS(domain);
        }catch(e) {
            if (e.type == '404') {
                console.log('Styles not found');
                cssString = cssStringDefault;
            }else{
                console.log(e);
            }
        }
        // вызов скрипта инъекции
        chrome.scripting.executeScript(
            {
                target:{tabId: tab.id, allFrames: true},
                func:injectCSS,
                args: [cssString]
            },
            onResult
        )
    }

}


async function saveCSS() {
    const domain = await getDomain();
//    const cssString = document.getElementById('css-textarea').value;
    const cssString = cssStringDefault;
    setCSS(domain, cssString);
}


function setCSS(domain, cssString) {
    const key = getKey(domain);
    chrome.storage.local.set({ [key]: cssString }, () => {
        console.log(`Стили CSS успешно сохранены для домена ${domain} по ключу ${key}`);
    });
}


async function getCSS(domain) {
    const key = getKey(domain);
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            const savedCssStyles = result[key];
            if (savedCssStyles) {
            resolve(savedCssStyles);
            } else {
                const error = new Error(`Styles CSS for domain ${domain} are not found`);
                error.type = '404';
                reject(error);
            }
        });
    });
}


function injectCSS(data) {
    var style = document.createElement("style");
    style.innerHTML = data;
    document.head.appendChild(style);

    return 'upate styles';
}

function onResult(frames) {
    // Возврат данных в popup
    console.log('onResult', frames);
}


function getActiveTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const activeTab = tabs[0];
            if (activeTab?.url) {
            resolve(activeTab);
            } else {
            reject(new Error('Active tab is not found'));
            }
        });
    });
}


async function getDomain() {
    const tab = await getActiveTab();
    const url = new URL(tab.url);
    const domain = url.hostname;
    return domain;
}


function getKey(domain) {
    return 'css_' + domain.replace(/[^\w]/g, "");
}


function paintCSS() {
    textarea = document.getElementById('css-textarea');
    overlay = document.getElementById('overlay');
    let code = textarea.value;
    code = code.replace(/\n/g, '<br />');
    code = code.replace(/\/\*([\s\S]*?)\*\//g, '<span class="comment">/*$1*/</span>');
    code = code.replace(/(\/\*[\s\S]*?\*\/|\/\/.*?(\r?\n|$))/g, '<span class="comment">$1</span>');
    code = code.replace(/([{}])/g, '<span class="highlight">$1</span>');
    code = code.replace(/(\.[\w-]+)/g, '<span class="selector">$1</span>');
    code = code.replace(/([\w-]+)(\s*:)/g, '<span class="property">$1</span>$2');
    code = code.replace(/(:\s*)([^;\n]+)(;)/g, '$1<span class="value">$2</span>$3');
    overlay.innerHTML = code;
}

function syncScroll(e) {
    overlay = document.getElementById('overlay');
    var scrollTop = e.target.scrollTop;
    var scrollLeft = e.target.scrollLeft;
    overlay.scrollTop = scrollTop;
    overlay.scrollLeft = scrollLeft;
  }