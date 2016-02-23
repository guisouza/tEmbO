var deepEqual = require('deep-equal');

module.exports = function(Tembo){
  'use strict';

  //File : src/Tembo._.deeplyCompare.js

  Tembo._.compare = function(element,reRenderedElement){

    var instance = element;
    var newInstance = reRenderedElement;

    // Recursively compare all the children first
    if (!Tembo._.compareTypes(element,reRenderedElement)) return false;
    if (!Tembo._.compareProps(element,reRenderedElement)) return false;
    if (!Tembo._.compareChildren(element,reRenderedElement)) return false;

    return false;

  };

  Tembo._.compareChildren = function(element,newElement){
    var oldChildren = element.props.children;
    var newChildren = newElement.props.children;

    if (oldChildren.length === newChildren.length === 0){
      return true;
    }

    if (oldChildren.length !== newChildren.length){
      return false;
    }

    var clean = true;
    var l = Math.min(oldChildren.length,newChildren.length);
    for(var i = 0; i < l; i++){
      var oldChild = oldChildren[i];
      var newChild = newChildren[i];
      if (!Tembo._.deeplyCompare(oldChild,newChild)){
        return false;
      }
    }

    return true;
  };

  Tembo._.compareTypes = function(oEl,nEl){
    if (oEl === null || nEl === null){
      return nEl === oEl;
    }
    var oType = oEl.type;
    var nType = nEl.type;

    if (typeof oType !== typeof nType) return false;
    return oType === nType;
  };

  Tembo._.compareProps = function(oEl,nEl){
    var oProps = Object.create(oEl.props);
    var nProps = Object.create(nEl.props);

    delete oProps.children;
    delete nProps.children;

    return deepEqual(oProps,nProps);
  };
};
