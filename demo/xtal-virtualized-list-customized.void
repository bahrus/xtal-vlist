import {XtalVirtualizedList} from '../xtal-virtualized-list.js';
import {define} from 'trans-render/define.js';
import {init} from 'trans-render/init.js';
import {RenderContext} from 'trans-render/types.d.js';
import {createTemplate} from 'trans-render/createTemplate.js';

const testTemplate = createTemplate(/* html */`
<div>
    <label></label>
</div>
`);
class XtalVirtualizedListCustomized extends XtalVirtualizedList{
    static get is(){return 'xtal-virtualized-list-customized';}

    renderRow(row: number){
        console.log(row);
        const el = document.createElement("div");
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
define(XtalVirtualizedListCustomized);