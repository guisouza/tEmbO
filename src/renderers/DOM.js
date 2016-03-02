
var DOM = document;

module.exports.setDOM = function(newDom){
  DOM = newDom;
};

if (typeof document === 'object'){
  module.exports.setDOM(document);
}

module.exports.render = function(component,parent){
  return component.instance;
};

module.exports.getId = function(element){
  return element.getAttribute('data-tamboId');
};

module.exports.setId = function(element,id){
  return element.setAttribute('data-tamboId',id);
};

var applyStyle;
module.exports.setProp = function(element,key,value){
  if (key.indexOf('on') === 0){
    key = key.toLowerCase();
    console.log(key);
    element[key] = value;
  }else if (key === 'style'){
    if (typeof value === 'string'){
      element.style = value;
      return;
    }
    Object.keys(value).forEach(applyStyle.bind(void 0,element.style,value));
  }else if (key !== 'children'){
    element.setAttribute(key,value);
  }
};

applyStyle = function(obj,style,key){
  switch(typeof style[key]){
    case 'string' : obj[key] = style[key]; return;
    case 'number' : obj[key] = style[key] + 'px'; return;
    case 'undefined' : return;
  }

  Object.keys(style[key]).forEach(applyStyle.bind(void 0,obj[key],style[key]));
};

module.exports.appendChild = function(parent,child){
  return parent.appendChild(child);
};

module.exports.insertChild = function(parent,child,index){
  return parent.appendChild(child,parent.childNodes[index]);
};

module.exports.removeChild = function(parent,child){
  return parent.removeChild(child);
};

module.exports.replaceChild = function(parent,oldChild,newChild){
  return parent.replaceChild(newChild,oldChild);
};

module.exports.isElement = function(textNode){
  return textNode.nodeType === 1;
};
module.exports.isText = function(textNode){
  return textNode.nodeType === 3;
};
module.exports.createElement = function(tagName){
  return DOM.createElement(tagName);
};
module.exports.createText = function(text){
  return DOM.createTextNode(text);
};
module.exports.setText = function(textNode,text){
  textNode.textContent = text;
};
