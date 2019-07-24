<a href="https://nodei.co/npm/xtal-vlist/"><img src="https://nodei.co/npm/xtal-vlist.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-vlist">

# xtal-vlist

The (abstract if using TypeScript) class XtalVList provides an unregistered base class web component wrapper around this [light-weight vertical virtual list](https://sergimansilla.com/blog/virtual-scrolling/).  It doesn't actually register a web component name.  To use it, you need to implement a generate method

For example:

```JavaScript
class XtalVListCustomized extends XtalVList{
    generate(row){
        const el = document.createElement("div");
        el.innerHTML = "<p>ITEM " + row + "</p>";
        return el;
    }
}
customElements.define('xtal-vlist-customized', XtalVListCustomized);
```

```html
<xtal-vlist-customized id=vlist></xtal-vlist-customized>       
<script>
    vlist.totalRows = 100000;
</script>
```






