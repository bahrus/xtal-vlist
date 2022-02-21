<a href="https://nodei.co/npm/xtal-vlist/"><img src="https://nodei.co/npm/xtal-vlist.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-vlist">

# xtal-vlist

xtal-vlist provides a declarative "infinite scrolling" virtual list web component.

[Demo](https://codepen.io/bahrus/pen/yLPjMER)

## Example

```html
<xtal-vlist id="vlist"
    row-transform='{
        "span": "."
    }'
>
    <div slot=row>
        <span></span>
    </div>
</xtal-vlist>
<script>
    const list = [];
    for (let i = 0; i < 100000; i++) {
        list.push(i);
    }
    vlist.list = list;
</script>
```

The row-transform syntax is based on css-like [Declarative Trans-Render syntax (DTR)](https://github.com/bahrus/trans-render#declarative-trans-render-syntax-via-plugins).

## Installation

1.  npm instal xtal-vlist
    1.  In JS, import 'xtal-vlist/xtal-vlist.js';

or

2.  jsDelivr

```html
<script type=module>
    import 'https://esm.run/xtal-vlist/xtal-vlist.js';
</script>
```


## Viewing Your Element Locally

```
$ npm install
$ npm run serve
```




