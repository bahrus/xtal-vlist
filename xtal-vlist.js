import { CE } from 'trans-render/lib/CE.js';
import { TemplMgmt, beTransformed } from 'trans-render/lib/mixins/TemplMgmt.js';
import { DTR } from 'trans-render/lib/DTR.js';
import { VirtualList } from './vlist2.js';
import 'be-deslotted/be-deslotted.js';
export class XtalVList extends HTMLElement {
    #ctsMap = new WeakMap();
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
        const containerDiv = shadowRoot.querySelector('#container');
        if (this.virtualList !== undefined) {
            containerDiv.innerHTML = '';
        }
        this.virtualList = new VirtualList({
            h,
            itemHeight,
            totalRows,
            scrollCallback,
            generatorFn: (row) => this.doTransform(row, this.generate(row)),
            rowXFormFn,
            containerXFormFn,
        });
        containerDiv.appendChild(this.virtualList.container);
    }
    scrollCallback = (pos) => {
        this.lastScrollPos = pos;
    };
    rowXFormFn = async (el, x) => {
        const dtr = this.#ctsMap.get(el);
        await dtr.transform(el);
    };
    doTransform(row, el) {
        if (!this.#ctsMap.has(el)) {
            const { rowTransform, list, rowTransformPlugins } = this;
            const ctx = {
                match: rowTransform,
                plugins: rowTransformPlugins,
                host: list[row],
            };
            const dtr = new DTR(ctx);
            this.#ctsMap.set(el, dtr);
        }
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
            rowTransform: {},
            rowTransformPlugins: {},
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
export const XtalVListExt = ce.classDef;
