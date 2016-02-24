//File : src/Tembo.js

var TemboConstructor = function(renderer){
  if (!(this instanceof TemboConstructor)) return new TemboConstructor(renderer);
  this._ = {};
  this.$ = renderer;
  this.components = {};

  require('./core/Tembo.core.can.js')(this);
  require('./core/Tembo.core.componentFactory.js')(this);
  require('./core/Tembo.core.deeplyCompare.js')(this);
  require('./core/tembo.El.js')(this);

  require('./interface/tembo.createClass.js')(this);
  require('./interface/tembo.createElement.js')(this);
  require('./interface/tembo.render.js')(this);

};

module.exports = TemboConstructor;

if (!module.parent && typeof window === 'object'){
  window.Tembo = new TemboConstructor(require('./renderers/DOM.js'));
}
