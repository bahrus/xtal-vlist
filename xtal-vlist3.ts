import {XtalVlistActions, XtalVlistProps} from './types';
import {CE} from 'trans-render/lib/CE.js';
import {TemplMgmt, beTransformed, TemplMgmtProps} from 'trans-render/lib/mixins/TemplMgmt.js';
import {VirtualList} from './vlist.js';
import 'be-deslotted/be-deslotted.js';

export class XtalVList extends HTMLElement implements XtalVlistActions{
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
        if(this.virtualList === undefined){
            this.virtualList = new VirtualList({
                h,
                itemHeight,
                totalRows,
                scrollCallback,
                generatorFn: (row: number) => this.transform(row, this.generate(row)),
                rowXFormFn,
                containerXFormFn,
            });
            const containerDiv = shadowRoot.querySelector('#container');
            containerDiv.appendChild(this.virtualList.container);
        }
    }
    scrollCallback = (pos: number) => {
        this.lastScrollPos = pos;
    }
    rowXFormFn = (el: HTMLElement) => {
    }
    transform(row: number, el: HTMLElement){
        return el;
    }
    generate(row: number) : HTMLElement{
        throw "Needs Implementation";
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
            mainTemplate: String.raw`
            <slot name=row be-deslotted='{
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