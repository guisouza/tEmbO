var Tembo = require('../../src/Tembo');
var TestRender = require('../../src/renderers/Test');
var EE = require('events').EventEmitter;

var triggerer = new EE();
var renderer = new TestRender();
var tembo = new Tembo(renderer);

var createChildTest,createReturnReplacer,createUnmountListener,runUnmountTest,runReplacement;
module.exports = function(at){
  at.comment('by developer',function(){});
  at.test('replaced by null',{ bail : true },runReplacement.bind(void 0,null));
  at.test('replaced by text',{ bail : true },runReplacement.bind(void 0,'replacement'));
  at.test(
    'replaced by native-element',{ bail : true },
    runReplacement.bind(void 0,tembo.createElement('replacement',{}))
  );
  at.test(
    'replaced by component',{ bail : true },
    runReplacement.bind(void 0,tembo.createElement(
      tembo.createClass({
        render : function(){ return 'replacement'; }
      }),{}
    ))
  );
  at.end();
};

runReplacement = function(replacement,aat){
  aat.test('by shadow',function(t){
    var root = new TestRender.TreeNode('root');

    var fmt = {};
    var sel = createReturnReplacer();
    var fel = createUnmountListener(t,fmt);
    tembo.render(tembo.createElement(sel,{
      willNull : true,
      element : tembo.createElement(fel,{ prefix : 'self',type : 'string' },[])
    },[]),root);
    var expected = replacement ? [replacement] : [];
    runUnmountTest(t,fmt,replacement,['self'],expected);
    triggerer.removeAllListeners('replaceReturn');
    t.end();
  });
  aat.test('by parent',function(aaat){
    aaat.test('empty children',function(t){
      var root = new TestRender.TreeNode('root');
      var fmt = {};
      var pel = createReturnReplacer();
      var cel = createUnmountListener(t,fmt);
      tembo.render(tembo.createElement(pel,{
        element : tembo.createElement('container',{},[
          tembo.createElement(cel,{ prefix : 'child' },[])
        ])
      },[]),root);
      var expected = replacement ? [replacement] : [];
      runUnmountTest(t,fmt,tembo.createElement('container',{},replacement),['child'],expected);
      triggerer.removeAllListeners('replaceReturn');
      t.end();
    });

    aaat.test('first child',function(t){
      createChildTest(t,replacement,[
        { prefix : 'first' },
        'second',
        'third'
      ]);

      t.end();
    });
    aaat.test('second child',function(t){
      createChildTest(t,replacement,[
        'first',
        { prefix : 'second' },
        'third'
      ]);

      t.end();
    });
    aaat.test('third child',function(t){
      createChildTest(t,replacement,[
        'first',
        'second',
        { prefix : 'third' }
      ]);

      t.end();
    });
    aaat.test('top two children',function(t){
      createChildTest(t,replacement,[
        { prefix : 'first' },
        { prefix : 'second' },
        'third'
      ]);
      createChildTest(t,replacement,[
        'first',
        { prefix : 'second' },
        { prefix : 'third' }
      ]);

      t.end();
    });
    aaat.test('bottom two children',function(t){
      createChildTest(t,replacement,[
        'first',
        { prefix : 'second' },
        { prefix : 'third' }
      ]);

      t.end();
    });
    aaat.test('middle of four children',function(t){
      createChildTest(t,replacement,[
        'first',
        { prefix : 'second' },
        { prefix : 'third' },
        'fourth'
      ]);

      t.end();
    });
    aaat.test('four children individually',function(t){
      createChildTest(t,replacement,[
        { prefix : 'first' },
        { prefix : 'second' },
        { prefix : 'third' },
        { prefix : 'fourth' }
      ]);
      t.end();
    });
    aaat.end();
  });

  aat.end();
};

createChildTest = function(t,replacement,children){
  var root = new TestRender.TreeNode('root');
  var fmt = {};
  var pel = createReturnReplacer();
  var cel = createUnmountListener(t,fmt);
  var expectedUnmount = [];
  var newChildren = [];
  var firstChildren = children.map(function(child){
    if (typeof child === 'string'){
      newChildren.push(child);
      return child;
    }
    if (replacement) newChildren.push(replacement);
    expectedUnmount.push(child.prefix);
    return tembo.createElement(cel,child,[]);
  });

  tembo.render(tembo.createElement(pel,{
    element : tembo.createElement('container',{},firstChildren)
  },[]),root);
  runUnmountTest(t,fmt,tembo.createElement('container',{},newChildren),expectedUnmount,newChildren);
  triggerer.removeAllListeners('replaceReturn');
};

createReturnReplacer = function(){
  return tembo.createClass({
    componentDidMount : function(){
      var _this = this;
      triggerer.on('replaceReturn',function(newObj){
        _this.setState({ ret : newObj });
      });
    },
    render : function(){
      return (this.state.ret !== void 0) ? this.state.ret : this.props.element;
    }
  });
};

createUnmountListener = function(t,mountTriggers){
  return tembo.createClass({
    componentDidMount : function(){
      mountTriggers.self = this;
      mountTriggers.didUnmount = 0;
    },
    componentWillUnmount : function(){
      if (!mountTriggers.didUnmount) mountTriggers.didUnmount = [];
      mountTriggers.didUnmount.push(this.props.prefix);
    },
    render : function(){
      return tembo.createElement('temporary',{});
    }
  });
};

runUnmountTest = function(t,mountTriggers,replacement,expectedUnmount,expected){

  t.notOk(mountTriggers.beforeUnmount,'beforeUnmount should be false');

  var native,parent;

  var el = expected.length;
  var l;

  t.test('beforeUnmount',function(beforeUnmount){
    native = tembo.getNative(mountTriggers.self);
    beforeUnmount.ok(native,'the obj has a native element');
    parent = native.parent;
    beforeUnmount.ok(parent,'the parent exists');
    l = parent.children.length;
    beforeUnmount.ok(parent.children.length,'has children');
    beforeUnmount.notEqual(parent.children.indexOf(native),-1,'native is a member of those children');
    beforeUnmount.end();
  });

  triggerer.emit('replaceReturn',replacement);
  t.test('afterUnmount',function(afterUnmount){
    afterUnmount.equal(parent.children.length,el,'the number of children are predictable');
    afterUnmount.equal(parent.children.indexOf(native),-1,'native is not a member of those children');
    parent.children.forEach(function(child,i){
      if (typeof expected[i] === 'string'){
        afterUnmount.equal(child.text,expected[i],'all other children stay in tact');
      }
    });
    afterUnmount.equal(
      mountTriggers.didUnmount.length,expectedUnmount.length,
      'componentWillUnmount triggered a predictable number of times'
    );
    mountTriggers.didUnmount.forEach(function(child,i){
      var i = expectedUnmount.indexOf(child);
      afterUnmount.notEqual(i,-1,'all removed children had component will mount triggered');
    });
    afterUnmount.end();
  });
};
