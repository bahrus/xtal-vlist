import {XtallatX, lispToCamel} from 'xtal-element/xtal-latx.js';
import {hydrate} from 'trans-render/hydrate.js';
import {define} from 'trans-render/define.js';
//import {RenderContext} from 'trans-render/init.d.js';
import {VirtualList} from './vlist.js';

const item_height = 'item-height';
const total_rows = 'total-rows';
const h = 'h';
const w = 'w';
export abstract class XtalVList extends XtallatX(hydrate(HTMLElement)){
    static get is(){return 'xtal-vlist';}

    static get observedAttributes(){
        return super.observedAttributes.concat([item_height, total_rows, h, w]);
    }

    attributeChangedCallback(n: string, ov: string, nv: string){
        switch(n){
            case total_rows:
            case item_height:
            case h:
            case w:
                (<any>this)['_' + lispToCamel(n)] = parseFloat(nv);
                break;
            default:
                super.attributeChangedCallback(n, ov, nv);
        }
        this.onPropsChange();
    }

    _c = false;
    connectedCallback(){
        this.style.display = 'block';
        this.propUp(XtalVList.observedAttributes.map(s => lispToCamel(s)));
        this.propUp(['generatorFn']);
        this._c = true;
        this.onPropsChange();
    }

    // _generatorFn: (row: number) => HTMLElement = row =>{
    //     const el = document.createElement("div");
    //     el.innerHTML = "<p>ITEM " + row + "</p>";
    //     return el;
    // }
    // get generatorFn(){
    //     return this._generatorFn;
    // }
    // set generatorFn(nv){
    //     this._generatorFn = nv;
    //     this.onPropsChange();
    // }
    abstract generate(row: number) : HTMLElement;
    transform(row: number, el: HTMLElement){
        return el;
    }

    _itemHeight: number = 30;
    get itemHeight(){
        return this._itemHeight;
    }
    set itemHeight(nv){
        this.attr(item_height, nv.toString());
    }

    _h: number = 600;
    get h(){
        return this._h
    }
    set h(nv){
        this.attr(h, nv.toString());
    }
    _totalRows: number = -1;
    get totalRows(){
        return this._totalRows;
    }
    set totalRows(nv){
        this.attr(total_rows, nv.toString());
    }

    onPropsChange(){
        if(!this._c || this._totalRows < 0) return;
        var list = new VirtualList({
            h: this._h,
            itemHeight: this._itemHeight,
            totalRows: this._totalRows,
            generatorFn: (row: number) => this.transform(row, this.generate(row)),
          });
          list.container.classList.add("container");
          this.innerHTML = '';
          this.appendChild(list.container)
    }




}
define(XtalVList);