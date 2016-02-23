(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//File : src/Tembo.js

var TemboConstructor = function(renderer){
  var tembo = {
    _ : {},
    $ : renderer || require('./renderers/DOM.js'),
    components : {}
  };
  require('./core/Tembo.core.can.js')(tembo);

  // require('./core/Tembo.core.componentFactory.js')(tembo);
  // require('./core/Tembo.core.deeplyCompare.js')(tembo);
  // require('./core/tembo.El.js')(tembo);

  require('./interface/tembo.createClass.js')(tembo);

  // require('./interface/tembo.createElement.js')(tembo);
  // require('./interface/tembo.render.js')(tembo);

  return tembo;
};

var Tembo = TemboConstructor();

Tembo.TemboConstructor = TemboConstructor;

module.exports = Tembo;

if (!module.parent && typeof window === 'object'){
  window.Tembo = Tembo;
}

},{"./core/Tembo.core.can.js":5,"./interface/tembo.createClass.js":6,"./renderers/DOM.js":10}],2:[function(require,module,exports){
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
  this.state = this.getInitialState ? this.getInitialState() : {};
  this._newState = {};
  this._stateChanged = false;
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
  for(var key in mixin){
    var method = mixin[key];
    if (eventFunctions.indexOf(key) > -1){
      ExtendedComponent.prototype['__' + key + '__'] = method;
    }else{
      ExtendedComponent.prototype[key] = method;
    }
  }
  if (mixin.displayName)
    ExtendedComponent.displayName = mixin.displayName;

  ExtendedComponent.isTemboComponent = true;
  return ExtendedComponent;
};

TemboComponent.prototype.attachProps = function(props,content){
  var didUpdate = false;
  var oldProps = this.props;
  var newProps = {};
  if (typeof props === 'object')
  for(var prop in props){
    newProps[prop] = props[prop];
  }
  if (!(content instanceof Array)){
    content = [content];
  }
  newProps.children = content;

  this.props = newProps;

  if (oldProps) Tembo.call('componentDidUpdate',this,oldProps);
  else Tembo.call('componentDidMount',this);
};

TemboComponent.prototype.isTemboComponent =
TemboComponent.isTemboComponent = true;

TemboComponent.prototype.render = function(){
  if (this._isUpdating){
    // component setState and all that
    this._isUpdating = false;
    this.state = this._newState;
    this._newState = {};
  }
  var renderResult = this.__render__();

  // if (!this.oldInstance){

  // }
  // this.instance = renderResult;
  renderResult.component = this;

  return renderResult;
};

TemboComponent.prototype.componentWillUnmount = function(){
  if (this.__componentWillUnmount__){
    return this.__componentWillUnmount__();
  }
};

TemboComponent.prototype.isTemboComponent = true;
TemboComponent.prototype.setState = function(state){
  var newState = this._newState;
  var curState = this.state;
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

},{}],3:[function(require,module,exports){


module.exports = function Patch(type,props,content){
  this.type = type;
  this.props = {};
  if (props)
    this.props = props;

  this.children = content;
};

},{}],4:[function(require,module,exports){
var SyncUpdate;
module.exports = SyncUpdate = function(){};

var proto = SyncUpdate.prototype;

proto.add = function(component){
  if (component.destroyed) return;
  if (component._isUpdating) return;
  component._isUpdating = true;
  component.renderNode.setPatch(component.render());
};

proto.remove = function(component){
  if (component.destroyed) return;
  if (!component._isUpdating) return;
  component._isUpdating = false;
};

},{}],5:[function(require,module,exports){
//File : src/Tembo._.can.js

module.exports = function(Tembo){
  'use strict';
  Tembo._.can = function(label,method){
    if (!Tembo[label])
      Tembo[label] = method;
  };
};

},{}],6:[function(require,module,exports){
var Component = require('../core/Component');
var Patch = require('../core/Patch');
var Updater = require('../core/SyncUpdate');
var NativeRoot = require('../render/NativeRoot');

// File : src/Tembo.createClass.js

module.exports = function(Tembo){
  'use strict';
  var updater = new Updater();
  Tembo._.can('createClass',function(structure){
    return Component.extend(structure,updater);
  });

  // File : src/Tembo.createElement.js
  Tembo._.can('createElement',function(element,props,content){
    if (!props)
      props = {};

    if (arguments.length > 3){
      content = [];
      var index = 2;
      while(index < arguments.length){
        content.push(arguments[index]);
        index++;
      }
    }

    return new Patch(element,props,content);
  });

  Tembo._.can('render',function(component,nativeParent){
    var root = NativeRoot.makeTree(Tembo.$,nativeParent,component);
    return Tembo.$.render(component,nativeParent);
  });

};

},{"../core/Component":2,"../core/Patch":3,"../core/SyncUpdate":4,"../render/NativeRoot":7}],7:[function(require,module,exports){

var UTIL = require('./util');
var ShadowNode = require('./ShadowNode');
var NativeRoot;

module.exports = NativeRoot = function(patch,options){
  this.renderer = options.renderer;
  this.parent = options.parent;
  this.children = [];

  if (this.renderer){
    this.elem = patch;
  }else if (UTIL.isNative(patch)){
    this.setPatch(patch);
  }else if (this.parent){
    this.shadowHead = new ShadowNode(patch,{ native : this });
  }else{
    throw new Error('what hapenned');
  }
};

NativeRoot.makeTree = function(Renderer,container,patch){
  var root = new NativeRoot(container,{ renderer : Renderer });
  var rootComponent = new NativeRoot(patch,{ parent : root });
  return root;
};

var proto = NativeRoot.prototype;

proto.setPatch = function(newPatch){
  var oldPatch = this.oldPatch;
  this.oldPatch = newPatch;
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
      children[i].setPatch(childrenPatches[i]);
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
  var element;
  if (!patch) return null;
  if (typeof patch === 'string') return this.Render.createText(elem);
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
      if (children[i] = this) break;
      if (children[i].nativeFigure) count++;
    }
    return count === l ? -1 : count;
  }
});

},{"./ShadowNode":8,"./util":9}],8:[function(require,module,exports){
var UTIL = require('./util');

var ShadowNode;

module.exports = ShadowNode = function(patch,options){
  this.shadow = options.shadow;
  this.native = options.native;
  this.elem = new patch.type(this);
  this.setPatch(patch);

  //component did mount
};

var proto = ShadowNode.prototype;

Object.defineProperty(proto,'parent',{
  get : function(){
    return this.native.parent;
  }
});

proto.setPatch = function(patch){
  var oldProps = this.elem.props;
  this.elem.props = patch.props;
  this.elem.props.children = patch.children;
  this.render();
};

proto.remove = function(){
  // component will unmount
  this.elem.remove();
  this.destroyed = true;
  if (this.figure){
    return this.figure.remove();
  }

  // component did unmount
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
    return this.figure = new ShadowNode(newPatch,{
      shadow : this,native : this.native
    });
  }
  if (UTIL.differentPatch(lastPatch,newPatch)){
    // component will update
    this.figure.setPatch(newPatch);

    // component did update
  }
};

},{"./util":9}],9:[function(require,module,exports){
module.exports.isNative = function isNative(patch){
  var type = patch.type;
  if (!type) return true;
  if (typeof type === 'string') return true;
  return !type.isTemboComponent;
};

module.exports.differentTypes = function differentTypes(a,b){
  //Check if one is null and the otherone isn't
  debugger;
  if ((!a && b) || (!b && a)) return true;
  if (typeof a !== typeof b) return true;
  switch(typeof a){
    case 'string': return false;
    case 'object': return a.type !== b.type;
  }
};

module.exports.differentPatch = function differentPatch(a,b){
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

module.exports.clone = function(obj){
  return Object.keys(obj).reduce(function(ret,key){
    ret[key] = obj[key];
    return ret;
  },{});
};

function deepCompare(a,b){
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
}

},{}],10:[function(require,module,exports){

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

},{}]},{},[1]);
