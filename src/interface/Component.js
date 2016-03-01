var eventFunctions = [
  'componentWillMount',
  'componentDidMount',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
  'componentDidUnmount',
  'render'
];
var TemboComponent;
module.exports = TemboComponent = function(renderNode){
  if (!renderNode) throw new Error('renderNode required');
  this.renderNode = renderNode;
  this.props = {};
  this.state = void 0;
  this._newState = this.getInitialState ? this.getInitialState() : {};
  this._stateChanged = false;
  this._isUpdating = true;
};
TemboComponent.extend = function(mixin,updater){
  var ExtendedComponent = function(renderNode){
    if (!(this instanceof ExtendedComponent)){
      return new ExtendedComponent(renderNode);
    }
    TemboComponent.call(this,renderNode);
    this.updater = updater;
  };

  ExtendedComponent.prototype = Object.create(TemboComponent.prototype);
  ExtendedComponent.prototype.constructor = ExtendedComponent;
  Object.keys(mixin).forEach(function(key){
    var method = mixin[key];
    if (eventFunctions.indexOf(key) > -1){
      ExtendedComponent.prototype['__' + key + '__'] = method;
    }else{
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
      return this['__' + eventName + '__']();
    }
  };
});

TemboComponent.prototype.render = function(){
  if (!this.state || this._isUpdating){
    // component setState and all that
    this._isUpdating = false;
    this.state = this._newState;
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

  if (shouldUpdate){
    this.updater.add(this);
  }else{
    this.updater.remove(this);
  }
};
