<a href="https://nodei.co/npm/xtal-vlist/"><img src="https://nodei.co/npm/xtal-vlist.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-vlist">

# xtal-vlist

xtal-vlist provides a declarative "infinite scrolling" virtual list web component.

[Demo](https://codepen.io/bahrus/pen/yLPjMER)

## [API](https://cf-sw.bahrus.workers.dev/?href=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fxtal-vlist%2Fcustom-elements.json&stylesheet=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fwc-info%2Fsimple-ce-style.css&embedded=false&tags=&ts=2022-03-05T11%3A08%3A36.018Z&tocXSLT=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fwc-info%2Ftoc.xsl)

## Example

```html
<xtal-vlist style="height:600px;width:100%;" id="vlist"
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




