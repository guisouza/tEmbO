var eventFunctions = [
  'componentWillMount',
  'componentDidMount',
  'componentWillRecieveProps',
  'componentDidRecieveProps',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
  'componentDidUnmount',
  'render'
];
var TemboComponent;
var util = require('../render/util');
module.exports = TemboComponent = function(renderNode){
  if (!renderNode) throw new Error('renderNode required');
  this.renderNode = renderNode;
  this.state = void 0;
  this._newState = {};
  this._stateChanged = false;
  this._isUpdating = true;
  Object.keys(this).forEach(function(key){
    if (typeof this[key] === 'function') this[key] = this[key].bind(this);
  }.bind(this));
};
TemboComponent.extend = function(mixin){
  var personalMethods = [];
  var ExtendedComponent = function(renderNode){
    if (!(this instanceof ExtendedComponent)){
      return new ExtendedComponent(renderNode);
    }
    TemboComponent.call(this,renderNode);
    personalMethods.forEach(function(key){
      this[key] = this[key].bind(this);
    }.bind(this));
  };

  ExtendedComponent.prototype = Object.create(TemboComponent.prototype);
  ExtendedComponent.prototype.constructor = ExtendedComponent;
  Object.keys(mixin).forEach(function(key){
    var method = mixin[key];
    if (eventFunctions.indexOf(key) > -1){
      ExtendedComponent.prototype['__' + key + '__'] = method;
    }else{
      if (typeof method === 'function'){
        personalMethods.push(key);
      }
      ExtendedComponent.prototype[key] = method;
    }
  });

  if (mixin.displayName)
    ExtendedComponent.displayName = mixin.displayName;

  ExtendedComponent.isTemboComponent = true;
  return ExtendedComponent;
};

TemboComponent.prototype.attachProps = function(props,content){
  // var didUpdate = false;
  // var oldProps = this.props;
  var newProps = {};
  if (typeof props === 'object')
  Object.keys(props).forEach(function(prop){
    newProps[prop] = props[prop];
  });
  if (!(content instanceof Array)){
    content = [content];
  }
  newProps.children = content;

  this.props = newProps;
};

TemboComponent.prototype.isTemboComponent =
TemboComponent.isTemboComponent =
true;

eventFunctions.forEach(function(eventName){
  TemboComponent.prototype[eventName] = function(){
    if (typeof this['__' + eventName + '__'] === 'function'){
      return this['__' + eventName + '__'].apply(this,arguments);
    }
  };
});

TemboComponent.prototype.render = function(){
  if (!this.state || this._isUpdating){
    // component setState and all that
    this._isUpdating = false;
    if (this.state) util.merge(this.state,this._newState);
    else this.state = this._newState;
    this._newState = {};
  }
  var renderResult = this.__render__();

  // if (!this.oldInstance){

  // }
  // this.instance = renderResult;

  return renderResult;
};

TemboComponent.prototype.setState = function(state){
  var newState = this._newState;
  var curState = this.state || {};
  Object.keys(state).forEach(function(key){
    newState[key] = state[key];
    if (newState[key] === curState[key]){
      delete newState[key];
    }
  });

  var shouldUpdate = Object.keys(newState).length;
  if (this._isUpdating) return;
  if (shouldUpdate){
    this.renderNode.native.updater.add(this);
  }else{
    this.renderNode.native.updater.remove(this);
  }
};
