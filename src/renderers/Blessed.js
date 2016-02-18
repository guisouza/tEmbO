module.exports.render = function(component,args){
  var parent = args[1];
  parent.append(component.instance);
  return component.instance;
};

module.exports.getId = function(element){
  return element._tamboId;
};

module.exports.setId = function(element,id){
  return element._tamboId = id;
};

module.exports.appendChild = function(parent,child){
  return parent.append(child);
};

module.exports.removeChild = function(parent,child){
  return parent.remove(child);
};

module.exports.replaceChild = function(parent,childA,childB){
  parent.insertBefore(childB,childA);
  parent.remove(childA);
};

module.exports.createText = function(text){
  return blessed.text({
    content : text
  });
};

module.exports.createElement = function(tagName,props){
  var events = Object.keys(props).filter(function(prop){
    return /^on\W/.test(prop);
  }).reduce(function(obj,key){
    obj[key] = props[key];
    delete props[key];
    return obj;
  },{});

  var element = createBlessed(tagName,props);

  Object.keys(events).forEach(function(ev){
    ev = ev.replace('on','').toLowerCase();
    element.on(ev,events[ev]);
  });

  return element;
};

function createBlessed(tagName,props){

  switch(tagName){
    case 'text':
    case 'line':
    case 'bigtext':{
      return blessed[tagName](props);
    }
    case 'list':
    case 'filemanager':
    case 'listtable':
    case 'listbar':{
      return blessed[tagName](props);
    }
    case 'form':
    case 'textarea':
    case 'textbox':
    case 'button':
    case 'checkbox':
    case 'radioset':
    case 'radiobutton':{
      return blessed[tagName](props);
    }
    case 'prompt':
    case 'question':
    case 'message':
    case 'loading':{
      return blessed[tagName](props);
    }
    case 'progressbar':
    case 'log':
    case 'table':{
      return blessed[tagName](props);
    }
    case 'terminal':
    case 'image':
    case 'ansiimage':
    case 'overlayimage':
    case 'video':
    case 'layout':{
      return blessed[tagName](props);
    }
    default:
      throw new Error(tagName + ' does not exists');
  }
}
