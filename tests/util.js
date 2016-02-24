

var MAX_SIBLINGS = 5;
module.exports.childTestIterator = function(){}

function AllButOne(abo,generator,tester){
  abo.test('All but one',function(t){
    var tree = layerIterator(MAX_SIBLINGS, generator);
    var max = totalNumber(MAX_SIBLINGS);
    var lastValue;
    for(var i = 0; i < max; i++){

      lastValue = setIndex(initialSiblings,tree,i,null);
      tester(tree);
      setIndex(initialSiblings,tree,i,lastValue);
    }
  });
}

function setIndex(initialSiblings,tree,index,value){
  var currentSiblings = initialSiblings;
  var currentDepth = 0;
  var currentParents = 1;
  var total = 0;
  while(currentSiblings > 0){
    // Every Layer deeper, we have the total parents * the amount of siblings per parent
    total += currentParents;
    currentSiblings--;
  }
  return total;
  if(index === 0) return tree;
  var currentChildren = tree.children;
  var currentNode = tree;
  while(currentNode){
    if(index > total + currentNode.children.length){
      total += currentNode.children.length;
      var parent = currentNode.parent;
      if(!parent){
        currentDepth++;

      }
    }
  }
  while(currentSiblings > 0){
    for(var i = 0; i < currentChildren.length; i++){
    }
    var lastParents = currentParents;
    currentParents *= currentSiblings;
    if(index < currentParents){
      var nodes = currentParents - lastParents;
      index -= lastParents;

    }
    // Every Layer deeper, we have the total parents * the amount of siblings per parent

    currentLayer = currentLayer.reduce(function(layer, parent){
      createSiblings(parent,currentNumber,currentSiblings,fn);
      currentNumber += currentSiblings;
      return layer.concat(parent.children);
    },[]);
    currentSiblings--;
  }
  return currentParent;
}

function findNode(count,children,index){

}

function layerIterator(initialSiblings,fn){
  var currentSiblings = initialSiblings;
  var currentParent = {index: 0, children: []};
  var currentLayer = [currentParent];
  var currentNumber = 1;
  while(currentSiblings > 0){
    // Every Layer deeper, we have the total parents * the amount of siblings per parent

    currentLayer = currentLayer.reduce(function(layer, parent){
      createSiblings(parent,currentNumber,currentSiblings,fn);
      currentNumber += currentSiblings;
      return layer.concat(parent.children);
    },[]);
    currentSiblings--;
  }
  return currentParent;
}

function createSiblings(parent,currentNumber,max,fn){
  for(var i=currentNumber;i<currentNumber+max;i++){
    var sibling = {index: i, children: [], value: fn(i)};
    parent.children.push(sibling);
  }
}

function totalNumber(initialSiblings){
  var currentSiblings = initialSiblings;
  var currentParents = 1;
  var total = 0;
  while(currentSiblings > 0){
    // Every Layer deeper, we have the total parents * the amount of siblings per parent
    currentParents *= currentSiblings;
    total += currentParents;
    currentSiblings--;
  }
  return total;
}

/*
---- - All exsist
0000 - Non exsist

0---, -0--, etc - one doesn't exist

00--, -00-, etc - two don't exist

0-0-, -0-0, etc - two seperated don't exist

-000, 0-00, etc - all but one exist

*/
