"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataManager {
    constructor(storage) {
        this.storage = storage;
    }
    getEarnedTomatoes() {
        try {
            const tomatoesInStorage = this.storage.get('earnedTomatoes');
            if ((tomatoesInStorage === null) || (typeof tomatoesInStorage === 'undefined')) {
                this.initializeEarnedTomatoes();
                return [];
            }
            return JSON.parse(tomatoesInStorage.toString());
        }
        catch (error) {
            this.initializeEarnedTomatoes();
            return [];
        }
    }
    appendEarnedTomato() {
        this.appendEarnedTomatoForDate((new Date()).toISOString());
    }
    initializeEarnedTomatoes() {
        this.storage.update('earnedTomatoes', JSON.stringify([]));
    }
    appendEarnedTomatoForDate(dateString) {
        const date = new Date(dateString).toISOString();
        const prevState = this.getEarnedTomatoes();
        const newState = [
            ...prevState,
            { time: date },
        ];
        const jsonData = JSON.stringify(newState);
        this.storage.update('earnedTomatoes', jsonData);
    }
    // Pass date as a Date object
    getDateString(dateObject) {
        const offset = dateObject.getTimezoneOffset();
        // const adjustedDate = (dateObject.getTime() + (offset*60*1000));
        const startTime = dateObject.getTime();
        const offsetMilliseconds = offset * 60 * 1000;
        const adjustedTime = startTime + offsetMilliseconds;
        const adjustedDate = new Date(adjustedTime);
        const dateString = adjustedDate.toISOString().split('T')[0];
        console.log('dateString: ' + dateString);
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
        else {
            return 0;
        }
    }
    getTodaysTomatoes() {
        return this.getTomatoesForDay(new Date());
    }
    saveBulkData(key, data) {
        const jsonData = JSON.stringify(data);
        this.storage.update(key, jsonData);
    }
    getConfiguration(workspace) {
        const config = workspace.getConfiguration('pomodoro-timer-vscode');
        return config;
    }
    getIsCondensed(workspace) {
        const configuration = this.getConfiguration(workspace);
        const isCondensed = configuration.get('condensedDisplay');
        return isCondensed;
    }
    getPomodoroLenghtMilliseconds(workspace) {
        const configuration = this.getConfiguration(workspace);
        const pomLengthInMinutes = configuration.get('pomodoroDuration');
        if (typeof pomLengthInMinutes === 'undefined') {
            return 25 * 60 * 1000;
        }
        return pomLengthInMinutes * 60 * 1000;
    }
    getShortBreakLengthMilliseconds(workspace) {
        const configuration = this.getConfiguration(workspace);
        const shortBreakLengthInMinutes = configuration.get('shortBreakDuration');
        if (typeof shortBreakLengthInMinutes === 'undefined') {
            return 5 * 60 * 1000;
        }
        return shortBreakLengthInMinutes * 60 * 1000;
    }
    getLongBreakLengthMilliseconds(workspace) {
        const configuration = this.getConfiguration(workspace);
        const longBreakLengthInMinutes = configuration.get('longBreakDuration');
        if (typeof longBreakLengthInMinutes === 'undefined') {
            return 15 * 60 * 1000;
        }
        return longBreakLengthInMinutes * 60 * 1000;
    }
    getPomodorosPerLongBreak(workspace) {
        const configuration = this.getConfiguration(workspace);
        const pomodorosPerLongBreak = configuration.get('pomodorosPerLongBreak');
        if (typeof pomodorosPerLongBreak === 'undefined') {
            return 4;
        }
        return pomodorosPerLongBreak;
    }
}
exports.default = DataManager;
//# sourceMappingURL=dataManager.js.map