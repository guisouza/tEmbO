var Tembo = require('../../src/Tembo');
var TestRender = require('../../src/renderers/Test');

var renderer = new TestRender();
var tembo = new Tembo(renderer);

var runMountTest,createMountListener;
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
    var el = createMountListener(t,root,mountTriggers);
    tembo.render(tembo.createElement(el,{ type : 'string' },[]),root);
    runMountTest(t,root,mountTriggers);
    t.ok(rInsert,'insert happened in renderer');
    t.ok(pInsert,'insertChild happened in rootNode');
    renderer.removeAllListeners('insert');
    t.end();
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
    var sel = createMountListener(t,root,smt,'shadow');
    var fel = createMountListener(t,root,fmt,'figure');
    tembo.render(tembo.createElement(sel,{
      type : 'element',
      element : tembo.createElement(fel,{ type : 'string' },[])
    },[]),root);
    runMountTest(t,root,smt,'shadow');
    runMountTest(t,root,fmt,'figure');
    t.ok(smt.render <= fmt.beforeMount,'shadow renders before figure beforeMount');
    t.ok(fmt.afterMount <= smt.afterMount,'figure afterMount happens before shadow afterMount');
    t.ok(rInsert,'insert happened in renderer');
    t.ok(pInsert,'insertChild happened in rootNode');
    renderer.removeAllListeners('insert');
    t.end();
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
    var pel = createMountListener(t,root,pmt,'parent');
    var cel = createMountListener(t,void 0,cmt,'child');
    tembo.render(tembo.createElement(pel,{
      type : 'element',
      element : tembo.createElement('container',{},[
        tembo.createElement(cel,{ type : 'string' },[])
      ])
    },[]),root);
    runMountTest(t,root,pmt,'parent');
    runMountTest(t,root,cmt,'child');
    t.ok(pmt.render <= cmt.beforeMount,'parent renders before child beforeMount');
    t.ok(cmt.afterMount <= pmt.afterMount,'child afterMount happens before parent afterMount');
    t.equal(rInsert,2,'insert happened twice in renderer');
    t.ok(pInsert,'insertChild happened in rootNode');
    renderer.removeAllListeners('insert');
    t.end();
  });
  at.end();
};

createMountListener = function(t,root,mountTriggers,prefix){
  if (!prefix) prefix = '';
  else prefix +=': ';
  return tembo.createClass({
    componentWillMount : function(){
      mountTriggers.beforeMount = Date.now();
      if (root){
        t.test('beforeMount',function(beforeMount){
          beforeMount.notOk(root.children.length,prefix+'no children exist');
          beforeMount.end();
        });
      }
    },componentDidMount : function(){
      mountTriggers.afterMount = Date.now();
      var _this = this;
      if (root){
        t.test('afterMount',function(afterMount){
          afterMount.ok(root.children.length,prefix+'children exist');
          afterMount.equal(root.children.length,1,prefix+'one child exists');
          afterMount.equal(root.children[0],tembo.getNative(_this),prefix+'The child is equal to the native element');
          afterMount.end();
        });
      }
    },render : function(){
      mountTriggers.render = Date.now();
      switch(this.props.type){
        case 'string': return 'string';
        case 'element': return this.props.element;
      }
    }
  });
};

runMountTest = function(t,root,mountTriggers,prefix){
  if (!prefix) prefix = '';
  else prefix +=': ';

  t.ok(mountTriggers.beforeMount,prefix+'componentWillMount triggered');
  t.ok(mountTriggers.render,prefix+'render triggered');
  t.ok(mountTriggers.afterMount,prefix+'componentDidMount triggered');
  t.ok(mountTriggers.beforeMount <= mountTriggers.render,prefix+'beforeMount happened before render');
  t.ok(mountTriggers.render <= mountTriggers.afterMount,prefix+'render happened before afterMount');
};
