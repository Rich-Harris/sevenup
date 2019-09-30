
# sevenup

Utility for making and loading spritesheets.

## CLI

```
npx sevenup sourcedir destdir
```

This will read all the `.png` and `.jpg` images in `sourcedir` and create three files:


* `destdir/sprites.png`
* `destdir/sprites.json`
* `destdir/sprites.css`


## In browser

```js
import { load } from 'sevenup';

(async function() {
  const spritesheet = await load('destdir');

  // we have a reference to the image
  console.log(spritesheet.image.width, spritesheet.image.height);

  // get a Blob URL
  const url = await spritesheet.url('somefile.png');

  // get a <canvas>
  const canvas = spritesheet.canvas('somefile.png');

  // get a set of UV coordinates, for use in a WebGL shader
  const [u1, v1, u2, v2] = spritesheet.uv('somefile.png');
}());
```

A lower-level `spritesheet = create(img, manifest)` API also exists.

Alternatively, use CSS:

```html
<div role="img" aria-label="Some alt text" data-sevenup="somefile.png"></div>
```

## License

[MIT](LICENSE)
