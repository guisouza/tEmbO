var deepEqual = require('deep-equal');

module.exports = function(Tembo){
  'use strict';

  //File : src/Tembo._.deeplyCompare.js

  Tembo._.deeplyCompare = function(element,reRenderedElement){

    var instance = element;
    var newInstance = reRenderedElement;

    // Recursively compare all the children first
    var clean_chidlren = Tembo._.compareChildren(element,reRenderedElement);

    var clean_type = Tembo._.compareTypes(element,reRenderedElement);

    var clean_props = Tembo._.compareProps(element,reRenderedElement);

    // If we are all clean, We don't have to rerender
    if (clean_chidlren && clean_type && clean_props) return true;

    if (element.isTemboComponent){
      // We want to recursively render the current element until it is no longer a TemboComponent
      // Or until we are clean.
      reRenderedElement.rendered = reRenderedElement.render();
      return deeplyCompare(element.rendered,reRenderedElement.rendered);
    }

    newInstance.instance = newInstance.render();
    newInstance.instance.component = newInstance;

    Tembo._.patchAttributes(instance,newInstance);
    if (!Tembo._.patchText(instance.instance,newInstance.instance)){
      Tembo._.patchChildren(instance.instance,newInstance.instance);
    }

    return false;

  };

  Tembo._.compareChildren = function(element,newElement){
    var oldChildren = element.props.children;
    var newChildren = newElement.props.children;

    if (oldChildren.length === newChildren.length === 0){
      return true;
    }
    var clean = true;
    var l = Math.min(oldChildren.length,newChildren.length);
    for(var i = 0; i < l; i++){
      var oldChild = oldChildren[i];
      var newChild = newChildren[i];
      if (!Tembo._.deeplyCompare(oldChild,newChild)){
        clean = false;
      }
    }

    return clean;
  };

  Tembo._.compareTypes = function(oEl,nEl){
    var oType = oEl.type;
    var nType = nEl.type;
    if (oType.env !== nType.env) return false;
    if (oType.proto !== nType.proto) return false;
    return true;
  };

  Tembo._.compareProps = function(oEl,nEl){
    var oProps = Object.create(oEl.props);
    var nProps = Object.create(nEl.props);

    delete oProps.children;
    delete nProps.children;

    return deepEqual(oProps,nProps);
  };
};
