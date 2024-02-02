import { ChromeTab } from './ChromeTab.js';

class CustomCSS {
  textarea = null;

  constructor(textarea) {
    this.loadCSS = this.loadCSS.bind(this);
    this.saveCSS = this.saveCSS.bind(this);
    this.getCSS = this.getCSS.bind(this);
    this.textarea = textarea;
  }
  
  async loadCSS() {
    const tab = await (new ChromeTab).getActiveTab();
    const domain = (new URL(tab.url)).hostname;
    let cssString = '';

    if (domain) {
      try {
        cssString = await this.getCSS(domain);
        this.textarea.innerHTML = cssString;
      } catch(e) {
        if (e.type == '404') {
          console.log('Styles not found');
          cssString = '';
        } else {
          console.log(e);
        }
      }

      (new ChromeTab).insertCSS(tab, cssString, this.onResult);
// Пример внедрения стилей через скрипт:) )
/*
      const injectCSS_callback = (cssString) => {
        const style = document.createElement("style");
        style.innerHTML = cssString;
        document.head.appendChild(style);
      }

      (new ChromeTab).insertJS(tab, injectCSS_callback, this.onResult, cssString);
*/
    }
  }
  
  async saveCSS() {
    const domain = await this.getDomain();
    const cssString = this.textarea.value;
    this.setCSS(domain, cssString);
  }
  
  setCSS(domain, cssString) {
    const key = this.getKey(domain);
    chrome.storage.local.set({ [key]: cssString }, () => {
      console.log(`Стили CSS успешно сохранены для домена ${domain} по ключу ${key}`);
    });
  }
  
  async getCSS(domain) {
    const key = this.getKey(domain);
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


  onResult(frames) {
    // Возврат данных в popup
    console.log('onResult', frames);
  }


  async getDomain() {
    const tab = await (new ChromeTab).getActiveTab();
    const url = new URL(tab.url);
    const domain = url.hostname;
    return domain;
  }

  getKey(domain) {
    return 'css_' + domain.replace(/[^\w]/g, "");
  }

}
  
export { CustomCSS };