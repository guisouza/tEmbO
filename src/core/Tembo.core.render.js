

var RenderNode;

module.exports = RenderNode = function(patch,options){
  this.shadow = options.shadow;
  this.parent = options.parent;
  this._renderer = options.renderer;
  this.lastPatch = patch;
  this.children = [];
  if (this.Render.isElement(patch)){
    console.log('TODO:',
      'When providing a preExisting element, can extract a lastPatch.',
      'This would be useful when creating isomorphic applications since',
      'what already exists is the same as what the application would define.',
      'An important part in that respect is ensuring that the provided is the',
      'exact same as what would be rendered'
    );
    this.elem = patch;
  }else{
    this.elem = this.renderPatchType(patch);
    patchNode(this,patch);
  }
};

RenderNode.makeTree = function(Renderer,container,patch){
  var root = new RenderNode(container,{ renderer : Renderer });
  var rootComponent = new RenderNode(patch,{ parent : root });
  return main;
};

RenderNode.patchNode = patchNode;

var proto = RenderNode.prototype;

proto.renderPatchType = function(patch){
  var element;
  if (typeof patch === 'string') return this.Render.createText(elem);
  if (!patch) return null;
  if (typeof patch !== 'object'){
    throw new Error('Cannot make patch of ' + patch);
  }
  if (!patch.type.isTemboComponent){
    return this.Render.createElement(patch.type);
  }
  var Element = patch.type;
  return new Element(this);
};

proto.updateNative = function(patch){
  var $ = this.Render;
  if (typeof patch === 'string'){
    return $.setText(this.elem,patch);
  }

  var nativeContainer = this.elem;
  var props = Object.create(newPatch.props);
  var childrenPatches = newPatch.children;
  delete props.children;

  Object.keys(props).forEach(function(key){
    $.setProp(nativeContainer,key,props[key]);
  });
  var child;
  var childLength = this.children.length;
  var patchLength = childrenPatches.length;
  var min = Math.min(childLength,patchLength);
  for(var i=0; i < min; i++){
    var childPatch = childrenPatches[i];
    child = this.children[i];
    patchNode(child,childPatch);
  }

  var Class = this.prototype;
  while(childLength < patchLength){
    var newChild = new RenderNode(childrenPatches[i],{ parent : this });
    this.children.push(newChild);
    childLength++;
  }
  while(childLength > patchLength){
    child = this.pop();
    var childNative = child.nativeFigure;
    child.remove();
    if (childNative){
      $.removeChild(nativeContainer,childNative);
    }
  }

  return nativeContainer;
};

Object.defineProperty(proto,'isNative',{
  get : function(){ return isNative(this.elem); }
});

Object.defineProperty(proto,'parent',{
  get : function(){
    console.log(this.shadow);
    return this.shadow ? this.shadow.parent : this._parent;
  },
  set : function(parent){
    if (!parent) return;
    if (this.shadow) this.shadow.parent  = parent;
    else this._parent = parent;
  }
});

Object.defineProperty(proto,'nativeFigure',{
  get : function(){
    return this.isNative ? this.elem :
      this.figure ? this.figure.nativeFigure :
      null
    ;
  }
});

Object.defineProperty(proto,'index',{
  get : function(){
    return this.nativeRoot.index;
  }
});

proto.setFigure = function(newFigure){
  var oldFigure = this.figure;
  var oldElem = this.nativeFigure;
  if (oldFigure) oldFigure.remove();
  if (!oldFigure && !newFigure) return null;
  var newElem = newFigure.nativeFigure;
  var nativeParent = this.parent.nativeFigure;
  if (!parent) return;
  if (oldElem)
  if (newElem) return this.Render.replaceChild(nativeParent,oldElem,newElem);
  else return this.Render.removeChild(nativeParent,oldElem);

  var i = this.index;
  if (i === -1){
    return this.Render.appendChild(nativeParent,newElem);
  }
  this.Render.insertChild(nativeParent,newElem,i);
};

proto.remove = function(){
  // component will unmount
  if (this.isNative){
    return this.Render.removeChild(nativeParent,oldElem);
  }

  // component did unmount
};

function patchNode(node,newPatch){
  var lastPatch = node.lastPatch;
  node.lastPatch = newPatch;
  if (!lastPatch && !newPatch) return;
  if (differentTypes(lastPatch,newPatch)){
    var newFigure;
    if (!inNative(newPatch)){
      newFigure = new RenderNode(newPatch,{ shadow : node });
    }else{
      throw new Error('Unknown Type for ' + newPatch);
    }

    return node.setFigure(newFigure);
  }

  if (differentPatch(lastPatch,newPatch)){
    if (node.isNative){
      return node.updateNative(newPatch);
    }
    var figure = node.figure;
    attachProps(figure.elem,newPatch.props,newPatch.children);
    patchNode(figure,figure.elem.render());
  }
}

function attachProps(element,props,content){
  var prop;
  if (!element.props){
    element.props = {};
  }
  if (props !== undefined && props !== null)
    for(prop in props){
      element.props[prop] = props[prop];
    }
  element.props.children = content;
  return element;
}

function isNative(component){
  return !component || typeof component !== 'object' || !component.isTemboComponent;
}

function differentTypes(a,b){
  //Check if one is null and the otherone isn't
  if ((!a && b) || (!b && a)) return true;
  if (typeof a !== typeof b) return true;
  switch(typeof a){
    case 'string': return false;
    case 'object': return a.type === b.type;
  }
}

function differentPatch(a,b){
  if (typeof a === 'string') return a !== b;
  if (!deepCompare(a.props,b.props)) return true;
  if (a.children.length !== b.children.length) return true;
  return a.some(function(aChild,index){
    var bChild = b[index];
    if (!aChild && !bChild) return false;
    if (differentTypes(a,b)) return true;
    return differentPatch(aChild,bChild);
  });
}
