
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

module.exports = function(at){
  at.skip('pass Falsy', function(t){
    createComponent(t,'falsy', require('./falsy.js'));
  });
  at.skip('pass String', function(t){
    createComponent(t,'string', require('./string.js'));
  });
  at.skip('pass Native', function(t){
    createComponent(t,'native', require('./native-element.js'));
  });
  at.skip('pass Component', function(aat){
    createComponent(aat,'component', function(aaat){
      aaat.skip('pass Falsy', function(t){
        createComponent(t,'falsy', require('./falsy.js'));
      });
      aaat.skip('pass String', function(t){
        createComponent(t,'string', require('./string.js'));
      });
      aaat.skip('pass Native', function(t){
        createComponent(t,'native', require('./native-element.js'));
      });
      aaat.skip('childrenAnomalies',childrenAnomalies);
    });
  });

  at.skip('Children Anomolies', childrenAnomalies)
};

function childrenAnomalies(){};
