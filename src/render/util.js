module.exports.isNative = function isNative(patch){
  var type = patch.type;
  if (!type) return true;
  if (typeof type === 'string') return true;
  return !type.isTemboComponent;
};

module.exports.differentTypes = function differentTypes(a,b){
  //Check if one is null and the otherone isn't
  debugger;
  if ((!a && b) || (!b && a)) return true;
  if (typeof a !== typeof b) return true;
  switch(typeof a){
    case 'string': return false;
    case 'object': return a.type !== b.type;
  }
};

module.exports.differentPatch = function differentPatch(a,b){
  if (typeof a === 'string') return a !== b;
  if (!deepCompare(a.props,b.props)) return true;
  if (!a.children && !b.children) return false;
  if (!a.children || !b.children) return true;
  if (a.children.length !== b.children.length) return true;
  return a.children.some(function(aChild,index){
    var bChild = b[index];
    if (!aChild && !bChild) return false;
    if (differentTypes(a,b)) return true;
    return differentPatch(aChild,bChild);
  });
};

module.exports.clone = function(obj){
  return Object.keys(obj).reduce(function(ret,key){
    ret[key] = obj[key];
    return ret;
  },{});
};

function deepCompare(a,b){
  var type = typeof a;
  if (type !== typeof b) return false;
  if (type !== 'object') return a === b;
  var akeys = Object.keys(a);
  var bkeys = Object.keys(b);
  if (akeys.length !== bkeys.length) return false;
  return !akeys.some(function(key){
    if (!(key in b)) return true;
    return !deepCompare(a[key],b[key]);
  });
}
