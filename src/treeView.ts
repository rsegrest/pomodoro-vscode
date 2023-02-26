import * as vscode from 'vscode';

import * as fs from 'fs';
// import * as rd from 'rd';

// lets put all in a cwt namespace
export namespace cwt
{
    // this represents an item and it's children (like nested items)
    // we implement the item later
    class TreeItem extends vscode.TreeItem 
    {
        children: TreeItem[]|undefined;

        constructor(label: string, children?: TreeItem[]) {
            super(
                label,
                children === undefined ? vscode.TreeItemCollapsibleState.None :
                                        vscode.TreeItemCollapsibleState.Expanded);
            this.children = children;
        }
    }
    
    // tree_view will created in our entry point
    export class TreeView implements vscode.TreeDataProvider<TreeItem>
    {
        // will hold our tree view data
        private mData : TreeItem [] = [];
        // with the vscode.EventEmitter we can refresh our  tree view
        // private onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined> = new vscode.EventEmitter<TreeItem | undefined>();
        // and vscode will access the event by using a readonly onDidChangeTreeData (this member has to be named like here, otherwise vscode doesnt update our treeview.
        // readonly onDidChangeTreeData ? : vscode.Event<TreeItem | undefined> = this.onDidChangeTreeData.event;

        
        // in the constructor we register a refresh and item clicked function
        constructor() 
        {
            vscode.commands.registerCommand('cwt_cucumber_view.item_clicked', r => this.itemClicked(r));
            vscode.commands.registerCommand('cwt_cucumber_view.refresh', () => this.refresh());
        }
    
        // we need to implement getTreeItem to receive items from our tree view
        public getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
            const item = new vscode.TreeItem(element.label!, element.collapsibleState);
            return item;
        }
        
        // and getChildren
        public getChildren(element : TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
            if (element === undefined) {
                return this.mData;
            } else {
                return element.children;
            }
        }
        
        // this is called when we click an item
        public itemClicked(item: TreeItem) {
            // we implement this later
        }
        
        // this is called whenever we refresh the tree view
        public refresh() {
            if (vscode.workspace.workspaceFolders) {
                this.mData = [];
                // this.read_directory(vscode.workspace.workspaceFolders[0].uri.fsPath);
                // this.onDidChangeTreeData.fire(undefined);
            } 
        }
        
        // read the directory recursively over all files
        // private read_directory(dir: string) {
            // fs.readdirSync(dir).forEach(file => {
            //     let current = path.join(dir,file);
            //     if (fs.statSync(current).isFile()) {
            //         if(current.endsWith('.feature')) {
            //             this.parse_feature_file(current);
            //         } 
            //     } else {
            //         this.read_directory(current)
            //     }
            // });
        // }
        
        // and if we find a *.feature file parse the content
        // private parse_feature_file(file: string) {
            // const regex_feature = new RegExp("(?<=Feature:).*");
            // const regex_scenario = new RegExp("(?<=Scenario:).*");
            // let reader = rd.createInterface(fs.createReadStream(file))
            // const line_counter = ((i = 0) => () => ++i)();

            // // let's loop over every line
            // reader.on("line", (line : string, line_number : number = line_counter()) => {
            //     let is_feature = line.match(regex_feature);
            //     if (is_feature) {
            //         // we found a feature and add this to our tree view data
            //         this.m_data.push(new TreeItem(is_feature[0], file, line_number));
            //     }
            //     let is_scenario = line.match(regex_scenario);
            //     if (is_scenario) {
            //         // every following scenario will be added to the last added feature with add_children from the tree_item
            //         this.m_data.at(-1)?.add_child(new TreeItem(is_scenario[0], file, line_number));
            //     }
            // });
        // }
    }
}