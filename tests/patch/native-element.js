var childTestIterator = require('../util').childTestIterator;

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
var nativeTester;
module.exports = function(at){
  at.comment('when created');
  at.comment('when created child');
  at.comment('when created grand children');
  at.comment('when adding children');
  at.comment('when removing children');
  childTestIterator(at,nativeTester);
  at.end();
};

nativeTester = function(){};
