import { CE } from 'trans-render/lib/CE.js';
import { TemplMgmt, beTransformed } from 'trans-render/lib/mixins/TemplMgmt.js';
import { VirtualList } from './vlist.js';
import 'be-deslotted/be-deslotted.js';
export class XtalVList extends HTMLElement {
    setFocus({ virtualList, focusId, lastFocusId }) {
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
    createVirtualList({ totalRows, isC, topIndex, h, itemHeight, scrollCallback, rowXFormFn, containerXFormFn }) {
        if (this.virtualList === undefined) {
            this.virtualList = new VirtualList({
                h,
                itemHeight,
                totalRows,
                scrollCallback,
                generatorFn: (row) => this.transform(row, this.generate(row)),
                rowXFormFn,
                containerXFormFn,
            });
        }
    }
    scrollCallback = (pos) => {
        this.lastScrollPos = pos;
    };
    rowXFormFn = (el) => {
    };
    transform(row, el) {
        return el;
    }
    generate(row) {
        throw "Needs Implementation";
    }
    containerXFormFn(el) {
    }
}
const ce = new CE({
    config: {
        tagName: 'xtal-vlist',
        propDefaults: {
            itemHeight: 30,
            h: 600,
            totalRows: -1,
            isC: true,
            rowTemplate: '',
            mainTemplate: String.raw `
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
        actions: {
            ...beTransformed,
            onList: 'list',
            createVirtualList: 'newList',
        }
    },
    superclass: XtalVList,
    mixins: [TemplMgmt],
});
