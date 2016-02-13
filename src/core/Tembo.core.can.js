//File : src/Tembo._.can.js

(function(Tembo){
  'use strict';
  Tembo._.can = function(label,method){
    if (!Tembo[label])
      Tembo[label] = method;
  };
})(this.Tembo);
