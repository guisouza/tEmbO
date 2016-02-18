//File : src/Tembo._.componentFactory.js

module.exports = function(Tembo){
  'use strict';

  Tembo._.componentFactory = function(structure){
    var TemboComponent = function(){};
    for(var key in structure){
      var method = structure[key];
      TemboComponent.prototype[key] = method;
    }


    TemboComponent.prototype.__render__ = TemboComponent.prototype.render;
    TemboComponent.prototype.render = function(){
      var renderResult = TemboComponent.prototype.__render__.bind(this)();
      // if (!this.oldInstance){

      // }
      // this.instance = renderResult;
      renderResult.component = this;

      return renderResult;
    };

    TemboComponent.prototype.__componentWillUnmount__ = TemboComponent.prototype.componentWillUnmount || function(){};
    TemboComponent.prototype.componentWillUnmount = function(){
      return TemboComponent.prototype.__componentWillUnmount__.bind(this)();
    };

    if (structure.displayName)
      TemboComponent.displayName = structure.displayName;

    TemboComponent.prototype.isTemboComponent = true;
    TemboComponent.prototype.setState = function(state){
      for(key in state){
        this.state[key] = state[key];
      }

      Tembo._.deeplyCompare(this.instance,this.render());

    };
    return TemboComponent;
  };
};
