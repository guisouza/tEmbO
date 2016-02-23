
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

module.exports.setProp = function(element,key,value){
  if (key.indexOf('on') === 0){
    key = key.replace('on','').toLowerCase();
    element.addEventListener(key,value,false);
  }else{
    if (key !== 'children')
    element.setAttribute(key,value);
  }
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
