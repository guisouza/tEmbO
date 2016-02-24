var tap = require('tap');

tap.test('Component',function(at){
  at.test('Lifecycle',function(aat){
    /*
    - mounting
      - when is created through `tEmbO.render(component, parentEl)` - will mount, did mount
      - When a shadow creates this as its figure - will mount, did mount
      - When a parent adds a child - will mount, did mount
    */
    aat.test('mount',require('./mount.js'));
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
    aat.test('update',require('./update.js'));

    /*
    - unmounting
      - provide a function that calls unmount?
      - when shadow returns null instead of this component - will unmount
      - when parent removes children - will unmount
    */
    aat.test('unmount',require('./unmount.js'));
  });
});
