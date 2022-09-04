import {XtalVlistActions, XtalVlistProps} from './types';
import {CE} from 'trans-render/lib/CE.js';
import {TemplMgmt, beTransformed, TemplMgmtProps} from 'trans-render/lib/mixins/TemplMgmt.js';
import('be-deslotted/be-deslotted.js');
import('be-lazy/be-lazy.js');
import('be-oosoom/be-oosoom.js');
import('be-repeated/be-repeated.js');

export class XtalVList extends HTMLElement implements XtalVlistActions{
    #previousPageNo: number = 0;
    containerParts!: WeakRef<HTMLDivElement>[];
    #pageContainers: {[key: number]: WeakRef<HTMLDivElement>} = {};
    onList({list}: this){
        return {
            totalRows: list.length,
            newList: true,
        }
    }
    createVirtualList({
            totalRows, rowTemplate,
            rowTransform, pageSize, timestampKey,
            rowIntersectionalSettings, minItemHeight
    }: this): void {
        const pages = Math.ceil(totalRows / pageSize);

        if(pages > this.#previousPageNo){
            const minHeight = minItemHeight * pageSize;
            const templHeight = (minItemHeight + 0.1) * pageSize;
            
            const beLazyAttr = JSON.stringify(rowIntersectionalSettings);
            const templS = String.raw`
    <div class=page style="min-height:${minHeight}px;">
        <template style="height:${templHeight}px" be-lazy='${beLazyAttr}'>
            <div class=rowContainer></div>
        </template>
    </div>
            `;
            const pageTempl = document.createElement('template');
            pageTempl.innerHTML = templS;
            const fragment = document.createDocumentFragment();
            for(let i = this.#previousPageNo; i < pages; i++){
                const pageContainer = pageTempl.content.cloneNode(true) as HTMLDivElement;
                this.#pageContainers[i] = new WeakRef(pageContainer.firstElementChild as HTMLDivElement);
                const bodyDiv = pageContainer.querySelector('template')!.content.querySelector('.rowContainer')!;
                const lBound = i * pageSize;
                const uBound = lBound + pageSize - 1;
                const beRepeatedArgs = {
                    list: '.list',
                    lBound,
                    uBound,
                    transform: rowTransform,
                    timestampKey,
                }
                const rowTemplateClone = rowTemplate.cloneNode(true) as HTMLElement;
                const beOosoomArgs = {
                    observeClosest: ".page"
                };
                rowTemplateClone.setAttribute('be-oosoom', JSON.stringify(beOosoomArgs));
                rowTemplateClone.setAttribute('be-repeated', JSON.stringify(beRepeatedArgs));
                bodyDiv.appendChild(rowTemplateClone);
                if(i === pages - 1){
                    const div = pageContainer.querySelector('.page') as HTMLDivElement;
                    div.style.minHeight = minItemHeight + 'px';
                }
                fragment.appendChild(pageContainer);
                this.#previousPageNo = i + 1;
            }
            const container = this.containerParts[0].deref()!;
            container.appendChild(fragment);
        }else if(pages < this.#previousPageNo){
            for(let i = pages; i < this.#previousPageNo; i++){
                const pageContainer = this.#pageContainers[i].deref();
                if(pageContainer !== undefined) pageContainer.remove();
                
            }
            this.#previousPageNo = pages;
        }

    }

}

export interface XtalVList extends XtalVlistProps{}

const ce = new CE<XtalVlistProps & TemplMgmtProps, XtalVlistActions>({
    config:{
        tagName: 'xtal-vlist',
        propDefaults: {
            itemHeight: 30,
            minItemHeight: 8,
            totalRows: -1,
            isC: true,
            //rowHTML: '',
            containerScrollTop: 0,
            pageSize: 100,
            rowTransform: {},
            rowTransformPlugins: {},
            rowIntersectionalSettings: {
                enterDelay: 16,
                exitDelay: 32,
            },
            mainTemplate: String.raw`
            <slot name=header></slot>
            <slot style=display:none name=row be-deslotted='{
                "props": ".",
                "propMap": {".": "rowTemplate"}
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
     template[be-lazy], template[is-lazy]{
            display:block;
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
            rowTemplate: {
                parse: false,
            },
            timestampKey: {
                type: 'String'
            }
        },
        actions:{
            ...beTransformed,
            onList: {
                ifAllOf: ['rowTemplate', 'list'],
            },
            createVirtualList: {
                ifAllOf: ['newList', 'rowTemplate']
            },
        }
    },
    superclass: XtalVList,
    mixins: [TemplMgmt],
});

export const XtalVListExt = ce.classDef!;

declare global {
    interface HTMLElementTagNameMap {
        "xtal-vlist": XtalVList,
    }
}