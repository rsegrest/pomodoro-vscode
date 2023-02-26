"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TreeItem_1 = require("./types/TreeItem");
class TreeDataProvider {
    constructor() {
        this.data = [new TreeItem_1.default('cars', [
                new TreeItem_1.default('Ford', [new TreeItem_1.default('Fiesta'), new TreeItem_1.default('Focus'), new TreeItem_1.default('Mustang')]),
                new TreeItem_1.default('BMW', [new TreeItem_1.default('320'), new TreeItem_1.default('X3'), new TreeItem_1.default('X5')])
            ])];
    }
    // onDidChangeTreeData?: vscode.Event<void | vscode.TreeItem | vscode.TreeItem[]>;
    getTreeItem(element) {
        throw new Error('Method not implemented.');
    }
    getChildren(element) {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }
}
module.exports = TreeDataProvider;
//# sourceMappingURL=treeDataProvider.js.map