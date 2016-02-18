//File : src/Tembo._.can.js

module.exports = function(Tembo){
  'use strict';
  Tembo._.can = function(label,method){
    if (!Tembo[label])
      Tembo[label] = method;
  };
};
