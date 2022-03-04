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
    createVirtualList({ totalRows, rowTemplate, rowTransform, }) {
        const pages = Math.floor(totalRows / 100);
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < pages; i++) {
            const container = document.createElement('div');
            container.classList.add('iah');
            const page = document.createElement('template');
            const beIntersectionalArgs = {
                enterDelay: 16,
                exitDelay: 32,
            };
            page.setAttribute('be-intersectional', JSON.stringify(beIntersectionalArgs));
            page.dataset.vlistIdx = i.toString();
            const bodyDiv = document.createElement('div');
            bodyDiv.dataset.vlistIdx = i.toString();
            bodyDiv.dataset.bodyDiv = 'true';
            const lBound = i * 100;
            const uBound = lBound + 100;
            const beRepeatedArgs = {
                list: '.list',
                lBound,
                uBound,
                //debug: true,
                transform: rowTransform,
            };
            const rowTemplateClone = rowTemplate.cloneNode(true);
            rowTemplateClone.setAttribute('be-repeated', JSON.stringify(beRepeatedArgs));
            bodyDiv.appendChild(rowTemplateClone);
            page.content.appendChild(bodyDiv);
            container.appendChild(page);
            fragment.appendChild(container);
        }
        const container = this.containerParts[0].deref();
        container.appendChild(fragment);
    }
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
                <div class=container part=container></div>
            </div>
            </div>
            <be-hive></be-hive>
            `,
            styles: String.raw `
<style>
    .scroller{
        display:flex;
        flex-direction:column;
        overflow:auto;
        border:1px solid black;
        height:inherit;
        width:inherit;
    }
    .container{
        display:flex;
        flex-direction:column;
    }
    .iah{
        min-height: 800px;
        display:flex;
        flex-direction:column;
    }
    template[be-intersectionalx], template[be-intersectional], template[is-intersectional]{
            display:block;
            height: 1000px;
    }
    template[be-intersectional].expanded, template[is-intersectional].expanded{
            display:none;
    }    

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
        }
    },
    superclass: XtalVList,
    mixins: [TemplMgmt],
});
export const XtalVListExt = ce.classDef;
