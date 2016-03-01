var EE = require('events').EventEmitter;

var TestRenderer;

var TreeNode = function(tagName){
  EE.call(this);
  if (typeof tagName !== 'string') throw new Error('not sure how to create non-string object');
  this.tagName = tagName;
  this.props = {};
  this.children = [];
};

TreeNode.prototype = Object.create(EE.prototype);

var TextNode = function(text){
  this.text = text;
};

TextNode.prototype = Object.create(EE.prototype);

module.exports = TestRenderer = function(){
  EE.call(this);
};

module.exports.TreeNode = TreeNode;
module.exports.TextNode = TextNode;

var proto = TestRenderer.prototype = Object.create(EE.prototype);

proto.render = function(component){
  return component;
};

proto.getId = function(node){
  return node.ID;
};

proto.setId = function(node,id){
  node.ID = id;
};

proto.setProp = function(node,key,value){
  node[key] = value;
};

proto.getChildren = function(parent){
  return parent.children.slice(0);
};

proto.appendChild = function(parent,child){
  this.insertChild(parent,child,parent.children.length);
};

proto.insertChild = function(parent,child,i){
  var found = parent.children.indexOf(child);
  if (found !== -1) throw 'insert: child already exists in parent';
  if (i >= parent.children.length) parent.children.push(child);
  else parent.children.splice(i,0,child);
  child.parent = parent;
  this.emit('insert',parent,child,parent.children.length);
  parent.emit('insertChild',child,parent.children.length);
  child.emit('insert',parent,parent.children.length);
};

proto.removeChild = function(parent,child){
  var i = parent.children.indexOf(child);
  if (i === -1) throw 'remove: old not found';
  parent.children.splice(i,1);
  child.parent = void 0;
  this.emit('remove',parent,child);
  parent.emit('removeChild',child);
  child.emit('remove',child);
};

proto.replaceChild = function(parent,oldNode,newNode){
  this.emit('replace',parent,oldNode,newNode);
  var i = parent.children.indexOf(oldNode);
  if (i === -1) throw 'replace: old not found';
  this.removeChild(parent,oldNode);
  this.insertChild(parent,newNode,i);
};

proto.createText = function(text){
  return new TextNode(text);
};

proto.getText = function(node){
  return node.text;
};

proto.setText = function(node,text){
  node.text = text;
};

proto.isText = function(node){
  return node instanceof TextNode;
};

proto.createElement = function(tagName){
  return new TreeNode(tagName);
};
