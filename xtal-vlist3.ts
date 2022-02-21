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
            rowXFormFn, containerXFormFn
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
            rowTemplate: '',
            mainTemplate: String.raw`
            <slot name=row be-deslotted='{
                "props": "outerHTML",
                "propMap": {"outerHTML": "rowTemplate"}
            }'></slot>
            <div>hello</div>
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
            onList: 'list',
            createVirtualList: 'newList',
        }
    },
    superclass: XtalVList,
    mixins: [TemplMgmt],
});