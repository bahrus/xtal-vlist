import { XtalVList } from '../xtal-vlist2.js';
import { xc } from 'xtal-element/lib/XtalCore.js';
// import {init} from 'trans-render/init.js';
// import {RenderContext} from 'trans-render/types.d.js';
// import {createTemplate} from 'trans-render/createTemplate.js';
import { html } from 'xtal-element/lib/html.js';
import { transform } from 'trans-render/lib/transform.js';
import { Texter } from 'trans-render/lib/Texter.js';
const testTemplate = html `
<div>
    <label></label>
</div>
`;
class XtalVListCustomized extends XtalVList {
    generate(row) {
        const el = document.createElement("div");
        transform(testTemplate, {
            match: {
                labelElements: ({ target }) => 'row' + row
            },
            postMatch: [{ rhsType: String, ctor: Texter }]
        }, el);
        return el;
    }
}
XtalVListCustomized.is = 'xtal-vlist-customized';
xc.define(XtalVListCustomized);
