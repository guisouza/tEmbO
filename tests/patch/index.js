var tap = require('tap');

tap.test('Patch',function(at){
  /*
  - when rendered, creates a textNode
  - When updated, updates textNode
  */
  at.test('string',require('./string.js'));
  /*
  - when rendered - creates an Element
  - when rendered with children - creates an element with children
  - when rendered with grand children - creates an element with grandchildren
  - when adding children - should have more children
  - when removing children - should have less children
    - first removed - have 2 and 3
    - second gone - have 1 and 3
    - third gone - have 1 and 2
  */
  at.test('native element',require('./native-element.js'));
  /*
  - removing values
    - when there was nothing, nothing changes
    - when text was inside its parent, it is removed
    - when an element was inside its parent, it is removed
  - providing values
    - Should be in the correct sibling position
      - when first, have 2 and 3 - updating will make 1, 2, 3
      - when second, have 1 and 3 - updating will make 1, 2, 3
      - when third, have 1, 2 - updating will make 1, 2, 3
  */
  at.test('falsy value',require('./falsy.js'));

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

  at.test('falsy value',require('./component.js'));

});
