
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
