
module.exports = function(Tembo){
  'use strict';
  Tembo._.can('renderTree',function(component){
    if (component.render){
      component.instance = component.render();
      component.instance.component = component;
      return Tembo.renderTree(component.instance);
    }
    return component;
  });

  Tembo._.can('render',function(component,element){
    component.instance = Tembo.renderTree(component);
    Tembo.appendChild(element,component.instance);

  });
};
