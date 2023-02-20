import { window } from 'vscode';
// const assert = require('assert');
// import * as vscode from 'vscode';
// import { expect } from 'jest';
import { expect } from 'jest';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const myExtension = require('../extension');

suite('Extension Test Suite', () => {
    window.showInformationMessage('Start all tests.');

    it('Sample test', () => {
        // assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        // assert.strictEqual(-1, [1, 2, 3].indexOf(0));
        expect(true).toBe(true);
    });
});
