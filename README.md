
# sevenup

Utility for making and loading spritesheets.

## CLI

```
npx sevenup sourcedir destdir
```

This will read all the `.png` and `.jpg` images in `sourcedir` and create two files:


*  `destdir/sprite.png`

*  `destdir/sprite.json`

```
npx sevenup-css jsonspritefile
```
This will create `sprite.css` file  with the same name as input `sprite.json` also expects to have `sprite.png` in the same folder as the generated `css` file 


## In browser

#####  use generated css sprite file 
include generated file inside the document then assign a `class` with the same name of the original icon name [file of the icon] and you will get  the icon

```html
<div  class="1f64a.png"></div> <!-- a div can be used  ---> 
<img  class="1f64a.png"  />
<img  class="1f3ad.png"  />
<img  class="1f3b8.png"  />
```
  
#####  displaying sprite image using canvas or low level API
```js
import { load } from  'sevenup';

(async  function () {

    const  spritesheet = await  load('destdir');

    // get a Blob URL
    const  url = await  spritesheet.url('somefile.png');

    // get a <canvas>
    const  canvas = spritesheet.canvas('somefile.png');

}());

```

A lower-level `spritesheet = create(img, manifest)` API also exists.

## License

[MIT](LICENSE)
