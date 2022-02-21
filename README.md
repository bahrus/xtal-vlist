<a href="https://nodei.co/npm/xtal-vlist/"><img src="https://nodei.co/npm/xtal-vlist.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-vlist">

# xtal-vlist

xtal-vlist provides a declarative virtual list web component.


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






