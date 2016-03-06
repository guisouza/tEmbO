

module.exports.render = function(component){
  return component.instance.toString();
};

module.exports.getId = function(element){
  return element._tamboID;
};

module.exports.setId = function(element,id){
  element._tamboID = id;
};

module.exports.setProp = function(element,key,value){
  element.props[key] = value;
};

module.exports.getChildren = function(parent){
  return parent.children;
};

module.exports.appendChild = function(parent,child){
  return parent.children.push(child);
};

module.exports.removeChild = function(parent,child){
  var children = parent.children;
  return children.splice(children.indexOf(child),1);
};

module.exports.replaceChild = function(parent,childA,childB){
  var children = parent.children;
  return children.splice(children.indexOf(childA),1,childB);
};
var TextWrapper;
module.exports.createText = function(text){
  return new TextWrapper(text);
};
TextWrapper = function(text){
  this.text = text;
};

TextWrapper.prototype.toString = function(){
  return this.text;
};

module.exports.getText = function(node){
  return node.children.length ? node.children[0] : '';
};

module.exports.setText = function(node,text){
  node.children = [text];
};

module.exports.isText = function(textNode){
  return textNode instanceof TextWrapper;
};
var FakeElem;
module.exports.createElement = function(tagName,props){
  return new FakeElem(tagName,props);
};

FakeElem = function(tagName,props){
  this.tagName = tagName;
  this.props = Object.create(props);
  delete this.props.children;
  this.children = [];
};

var proto = FakeElem.prototype;
var reduceProperties;
proto.toString = function(){
  var props = this.props;
  var tagName = this.tagName;
  var ID = this._tamboID;
  return '<' + tagName + ' ' +
    'data-tamboId=\"' + ID + '\" ' +
    Object.keys(props).reduce(reduceProperties.bind(void 0,props),'') +
    '>' + this.children.join('') + '<' + this.tagName + '>';
};

var reduceObject;
reduceProperties = function(props,str,key){
  var value = props[key];
  switch(typeof value){
    case 'undefined':
      return str;
    case 'function':
      console.log('It is possible to implement a json-rpc for events');
      return str;
    case 'object':
      if (value === null) return str;
      if (value instanceof Array){
        return str + ' ' + key + '=\"' + value.join(' ') + '\"';
      }
      return str + ' ' + key + '=\"' + Object.keys(value)
        .reduce(reduceObject.bind(void 0,value),'') + '\"';
  }
  return str + ' ' + key + '=\"' + value + '\"';
};

reduceObject = function(obj,str,key){
  return str + ';' + key + ':' + obj[key];
};
