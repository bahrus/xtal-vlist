import { XtallatX, lispToCamel } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
//import {define} from 'trans-render/define.js';
//import {RenderContext} from 'trans-render/init.d.js';
import { VirtualList } from './vlist.js';
const item_height = 'item-height';
const total_rows = 'total-rows';
const h = 'h';
const w = 'w';
export class XtalVListBase extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        //static get is(){return 'xtal-vlist';}
        super(...arguments);
        this._c = false;
        this._itemHeight = 30;
        this._h = 600;
        this._totalRows = -1;
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([item_height, total_rows, h, w]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case total_rows:
            case item_height:
            case h:
            case w:
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
        //this.propUp(['generatorFn']);
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
        this.attr(total_rows, nv.toString());
    }
    onPropsChange() {
        if (!this._c || this._totalRows < 0)
            return;
        var list = new VirtualList({
            h: this._h,
            itemHeight: this._itemHeight,
            totalRows: this._totalRows,
            generatorFn: (row) => this.transform(row, this.generate(row)),
        });
        list.container.classList.add("container");
        this.innerHTML = '';
        this.appendChild(list.container);
    }
}
//define(XtalVList);
