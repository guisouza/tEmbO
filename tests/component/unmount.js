var Tembo = require('../../src/Tembo');
var TestRender = require('../../src/renderers/Test');
var EE = require('events').EventEmitter;

var triggerer = new EE();
var renderer = new TestRender();
var tembo = new Tembo(renderer);

module.exports = function(at){
  at.skip('by developer',function(t){});
  at.test('replaced by null',function(aat){
    aat.test('by shadow',function(t){
      var fmt = {};
      var sel = createReturnReplacer();
      var fel = createUnmountListener(t,fmt);
      tembo.render(tembo.createElement(sel,{
        willNull : true,
        element : tembo.createElement(fel,{ type : 'string' },[])
      },[]),root);
      runUnmountTest(t,fmt,null);
      triggerer.removeListeners('replaceReturn');
    });
    aat.test('by parent',function(aaat){
      aaat.test('empty children',function(t){
        var fmt = {};
        var pel = createReturnReplacer();
        var cel = createUnmountListener(t,fmt);
        tembo.render(tembo.createElement(pel,{
          element : tembo.createElement('container',{},[
            tembo.createElement(cel,{},[])
          ])
        },[]),root);
        runUnmountTest(t,fmt,tembo.createElement('container',{},[]));
        triggerer.removeListeners('replaceReturn');
      });
      aaat.test('first child',function(t){
        createChildTest(t,[
          { prefix : 'first' },
          'second',
          'third'
        ]);
      });
      aaat.test('second child',function(t){
        createChildTest(t,[
          'first',
          { prefix : 'second' },
          'third'
        ]);
      });
      aaat.test('third child',function(t){
        createChildTest(t,[
          'first',
          'second',
          { prefix : 'third' }
        ]);
      });
      aaat.test('top two children',function(t){
        createChildTest(t,[
          { prefix : 'first' },
          { prefix : 'second' },
          third
        ]);
        createChildTest(t,[
          'first',
          { prefix : 'second' },
          { prefix : 'third' }
        ]);
      });
      aaat.test('bottom two children',function(t){
        createChildTest(t,[
          'first',
          { prefix : 'second' },
          { prefix : 'third' }
        ]);
      });
      aaat.test('middle of four children',function(t){
        createChildTest(t,[
          'first',
          { prefix : 'second' },
          { prefix : 'third' },
          'fourth'
        ]);
      });
      aaat.test('four children individually',function(t){
        createChildTest(t,[
          { prefix : 'first' },
          { prefix : 'second' },
          { prefix : 'third' },
          { prefix : 'fourth' }
        ]);
      });
    });
  });
  at.skip('replaced by something',function(){});
};

function createChildTest(t,children){
  var fmt = {};
  var pel = createReturnReplacer();
  var cel = createUnmountListener(t,fmt);
  var expectedUnmount = [];
  var firstChildren = children.map(function(child){
    if (typeof child === 'string') return child;
    expectedUnmount.push(child.prefix);
    return tembo.createElement(cel,child,[]);
  });
  var newChildren = children.map(function(child){
    if (typeof child === 'string') return child;
    return null;
  });
  tembo.render(tembo.createElement(pel,{
    element : tembo.createElement('container',{},firstChildren)
  },[]),root);
  runUnmountTest(t,fmt,tembo.createElement('container',{},newChildren),expectedUnmount);
  triggerer.removeListeners('replaceReturn');
}

function createReturnReplacer(){
  return tembo.createClass({
    componentDidMount : function(){
      triggerer.on('replaceReturn',function(newObj){
        this.setState({ ret : newObj });
      });
    },
    render : function(){
      return (this.state.ret !== void 0) ? this.state.ret : this.props.element;
    }
  });
}

function createUnmountListener(t,mountTriggers){
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
      return 'string';
    }
  });
}

function runUnmountTest(t,mountTriggers,replacement,expectedUnmount){

  t.notOk(mountTriggers.beforeUnmount,'beforeUnmount should be false');
  var native,parent,expected;
  if (replacement && replacement.props && replacement.props.children){
    expected = replacement.props.children.filter(function(child){
      return !!child;
    });
  }

  var l = parent.children.length;
  var el = expected ? expected.length : 0;

  t.test('beforeUnmount',function(beforeUnmount){
    native = tembo.findNative(mountTriggers.self);
    beforeUnmount.ok(native,'the obj has a native element');
    parent = native.parent;
    beforeUnmount.ok(parent,'the parent exists');
    beforeUnmount.ok(parent.children.length,'has children');
    beforeUnmount.notEqual(parent.children.indexOf(native),-1,'native is a member of those children');
  });

  triggerer.emit('replaceReturn',replacement);
  t.test('afterUnmount',function(afterUnmount){
    t.equal(parent.children.length,el,'the number of children are predictable');
    t.equal(parent.children.indexOf(native),-1,'native is not a member of those children');
    parent.children.forEach(function(child,i){
      t.equal(child.text,expected[i],'all other children stay in tact');
    });
    t.equal(mountTriggers.beforeUnmount.length,l-el,'componentWillUnmount triggered a predictable number of times');
    mountTriggers.beforeMount.forEach(function(child,i){
      t.equal(child,expectedUnmount[i],'all removed children had component will mount triggered');
    });
  });
}
