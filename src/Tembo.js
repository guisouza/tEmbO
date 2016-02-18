//File : src/Tembo.js

var TemboConstructor = function(){
  var tembo = {
    _ : {},
    components : {}
  };
  require('./core/Tembo.core.can.js')(tembo);
  require('./core/Tembo.core.componentFactory.js')(tembo);
  require('./core/Tembo.core.deeplyCompare.js')(tembo);
  require('./core/tembo.El.js')(tembo);

  require('./interface/tembo.createClass.js')(tembo);
  require('./interface/tembo.createElement.js')(tembo);
  require('./interface/tembo.render.js')(tembo);

  return tembo;
};

var Tembo = TemboConstructor();

Tembo.TemboConstructor = TemboConstructor;

module.exports = Tembo;

if (!module.parent && typeof window === 'object'){
  window.Tembo = Tembo;
}
