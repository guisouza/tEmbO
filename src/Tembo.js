var Component = require('./interface/Component');
var Patch = require('./interface/Patch');
var NativeRoot = require('./render/NativeRoot');

//File : src/Tembo.js

var TemboConstructor = function(renderer,updater){
  if (!updater){
    var SyncUpdate = require('./updaters/SyncUpdate');
    updater = new SyncUpdate();
  }
  var tembo = {
    _ : {},
    components : {}
  };
  require('./core/Tembo.core.can.js')(tembo);

  tembo._.can('createClass',function(structure){
    return Component.extend(structure,updater);
  });

  // File : src/Tembo.createElement.js
  tembo._.can('createElement',function(element,props,content){
    if (!props)
      props = {};

    if (arguments.length > 3){
      content = [];
      var index = 2;
      while(index < arguments.length){
        content.push(arguments[index]);
        index++;
      }
    }

    return new Patch(element,props,content);
  });

  tembo._.can('render',function(component,nativeParent){
    var root = NativeRoot.makeTree(renderer,nativeParent,component);
    return renderer.render(root);
  });

  tembo._.can('getNative',function(component){
    return component.renderNode.native.elem;
  });

  return tembo;
};

module.exports = TemboConstructor;

if (!module.parent && typeof window === 'object'){
  var SyncUpdate = require('./updaters/SyncUpdate');

  window.Tembo = TemboConstructor(require('./renderers/DOM.js'),new SyncUpdate());
}
