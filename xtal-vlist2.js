import { VirtualList } from './vlist.js';
import { xc } from 'xtal-element/lib/XtalCore.js';
//#region 
const baseProp = {
    async: true,
    dry: true,
};
const numProp0 = {
    ...baseProp,
    type: Number,
};
const objProp0 = {
    ...baseProp,
    type: Object,
};
const boolProp0 = {
    ...baseProp,
    type: Boolean,
};
const boolProp1 = {
    ...boolProp0,
    stopReactionsIfFalsy: true,
};
const propDefMap = {
    itemHeight: numProp0,
    h: numProp0,
    w: numProp0,
    totalRows: numProp0,
    topIndex: numProp0,
    items: objProp0,
    isC: boolProp1,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
//#endregion
export class XtalVList extends HTMLElement {
    static observedAttributes = [...slicedPropDefs.boolNames, ...slicedPropDefs.numNames, ...slicedPropDefs.strNames];
    attributeChangedCallback(n, ov, nv) {
        xc.passAttrToProp(this, slicedPropDefs, n, ov, nv);
    }
    propActions = propActions;
    self = this;
    reactor = new xc.Rx(this);
    rowXFormFn(el) { }
    containerXFormFn(el) { }
    _lastFocusID;
    _list;
    _lastScrollPos;
    onVListScroll(pos) {
        this._lastScrollPos = pos;
    }
    setFocus() {
        const focus = this._list.container.querySelector(`[${focus_id}="${this._lastFocusID}"]`);
        if (focus) {
            focus.focus();
            event = new Event('focus', { bubbles: true, cancelable: true });
            focus.dispatchEvent(event);
        }
    }
    isC;
    connectedCallback() {
        xc.mergeProps(this, slicedPropDefs, {
            itemHeight: 30,
            h: 600,
            totalRows: -1,
        });
        this.isC = true;
    }
    onPropChange(n, prop, nv) {
        this.reactor.addToQueue(prop, nv);
    }
    generate(row) {
        throw "Needs Implementation";
    }
    transform(row, el) {
        return el;
    }
}
export const focus_id = 'focus-id';
export const newList = ({ totalRows, isC, topIndex, self }) => {
    if (totalRows < 0)
        return;
    if (!self._list) {
        const b = self.onVListScroll.bind(self);
        const c = self.rowXFormFn.bind(self);
        const d = self.containerXFormFn.bind(self);
        self._list = new VirtualList({
            h: self.h,
            itemHeight: self.itemHeight,
            totalRows: self.totalRows,
            scrollCallback: b,
            generatorFn: (row) => self.transform(row, self.generate(row)),
            rowXFormFn: c,
            containerXFormFn: d,
        });
        self._list.container.classList.add("container");
        self.innerHTML = '';
        self.appendChild(self._list.container);
    }
    if (topIndex !== undefined) {
        self._list.scrollToIndex(topIndex);
    }
    if (self._lastFocusID !== undefined) {
        for (let i = 1; i < 11; i++) {
            setTimeout(() => {
                self.setFocus();
            }, 50 * i);
        }
    }
};
export const propActions = [
    newList
];
xc.letThereBeProps(XtalVList, slicedPropDefs, 'onPropChange');
