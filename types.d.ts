import {TransformPlugins} from 'trans-render/lib/types';
import {BeLazyVirtualProps} from 'node_modules/be-lazy/types';
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
    timestampKey?: string,
    list: any[];
    newList: boolean;
    lastScrollPos: number;
    //styleTemplate: HTMLTemplateElement;
    rowTemplate: HTMLTemplateElement;
    pageSize: number;
    rowIntersectionalSettings: Partial<BeLazyVirtualProps>;
}

export interface XtalVlistActions{
    //setFocus(self: this): void;
    onList(self: this): {
        totalRows: number,
        newList: boolean,
    }
    createVirtualList(self: this): void;

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

