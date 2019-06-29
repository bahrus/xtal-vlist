import { XtalVListBase } from '../xtal-vlist-base.js';
import { define } from 'trans-render/define.js';
import { init } from 'trans-render/init.js';
import { createTemplate } from 'xtal-element/utils.js';
const testTemplate = createTemplate(/* html */ `
<div>
    <label></label>
</div>
`);
class XtalVListCustomized extends XtalVListBase {
    static get is() {
        return 'xtal-vlist-customized';
    }
    generate(row) {
        const el = document.createElement("div");
        // el.innerHTML = "<p>ITEM " + row + "</p>";
        // return el;
        const ctx = {
            Transform: {
                div: {
                    label: 'row' + row
                }
            }
        };
        init(testTemplate, ctx, el);
        return el;
    }
}
define(XtalVListCustomized);
