import * as vscode from 'vscode';
class TreeItem extends vscode.TreeItem {
    children: TreeItem[]|undefined;
  
    constructor(label: string, children?: TreeItem[]) {
        super(
            label,
            children === undefined ? vscode.TreeItemCollapsibleState.None :
                                    vscode.TreeItemCollapsibleState.Expanded);
        this.children = children;
    }
}
export default TreeItem;