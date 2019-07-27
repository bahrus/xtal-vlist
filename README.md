<a href="https://nodei.co/npm/xtal-vlist/"><img src="https://nodei.co/npm/xtal-vlist.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-vlist">

# xtal-vlist

There's some [interesting](https://www.chromestatus.com/features/5673195159945216) [work](https://fergald.github.io/virtual-scroller/versions/virtual-content-display-locking-binary-search/demo/jank/) going on that will hopefully cause this component to be able to enter the great hall of Valhalla.

In the meantime, this component can serve a limited purpose -- virtual lists with no variation in height of each item.

The (abstract if using TypeScript) class XtalVList provides an unregistered base class web component wrapper around this [light-weight virtual list library](https://sergimansilla.com/blog/virtual-scrolling/).  It doesn't actually register a web component name.  To use it, you need to subclass xtalVListCustomized, implement a generate method, and that's what needs to be registered as a web component.

xtal-vlist would feel extremely flattered if you start the name of such an element with xtal-vlist-

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






