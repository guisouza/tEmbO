require('setimmediate');

var BatchUpdate;
module.exports = BatchUpdate = function(){
  this.toRerender = new Set();
  this.immediateID = void 0;
};

var proto = BatchUpdate.prototype;

proto.rerender = function(){
  var cleared = false;
  var nextNodes = Array.from(this.toRerender);
  this.toRerender = new Set();
  var _this = this;
  return this.renderNodes(nextNodes).then(function(){
    if (_this.toRerender.length) return _this.rerender();
    _this.immediateID = false;
    return true;
  },function(e){
    console.error(e);
  });
};

proto.renderNodes = function(nextNodes){
  /*
    its actually possible to rerender in parallel
    What would have to be done is to run siblings in a nested way
    For now just having them appropriately sorted is nice
  */

  var promised = new Map();
  var possiblyIndependent = nextNodes.map(function(component){
    return component.renderNode;
  });
  var offset = 0;
  return Promise.all(nextNodes.reduce(function(pending,component,i){
    var renderNode = component.renderNode;
    if (!component._isUpdating) return pending;
    if (renderNode.destroyed) return pending;
    var propProvider;
    if (possiblyIndependent.some(function(oRenderNode){
      var oComponent;
      if (renderNode === oRenderNode) return;
      if (isAncestorOf(renderNode,oRenderNode)){
        propProvider = oComponent;
        possiblyIndependent.splice(i-offset--,1);
        return true;
      }
      if (isShadowOf(renderNode,oRenderNode)){
        propProvider = oComponent;
        possiblyIndependent.splice(i-offset--,1);
        return true;
      }
    })){
      var waiting = promised.get(ancestor);
      if (!waiting){
        waiting = [];
        promised.set(ancestor,waiting);
      }
      waiting.push(component);
      return pending;
    }
    var ret = component.renderNode.setPatch(component.render());
    pending.push(Promise.resolve(ret || true).then(function(){
      var waiting = promised.get(component);
      if (!waiting) return;
      return this.renderNodes(waiting);
    }.bind(this)));
    return pending;
  },[]));
};

proto.add = function(component){
  if (component._isUpdating) return;
  component._isUpdating = true;
  if (this.toRerender.has(component)) return;
  this.toRerender.add(component);
  if (this.toRerender.length > 1) return;
  this.immediateID = setImmediate(this.rerender.bind(this));
};

proto.remove = function(component){
  if (!component._isUpdating) return;
  component._isUpdating = false;
  if (!this.toRerender.has(component)) return;
  this.toRerender.remove(component);
  if (this.toRerender.length > 0) return;
  clearImmediate(this.immediateID);
  this.immediateID = false;
};

function isAncestorOf(possible,child){
  var parent = child.parent;
  while(parent){
    if (possible === parent) return true;
    parent = parent.parent;
  }
  return false;
}

function isShadowOf(possible,figure){
  var shadow = figure.shadow;
  while(shadow){
    if (possible === shadow) return true;
    shadow = figure.shadow;
  }
  return false;
}
