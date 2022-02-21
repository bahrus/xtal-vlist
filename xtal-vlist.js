var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _XtalVList_ctsMap;
import { CE } from 'trans-render/lib/CE.js';
import { TemplMgmt, beTransformed } from 'trans-render/lib/mixins/TemplMgmt.js';
import { DTR } from 'trans-render/lib/DTR.js';
import { VirtualList } from './vlist.js';
import 'be-deslotted/be-deslotted.js';
export class XtalVList extends HTMLElement {
    constructor() {
        super(...arguments);
        _XtalVList_ctsMap.set(this, new WeakMap());
        this.scrollCallback = (pos) => {
            this.lastScrollPos = pos;
        };
        this.rowXFormFn = (el, x) => {
            const dtr = __classPrivateFieldGet(this, _XtalVList_ctsMap, "f").get(el);
            dtr.transform(el);
        };
    }
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
                generatorFn: (row) => this.doTransform(row, this.generate(row)),
                rowXFormFn,
                containerXFormFn,
            });
            const containerDiv = shadowRoot.querySelector('#container');
            containerDiv.appendChild(this.virtualList.container);
        }
    }
    doTransform(row, el) {
        if (!__classPrivateFieldGet(this, _XtalVList_ctsMap, "f").has(el)) {
            const { rowTransform, list, rowTransformPlugins } = this;
            const ctx = {
                match: rowTransform,
                plugins: rowTransformPlugins,
                host: list[row],
            };
            const dtr = new DTR(ctx);
            __classPrivateFieldGet(this, _XtalVList_ctsMap, "f").set(el, dtr);
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
_XtalVList_ctsMap = new WeakMap();
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
