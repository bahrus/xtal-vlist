import {TransformPlugins} from 'trans-render/lib/types';

export interface XtalVlistProps{
    itemHeight: number,
    // height: string,
    // width: string,
    totalRows: number,
    items: any[],
    isC: boolean,
    topIndex: number,
    containerScrollTop: number,
    //virtualList: VirtualList,
    lastFocusId: string,
    focusId: string,
    doTransform: any | any[],
    rowTransform: any,
    rowTransformPlugins: TransformPlugins,
    list: any[];
    newList: boolean;
    lastScrollPos: number;
    rowHTML: string;
    rowTemplate: HTMLTemplateElement;
    
}

export interface XtalVlistActions{
    setFocus(self: this): void;
    onList(self: this): {
        totalRows: number,
        newList: boolean,
    }
    createVirtualList(self: this): void;
    onRowHTML(self: this): {
        rowTemplate: HTMLTemplateElement,
    }
    onScroll(self: this): void;
}

// export interface VirtualList{
//     container: HTMLElement;
// }