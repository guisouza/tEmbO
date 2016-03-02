(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Component = require('./interface/Component');
var Patch = require('./interface/Patch');
var NativeRoot = require('./render/NativeRoot');

var SyncUpdate = require('./updaters/SyncUpdate');

//File : src/Tembo.js

var TemboConstructor = function(renderer,updater){
  this.updater = updater || new SyncUpdate();

  var tembo = {
    _ : {},
    components : {}
  };
  require('./core/Tembo.core.can.js')(tembo);

  tembo._.can('createClass',TemboConstructor.createClass);

  // File : src/Tembo.createElement.js
  tembo._.can('createElement',TemboConstructor.createElement);

  tembo._.can('render',function(component,nativeParent){
    var root = NativeRoot.makeTree(renderer,nativeParent,component);
    return renderer.render(root);
  });

  tembo._.can('getNative',function(component){
    return component.renderNode.native.elem;
  });

  return tembo;
};

TemboConstructor.updater = new SyncUpdate();

TemboConstructor.createClass = function(structure){
  return Component.extend(structure,this.updater);
};

TemboConstructor.createElement = function(element,props,content){
  if (!props) props = {};

  if (arguments.length > 3){
    content = [];
    var index = 2;
    while(index < arguments.length){
      content.push(arguments[index]);
      index++;
    }
  }

  return new Patch(element,props,content);
};

module.exports = TemboConstructor;

if (!module.parent && typeof window === 'object'){
  window.Tembo = TemboConstructor(require('./renderers/DOM.js'),new SyncUpdate());
}

},{"./core/Tembo.core.can.js":2,"./interface/Component":3,"./interface/Patch":4,"./render/NativeRoot":5,"./renderers/DOM.js":8,"./updaters/SyncUpdate":9}],2:[function(require,module,exports){
//File : src/Tembo._.can.js

module.exports = function(Tembo){
  'use strict';
  Tembo._.can = function(label,method){
    if (!Tembo[label])
      Tembo[label] = method;
  };
};

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){


module.exports = function Patch(type,props,content){
  this.type = type;
  this.props = {};
  if (props)
    this.props = props;

  this.children = content instanceof Array ? content : content ? [content] : [];
};

},{}],5:[function(require,module,exports){

var UTIL = require('./util');
var ShadowNode = require('./ShadowNode');
var NativeRoot;

module.exports = NativeRoot = function(patch,options){
  this.renderer = options.renderer;
  this.parent = options.parent;
  this.children = [];
  this.setContent(patch);
};

NativeRoot.makeTree = function(Renderer,container,patch){
  var root = new NativeRoot(container,{ renderer : Renderer });
  var rootComponent = new NativeRoot(patch,{ parent : root });
  return [root,rootComponent];
};

var proto = NativeRoot.prototype;

proto.setContent = function(patch){
  var oldPatch = this.oldPatch;
  this.oldPatch = patch;
  if (this.renderer) return (this.elem = patch);

  if (UTIL.differentTypes(oldPatch,patch)){
    if (this.shadowHead) this.shadowHead.remove();
    this.shadowHead = null;
    if (UTIL.isNative(patch)) return this.setPatch(patch);
    if (this.parent){
      this.shadowHead = new ShadowNode(patch,{ native : this });
      return;
    }

    throw new Error('what hapenned');
  }

  if (!UTIL.differentPatch(oldPatch,patch)) return;

  if (this.shadowHead){
    this.shadowHead.setPatch(patch);
  }else{
    this.setProps(patch);
  }
};

proto.setPatch = function(newPatch){
  var oldPatch = this.oldNative;
  this.oldNative = newPatch;
  if (!oldPatch && !newPatch) return;
  if (UTIL.differentTypes(oldPatch,newPatch)){
    this.differentTypeSet(oldPatch,newPatch);
    return this.setProps(newPatch);
  }
  if (UTIL.differentPatch(oldPatch,newPatch)){
    return this.setProps(newPatch);
  }
};

proto.setProps = function(newPatch){
  var $ = this.Render;
  var nativeContainer = this.elem;

  if (!newPatch){
    return;
  }

  if (typeof newPatch === 'string'){
    return $.setText(nativeContainer,newPatch);
  }

  var props = UTIL.clone(newPatch.props);
  var childrenPatches = newPatch.children;
  delete props.children;

  Object.keys(props).forEach(function(key){
    $.setProp(nativeContainer,key,props[key]);
  });
  var children = this.children;
  var childLength = children.length;
  var patchLength = childrenPatches.length;
  var min = Math.min(childLength,patchLength);
  var max = Math.max(childLength,patchLength);
  for(var i=0; i < max; i++){
    if (i < min)
      children[i].setContent(childrenPatches[i]);
    else if (childLength < patchLength)
      children.push(new NativeRoot(childrenPatches[i],{ parent : this }));
    else
      children.pop().remove();
  }

  return nativeContainer;
};

proto.remove = function(){
  if (this.shadowHead) this.shadowHead.remove();
  this.Render.removeChild(this.parent.elem,this.elem);
};

proto.renderPatch = function(patch){
  if (!patch) return null;
  if (typeof patch === 'string') return this.Render.createText(patch);
  if (typeof patch !== 'object'){
    throw new Error('Cannot make patch of ' + patch);
  }
  if (!patch.type.isTemboComponent){
    return this.Render.createElement(patch.type);
  }

  throw new Error('NativeRoot expects only native patches');
};

proto.differentTypeSet = function(oldPatch,newPatch){
  if (!this.parent) return;
  var nativeParent = this.parent.elem;

  var oldNative = this.elem;
  var newNative = this.renderPatch(newPatch);
  this.elem = newNative;
  if (!oldNative && !newNative) return;

  if (oldNative)
  if (newNative){
    return this.Render.replaceChild(nativeParent,oldNative,newNative);
  }else{
    return this.Render.removeChild(nativeParent,oldNative);
  }

  var i = this.index;
  if (i === -1){
    return this.Render.appendChild(nativeParent,newNative);
  }

  this.Render.insertChild(nativeParent,newNative,i);
};

Object.defineProperty(proto,'Render',{
  get : function(){
    return this.parent ? this.parent.Render : this.renderer;
  }
});

Object.defineProperty(proto,'index',{
  get : function(){
    var children = this.parent.children;

    // Its possible to the two iterators below
    // Also possible to cache this
    var count = 0;
    for(var i=0,l=children.length; i < l; i++){
      if (children[i] == this) break;
      if (children[i].elem) count++;
    }
    return count === l ? -1 : count;
  }
});

},{"./ShadowNode":6,"./util":7}],6:[function(require,module,exports){
var UTIL = require('./util');

var ShadowNode;

module.exports = ShadowNode = function(patch,options){
  this.shadow = options.shadow;
  this.native = options.native;
  this.elem = new patch.type(this);

  this.elem.props = patch.props;
  this.elem.props.children = patch.children;

  this.elem.componentWillMount();
  this.render();
  this.elem.componentDidMount();

};

var proto = ShadowNode.prototype;

Object.defineProperty(proto,'parent',{
  get : function(){
    return this.native.parent;
  }
});

proto.setPatch = function(patch){
  var oldProps = this.elem.props;
  var newProps = patch.props;
  newProps.children = patch;

  this.elem.componentRecievedProps(oldProps,newProps);
  this.elem.props = newProps;

  this.update();
};

proto.update = function(){
  // This is called by set state and by props updating
  this.elem.componentWillUpdate();
  this.render();
  this.elem.componentWillUpdate();
};

proto.remove = function(){
  this.elem.componentWillUnmount();

  this.destroyed = true;
  if (this.figure){
    return this.figure.remove();
  }
  this.shadow = void 0;
  this.figure = void 0;
  this.native = void 0;
  this.elem.componentDidUnmount();
};

proto.render = function(){
  var newPatch = this.elem.render();
  var lastPatch = this.lastPatch;
  this.lastPatch = newPatch;
  if (!lastPatch && !newPatch) return;
  if (UTIL.isNative(newPatch)){
    if (this.figure){
      this.figure.remove();
      this.figure = void 0;
    }
    this.native.shadowTail = this;
    return this.native.setPatch(newPatch);
  }

  if (UTIL.differentTypes(lastPatch,newPatch)){
    if (this.figure) this.figure.remove();
    this.figure = new ShadowNode(newPatch,{
      shadow : this,native : this.native
    });
    return this.figure;
  }
  if (UTIL.differentPatch(lastPatch,newPatch)){
    // component will update
    this.figure.setPatch(newPatch);

    // component did update
  }
};

},{"./util":7}],7:[function(require,module,exports){

var isNative,differentTypes,differentPatch,clone,deepCompare;

module.exports.isNative = isNative = function(patch){
  if (!patch) return true;
  if (typeof patch === 'string') return true;
  var type = patch.type;
  return !type.isTemboComponent;
};

module.exports.differentTypes = differentTypes = function(a,b){
  //Check if one is null and the otherone isn't
  var booA = !a,booB = !b;
  if (booA || booB) return booA !== booB;
  if (typeof a !== typeof b) return true;
  if (typeof a === 'string') return false;
  if (typeof a.type === 'string') return a.type !== b.type;
  return a.type !== b.type;
};

module.exports.differentPatch = differentPatch = function(a,b){
  var booA = !a,booB = !b;
  if (booA || booB) return booA !== booB;
  if (typeof a === 'string') return a !== b;
  if (!deepCompare(a.props,b.props)) return true;
  if (!a.children && !b.children) return false;
  if (!a.children || !b.children) return true;
  if (a.children.length !== b.children.length) return true;
  return a.children.some(function(aChild,index){
    var bChild = b[index];
    if (!aChild && !bChild) return false;
    if (differentTypes(a,b)) return true;
    return differentPatch(aChild,bChild);
  });
};

module.exports.clone = clone = function(obj){
  return Object.keys(obj).reduce(function(ret,key){
    ret[key] = obj[key];
    return ret;
  },{});
};

deepCompare = function(a,b){
  var type = typeof a;
  if (type !== typeof b) return false;
  if (type !== 'object') return a === b;
  var akeys = Object.keys(a);
  var bkeys = Object.keys(b);
  if (akeys.length !== bkeys.length) return false;
  return !akeys.some(function(key){
    if (!(key in b)) return true;
    return !deepCompare(a[key],b[key]);
  });
};

},{}],8:[function(require,module,exports){

var DOM = document;

module.exports.setDOM = function(newDom){
  DOM = newDom;
};

if (typeof document === 'object'){
  module.exports.setDOM(document);
}

module.exports.render = function(component,parent){
  return component.instance;
};

module.exports.getId = function(element){
  return element.getAttribute('data-tamboId');
};

module.exports.setId = function(element,id){
  return element.setAttribute('data-tamboId',id);
};

module.exports.setProp = function(element,key,value){
  if (key.indexOf('on') === 0){
    key = key.replace('on','').toLowerCase();
    element.addEventListener(key,value,false);
  }else{
    if (key !== 'children')
    element.setAttribute(key,value);
  }
};

module.exports.appendChild = function(parent,child){
  return parent.appendChild(child);
};

module.exports.insertChild = function(parent,child,index){
  return parent.appendChild(child,parent.childNodes[index]);
};

module.exports.removeChild = function(parent,child){
  return parent.removeChild(child);
};

module.exports.replaceChild = function(parent,oldChild,newChild){
  return parent.replaceChild(newChild,oldChild);
};

module.exports.isElement = function(textNode){
  return textNode.nodeType === 1;
};
module.exports.isText = function(textNode){
  return textNode.nodeType === 3;
};
module.exports.createElement = function(tagName){
  return DOM.createElement(tagName);
};
module.exports.createText = function(text){
  return DOM.createTextNode(text);
};

},{}],9:[function(require,module,exports){
var SyncUpdate;
module.exports = SyncUpdate = function(){};

var proto = SyncUpdate.prototype;

proto.add = function(component){
  if (component.destroyed) return;
  if (component._isUpdating) return;
  component._isUpdating = true;
  component.renderNode.update();
};

proto.remove = function(component){
  if (component.destroyed) return;
  if (!component._isUpdating) return;
  component._isUpdating = false;
};

},{}]},{},[1]);
