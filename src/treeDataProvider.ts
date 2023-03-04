import * as vscode from 'vscode';
import { pad } from './extension';
import EarnedTomato from './types/tomato';
import TreeItem from './types/TreeItem';

type DateRecord = {
    [key: string]: number
};

// type DateRecord = {
//     [key: string]: number;
//     // dateString: string;
//     // tomatoes: EarnedTomato[];
// }
class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    onDidChangeTreeData?: vscode.Event<TreeItem|null|undefined>|undefined;
    data: TreeItem[];

    constructor() {
        console.log('constructor -- TreeDataProvider');
        this.data = this.getData();
    }
    // TEMP DRIVER FUNCTION
    generateSampleTomatoes() {
        console.log('generateSampleTomatoes');
        const earnedTomatoes:EarnedTomato[] = [];
        const now = new Date();
        const halfHour = 1000 * 60 * 30;
        const day = 1000 * 60 * 60 * 24;

        const today04 = new EarnedTomato(now, 25, 'description');
        const today03 = new EarnedTomato(new Date(now.getTime()-(halfHour)), 25, 'description');
        const today02 = new EarnedTomato(new Date(now.getTime()-(halfHour*2)), 25, 'description');
        const today01 = new EarnedTomato(new Date(now.getTime()-(halfHour*3)), 25, 'description');

        const yesterday08 = new EarnedTomato(new Date(now.getTime()-(day)-(halfHour*7)), 25, 'description');
        const yesterday07 = new EarnedTomato(new Date(now.getTime()-(day)-(halfHour*6)), 25, 'description');
        const yesterday06 = new EarnedTomato(new Date(now.getTime()-(day)-(halfHour*5)), 25, 'description');
        const yesterday05 = new EarnedTomato(new Date(now.getTime()-(day)-(halfHour*4)), 25, 'description');
        const yesterday04 = new EarnedTomato(new Date(now.getTime()-(day)-(halfHour*3)), 25, 'description');
        const yesterday03 = new EarnedTomato(new Date(now.getTime()-(day)-(halfHour*2)), 25, 'description');
        const yesterday02 = new EarnedTomato(new Date(now.getTime()-(day)-(halfHour*1)), 25, 'description');
        const yesterday01 = new EarnedTomato(new Date(now.getTime()-(day)-(halfHour)), 25, 'description');

        const twoDaysAgo03 = new EarnedTomato(new Date(now.getTime()-(day*2)-(halfHour*2)), 25, 'description');
        const twoDaysAgo02 = new EarnedTomato(new Date(now.getTime()-(day*2)-(halfHour*1)), 25, 'description');
        const twoDaysAgo01 = new EarnedTomato(new Date(now.getTime()-(day*2)-(halfHour)), 25, 'description');

        return JSON.stringify([
            twoDaysAgo03,
            twoDaysAgo02,
            twoDaysAgo01,
            yesterday08,
            yesterday07,
            yesterday06,
            yesterday05,
            yesterday04,
            yesterday03,
            yesterday02,
            yesterday01,
            today04,
            today03,
            today02,
            today01,
        ]);
    }

    formatDateWithDayOfWeek(date:Date) {
        console.log('formatDateWithDayOfWeek', date);
        const theMonth = pad(date.getMonth()+1);
        const theDate = pad(date.getDate()+1);
        const formattedDate = `${this.getDayOfWeek(date)} ${date.getFullYear()}-${theMonth}-${theDate}`;
        console.log('formattedDate', formattedDate);
        return formattedDate;
    }

    formatDate(date:Date) {
        console.log('formatDate', date);
        const theMonth = pad(date.getMonth()+1);
        const theDate = pad(date.getDate()+1);
        const formattedDate = `${date.getFullYear()}-${theMonth}-${theDate}`;
        console.log('formattedDate', formattedDate);
        return formattedDate;
    }

    getTomatoHistoryArray(dateArray:Date[], numTomatoesArray:number[]) {
        const tomatoHistoryArray:TreeItem[] = [];
        for(let i=0; i < dateArray.length; i++) {
            const date = dateArray[i];
            const numTomatoes = numTomatoesArray[i];
            const tomatoString = '🍅'.repeat(numTomatoes);
            tomatoHistoryArray.push(new TreeItem(this.formatDate(date), [new TreeItem(tomatoString)]));
        }
        return tomatoHistoryArray;
    }
    getDayOfWeekFromDateString(dateString:string) {
        const date = new Date(dateString);
        return this.getDayOfWeek(date);
    }
    getDayOfWeek(date:Date) {
        // console.log('dateKey', dateKey);
        // const date = new Date(dateKey);
        console.log('date', date);
        const day = date.getDay();
        console.log('day', day);
        switch(day) {
            case 0:
                return 'Sunday';
            case 1:
                return 'Monday';
            case 2:
                return 'Tuesday';
            case 3:
                return 'Wednesday';
            case 4:
                return 'Thursday';
            case 5:
                return 'Friday';
            case 6:
                return 'Saturday';
        }
    }

    getData():TreeItem[] {
        console.log('getData');
        const theData:TreeItem[] = [];
        const storedTomatoes = this.generateSampleTomatoes();
        const storedTomatoesObject = JSON.parse(storedTomatoes);
        const dateRecordObject:DateRecord = {};

        console.log('for i loop');
        for(let i=0; i < storedTomatoesObject.length; i++) {
            console.log('i', i);
            const tomato = storedTomatoesObject[i];
            const dateFromTomato = new Date(tomato.date);
            // const year = dateFromTomato.getFullYear();
            // const month = (dateFromTomato.getMonth()+1);
            // const date = (dateFromTomato.getDate()+1);
            // const day = dateFromTomato.getDay();

            // const thisDateString = `${year}-${month}-${date}`;
            const thisDateString = this.formatDate(dateFromTomato);
            const keys = Object.keys(dateRecordObject);
            if (Object.keys(dateRecordObject).includes(thisDateString)) {
                let numTomatoes = dateRecordObject[thisDateString];
                numTomatoes += 1;
                dateRecordObject[thisDateString] = numTomatoes;
            } else {
                dateRecordObject[thisDateString] = 1;
            }
        }
        const dateKeys = Object.keys(dateRecordObject);
        dateKeys.sort().reverse();
        console.log('dateKeys', dateKeys);
        console.log('for j loop');

        for(let j=0; j < dateKeys.length; j += 1) {
            console.log('j', j);
            const thisDate = `${dateKeys[j]}`;
            // ${this.getDayOfWeek(dateKeys[j])} 
            const dateString = `${this.getDayOfWeekFromDateString(thisDate)} ${thisDate}`;
            console.log('*** dateString:');
            console.log(dateString);
            const numTomatoes = dateRecordObject[thisDate];
            const tomatoString = '🍅'.repeat(numTomatoes);
            const tomatoTreeItem = new TreeItem(`${dateString}`, [new TreeItem(tomatoString)]);
            theData.push(tomatoTreeItem);
        }

        // const today = new Date('2023-02-26');
        // const yesterday = new Date('2023-02-25');
        // return this.getTomatoHistoryArray([today, yesterday], [4, 8]);
        const historyData:TreeItem[] = [new TreeItem('History', theData)];
        return historyData;

        // return [new TreeItem('History', [
        //     new TreeItem(
        //         this.formatDate(today), [
        //             new TreeItem('🍅🍅🍅🍅')
        //         ]
        //     ),
        //     new TreeItem(
        //         this.formatDate(yesterday), [
        //             new TreeItem('🍅🍅🍅🍅🍅🍅🍅🍅'),
        //         ]
        //     )
        //   ])];
        // return theData;
    }
    // onDidChangeTreeData?: vscode.Event<void | vscode.TreeItem | vscode.TreeItem[]>;
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
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
// module.exports = TreeDataProvider;
export default TreeDataProvider;
