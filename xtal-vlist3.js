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
    createVirtualList({ totalRows, isC, topIndex, h, itemHeight, scrollCallback, rowXFormFn, containerXFormFn, shadowRoot }) {
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
            const containerDiv = shadowRoot.querySelector('#container');
            containerDiv.appendChild(this.virtualList.container);
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
            h: 600,
            totalRows: -1,
            isC: true,
            rowHTML: '',
            mainTemplate: String.raw `
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
        actions: {
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
