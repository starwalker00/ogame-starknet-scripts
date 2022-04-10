require('dotenv').config();
const path = require('path');
const fs = require('fs');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

const gitLocalFolder = path.join(process.cwd(), 'ogame-starknet-data');
// namedConsoleLog("gitLocalFolder", gitLocalFolder);
const gitLocalLeaderboard = path.join(gitLocalFolder, 'main.json');
// namedConsoleLog("gitLocalLeaderboard", gitLocalLeaderboard);
exports.gitLocalFolder = gitLocalFolder;
exports.gitLocalLeaderboard = gitLocalLeaderboard;

exports.initGit = async function () {
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

exports.gitAddAndCommitAndPush = async function () {
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
                name: process.env.GITHUB_NAME,
                email: process.env.GITHUB_EMAIL,
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