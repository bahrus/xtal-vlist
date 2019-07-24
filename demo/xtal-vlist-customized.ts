import {XtalVList} from '../xtal-vlist.js';
import {define} from 'trans-render/define.js';
import {init} from 'trans-render/init.js';
import {RenderContext} from 'trans-render/init.d.js';
import {createTemplate} from 'xtal-element/utils.js';

const testTemplate = createTemplate(/* html */`
<div>
    <label></label>
</div>
`);

class XtalVListCustomized extends XtalVList{
    static get is(){
        return 'xtal-vlist-customized';
    }
    generate(row: number){
        const el = document.createElement("div");
        // el.innerHTML = "<p>ITEM " + row + "</p>";
        // return el;
        const ctx : RenderContext = {
            Transform:{
                div:{
                    label: 'row' + row
                }
            }
        };
        init(testTemplate, ctx, el);
        return el;
    }


}

define(XtalVListCustomized);