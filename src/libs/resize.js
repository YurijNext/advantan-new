let defaultWidth = 1920,
    defaultFont = 16,
    minWidth = 768,
    minHeight = 500,
    defaultHeight = 1000,
    vW = window.innerWidth,
    vH = window.innerHeight;
let page = $("html");

    let fontSize = function(){
        return defaultFont * Math.min(Math.max(minWidth, vW) / defaultWidth, Math.max(minHeight, vH) / defaultHeight);
    };
    let calculate = function(){
        vW = window.innerWidth;
        vH = window.innerHeight;
        page.css('font-size', `${fontSize()}px`);
        console.log(fontSize());
    };

window.addEventListener('resize',calculate);

