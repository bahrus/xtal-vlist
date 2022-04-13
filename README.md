# xtal-vlist

<a href="https://nodei.co/npm/xtal-vlist/"><img src="https://nodei.co/npm/xtal-vlist.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-vlist">

[![Actions Status](https://github.com/bahrus/xtal-vlist/workflows/CI/badge.svg)](https://github.com/bahrus/xtal-vlist/actions?query=workflow%3ACI)


xtal-vlist provides a declarative "infinite scrolling" virtual list web component.

[Demo 1 -- Simple](https://codepen.io/bahrus/pen/yLPjMER)

[Demo 2 -- Tree View](https://codepen.io/bahrus/pen/GROLwBV)

Note that for Demo 2, if you click expand all, and enable Chrome's Web Vitals dev tool (under rendering tab), there is no Cumulative Layout Shift.

This is done by utilizing the intersectional settings:

```html
<xtal-vlist ...
  row-intersectional-settings='{
    "rootClosest": ".scroller",
    "options": {
        "rootMargin": "300px",
        "threshold": 0
    }
}'>
 ...
</xtal-vlist>
```

## [API](https://cf-sw.bahrus.workers.dev/?href=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fxtal-vlist%2Fcustom-elements.json&stylesheet=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fwc-info%2Fsimple-ce-style.css&embedded=false&tags=&ts=2022-03-05T11%3A08%3A36.018Z&tocXSLT=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fwc-info%2Ftoc.xsl)

## Example

```html
<xtal-vlist style="height:600px;width:100%;" id="vlist"
    row-transform='{
        "span": "."
    }'
>
    <template slot=row>
        <div>
            <span></span>
        </div>
    </template>
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




