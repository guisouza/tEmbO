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

module.exports = function(at){
  at.comment('nothing is updated for two false values',function(){});
  at.comment('text gets removed',function(){});
  at.comment('elments get removed',function(){});
  at.comment('components get removed',function(){});
  at.comment('children removal',function(){});
  at.end();
};
