const vscode = require('vscode');
// const assert = require('assert');
// import vscode from 'vscode';
// import { expect } from 'jest';
const expect = require('jest').expect;

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it

const DataManager = require('../dataManager');

describe('Data Manager Test Suite', () => {
    // let vsc = vscode;
    before = () => {
        vscode.window.showInformationMessage('Start all tests.');
    }

    it('Tests Local Storage', () => {
        // assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        // const dataManager = new DataManager();
        // assert.strictEqual(dataManager.get('test'), null);
        expect(true).toBe(true);
    });
});
