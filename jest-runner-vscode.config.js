/** @type {import('jest-runner-vscode').RunnerOptions} */
module.exports = {
    version: '1.71.1',
    // extensionTestsEnv: {
    //   FOO_BAR: 'baz',
    // },
    launchArgs: ['--new-window', '--disable-extensions'],
    workspaceDir: '.',
    openInFolder: true,
}