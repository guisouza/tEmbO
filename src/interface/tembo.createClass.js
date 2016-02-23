var Component = require('../core/Component');
var Patch = require('../core/Patch');
var Updater = require('../core/SyncUpdate');
var NativeRoot = require('../render/NativeRoot');

// File : src/Tembo.createClass.js

module.exports = function(Tembo){
  'use strict';
  var updater = new Updater();
  Tembo._.can('createClass',function(structure){
    return Component.extend(structure,updater);
  });

  // File : src/Tembo.createElement.js
  Tembo._.can('createElement',function(element,props,content){
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

  Tembo._.can('render',function(component,nativeParent){
    var root = NativeRoot.makeTree(Tembo.$,nativeParent,component);
    return Tembo.$.render(component,nativeParent);
  });

};
