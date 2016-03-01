
var isNative,differentTypes,differentPatch,clone,deepCompare;

module.exports.isNative = isNative = function(patch){
  if (!patch) return true;
  if (typeof patch === 'string') return true;
  var type = patch.type;
  return !type.isTemboComponent;
};

module.exports.differentTypes = differentTypes = function(a,b){
  //Check if one is null and the otherone isn't
  var booA = !a,booB = !b;
  if (booA || booB) return booA !== booB;
  if (typeof a !== typeof b) return true;
  if (typeof a === 'string') return false;
  if (typeof a.type === 'string') return a.type !== b.type;
  return a.type !== b.type;
};

module.exports.differentPatch = differentPatch = function(a,b){
  var booA = !a,booB = !b;
  if (booA || booB) return booA !== booB;
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

module.exports.clone = clone = function(obj){
  return Object.keys(obj).reduce(function(ret,key){
    ret[key] = obj[key];
    return ret;
  },{});
};

deepCompare = function(a,b){
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
};
