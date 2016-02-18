
var DOM = document;

module.exports.setDOM = function(newDom){
  DOM = newDom;
};

if (typeof document === 'object'){
  module.exports.setDOM(document);
}

module.exports.render = function(component,args){
  var parent = args[1];
  parent.appendChild(component.instance);
  return component.instance;
};

module.exports.getId = function(element){
  return element.getAttribute('data-tamboId');
};

module.exports.setId = function(element,id){
  return element.setAttribute('data-tamboId',id);
};

module.exports.setProp = function(element,key,value){
  return element.setAttribute(key,value);
};

module.exports.getChildren = function(parent){
  return Array.prototype.slice.call(parent.children);
};

module.exports.appendChild = function(parent,child){
  return parent.appendChild(child);
};

module.exports.removeChild = function(parent,child){
  return parent.removeChild(child);
};

module.exports.replaceChild = function(parent,childA,childB){
  return parent.replaceChild(childA,childB);
};

module.exports.createText = function(text){
  return DOM.createTextNode(text);
};

module.exports.getText = function(node){
  return node.textContent;
};

module.exports.setText = function(node,text){
  return node.textContent = text;
};

module.exports.isText = function(textNode){
  return textNode.nodeType === 3;
};

module.exports.createElement = function(tagName,props){
  var element = DOM.createElement(tagName);
  for(var attr in props){

    if (attr.indexOf('on') === 0){
      var event = attr.replace('on','').toLowerCase();
      element.addEventListener(event,props[attr],false);
    }else{
      if (attr !== 'children')
      element.setAttribute(attr,props[attr]);
    }
  }
  return element;
};
