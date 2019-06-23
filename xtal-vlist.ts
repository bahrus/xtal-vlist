import {XtallatX, lispToCamel} from 'xtal-element/xtal-latx.js';
import {hydrate} from 'trans-render/hydrate.js';
import VirtualizedList from 'virtualized-list/es/index.js';
const height = 'height';
const row_count = 'row-count';
const initial_scroll_top = 'initial-scroll-top';
const initial_index = 'initial-index';
const overscan_count = 'overscan-count';
const estimated_row_height = 'estimated-row-height';
const row_height = 'row-height';
type rowIdxToNumber = (n: number) => number; 
type rowHeightType = number | number[] | rowIdxToNumber;
export class XtalVList extends XtallatX(hydrate(HTMLElement)){

    static get observedAttributes(){
        return super.observedAttributes.concat([height, row_count, initial_scroll_top, initial_index, initial_index, overscan_count, estimated_row_height])
    }
    attributeChangedCallback(n: string, ov: string, nv: string){
        switch(n){
            case height:
                this._height = parseFloat(nv);
                break;
            case row_count:
            case initial_scroll_top:
            case initial_index:
            case overscan_count:
            case estimated_row_height:
            case row_height:
                (<any>this)['_' + lispToCamel(n)] = parseFloat(nv);
                break;
            default:
                super.attributeChangedCallback(n, ov, nv);
        }
        this.onPropsChange();
    }

    _c = false;
    connectedCallback(){
        this.propUp(XtalVList.observedAttributes.map(s => lispToCamel(s)));
        this.propUp(['rows']);
        this._c = true;
        this.onPropsChange();
    }

    _rows!: any[];
    get rows(){
        return this._rows;
    }
    set rows(nv){
        this._rows = nv;
    }

    onPropsChange(){
        if(!this._c || this._rowCount < 0 || !this._renderRow) return;
        
        const virtualizedList = new VirtualizedList(this, {
            height: this._height, // The height of the container
            rowCount: this._rowCount,
            renderRow: this._renderRow,
            rowHeight: this._rowHeight,
            initialIndex: this._initialIndex,
            initialScrollTop: this._initialScrollTop,
            overscanCount: this._overscanCount,
            estimatedRowHeight: this._estimatedRowHeight
        });
    }

    _renderRow!: (idx: number) => HTMLElement

    get renderRow(){
        return this._renderRow;
    }
    set renderRow(nv){
        this._renderRow = nv;
    }

    _rowHeight: rowHeightType = 20;
    get rowHeight(){
        return this._rowHeight;
    }
    set rowHeight(nv){
        this._rowHeight = nv;
        this.onPropsChange();
    }

    _height: number = 600;
    get height(){
        return this._height;
    }
    set height(nv: number){
        this.attr(height, nv.toString());
    }

    _initialScrollTop = 0;
    get initialScrollTop(){
        return this._initialScrollTop;
    }
    set initialScrollTop(nv){
        this.attr(initial_scroll_top, nv.toString());
    }

    _initialIndex = 0;
    get initialIndex(){
        return this._initialIndex;
    }
    set initialIndex(nv){
        this.attr(initial_index, nv.toString());
    }

    _overscanCount = 3;
    get overscanCount(){
        return this._overscanCount;
    }
    set overscanCount(nv){
        this.attr(overscan_count, nv.toString());
    }

    _estimatedRowHeight = 20;
    get estimatedRowHeight(){
        return this._estimatedRowHeight;
    }
    set estimatedRowHeight(nv){
        this.attr(estimated_row_height, nv.toString());
    }

    _rowCount = -1;
    get rowCount(){
        return this._rowCount;
    }
    set rowCount(nv){
        this.attr(row_count, nv.toString());
    }



}