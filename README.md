![Alt text](http://i.imgur.com/osPnYVh.png)
# Tembo

Tembo is my own react-like rendering implementation in 4kb.

# API

##### Tembo.createClass(componentSpec)
```javscript
const Message = Tembo.createClass({
        getInitialState : function(){
          return {
            message : 'Hello Word'
          }
        },
        render : function(){
          return Tembo.createElement('div',{},this.state.message)
        }
      })
```
##### Tembo.createElement(temboComponentClass || domNodeName, props, children)
```javscript
    Tembo.createElement('div',{},'hello world')
```
##### Tembo.render(temboComponent, DOMNode)
```javscript
    const component = Tembo.createElement(myMessage,{},false)
    Tembo.render(component, document.getElementById('content'));
```