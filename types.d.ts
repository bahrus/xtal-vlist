export interface XtalVlistProps{
    itemHeight: number,
    h: number,
    w: number,
    totalRows: number,
    items: any[],
    isC: boolean,
    topIndex: number,
    virtualList: VirtualList,
    lastFocusId: string,
    focusId: string,
    transform: any | any[],
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
}

export interface VirtualList{
    container: HTMLElement;
}