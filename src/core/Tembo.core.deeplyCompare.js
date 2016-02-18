var deepEqual = require('deep-equal');

module.exports = function(Tembo){
  'use strict';
  Tembo._.upCall = function(lifecycleMethod,instance){
    if (instance.component){
      if (instance.component.componentWillUnmount){
        instance.component[lifecycleMethod]();
      }else{
        Tembo._.upCall(lifecycleMethod,instance.component);
      }
    }else{
      console.log('if your code reach this line, send-me a e-mail gui_souza@me.com . I would love to work with you in my new project');
    }
  };

  Tembo._.patchAttributes = function(component,newComponent){

    var instance = component.instance;
    var oldProps = component.props;
    var newProps = newComponent.props;

    Object.keys(newProps).forEach(function(key){
      if (key === 'data-tamboId') return;
      if (key === 'children') return;
      if (oldProps[key] === newProps[key]) return;
      Tembo.$.setProp(instance,key,newProps[key]);
    });
  };

  Tembo._.patchChildren = function(instance,newInstance){

    var SilentDiff = {};
    var children = Tembo.$.getChildren(intstance);
    children.forEach(function(element){
      var id = Tembo.$.getId(element);
      if (!SilentDiff[id]) SilentDiff[id] = {};

      SilentDiff[id].a = element;
    });

    var newChildren = Tembo.$.getChildren(newInstance);
    newChildren.forEach(function(element){
      var id = Tembo.$.getId(element);
      if (!SilentDiff[id]) SilentDiff[id] = {};
      SilentDiff[id].b = element;
    });

    Object.keys(SilentDiff).forEach(function(key){
      var patch = SilentDiff[key];
      if (patch.a === void 0 && patch.b !== void 0){
        Tembo._.upCall('componentWillMount',patch.b);
        Tembo.$.appendChild(instance,patch.b);
      }else if (patch.a !== void 0 && patch.b === void 0){
        Tembo._.upCall('componentWillUnmount',patch.a);
        Tembo.$.removeChild(instance,patch.a);
      } // else{
      // if a !== b
      // Tembo._.upCall('componentWillUpdate',patch.a,patch.b);
      // Tembo.$.replace(instance,patch.a,patch.b);
      // }
    });

    // newInstance.attributes,function(attr){
    // instance.setAttribute(attr.localName,attr.value);
    // });
  };

  Tembo._.patchText = function(instance,newInstance){
    var children = Tembo.$.getChildren(newInstance);
    if (!children.length || children.length === 1 && Tembo.$.isText(children[0])){
      var oldChildren = Tembo.$.getChildren(newInstance);
      if (oldChildren.length){
        oldChildren.forEach(function(child){
          Tembo._.upCall('componentWillUnmount',child);
          Tembo.$.removeChild(instance,child);
        });
      }
      Tembo.$.setText(instance,Tembo.$.getText(newInstance));
      return true;
    }
  };

  //File : src/Tembo._.deeplyCompare.js

  Tembo._.deeplyCompare = function(element,reRenderedElement){

    var instance = element;
    var newInstance = reRenderedElement;

    var dirty = Tembo._.compareChildren(element, reRenderedElement);

    newInstance.instance = newInstance.render();
    newInstance.instance.component = newInstance;

    Tembo._.patchAttributes(instance,newInstance);
    if (!Tembo._.patchText(instance.instance,newInstance.instance)){
      Tembo._.patchChildren(instance.instance,newInstance.instance);
    }

    return false;

  };
};
