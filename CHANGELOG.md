# sevenup changelog

## 1.4.0

* Add `spritesheet.box` method, for getting bounding box of an image
* Add `--pad`/`-p` flag for generating mipmappable textures

## 1.3.2

* Check for existence of dest directory ([#5](https://github.com/Rich-Harris/sevenup/pull/5))

## 1.3.1

* Better error when arguments are invalid
* Properly namespace data attributes

## 1.3.0

* Differentiate between multiple CSS spritesheets on the same page ([#3](https://github.com/Rich-Harris/sevenup/issues/3))

## 1.2.2

* Handle multiple overlapping loads

## 1.2.1

* Remove unused `sevenup-css` bin

## 1.2.0

* Generate CSS file in addition to JSON manifest

## 1.1.1

* Fix loading on browsers without `createImageBitmap`

## 1.1.0

* Add `spritesheet.uvs(filename)` method

## 1.0.2

* Cross-origin image loading

## 1.0.1

* Use worker to decode spritesheet where possible

## 1.0.0

* First release