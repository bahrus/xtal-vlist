import { XtallatX, lispToCamel } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
import { VirtualList } from './vlist.js';
const item_height = 'item-height';
const total_rows = 'total-rows';
const h = 'h';
const w = 'w';
const top_index = 'top-index';
const focus_id = 'focus-id';
export class XtalVListBase extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._c = false;
        this._itemHeight = 30;
        this._h = 600;
        this._totalRows = -1;
        this._topIndex = undefined;
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([item_height, total_rows, h, w, top_index]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case total_rows:
            case item_height:
            case h:
            case w:
            case top_index:
                this['_' + lispToCamel(n)] = parseFloat(nv);
                break;
            default:
                super.attributeChangedCallback(n, ov, nv);
        }
        this.onPropsChange();
    }
    connectedCallback() {
        this.style.display = 'block';
        this.propUp(XtalVListBase.observedAttributes.map(s => lispToCamel(s)));
        this.propUp(['items']);
        this._c = true;
        this.onPropsChange();
    }
    transform(row, el) {
        return el;
    }
    get itemHeight() {
        return this._itemHeight;
    }
    set itemHeight(nv) {
        this.attr(item_height, nv.toString());
    }
    get h() {
        return this._h;
    }
    set h(nv) {
        this.attr(h, nv.toString());
    }
    get totalRows() {
        return this._totalRows;
    }
    set totalRows(nv) {
        delete this._list;
        this.attr(total_rows, nv.toString());
    }
    get items() {
        return this._items;
    }
    set items(nv) {
        this._items = nv;
        this.totalRows = nv.length;
        if (this._lastScrollPos !== undefined) {
            this._list.scrollToPosition(this._lastScrollPos);
        }
    }
    get topIndex() {
        return this._topIndex;
    }
    set topIndex(nv) {
        if (nv !== undefined) {
            this.attr(top_index, nv.toString());
        }
    }
    rowXFormFn(el) { }
    containerXFormFn(el) { }
    onVListScroll(pos) {
        this._lastScrollPos = pos;
    }
    onPropsChange() {
        if (!this._c || this._totalRows < 0)
            return;
        if (!this._list) {
            const b = this.onVListScroll.bind(this);
            const c = this.rowXFormFn.bind(this);
            const d = this.containerXFormFn.bind(this);
            this._list = new VirtualList({
                h: this._h,
                itemHeight: this._itemHeight,
                totalRows: this._totalRows,
                scrollCallback: b,
                generatorFn: (row) => this.transform(row, this.generate(row)),
                rowXFormFn: c,
                containerXFormFn: d,
            });
            this._list.container.classList.add("container");
            this.innerHTML = '';
            this.appendChild(this._list.container);
        }
        if (this._topIndex !== undefined) {
            this._list.scrollToIndex(this._topIndex);
        }
        if (this._lastFocusID !== undefined) {
            const focus = this._list.container.querySelector(`[${focus_id}="${this._lastFocusID}"]`);
            if (focus)
                focus.focus();
        }
    }
}
