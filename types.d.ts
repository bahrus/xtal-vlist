import {TransformPlugins} from 'trans-render/lib/types';
import {BeIntersectionalVirtualProps} from 'be-intersectional/types';
import {SimpleWCInfo} from 'may-it-be/SimpleWCInfo';
declare class WeakRef<T>{}
export interface XtalVlistProps{
    itemHeight: number,
    totalRows: number,
    items: any[],
    minItemHeight: number,
    isC: boolean,
    topIndex: number,
    containerScrollTop: number,
    rowTransform: any,
    rowTransformPlugins: TransformPlugins,
    list: any[];
    newList: boolean;
    lastScrollPos: number;
    //rowHTML: string;
    styleTemplate: HTMLTemplateElement;
    //rowStyle: Node;
    rowTemplate: HTMLTemplateElement;
    pageSize: number;
    rowIntersectionalSettings: Partial<BeIntersectionalVirtualProps>;
}

export interface XtalVlistActions{
    //setFocus(self: this): void;
    onList(self: this): {
        totalRows: number,
        newList: boolean,
    }
    createVirtualList(self: this): void;
    // onRow(self: this): {
    //     rowTemplate: HTMLTemplateElement,
    // }
    onStyleTemplate(self: this): void;
    //onScroll(self: this): void;
}

/**
 * xtal-vlist provides a declarative "infinite scrolling" virtual list web component.
 */
export abstract class XtalVList implements SimpleWCInfo<XtalVlistProps>{
    src: './xtal-vlist.js';
    tagName: 'xtal-vlist';
    props: XtalVlistProps;
    methods: XtalVlistActions;
}

export type Package = [XtalVList];

