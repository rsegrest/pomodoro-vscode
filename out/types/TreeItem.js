"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class TreeItem extends vscode.TreeItem {
    constructor(label, children) {
        super(label, children === undefined ? vscode.TreeItemCollapsibleState.None :
            vscode.TreeItemCollapsibleState.Expanded);
        this.children = children;
    }
}
exports.default = TreeItem;
//# sourceMappingURL=TreeItem.js.map