// File : src/Tembo.createClass.js

module.exports = function(Tembo){
  'use strict';
  Tembo._.can('createClass',function(structure){
    return Tembo._.componentFactory(structure);
  });
};
