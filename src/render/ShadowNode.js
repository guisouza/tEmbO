var UTIL = require('./util');

var ShadowNode;

module.exports = ShadowNode = function(patch,options){
  this.shadow = options.shadow;
  this.native = options.native;
  this.elem = new patch.type(this);
  this.elem.props = patch.props;
  this.elem.props.children = patch.children;
  this.elem.state = this.elem.getInitialState ? this.elem.getInitialState() : {};

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
  this.elem._isUpdating = true;
  var newProps = patch.props;
  newProps.children = patch.children;

  this.elem.componentWillRecieveProps(newProps);
  this.elem.props = newProps;
  this.elem.componentDidRecieveProps(oldProps);

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
