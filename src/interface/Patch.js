

module.exports = function Patch(type,props,content){
  if (typeof type === 'undefined'){
    throw new Error('A type needs to be provided when creating a component');
  }
  this.type = type;
  this.props = {};
  if (props)
    this.props = props;

  this.children = content instanceof Array ? content : content ? [content] : [];
};
