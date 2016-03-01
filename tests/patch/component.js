
  /*
- if the component returns null - parent should be empty
  - can pass String
- if the component returns text - parent should have a textNode
  - can pass Patch
- if the component returns NativeElement - parent should have a native Element
  - can pass NativeElement test
- if the component returns a component - that component decides what is rendered
  - sub component can pass String
  - sub Component can pass Patch
  - sub Component can pass Falsy
  - if passing children
    - the other component gets direct references to the children
    - the other component may not render the child
    - the other component may create entirely new children
    - the other component may add the children to their component
  - when not passing children
    - the other component may create children
    - the other component may use a property as its children
    - the other component may not have children
*/
var createComponent,childrenAnomalies;
module.exports = function(at){
  at.comment('pass Falsy',function(t){
    createComponent(t,'falsy',require('./falsy.js'));
  });
  at.comment('pass String',function(t){
    createComponent(t,'string',require('./string.js'));
  });
  at.comment('pass Native',function(t){
    createComponent(t,'native',require('./native-element.js'));
  });
  at.comment('pass Component',function(aat){
    createComponent(aat,'component',function(aaat){
      aaat.comment('pass Falsy',function(t){
        createComponent(t,'falsy',require('./falsy.js'));
      });
      aaat.comment('pass String',function(t){
        createComponent(t,'string',require('./string.js'));
      });
      aaat.comment('pass Native',function(t){
        createComponent(t,'native',require('./native-element.js'));
      });
      aaat.comment('childrenAnomalies',childrenAnomalies);
    });
    aat.end();
  });

  at.comment('Children Anomolies',childrenAnomalies);
  at.end();
};

childrenAnomalies = function(){};
