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

    clearAllEarnedTomatoes() {
        this.storage.update('earnedTomatoes', JSON.stringify([]));
    }
    
    appendEarnedTomatoForDate(dateString) {
        const date = new Date(dateString).toISOString();
        const prevState = this.getEarnedTomatoes();
        const newState = [
            ...prevState,
            {time: date},
        ]
        const jsonData = JSON.stringify(newState);
        this.storage.update('earnedTomatoes', jsonData);
    }


    // Pass date as a Date object
    getDateString(dateObject) {
        const offset = dateObject.getTimezoneOffset();
        // const adjustedDate = (dateObject.getTime() + (offset*60*1000));
        const startTime = dateObject.getTime();
        const offsetMilliseconds = offset*60*1000;
        const adjustedTime = startTime + offsetMilliseconds;
        const adjustedDate = new Date(adjustedTime);
        const dateString = adjustedDate.toISOString().split('T')[0];
        console.log('dateString: ' + dateString)
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

    getConfiguration(vscode) {
        const config = vscode.workspace.getConfiguration('pomodoro-timer-vscode');
        return config;
    }

    getIsCondensed(vscode) {
        const configuration = this.getConfiguration(vscode);
        const isCondensed = configuration.get('condensedDisplay');
        return isCondensed;
    }

    getPomodoroLenghtMilliseconds(vscode) {
        const configuration = this.getConfiguration(vscode);
        const pomLengthInMinutes = configuration.get('pomodoroDuration');
        return pomLengthInMinutes*60*1000;
    }

    getShortBreakLengthMilliseconds(vscode) {
        const configuration = this.getConfiguration(vscode);
        const shortBreakLengthInMinutes = configuration.get('shortBreakDuration');
        return shortBreakLengthInMinutes*60*1000;
    }

    getLongBreakLengthMilliseconds(vscode) {
        const configuration = this.getConfiguration(vscode);
        const longBreakLengthInMinutes = configuration.get('longBreakDuration');
        return longBreakLengthInMinutes*60*1000;
    }

    getPomodorosPerLongBreak(vscode) {
        const configuration = this.getConfiguration(vscode);
        const pomodorosPerLongBreak = configuration.get('pomodorosPerLongBreak');
        return pomodorosPerLongBreak;
    }
}
module.exports = DataManager;