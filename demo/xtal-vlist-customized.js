import { XtalVList } from '../xtal-vlist.js';
import { define } from 'trans-render/define.js';
import { init } from 'trans-render/init.js';
import { createTemplate } from 'trans-render/createTemplate.js';
const testTemplate = createTemplate(/* html */ `
<div>
    <label></label>
</div>
`);
class XtalVListCustomized extends XtalVList {
    static get is() {
        return 'xtal-vlist-customized';
    }
    generate(row) {
        const el = document.createElement("div");
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
