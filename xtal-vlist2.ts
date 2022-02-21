import {VirtualList} from './vlist.js';
import {xc, IReactor, PropAction, PropDef, PropDefMap, ReactiveSurface} from 'xtal-element/lib/XtalCore.js';
import {XtalVlistProps} from './types.d.js';
//#region 
const baseProp: PropDef = {
    async: true,
    dry: true,
};
const numProp0: PropDef = {
    ...baseProp,
    type: Number,
}
const objProp0 : PropDef = {
    ...baseProp,
    type: Object,
}
const boolProp0: PropDef = {
    ...baseProp,
    type: Boolean,
};
const boolProp1: PropDef = {
    ...boolProp0,
    stopReactionsIfFalsy: true,
}
const propDefMap: PropDefMap<XtalVlistProps> = {
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
export class XtalVList extends HTMLElement implements ReactiveSurface{
    static observedAttributes = [...slicedPropDefs.boolNames, ...slicedPropDefs.numNames, ...slicedPropDefs.strNames];
    attributeChangedCallback(n: string, ov: string | null, nv: string | null){
        xc.passAttrToProp(this, slicedPropDefs, n, ov, nv);
    }
    propActions = propActions;
    self=this;
    reactor: IReactor = new xc.Rx(this);
    rowXFormFn(el: HTMLElement){}

    containerXFormFn(el: HTMLElement){}

    _lastFocusID: string | undefined;

    _list: any;
    _lastScrollPos : number | undefined;
    onVListScroll(pos: number){
        this._lastScrollPos = pos;
    }
    setFocus(){
        const focus = this._list.container.querySelector(`[${focus_id}="${this._lastFocusID}"]`);
        if(focus) {
            focus.focus();
            event = new Event('focus', { bubbles: true, cancelable: true });
            focus.dispatchEvent(event);
        }
    }
    isC: boolean | undefined;
    connectedCallback(){
        xc.mergeProps<Partial<XtalVlistProps>>(this, slicedPropDefs, {
            itemHeight: 30,
            h: 600,
            totalRows: -1,
        });
        this.isC = true;
    }
    onPropChange(n: string, prop: PropDef, nv: any){
        this.reactor.addToQueue(prop, nv);
    }

    generate(row: number) : HTMLElement{
        throw "Needs Implementation";
    }

    rowTransform(row: number, el: HTMLElement){
        return el;
    }
}

export interface XtalVList extends XtalVlistProps{}

type X = XtalVList;

export const focus_id = 'focus-id';

export const newList = ({totalRows, isC, topIndex, self}: X) => {
    if(totalRows < 0) return;
    if(!self._list){
        const b = self.onVListScroll.bind(self);
        const c = self.rowXFormFn.bind(self);
        const d = self.containerXFormFn.bind(self);
        self._list = new VirtualList({
            h: self.h,
            itemHeight: self.itemHeight,
            totalRows: self.totalRows,
            scrollCallback: b,
            generatorFn: (row: number) => self.rowTransform(row, self.generate(row)),
            rowXFormFn: c,
            containerXFormFn: d,
        });
        self._list.container.classList.add("container");
        self.innerHTML = '';
        self.appendChild(self._list.container);        
    }
    if(topIndex !== undefined){
        self._list.scrollToIndex(topIndex);
    }
    if(self._lastFocusID !== undefined){
        for(let i = 1; i < 11; i++){
            setTimeout(() =>{
                self.setFocus();
            }, 50 * i);
        }

    }
}
export const propActions = [
    newList
] as PropAction[];


xc.letThereBeProps(XtalVList, slicedPropDefs, 'onPropChange');