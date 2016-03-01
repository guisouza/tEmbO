

module.exports = function Patch(type,props,content){
  this.type = type;
  this.props = {};
  if (props)
    this.props = props;

  this.children = content instanceof Array ? content : content ? [content] : [];
};
