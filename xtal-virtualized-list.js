import { XtallatX, lispToCamel } from 'xtal-element/xtal-latx.js';
import { hydrate, disabled } from 'trans-render/hydrate.js';
import VirtualizedList from 'virtualized-list/es/VirtualList/index.js';
const height = 'height';
const row_count = 'row-count';
const row_height = 'row-height';
const initial_scroll_top = 'initial-scroll-top';
const initial_index = 'initial-index';
const overscan_count = 'overscan-count';
const estimated_row_height = 'estimated-row-height';
export class XtalVirtualizedList extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._conn = false;
    }
    static get is() { return 'xtal-virtualized-list'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([height, row_count, row_height, initial_scroll_top, initial_index, overscan_count, estimated_row_height]);
    }
    attributeChangedCallback(n, ov, nv) {
        //super.attributeChangedCallback(n, ov, nv);
        switch (n) {
            case disabled:
                this._disabled = nv !== null;
                break;
            case row_height:
                this._rowHeight = JSON.parse(nv);
                break;
            default:
                this['_' + lispToCamel(n)] = parseInt(nv);
        }
        this.onPropsChange();
    }
    get height() {
        return this._height;
    }
    set height(nv) {
        this.attr(height, nv.toString());
    }
    get rowCount() {
        return this._rowCount;
    }
    set rowCount(nv) {
        this.attr(row_count, nv.toString());
    }
    get rowHeight() {
        return this._rowHeight;
    }
    set rowHeight(nv) {
        this._rowHeight = nv;
    }
    get initialScrollTop() {
        return this._initialScrollTop;
    }
    set initialScrollTop(nv) {
        this.attr(initial_scroll_top, nv.toString());
    }
    get initialIndex() {
        return this._initialIndex;
    }
    set initialIndex(nv) {
        this.attr(initial_index, nv.toString());
    }
    get estimatedRowHeight() {
        return this._estimatedRowHeight;
    }
    set estimatedRowHeight(nv) {
        this.attr(estimated_row_height, nv.toString());
    }
    get overscanCount() {
        return this._overscanCount;
    }
    set overscanCount(nv) {
        this.attr(overscan_count, nv.toString());
    }
    connectedCallback() {
        this.propUp(XtalVirtualizedList.observedAttributes.map(s => lispToCamel(s)));
        this._conn = true;
        this.onPropsChange();
    }
    onPropsChange() {
        if (this._disabled || !this._conn ||
            this._height === undefined || this._rowCount === undefined || this._rowHeight === undefined)
            return;
        this.virtualizedList = new VirtualizedList(this, this);
    }
    scrollToIndex(index, alignment) {
        this.virtualizedList.scrollToIndex(index, alignment);
    }
    setRowCount(count) {
        this.virtualizedList.setRowCount(count);
    }
}
