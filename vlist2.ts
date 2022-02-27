export interface Config{
    height: string,
    itemHeight: number,
    width: string,
    container: Element,
    totalRows: number,
    rowTemplate: HTMLTemplateElement
}

export class VirtualList{

    constructor(public config, public data: any[]){
        this.init(this);
    }

    init({config}: this){
        const h = document.createElement;
        const scrollContainer = h('div');
        const {height, itemHeight, width, container, totalRows} = config;
        const a = Object.assign;
        a(scrollContainer.style, {
            width,
            height,
            overflow: 'auto',
            border: '1px solid black',
        });
        const heightener = h('div');
        a(heightener.style, {
            opacity: '0',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '1px',
            height: totalRows * itemHeight + 'px',
        });
        scrollContainer.appendChild(heightener);
        container.appendChild(scrollContainer);
    }
}