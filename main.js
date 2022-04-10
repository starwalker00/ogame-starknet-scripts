console.log("test");
var path = require('path');
const fs = require('fs')
require('dotenv').config()
const { namedConsoleLog, sleep } = require('./helpers.js');
const { fetchLeaderboard } = require('./fetch.js');

const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node')

const gitLocalFolder = path.join(process.cwd(), 'ogame-starknet-data');
namedConsoleLog("gitLocalFolder", gitLocalFolder);
const gitLocalLeaderboard = path.join(gitLocalFolder, 'main.json');
namedConsoleLog("gitLocalLeaderboard", gitLocalLeaderboard);

async function initGit() {
    // Cleaning gitLocalFolder 
    if (!fs.existsSync(gitLocalFolder)) {
        console.log('Folder to clone remote DOES NOT exist.');
        fs.mkdirSync(gitLocalFolder);
        console.log('Folder to clone remote created successfully.');
    }
    else {
        console.log('Folder to clone remote DOES exist.');
        console.log('Deleting it.');
        fs.rmSync(gitLocalFolder, { recursive: true });
    }
    console.log('Cloning git repository.');
    var dir = gitLocalFolder;
    await git.clone({
        fs,
        http,
        dir,
        url: 'https://github.com/starwalker00/ogame-starknet-data'
    });
    console.log("Cloned.")

}

async function gitAddAndCommitAndPush() {
    var dir = gitLocalFolder;
    try {
        // git add
        await git.add({ fs, dir: dir, filepath: 'main.json' })
        console.log(`Git added`)
        // git commit
        await git.commit({
            fs,
            dir: dir,
            author: {
                name: 'starwalker00',
                email: 'aaronwalkerup@gmail.com',
            },
            message: 'add data'
        });
        console.log(`Git committed.`)
        // git push
        await git.push({
            fs,
            http,
            dir: dir,
            url: 'https://github.com/starwalker00/ogame-starknet-data.git',
            ref: 'main',
            onAuth: () => ({ username: process.env.GITHUB_TOKEN })
        });
        console.log(`Git Pushed.`)
    }
    catch (error) {
        console.log(`Error in gitAddAndCommitAndPush() \n ${error}`)
    }
}

const sleepTime = 5000;
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
