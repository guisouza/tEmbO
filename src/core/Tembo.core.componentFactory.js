require('setimmediate');

//File : src/Tembo._.componentFactory.js

module.exports = function(Tembo){
  'use strict';

  Tembo._.can('getNative',function(component){
    var instance = component.instance;
    while(instance.instance) instance = instance.instance;
    return instance;
  });

  Tembo._.componentFactory = function(structure){
    var TemboComponent = function(){
      this.state = {};
      this._newState = {};
      this._stateChanged = false;
    };
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
      if (typeof renderResult === 'string'){
        renderResult = Tembo.$.createText(renderResult);
      }

      if (typeof renderResult === 'object' && !renderResult)
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
      var newState = this._newState;
      var curState = this._curState;
      Object.keys(state).forEach(function(key){
        newState[key] = state[key];
        if (newState[key] === curState[key]){
          delete newState[key];
        }
      });

      var shouldUpdate = Object.keys(newState).length;

      if (!!shouldUpdate === !!this.isUpdating) return;
      if (shouldUpdate){
        this.isUpdating = setImmediate(this.reRender.bind(this));
      }else{
        clearImmediate(this.isUpdating);
        this.isUpdating = false;
      }
    };

    TemboComponent.prototype.reRender = function(){
      Tembo._.deeplyCompare(this.instance,this.render());
    };

    return TemboComponent;
  };
};
