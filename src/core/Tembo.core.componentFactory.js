var Component = require('./Component');

//File : src/Tembo._.componentFactory.js

module.exports = function(Tembo){
  'use strict';
  var updater = new Updater();

  Tembo._.can('getNative',function(component){
    var instance = component.instance;
    while(instance.instance) instance = instance.instance;
    return instance;
  });

  Tembo._.componentFactory = function(structure){
    return Component.extend(structure,updater);
  };

};
