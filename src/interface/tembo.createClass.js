// File : src/Tembo.createClass.js

(function(Tembo){
  'use strict';
  Tembo._.can('createClass',function(structure){
    return Tembo._.componentFactory(structure);
  });
})(this.Tembo);
