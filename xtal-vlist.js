import { CE } from 'trans-render/lib/CE.js';
import { TemplMgmt, beTransformed } from 'trans-render/lib/mixins/TemplMgmt.js';
import('be-deslotted/be-deslotted.js');
import('be-intersectional/be-intersectional.js');
import('be-repeated/be-repeated.js');
export class XtalVList extends HTMLElement {
    //#ctsMap = new WeakMap<HTMLElement, DTR>();
    #previousPageNo = 0;
    containerParts;
    #pageContainers = {};
    onList({ list }) {
        return {
            totalRows: list.length,
            newList: true,
        };
    }
    createVirtualList({ totalRows, rowTemplate, rowTransform, pageSize, beIntersectional, minItemHeight }) {
        const pages = Math.ceil(totalRows / pageSize);
        const minHeight = minItemHeight * pageSize;
        const templHeight = (minItemHeight + 0.1) * pageSize;
        const beIntersectionalAttr = JSON.stringify(beIntersectional);
        const templS = String.raw `
<div class=page style="min-height:${minHeight}px;">
    <template style="height:${templHeight}px" be-intersectional='${beIntersectionalAttr}'>
        <div class=rowContainer></div>
    </template>
</div>
        `;
        const pageTempl = document.createElement('template');
        pageTempl.innerHTML = templS;
        if (pages > this.#previousPageNo) {
            const fragment = document.createDocumentFragment();
            for (let i = this.#previousPageNo; i < pages; i++) {
                const pageContainer = pageTempl.content.cloneNode(true);
                this.#pageContainers[i] = new WeakRef(pageContainer.firstElementChild);
                const bodyDiv = pageContainer.querySelector('template').content.querySelector('.rowContainer');
                const lBound = i * pageSize;
                const uBound = lBound + pageSize;
                const beRepeatedArgs = {
                    list: '.list',
                    lBound,
                    uBound,
                    transform: rowTransform,
                    debug: true
                };
                const rowTemplateClone = rowTemplate.cloneNode(true);
                rowTemplateClone.setAttribute('be-repeated', JSON.stringify(beRepeatedArgs));
                bodyDiv.appendChild(rowTemplateClone);
                fragment.appendChild(pageContainer);
                this.#previousPageNo = i + 1;
            }
            const container = this.containerParts[0].deref();
            container.appendChild(fragment);
        }
        else {
            for (let i = pages; i < this.#previousPageNo; i++) {
                const pageContainer = this.#pageContainers[i].deref();
                if (pageContainer !== undefined)
                    pageContainer.remove();
            }
        }
    }
    onRowHTML({ rowHTML }) {
        const rowTemplate = document.createElement('template');
        rowTemplate.innerHTML = rowHTML;
        return {
            rowTemplate
        };
    }
    onRowStyle({ rowStyle, shadowRoot }) {
        console.log({ rowStyle, shadowRoot });
        shadowRoot.appendChild(rowStyle.cloneNode(true));
    }
}
const ce = new CE({
    config: {
        tagName: 'xtal-vlist',
        propDefaults: {
            itemHeight: 30,
            minItemHeight: 8,
            totalRows: -1,
            isC: true,
            rowHTML: '',
            containerScrollTop: 0,
            pageSize: 100,
            rowTransform: {},
            rowTransformPlugins: {},
            beIntersectional: {
                enterDelay: 16,
                exitDelay: 32,
            },
            mainTemplate: String.raw `
            <slot style=display:none name=style be-deslotted='{
                "props": "content",
                "propMap": {"content": "rowStyle"}
            }'></slot>
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
    .page{
        display:flex;
        flex-direction:column;
    }
     template[be-intersectional], template[is-intersectional]{
            display:block;
    }
    template[be-intersectional].expanded, template[is-intersectional].expanded{
            display:none;
    }    

</style>
            `,
            transform: {
                containerParts: true,
            }
        },
        propInfo: {
            newList: {
                dry: false,
            },
            rowStyle: {
                parse: false,
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
            onRowStyle: 'rowStyle',
        }
    },
    superclass: XtalVList,
    mixins: [TemplMgmt],
});
export const XtalVListExt = ce.classDef;
