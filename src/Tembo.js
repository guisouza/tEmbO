var Component = require('./interface/Component');
var Patch = require('./interface/Patch');
var NativeRoot = require('./render/NativeRoot');

var SyncUpdate = require('./updaters/SyncUpdate');

//File : src/Tembo.js

var TemboConstructor = function(renderer,updater){
  updater = updater || new SyncUpdate();

  var tembo = {
    _ : {},
    components : {}
  };
  require('./core/Tembo.core.can.js')(tembo);

  tembo._.can('createClass',TemboConstructor.createClass);

  // File : src/Tembo.createElement.js
  tembo._.can('createElement',TemboConstructor.createElement);
  tembo._.can('getNative',TemboConstructor.getNative);

  tembo._.can('render',function(component,nativeParent){
    var root = NativeRoot.makeTree(renderer,updater,nativeParent,component);
    renderer.render(root);
    return root[1].shadowHead.elem;
  });

  return tembo;
};

TemboConstructor.createClass = function(structure){
  return Component.extend(structure);
};

TemboConstructor.createElement = function(element,props,content){
  if (!props) props = {};

  if (arguments.length > 3){
    content = [];
    var index = 2;
    while(index < arguments.length){
      content.push(arguments[index]);
      index++;
    }
  }

  return new Patch(element,props,content);
};

TemboConstructor.getNative = function(component){
  return component.renderNode.native.elem;
};

TemboConstructor.__spread = Object.assign.bind(Object);

module.exports = TemboConstructor;

if (!module.parent && typeof window === 'object'){
  window.Tembo = TemboConstructor(require('./renderers/DOM.js'),new SyncUpdate());
}
