!function(d){function e(){var c=a.getBoundingClientRect().width;1===b&&(480<c&&(c=480),a.style.width=c+"px",a.style.margin="0 auto");a.style.fontSize=c/7.5+"px"
  var font0 =a.style.fontSize.split('px')[0];
  var font1 =window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize.replace('px','')
  if(font0 !== font1){
    document.getElementsByTagName("html")[0].style.cssText = 'font-size: ' + (c/7.5)*(c/7.5)/font1 +"px";
  }
}var a=d.document.documentElement,b=d.devicePixelRatio,f,b=2<b?3:1<b?2:1;a.setAttribute("data-dpr",b); d.addEventListener("resize",function(){clearTimeout(f);f=setTimeout(e,200)},!1);e()}(window);
