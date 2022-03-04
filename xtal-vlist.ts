import {XtalVlistActions, XtalVlistProps} from './types';
import {CE} from 'trans-render/lib/CE.js';
import {TemplMgmt, beTransformed, TemplMgmtProps} from 'trans-render/lib/mixins/TemplMgmt.js';
import {RenderContext} from 'trans-render/lib/types';
import {DTR} from 'trans-render/lib/DTR.js';
import {html} from 'trans-render/lib/html.js';
import('be-deslotted/be-deslotted.js');
import('be-intersectional/be-intersectional.js');
import('be-repeated/be-repeated.js');

export class XtalVList extends HTMLElement implements XtalVlistActions{
    #ctsMap = new WeakMap<HTMLElement, DTR>();
    containerParts!: WeakRef<HTMLDivElement>[];
    onList({list}: this){
        return {
            totalRows: list.length,
            newList: true,
        }
    }
    createVirtualList({
            totalRows, rowTemplate,
            rowTransform, pageSize,
            beIntersectional,
    }: this): void {
        const pages = Math.floor(totalRows / pageSize);
        const fragment = document.createDocumentFragment();
        const beIntersectionalAttr = JSON.stringify(beIntersectional);
        const templ = html`
<div class=page>
    <template be-intersectional='${beIntersectionalAttr}'>
        <div class=rowContainer></div>
    </template>
</div>
        `;
        for(let i = 0; i < pages; i++){
            const container = templ.content.cloneNode(true) as HTMLDivElement;
            const bodyDiv = container.querySelector('template')!.content.querySelector('.rowContainer')!;
            const lBound = i * pageSize;
            const uBound = lBound + pageSize;
            const beRepeatedArgs = {
                list: '.list',
                lBound,
                uBound,
                transform: rowTransform,
            }
            const rowTemplateClone = rowTemplate.cloneNode(true) as HTMLElement;
            rowTemplateClone.setAttribute('be-repeated', JSON.stringify(beRepeatedArgs));
            bodyDiv.appendChild(rowTemplateClone);
            fragment.appendChild(container);
        }
        const container = this.containerParts[0].deref()!;
        container.appendChild(fragment);
    }


    doTransform(row: number, el: HTMLElement){
        let dtr: DTR | undefined = undefined;
        const {list} = this;
        if(!this.#ctsMap.has(el)){
            const {rowTransform, rowTransformPlugins} = this;
            const ctx: RenderContext = {
                match: rowTransform,
                plugins: rowTransformPlugins,
            };
            const dtr = new DTR(ctx);
            this.#ctsMap.set(el, dtr);
        }
        if(dtr === undefined){
            dtr = this.#ctsMap.get(el)!;
        }
        dtr.ctx.host = list[row];
        return el;
    }



    onRowHTML({rowHTML}: this) {
        const rowTemplate = document.createElement('template');
        rowTemplate.innerHTML = rowHTML;
        return {
            rowTemplate
        }
    }
}

export interface XtalVList extends XtalVlistProps{}

const ce = new CE<XtalVlistProps & TemplMgmtProps, XtalVlistActions>({
    config:{
        tagName: 'xtal-vlist',
        propDefaults: {
            itemHeight: 30,
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
            mainTemplate: String.raw`
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
            styles: String.raw`
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
        min-height: 800px;
        display:flex;
        flex-direction:column;
    }
     template[be-intersectional], template[is-intersectional]{
            display:block;
            height: 1000px;
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
            }
        },
        actions:{
            ...beTransformed,
            onList: {
                ifAllOf: ['rowTemplate', 'list'],
            },
            createVirtualList: {
                ifAllOf: ['newList', 'rowTemplate']
            } ,
            onRowHTML: 'rowHTML',
        }
    },
    superclass: XtalVList,
    mixins: [TemplMgmt],
});

export const XtalVListExt = ce.classDef!;

declare global {
    interface HTMLElementTagNameMap {
        "xtal-vlist": XtalVListExt,
    }
}