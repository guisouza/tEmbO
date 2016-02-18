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

  Tembo._.patchAttributes = function(instance,newInstance){

    Array.prototype.forEach.call(newInstance.attributes,function(attr){

      if (attr.localName !== 'data-tamboid'){
        instance.setAttribute(attr.localName,attr.value);
      }

    });
  };

  Tembo._.patchChildren = function(instance,newInstance){

    var SilentDiff = {};
    Array.prototype.forEach.call(instance.children,function(element){
      if (!SilentDiff[element.getAttribute('data-tamboId')])
        SilentDiff[element.getAttribute('data-tamboId')] = {};

      SilentDiff[element.getAttribute('data-tamboId')].a = element;
    });

    Array.prototype.forEach.call(newInstance.children,function(element){
      if (!SilentDiff[element.getAttribute('data-tamboId')])
        SilentDiff[element.getAttribute('data-tamboId')] = {};
      SilentDiff[element.getAttribute('data-tamboId')].b = element;
    });

    for(var key in SilentDiff){
        var patch = SilentDiff[key];
        if (patch.a === undefined && patch.b !== undefined){
          Tembo._.upCall('componentWillUnmount',patch.b);
          instance.appendChild(patch.b);
        }
        if (patch.a !== undefined && patch.b === undefined){
          Tembo._.upCall('componentWillUnmount',patch.a);
          instance.removeChild(patch.a);
        }
    }

      // newInstance.attributes,function(attr){
      // instance.setAttribute(attr.localName,attr.value);
    // });
  };

  Tembo._.patchText = function(instance,newInstance){
    if (!instance.hasChildNodes()){
        instance.textContent = newInstance.textContent;
    }
  };

  //File : src/Tembo._.deeplyCompare.js

  Tembo._.deeplyCompare = function(element,reRenderedElement){

    var instance = element;
    var newInstance = reRenderedElement;

    newInstance.instance = newInstance.render();
    newInstance.instance.component = newInstance;

    Tembo._.patchAttributes(instance.instance,newInstance.instance);
    Tembo._.patchText(instance.instance,newInstance.instance);
    Tembo._.patchChildren(instance.instance,newInstance.instance);

    return false;

  };
};
