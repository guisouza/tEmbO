![Alt text](http://i.imgur.com/osPnYVh.png)
# Tembo

Tembo is my own react-like rendering engine implementation in 4kb.

# [Live Demo / Performance Test](https://s3-sa-east-1.amazonaws.com/tembojs/perf.html)

# API

##### Tembo.createClass(componentSpec)
```javascript
const Message = Tembo.createClass({
  getInitialState: function() {
    return {
      message: 'Hello Word'
    }
  },
  render: function() {
    return Tembo.createElement('div', {}, this.state.message)
  }
})
```
##### Tembo.createElement(temboComponentClass || domNodeName,props,children)
```javascript
  Tembo.createElement('div', {}, 'hello world')
```
##### Tembo.render(temboComponent, DOMNode)
```javscript
    const component = Tembo.createElement(myMessage,{},false)
    Tembo.render(component, document.getElementById('content'));
```
