export class Tree {
    constructor(value) {
        this.value = value;
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
    }

    addChildren(children) {
        this.children = this.children.concat(children);
    }

    getChild(index) {
        return this.children[index];
    }

    getChildren() {
        return this.children;
    }

    hasChildren() {
        return this.children.length > 0;
    }
}