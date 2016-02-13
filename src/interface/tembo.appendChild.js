//File : src/Tembo.appendChild.js

;(function(Tembo){
  'use strict';
  Tembo._.can('appendChild',function(element,content){


    if (content === undefined){
      return false;
    }

    if (Array.isArray(content)){
      return content.map(function(child){
          Tembo.appendChild(element,child);
      });
    }

    if (content.innerHTML){
        return element.appendChild(content);
    }

    if (typeof content === 'string' || typeof content === 'number'){
        var childEl = document.createElement('span');
        childEl.appendChild(document.createTextNode(content));
        return element.appendChild(childEl);
    }

    if (content.render){
      content.instance = content.render();
      return Tembo.appendChild(element,content.instance);
    }
  });
})(this.Tembo);
