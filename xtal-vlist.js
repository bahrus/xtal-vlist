import { XtallatX, lispToCamel } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
import VirtualizedList from 'virtualized-list/es/index.js';
const height = 'height';
const row_count = 'row-count';
const initial_scroll_top = 'initial-scroll-top';
const initial_index = 'initial-index';
const overscan_count = 'overscan-count';
const estimated_row_height = 'estimated-row-height';
const row_height = 'row-height';
export class XtalVList extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._c = false;
        this._rowHeight = 20;
        this._height = 600;
        this._initialScrollTop = 0;
        this._initialIndex = 0;
        this._overscanCount = 3;
        this._estimatedRowHeight = 20;
        this._rowCount = -1;
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([height, row_count, initial_scroll_top, initial_index, initial_index, overscan_count, estimated_row_height]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case height:
                this._height = parseFloat(nv);
                break;
            case row_count:
            case initial_scroll_top:
            case initial_index:
            case overscan_count:
            case estimated_row_height:
            case row_height:
                this['_' + lispToCamel(n)] = parseFloat(nv);
                break;
            default:
                super.attributeChangedCallback(n, ov, nv);
        }
        this.onPropsChange();
    }
    connectedCallback() {
        this.propUp(XtalVList.observedAttributes.map(s => lispToCamel(s)));
        this.propUp(['rows']);
        this._c = true;
        this.onPropsChange();
    }
    get rows() {
        return this._rows;
    }
    set rows(nv) {
        this._rows = nv;
    }
    onPropsChange() {
        if (!this._c || this._rowCount < 0 || !this._renderRow)
            return;
        const virtualizedList = new VirtualizedList(this, {
            height: this._height,
            rowCount: this._rowCount,
            renderRow: this._renderRow,
            rowHeight: this._rowHeight,
            initialIndex: this._initialIndex,
            initialScrollTop: this._initialScrollTop,
            overscanCount: this._overscanCount,
            estimatedRowHeight: this._estimatedRowHeight
        });
    }
    get renderRow() {
        return this._renderRow;
    }
    set renderRow(nv) {
        this._renderRow = nv;
    }
    get rowHeight() {
        return this._rowHeight;
    }
    set rowHeight(nv) {
        this._rowHeight = nv;
        this.onPropsChange();
    }
    get height() {
        return this._height;
    }
    set height(nv) {
        this.attr(height, nv.toString());
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
    get overscanCount() {
        return this._overscanCount;
    }
    set overscanCount(nv) {
        this.attr(overscan_count, nv.toString());
    }
    get estimatedRowHeight() {
        return this._estimatedRowHeight;
    }
    set estimatedRowHeight(nv) {
        this.attr(estimated_row_height, nv.toString());
    }
    get rowCount() {
        return this._rowCount;
    }
    set rowCount(nv) {
        this.attr(row_count, nv.toString());
    }
}
