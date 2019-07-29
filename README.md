<a href="https://nodei.co/npm/xtal-vlist/"><img src="https://nodei.co/npm/xtal-vlist.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-vlist">

# xtal-vlist

There's some [interesting](https://www.chromestatus.com/features/5673195159945216) [work](https://fergald.github.io/virtual-scroller/versions/virtual-content-display-locking-binary-search/demo/jank/) going on that will hopefully cause this component to be able to enter the great hall of Valhalla.

There are other web component virtual list libraries:  

[iron-list](https://www.webcomponents.org/element/@polymer/iron-list), to my knowledge, was the first web based component (in any "framework") to provide virtual list capabilities not specifically aimed at grids. 

[ionic-list](https://ionicframework.com/docs/api/virtual-scroll) also looks really promising (but appears to be coupled with Angular for now, and I didn't see how to use with vanilla js).

In the meantime, this component can serve a limited purpose -- a light-weight virtual list with no variation in height of each item.

The (abstract if using TypeScript) class XtalVList provides an unregistered base class web component wrapper around this [light-weight virtual list library](https://sergimansilla.com/blog/virtual-scrolling/).  It doesn't actually register a web component name.  To use it, you need to subclass XtalVList, implement a generate method, and *that's* what should be registered as a web component.


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






