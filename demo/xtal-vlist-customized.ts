import {XtalVListBase} from '../xtal-vlist-base.js';
import {define} from 'trans-render/define.js';

class XtalVListCustomized extends XtalVListBase{
    static get is(){
        return 'xtal-vlist-customized';
    }
    generate(row: number){
        const el = document.createElement("div");
        el.innerHTML = "<p>ITEM " + row + "</p>";
        return el;
    }


}

define(XtalVListCustomized);