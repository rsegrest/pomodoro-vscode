// const Memento = require('vscode').Memento;

class DataManager {
    constructor(storage) {
        this.storage = storage;
    }

    getEarnedTomatoes() {
        return JSON.parse(this.storage.get('earnedTomatoes')) || JSON.parse([]);
    }

    appendEarnedTomato() {
        this.appendEarnedTomatoForDate((new Date()).toISOString())
    }
    
    appendEarnedTomatoForDate(dateString) {
        const date = new Date(dateString).toISOString();
        console.log('DATE STRING TO SAVE: ' + date)
        const prevState = this.getEarnedTomatoes();
        const newState = [
            ...prevState,
            {time: date},
        ]
        const jsonData = JSON.stringify(newState);
        this.storage.update('earnedTomatoes', jsonData);
    }

    getDateString(thisDate) {
        const offset = thisDate.getTimezoneOffset();
        const adjustedDate = new Date(thisDate.getTime() + (offset*60*1000));
        const dateString = adjustedDate.toISOString().split('T')[0];
        return dateString;
    }

    getTomatoesForDay(date) {
        const targetDateString = this.getDateString(date);
        const earnedTomatoes = this.getEarnedTomatoes();
        const dates = earnedTomatoes.map((tomato) => new Date(tomato.date));
        const tomatoesForDay = dates.filter((date) => {
            const thisDateString = this.getDateString(date);
            return thisDateString === targetDateString;
        });
        if ((tomatoesForDay) && (tomatoesForDay.length > 0)) {
            return tomatoesForDay.length;
        }
        else return 0;
    }

    getTodaysTomatoes() {
        return this.getTomatoesForDay(new Date());
    }

    saveBulkData(key, data) {
        const jsonData = JSON.stringify(data);
        this.storage.update(key, jsonData);
    }

    getIsCondensed(vscode) {
        const isCondensed = vscode.workspace.getConfiguration('pomodoro-timer-vscode').get('condensedDisplay');
        return isCondensed;
    }

    getPomodoroLenghtMilliseconds(vscode) {
        const pomLengthInMinutes = vscode.workspace.getConfiguration('pomodoro-timer-vscode').get('condensedDisplay');
        return pomLengthInMinutes*60*1000;
    }

    getShortBreakLengthMilliseconds(vscode) {
        const shortBreakLengthInMinutes = vscode.workspace.getConfiguration('pomodoro-timer-vscode').get('condensedDisplay');
        return shortBreakLengthInMinutes*60*1000;
    }

    getLongBreakLengthMilliseconds(vscode) {
        const longBreakLengthInMinutes = vscode.workspace.getConfiguration('pomodoro-timer-vscode').get('condensedDisplay');
        return longBreakLengthInMinutes*60*1000;
    }
}
module.exports = DataManager;