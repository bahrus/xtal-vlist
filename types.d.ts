import {TransformPlugins} from 'trans-render/lib/types';
import {BeIntersectionalVirtualProps} from 'be-intersectional/types';

export interface XtalVlistProps{
    itemHeight: number,
    totalRows: number,
    items: any[],
    isC: boolean,
    topIndex: number,
    containerScrollTop: number,
    rowTransform: any,
    rowTransformPlugins: TransformPlugins,
    list: any[];
    newList: boolean;
    lastScrollPos: number;
    rowHTML: string;
    rowTemplate: HTMLTemplateElement;
    pageSize: number;
    beIntersectional: Partial<BeIntersectionalVirtualProps>;
}

export interface XtalVlistActions{
    //setFocus(self: this): void;
    onList(self: this): {
        totalRows: number,
        newList: boolean,
    }
    createVirtualList(self: this): void;
    onRowHTML(self: this): {
        rowTemplate: HTMLTemplateElement,
    }
    //onScroll(self: this): void;
}

