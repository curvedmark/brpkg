# brpkg

[browserify](http://browserify.org) plugin that inlines required package.json

## example

for a main.js:

```js
console.log(require('../package.json').version);
```

and a package.json:

```json
{
	"name": "beep",
	"version": "1.0.0"
}
```

turns into:

```js
console.log("1.0.0");
```

## license

MIT