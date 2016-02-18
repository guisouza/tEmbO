
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

  Tembo._.can('render',function(component){
    component.instance = Tembo.renderTree(component);
    return Tembo.$.render(component,arguments);
  });
};
