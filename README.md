# sevenup

Utility for making and loading spritesheets.


## CLI

```
npx sevenup sourcedir destdir
```

This will read all the `.png` and `.jpg` images in `sourcedir` and create two files:

* `destdir/sprite.png`
* `destdir/manifest.json`

*TODO and CSS spritesheet?*


## In browser

```js
import { load } from 'sevenup';

(async function () {
  const spritesheet = await load('destdir');

  // get a Blob URL
  const url = await spritesheet.url('somefile.png');

  // get a <canvas>
  const canvas = await spritesheet.canvas('somefile.png');
}());
```

A lower-level `spritesheet = create(img, manifest)` API also exists.


## License

[MIT](LICENSE)