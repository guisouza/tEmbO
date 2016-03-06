```

createElement(Parent, props, [
  createElement(Child, props, [Text])
]);


```

What happens is
- Text is rendered
- Child is rendered
- Parent is rendered

Heres the key though
- setState Occurs
  - nextAnimation frame (if the state has changed)
    - This create all the elements again

compare
  - if the Element has Children
    -
  - Compare the old elements to the new Elements
    - If the ElementType is not the same
      - componentWillUnmount(old)
      - componentWillMount(new);
      - RETURN - replace(old, new);
    - If the Props are not the same
      - componentWillUpdate(newProps);
  - Do this for each child as well
    - If a child is added - componentWillMount is called
    - If a child is missing - componentWillUnmount is called
```
If one of these elements is different
  if(element.isTemboComponent && newElement.isTemboComponent){
    return compare(element.rendered, newElement.render());
  }
  if(newElement.isTempoComponent){

  }
```
