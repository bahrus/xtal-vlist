import {XtalVlistActions, XtalVlistProps} from './types';
import {CE} from 'trans-render/lib/CE.js';
import {TemplMgmt, beTransformed, TemplMgmtProps} from 'trans-render/lib/mixins/TemplMgmt.js';
import {RenderContext} from 'trans-render/lib/types';
import {DTR} from 'trans-render/lib/DTR.js';
import 'be-deslotted/be-deslotted.js';
import 'be-intersectional/be-intersectional.js';
import 'be-repeated/be-repeated.js';

export class XtalVList extends HTMLElement implements XtalVlistActions{
    #ctsMap = new WeakMap<HTMLElement, DTR>();
    heightenerParts!: WeakRef<HTMLDivElement>[];
    scrollerParts!: WeakRef<HTMLDivElement>[];
    containerParts!: WeakRef<HTMLDivElement>[];
    onList({list}: this){
        return {
            totalRows: list.length,
            newList: true,
        }
    }
    createVirtualList({
            totalRows, isC, topIndex, itemHeight,
            rowXFormFn, containerXFormFn, shadowRoot, heightenerParts, rowTemplate,
            rowTransform,
    }: this): void {
        //heightenerParts![0].deref().style.height = totalRows * itemHeight + 'px';
        const pages = Math.floor(totalRows / 100);
        const fragment = document.createDocumentFragment();
        for(let i = 0; i < pages; i++){
            const container = document.createElement('div');
            container.classList.add('iah');
            const page = document.createElement('template');
            const beIntersectionalArgs = {
                enterDelay: 16,
                exitDelay: 32,
            };
            page.setAttribute('be-intersectional', JSON.stringify(beIntersectionalArgs));
            page.dataset.vlistIdx = i.toString();
            //const enterDiv = document.createElement('div');
            //enterDiv.dataset.enterDiv = 'true';
            //page.content.appendChild(enterDiv);
            const bodyDiv = document.createElement('div');
            bodyDiv.dataset.vlistIdx = i.toString();
            bodyDiv.dataset.bodyDiv = 'true';
            const lBound = i*100;
            const uBound = lBound + 100;
            const beRepeatedArgs = {
                list: '.list',
                lBound,
                uBound,
                debug: true,
                transform: rowTransform,
            }
            const rowTemplateClone = rowTemplate.cloneNode(true) as HTMLElement;
            rowTemplateClone.setAttribute('be-repeated', JSON.stringify(beRepeatedArgs));
            bodyDiv.appendChild(rowTemplateClone);
            page.content.appendChild(bodyDiv);
            //const exitDiv = document.createElement('div');
            //exitDiv.dataset.exitDiv = 'true';
            //page.content.appendChild(exitDiv);
            container.appendChild(page);
            fragment.appendChild(container);
        }
        const container = this.containerParts[0].deref()!;
        container.appendChild(fragment);
    }

    rowXFormFn = async (el: HTMLElement, x: any) => {
        const dtr = this.#ctsMap.get(el);
        await dtr.transform(el);
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
    generate(row: number) : HTMLElement{
        const {rowTemplate} = this;
        const clone = rowTemplate.content.cloneNode(true) as HTMLElement;
        return clone.firstChild as HTMLElement;
    }
    containerXFormFn(el: HTMLElement){
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
            rowTransform: {},
            rowTransformPlugins: {},
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
        actions:{
            ...beTransformed,
            onList: {
                ifAllOf: ['rowTemplate', 'list'],
            },
            createVirtualList: {
                ifAllOf: ['newList', 'rowTemplate']
            } ,
            onRowHTML: 'rowHTML',
            //onScroll: 'containerScrollTop',
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