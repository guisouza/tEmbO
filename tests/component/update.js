/*
- updating
  - when shadow provides it props - recieves props, should update, will update, did update
  - when parent provides it props - recieves props, should update, will update, did update
  - when set state is called - should update, will update, did update
    - will not update parent
    - will not update shadow if render returns the same patch
    - will not update children if render returns the same patch
    - will update shadow if render provides different props
    - will update children if render provides different props
  - can cancel update - should update -> return false
*/

module.exports = function(at){
  at.skip('shadow provides props',function(){});
  at.skip('parent provides props',function(){});
  at.skip('set state called',function(){});
  at.skip('can cancel update',function(){});
};
