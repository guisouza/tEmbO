var SyncUpdate;
module.exports = SyncUpdate = function(){};

var proto = SyncUpdate.prototype;

proto.add = function(component){
  if (component.destroyed) return;
  if (component._isUpdating) return;
  component._isUpdating = true;
  component.renderNode.update();
};

proto.remove = function(component){
  if (component.destroyed) return;
  if (!component._isUpdating) return;
  component._isUpdating = false;
};
