console.log("test");
const fs = require('fs');
require('dotenv').config();
const { namedConsoleLog, sleep } = require('./helpers.js');
const { initGit, gitAddAndCommitAndPush } = require('./helpers-git.js');
const { gitLocalFolder, gitLocalLeaderboard } = require('./helpers-git.js');
const { fetchLeaderboard } = require('./fetch.js');
const sleepTime = parseInt(process.env.SLEEP_TIME_IN_MS) || 5000;

(async () => {
    console.log('>>>>> start');
    await initGit();
    while (1) {
        const leaderboard = await fetchLeaderboard();
        fs.writeFileSync(gitLocalLeaderboard, JSON.stringify(leaderboard));
        console.log(`>>>>> file ${gitLocalLeaderboard} written`);
        await gitAddAndCommitAndPush();
        console.log(`>>>>> remote file updated correctly`);
        console.log(`>>>>>>>>>> waiting for ${sleepTime}`);
        await sleep(sleepTime);
    }
})();
