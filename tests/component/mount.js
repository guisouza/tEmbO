var Tembo = require('../../src/Tembo');
var TestRender = require('../../src/renderers/Test');

var renderer = new TestRender();
var tembo = new Tembo(renderer);

module.exports = function(at){
  at.test('mounted by developer',function(t){
    var rInsert = false,pInsert = false;
    renderer.on('insert',function(){
      rInsert = true;
    });
    var root = new TestRender.TreeNode('root');
    root.on('insertChild',function(){
      pInsert = true;
    });
    var mountTriggers = {};
    var el = createMountListener(t,mountTriggers);
    tembo.render(tembo.createElement(el,{ type : 'string' },[]),root);
    runMountTest(t,mountTriggers);
    t.ok(rInsert,'insert happened in renderer');
    t.ok(pInsert,'insertChild happened in rootNode');
    renderer.removeAllListeners('insert');
  });
  at.test('mounted by shadow',function(t){
    var rInsert = false,pInsert = false;
    renderer.on('insert',function(){
      rInsert = true;
    });
    var root = new TestRender.TreeNode('root');
    root.on('insertChild',function(){
      pInsert = true;
    });
    var smt = {};
    var fmt = {};
    var sel = createMountListener(t,smt,'shadow');
    var fel = createMountListener(t,fmt,'figure');
    tembo.render(tembo.createElement(sel,{
      type : 'element',
      element : tembo.createElement(fel,{ type : 'string' },[])
    },[]),root);
    runMountTest(t,smt,'shadow');
    runMountTest(t,fmt,'figure');
    t.ok(smt.render < fmt.beforeMount,'shadow renders before figure beforeMount');
    t.ok(fmt.afterMount < smt.afterMount,'figure afterMount happens before shadow afterMount');
    t.ok(rInsert,'insert happened in renderer');
    t.ok(pInsert,'insertChild happened in rootNode');
    renderer.removeAllListeners('insert');
  });
  at.test('mounted by by parent',function(t){
    var rInsert = 0,pInsert = 0;
    renderer.on('insert',function(){
      rInsert++;
    });
    var root = new TestRender.TreeNode('root');
    root.on('insertChild',function(){
      pInsert++;
    });
    var pmt = {};
    var cmt = {};
    var pel = createMountListener(t,pmt,'parent');
    var cel = createMountListener(t,cmt,'child');
    tembo.render(tembo.createElement(pel,{
      type : 'element',
      element : tembo.createElement('container',{},[
        tembo.createElement(cel,{ type : 'string' },[])
      ])
    },[]),root);
    runMountTest(t,pmt,'parent');
    runMountTest(t,cmt,'child');
    t.ok(pmt.render < cmt.beforeMount,'parent renders before child beforeMount');
    t.ok(cmt.afterMount < pmt.afterMount,'child afterMount happens before parent afterMount');
    t.equal(rInsert,2,'insert happened twice in renderer');
    t.ok(pInsert,'insertChild happened in rootNode');
    renderer.removeAllListeners('insert');
  });
};

function createMountListener(t,mountTriggers,prefix){
  if (!prefix) prefix = '';
  else prefix +=': ';
  return tembo.createClass({
    componentWillMount : function(){
      mountTriggers.beforeMount = Date.now();
      t.test('beforeMount',function(beforeMount){
        beforeMount.notOk(root.children.length,prefix+'no children exist');
      });
    },componentDidMount : function(){
      mountTriggers.afterMount = Date.now();
      t.test('afterMount',function(afterMount){
        afterMount.ok(root.children.length,prefix+'children exist');
        afterMount.equal(root.children.length,1,prefix+'one child exists');
        afterMount.equal(root.children[0],tembo.getNative(this),prefix+'The child is equal to the native element');
      });
    },render : function(){
      mountTriggers.render = Date.now();
      switch(this.props.type){
        case 'string': return 'string';
        case 'element': return this.props.element;
      }
    }
  });
}

function runMountTest(t,mountTriggers,prefix){
  if (!prefix) prefix = '';
  else prefix +=': ';

  t.ok(mountTriggers.beforeMount,prefix+'componentWillMount triggered');
  t.ok(mountTriggers.render,prefix+'render triggered');
  t.ok(mountTriggers.afterMount,prefix+'componentDidMount triggered');
  t.ok(mountTriggers.beforeMount < mountTriggers.render,prefix+'beforeMount happened before render');
  t.ok(mountTriggers.render < mountTriggers.afterMount,prefix+'render happened before afterMount');
}
