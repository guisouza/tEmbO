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
