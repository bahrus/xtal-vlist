import { CE } from 'trans-render/lib/CE.js';
import { TemplMgmt, beTransformed } from 'trans-render/lib/mixins/TemplMgmt.js';
import { DTR } from 'trans-render/lib/DTR.js';
import 'be-deslotted/be-deslotted.js';
import 'be-intersectional/be-intersectional.js';
import 'be-repeated/be-repeated.js';
export class XtalVList extends HTMLElement {
    #ctsMap = new WeakMap();
    heightenerParts;
    scrollerParts;
    containerParts;
    onList({ list }) {
        return {
            totalRows: list.length,
            newList: true,
        };
    }
    createVirtualList({ totalRows, isC, topIndex, itemHeight, rowXFormFn, containerXFormFn, shadowRoot, heightenerParts, rowTemplate, rowTransform, }) {
        //heightenerParts![0].deref().style.height = totalRows * itemHeight + 'px';
        const pages = Math.floor(totalRows / 100);
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < pages; i++) {
            const page = document.createElement('template');
            const beIntersectionalArgs = {
                archive: false
            };
            page.setAttribute('be-intersectional', JSON.stringify(beIntersectionalArgs));
            const lbound = i * 100;
            const ubound = lbound + 100;
            const beRepeatedArgs = {
                list: '.list',
                lbound,
                ubound,
                debug: true,
                transform: rowTransform,
            };
            const rowTemplateClone = rowTemplate.cloneNode(true);
            rowTemplateClone.setAttribute('be-repeated', JSON.stringify(beRepeatedArgs));
            page.content.appendChild(rowTemplateClone);
            fragment.appendChild(page);
        }
        const container = this.containerParts[0].deref();
        container.appendChild(fragment);
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
            <div class=scroller part=scroller>
                <div part=container></div>
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
    template[be-intersectional], template[is-intersectional]{
            display:block;
            height: 1000px;
    }
    /* template[be-intersectional].expanded, template[is-intersectional].expanded{
            display:none;
    }     */

</style>
            `,
            transform: {
                heightenerParts: true,
                scrollerParts: true,
                containerParts: true,
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
            createVirtualList: {
                ifAllOf: ['newList', 'rowTemplate']
            },
            onRowHTML: 'rowHTML',
            //onScroll: 'containerScrollTop',
        }
    },
    superclass: XtalVList,
    mixins: [TemplMgmt],
});
export const XtalVListExt = ce.classDef;
