class TextAreaPainter {
  
  paintCSS(e) {
    const textarea = this;
    const overlay = this.parentNode.querySelector('#overlay');
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
  syncScroll(e) {
    const overlay = this.parentNode.querySelector('#overlay');
    var scrollTop = e.target.scrollTop;
    var scrollLeft = e.target.scrollLeft;
    overlay.scrollTop = scrollTop;
    overlay.scrollLeft = scrollLeft;
  }
}
  
export { TextAreaPainter };