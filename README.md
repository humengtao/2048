#import 2048 game plug
you must be import jquery before import 2048.js like this

```html
<script type="text/javascript" src="jquery-3.0.0.min.js"></script>
<script type="text/javascript" src="2048.js"></script>

```

#how to use it
create a dom in your html like this
```html
<div class="className"></div>
```

and start to use it by js like this
```javascript
$('.className').game();
```

open your html ,you will find a default demo and start to play with keyboard (**w**/**a**/**s**/**d**)

#options
>             emptyColor: '#eeeeee', //color of empty block
            blockColor_2: '#2e6da4', //block color where value is 2
            blockColor_4: '#31b0d5',
            blockColor_8: '#eea236',
            blockColor_16: '#f0ad4e',
            blockColor_32: '#c9302c',
            blockColor_64: '#337ab7',
            blockColor_128: '#398439',
            blockColor_256: '#449d44',
            blockColor_512: '#269abc',
            blockColor_1024: '#ac2925',
            blockColor_2048: '#2c2c2c',
            size: 500 // container box size such as {width:500,height:500}
            
#callback
you alse can add your callback follow options
```javascript
$('.className').game({options},callback);
```
#demo
```javascript
$('.className').game({
  emptyColor:'#ffff00',
  blockColor_16:'blue',
  blockColor_512:rgb(1,2,3),
  size:300
},function(){
  alert('game over!')
})
```
