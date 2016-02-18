
module.exports = function(Tembo){
  'use strict';
Tembo._.can('attachProps',function(element,props,content){
  var prop;
  if (element.isTemboComponent && element.isTemboComponent !== undefined){
    if (!element.props){
      element.props = {};
    }
    if (props !== undefined && props !== null)
      for(prop in props){
        element.props[prop] = props[prop];
      }
    element.props.children = content;
  }else{
    element = Tembo.$.createElement(element,props);
    element = Tembo.append(element,content);
  }
  return element;
});

  //File : src/Tembo.El.js

  Tembo.El = function(type,props,content){
    this.type = type;
    this.props = {};
    if (props)
      this.props = props;

    this.props.children = content;
  };

  Tembo.El.prototype.render = function(){
    var element = Tembo.attachProps(this.type,this.props,this.props.children);
    element = Tembo.setInitialState(element);
    element.component = this;
    return element;

  };
};
