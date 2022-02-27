import { CE } from 'trans-render/lib/CE.js';
import { TemplMgmt, beTransformed } from 'trans-render/lib/mixins/TemplMgmt.js';
import { DTR } from 'trans-render/lib/DTR.js';
import 'be-deslotted/be-deslotted.js';
export class XtalVList extends HTMLElement {
    #ctsMap = new WeakMap();
    heightenerParts;
    setFocus({ focusId, lastFocusId }) {
        const focus = virtualList.container.querySelector(`[${focusId}="${lastFocusId}"]`);
        if (focus) {
            focus.focus();
            const event = new Event('focus', { bubbles: true, cancelable: true });
            focus.dispatchEvent(event);
        }
    }
    onList({ list }) {
        return {
            totalRows: list.length,
            newList: true,
        };
    }
    createVirtualList({ totalRows, isC, topIndex, itemHeight, rowXFormFn, containerXFormFn, shadowRoot, heightenerParts }) {
        heightenerParts[0].deref().style.height = totalRows * itemHeight + 'px';
    }
    onScroll({ containerScrollTop, shadowRoot }) {
        console.log(containerScrollTop);
        const contents = shadowRoot.querySelectorAll('.content');
        const scroller = shadowRoot.querySelector('.scroller');
        let count = 0;
        const scrollerTop = scroller.getBoundingClientRect().top;
        contents.forEach(el => {
            el.style.top = (scrollerTop - containerScrollTop + el.clientHeight * count) + 'px';
            count++;
        });
    }
    rowXFormFn = async (el, x) => {
        const dtr = this.#ctsMap.get(el);
        await dtr.transform(el);
    };
    doTransform(row, el) {
        let dtr = undefined;
        const { list } = this;
        if (!this.#ctsMap.has(el)) {
            const { rowTransform, rowTransformPlugins } = this;
            const ctx = {
                match: rowTransform,
                plugins: rowTransformPlugins,
            };
            const dtr = new DTR(ctx);
            this.#ctsMap.set(el, dtr);
        }
        if (dtr === undefined) {
            dtr = this.#ctsMap.get(el);
        }
        dtr.ctx.host = list[row];
        return el;
    }
    generate(row) {
        const { rowTemplate } = this;
        const clone = rowTemplate.content.cloneNode(true);
        return clone.firstChild;
    }
    containerXFormFn(el) {
    }
    onRowHTML({ rowHTML }) {
        const rowTemplate = document.createElement('template');
        rowTemplate.innerHTML = rowHTML;
        return {
            rowTemplate
        };
    }
}
const ce = new CE({
    config: {
        tagName: 'xtal-vlist',
        propDefaults: {
            itemHeight: 30,
            totalRows: -1,
            isC: true,
            rowHTML: '',
            containerScrollTop: 0,
            rowTransform: {},
            rowTransformPlugins: {},
            mainTemplate: String.raw `
            <slot style=display:none name=row be-deslotted='{
                "props": "outerHTML",
                "propMap": {"outerHTML": "rowHTML"}
            }'></slot>
            <div class=scroller part=scroller style="overflow:auto;height:inherit;width:inherit;">
                <div part=heightener style="opacity:0;top:0;left:0;width:1px;height:inherit;"></div>
                <div class=content part=content1>
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                </div>
                <div class=content part=content2>
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                </div>
                <div class=content part=content3>
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                </div>
            </div>
            </div>
            <be-hive></be-hive>
            `,
            styles: String.raw `
<style>
    .scroller{
        display:flex;
        overflow:auto;
        border:1px solid black;
        height:inherit;
        width:inherit;
    }
    .content{
        overflow: hidden;
        position: absolute;
    }
</style>
            `,
            transform: {
                heightenerParts: true,
                scrollerParts: [{}, { scroll: { prop: 'containerScrollTop', vft: 'scrollTop' } }]
            }
        },
        propInfo: {
            newList: {
                dry: false,
            }
        },
        actions: {
            ...beTransformed,
            onList: {
                ifAllOf: ['rowTemplate', 'list'],
            },
            createVirtualList: 'newList',
            onRowHTML: 'rowHTML',
            onScroll: 'containerScrollTop',
        }
    },
    superclass: XtalVList,
    mixins: [TemplMgmt],
});
export const XtalVListExt = ce.classDef;
