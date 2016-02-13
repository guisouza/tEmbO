(function(Tembo){
  'use strict';
  Tembo._.can('renderTree',function(component){
    if (component.render){
      component.instance = component.render();
      component.instance.component = component;
      return Tembo.renderTree(component.instance);
    }
    return component;
  });
})(this.Tembo);



//File : src/Tembo.render.js

(function(Tembo){
  'use strict';
  Tembo._.can('render',function(component,element){

    component.instance = Tembo.renderTree(component);
    Tembo.append(element,component.instance);

  });
})(this.Tembo);
