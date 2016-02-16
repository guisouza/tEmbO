//File : src/Tembo.js

;(function(world){
  'use strict';

  world.Tembo = function(){
    return {
      _ : {
      },
      components : {
      }
    };
  }();

})(this);

//File : src/Tembo._.can.js

(function(Tembo){
  'use strict';
  Tembo._.can = function(label,method){
    if (!Tembo[label])
      Tembo[label] = method;
  };
})(this.Tembo);

//File : src/Tembo._.componentFactory.js

(function(Tembo){
  'use strict';

  Tembo._.componentFactory = function(structure){
    var TemboComponent = function(){};
    for(var key in structure){
      var method = structure[key];
      TemboComponent.prototype[key] = method;
    }


    TemboComponent.prototype.__render__ = TemboComponent.prototype.render;
    TemboComponent.prototype.render = function(){
      var renderResult = TemboComponent.prototype.__render__.bind(this)();
      // if (!this.oldInstance){

      // }
      // this.instance = renderResult;
      renderResult.component = this;

      return renderResult;
    };

    TemboComponent.prototype.__componentWillUnmount__ = TemboComponent.prototype.componentWillUnmount || function(){};
    TemboComponent.prototype.componentWillUnmount = function(){
      return TemboComponent.prototype.__componentWillUnmount__.bind(this)();
    };

    if (structure.displayName)
      TemboComponent.displayName = structure.displayName;

    TemboComponent.prototype.isTemboComponent = true;
    TemboComponent.prototype.setState = function(state){
      for(key in state){
        this.state[key] = state[key];
      }

      Tembo._.deeplyCompare(this.instance,this.render());

    };
    return TemboComponent;
  };

})(this.Tembo);

Tembo._.upCall = function(lifecycleMethod,instance){
  if (instance.component){
    if (instance.component.componentWillUnmount){
      instance.component[lifecycleMethod]();
    }else{
      Tembo._.upCall(lifecycleMethod,instance.component);
    }
  }else{
    console.log('if your code reach this line, send-me a e-mail gui_souza@me.com . I would love to work with you in my new project');
  }
};


  Tembo._.patchAttributes = function(instance,newInstance){

    Array.prototype.forEach.call(newInstance.attributes,function(attr){

      if (attr.localName !== 'data-tamboid'){
        instance.setAttribute(attr.localName,attr.value);
      }

    });
  };

  Tembo._.patchChildren = function(instance,newInstance){

    var SilentDiff = {};
    Array.prototype.forEach.call(instance.children,function(element){
      if (!SilentDiff[element.getAttribute('data-tamboId')])
        SilentDiff[element.getAttribute('data-tamboId')] = {};

      SilentDiff[element.getAttribute('data-tamboId')].a = element;
    });

    Array.prototype.forEach.call(newInstance.children,function(element){
      if (!SilentDiff[element.getAttribute('data-tamboId')])
        SilentDiff[element.getAttribute('data-tamboId')] = {};

      SilentDiff[element.getAttribute('data-tamboId')].b = element;
    });

    for(var key in SilentDiff){
        var patch = SilentDiff[key];
        if (patch.a === undefined && patch.b !== undefined){
          Tembo._.upCall('componentWillUnmount',patch.b);
          instance.appendChild(patch.b);
        }
        if (patch.a !== undefined && patch.b === undefined){
          Tembo._.upCall('componentWillUnmount',patch.a);
          instance.removeChild(patch.a);
        }
    }


      // newInstance.attributes,function(attr){
      // instance.setAttribute(attr.localName,attr.value);
    // });
  };

  Tembo._.patchText = function(instance,newInstance){
    if (!instance.hasChildNodes()){
        instance.textContent = newInstance.textContent;
    }
  };









//File : src/Tembo._.deeplyCompare.js
(function(Tembo){
  'use strict';

  Tembo._.deeplyCompare = function(element,reRenderedElement){

    var instance = element;
    var newInstance = reRenderedElement;

    newInstance.instance = newInstance.render();
    newInstance.instance.component = newInstance;

    Tembo._.patchAttributes(instance.instance,newInstance.instance);
    Tembo._.patchText(instance.instance,newInstance.instance);
    Tembo._.patchChildren(instance.instance,newInstance.instance);

    return false;

  };

})(this.Tembo);

Tembo._.can('attachProps',function(element,props,content){
  var prop;
  if(element.isTemboComponent && element.isTemboComponent !== undefined){
    if (!element.props){
      element.props = {};
    }
    if (props !== undefined && props !== null)
      for(prop in props){
        element.props[prop] = props[prop];
      }
      element.props.children = content;
  }else{
    element = document.createElement(element);
    element = Tembo.append(element,content);
    for(var attr in props){

        if (attr.indexOf('on') === 0){
          var event = attr.replace('on','').toLowerCase();
          element.addEventListener(event,props[attr],false);
        }else{
          if (attr !== 'children')
          element.setAttribute(attr,props[attr]);
        }
    }
  }
    return element;
});


//File : src/Tembo.El.js

(function(Tembo){
  'use strict';

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

})(this.Tembo);

// File : src/Tembo.createClass.js

(function(Tembo){
  'use strict';
  Tembo._.can('createClass',function(structure){
    return Tembo._.componentFactory(structure);
  });
})(this.Tembo);


  Tembo._.can('append',function(element,content){
    if (content)
    if (Array.isArray(content)){
      content.forEach(function(child){
        Tembo.appendChild(element,child);
      });
    }else{
      Tembo.appendChild(element,content);
    }

    return element;

  });



  Tembo._.can('appendChild',function(element,content){
    content.parent = element;
    if (element.getAttribute('data-tamboId') === null){
        element.setAttribute('data-tamboId','$0');
    }
    if (element.childIndex === undefined){
      element.childIndex = 0;
    }else{
      element.childIndex = element.childIndex+1;
    }

    if (content){

      if (content.render){
        component = content;
        content = Tembo.renderTree(content);
        content.parent = element;
        content.setAttribute('data-tamboId',content.parent.getAttribute('data-tamboId')+'.$'+content.parent.childIndex);
        element.appendChild(content);
        return element;
      }

      if (content.tagName){
        content.setAttribute('data-tamboId',content.parent.getAttribute('data-tamboId')+'.$'+content.parent.childIndex);
        element.appendChild(content);
        return element;
      }
      // if (content.instance){
      //   if (content.componentDidMount)
      //     content.componentDidMount();
      //   content.parent = element;
      //   element.appendChild(content.instance);
      //   return element;
      // }
      if (typeof content === 'string'){

        element.appendChild(document.createTextNode(content));
        return element;
      }
    }
  });




  Tembo._.can('setInitialState',function(element){
    if(element.isTemboComponent){
      if (element.getInitialState){
        if (!element.state)
          element.state = {};
        element.state = element.getInitialState();
      }
    }

    return element;
  });





// File : src/Tembo.createElement.js

(function(Tembo){

  'use strict';
  Tembo._.can('createElement',function(element,props,content){

    if (!props)
      props = {};

    if(arguments.length > 3){
      content = [];
      var index = 2;
      while(index < arguments.length){
        content.push(arguments[index]);
        index++;
      }
    }


    if (element.prototype)
    if (element.prototype.isTemboComponent){
      var Element = element;
      element = new Element();
      element.isTemboComponent = true;
    }

    return new Tembo.El(element,props,content);

  });
})(this.Tembo);

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
    Tembo.appendChild(element,component.instance);

  });
})(this.Tembo);
