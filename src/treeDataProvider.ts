import * as vscode from 'vscode';
import TreeItem from './types/TreeItem';
class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    onDidChangeTreeData?: vscode.Event<TreeItem|null|undefined>|undefined;
    data: TreeItem[];

    constructor() {
      this.data = [new TreeItem('cars', [
        new TreeItem(
            'Ford', [new TreeItem('Fiesta'), new TreeItem('Focus'), new TreeItem('Mustang')]),
        new TreeItem(
            'BMW', [new TreeItem('320'), new TreeItem('X3'), new TreeItem('X5')])
      ])];
    }
    // onDidChangeTreeData?: vscode.Event<void | vscode.TreeItem | vscode.TreeItem[]>;
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        throw new Error('Method not implemented.');
    }
    getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
        if (element === undefined) {
        return this.data;
        }
        return element.children;
    }
    // getParent?(element: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem> {
    //     throw new Error('Method not implemented.');
    // }
    // resolveTreeItem?(item: vscode.TreeItem, element: vscode.TreeItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
    //     throw new Error('Method not implemented.');
    // }
    // addTree(tree) {
    //     this.trees.push(tree);
    // }
    // getTrees() {
    //     return this.trees;
    // }
}
module.exports = TreeDataProvider;