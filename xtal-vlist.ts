import {XtalVlistActions, XtalVlistProps} from './types';
import {CE} from 'trans-render/lib/CE.js';
import {TemplMgmt, beTransformed, TemplMgmtProps} from 'trans-render/lib/mixins/TemplMgmt.js';
import {RenderContext} from 'trans-render/lib/types';
import {DTR} from 'trans-render/lib/DTR.js';
import {VirtualList} from './vlist.js';
import 'be-deslotted/be-deslotted.js';


export class XtalVList extends HTMLElement implements XtalVlistActions{
    #ctsMap = new WeakMap<HTMLElement, DTR>();
    setFocus({virtualList, focusId, lastFocusId}: this){
        const focus = virtualList.container.querySelector(`[${focusId}="${lastFocusId}"]`) as HTMLElement;
        if(focus) {
            focus.focus();
            const event = new Event('focus', { bubbles: true, cancelable: true });
            focus.dispatchEvent(event);
        }
    }
    onList({list}: this){
        return {
            totalRows: list.length,
            newList: true,
        }
    }
    createVirtualList({
            totalRows, isC, topIndex, h, itemHeight, scrollCallback,
            rowXFormFn, containerXFormFn, shadowRoot
    }: this): void {
        const containerDiv = shadowRoot.querySelector('#container');
        if(this.virtualList !== undefined){
            containerDiv.innerHTML = ''
        }
        this.virtualList = new VirtualList({
            h,
            itemHeight,
            totalRows,
            scrollCallback,
            generatorFn: (row: number) => this.doTransform(row, this.generate(row)),
            rowXFormFn,
            containerXFormFn,
        });
        containerDiv.appendChild(this.virtualList.container);
    }
    scrollCallback = (pos: number) => {
        this.lastScrollPos = pos;
    }
    rowXFormFn = async (el: HTMLElement, x: any) => {
        const dtr = this.#ctsMap.get(el);
        await dtr.transform(el);
    }
    doTransform(row: number, el: HTMLElement){
        if(!this.#ctsMap.has(el)){
            const {rowTransform, list, rowTransformPlugins} = this;
            const ctx: RenderContext = {
                match: rowTransform,
                plugins: rowTransformPlugins,
                host: list[row],
            };
            const dtr = new DTR(ctx);
            this.#ctsMap.set(el, dtr);
        }
        
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
            h: 600,
            totalRows: -1,
            isC: true,
            rowHTML: '',
            rowTransform: {},
            rowTransformPlugins: {},
            mainTemplate: String.raw`
            <slot style=display:none name=row be-deslotted='{
                "props": "outerHTML",
                "propMap": {"outerHTML": "rowHTML"}
            }'></slot>
            <div id=container></div>
            <be-hive></be-hive>
            `,
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
            createVirtualList: 'newList',
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