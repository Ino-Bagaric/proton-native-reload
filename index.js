#!/usr/bin/env node

'use strict';

const fs        = require('fs');
const { spawn } = require('child_process');
const terminate = require('terminate');

const pkg       = require('./lib/pkg');
const cwd       = require('./lib/cwd');

let __mainFile  = 'index.js';
let __mainPath  = '.';

if (process.argv.length) {
    const argvOffset = 2;

    for (let i in process.argv) {
        i = i + argvOffset;
        const arg = process.argv[i];

        if (arg) {
            const argClean = arg.replace(/--main-file=|--watch-path=/ig, '');

            if ((arg.indexOf('--main-file=') > -1 && fs.lstatSync(argClean).isFile()) || fs.lstatSync(argClean).isFile()) {
                __mainFile = argClean;
            }

            if ((arg.indexOf('--watch-path=') > -1 && fs.lstatSync(argClean).isDirectory())  || fs.lstatSync(argClean).isDirectory()) {
                __mainPath = argClean;
            }
        }
    }
}

let app = startApp(__mainFile, __mainPath);

fs.watch(__mainPath, {recursive: true}, (event, filename) => {
    if (event === 'change' && filename) {
        terminate(app.pid, (err) => {
            if (!err) {
                console.log(`\n\x1b[32m[proton-native-reload] File \x1b[0m${filename} \x1b[32mhas been changed\x1b[0m\n`);
                app = startApp();
            }
        });
    }
});

function startApp(mainFile, mainPath) {
    if (!cwd()) {
        console.log('\n\x1b[31m[proton-native-reload] proton-native app not found!\x1b[0m');
        console.log('\x1b[31m[proton-native-reload] Please execute this command in \x1b[0mproton-native\x1b[31m project directory\x1b[0m\n');
        process.exit(0);
    }

    const dir  = process.cwd();
    let folder = dir.split('/');
    folder     = folder[folder.length - 1];

    console.log(`\n\x1b[33m[proton-native-reload] ${pkg.version}\x1b[0m`);
    console.log(`\x1b[33m[proton-native-reload] Starting\x1b[0m ${folder}`);
    console.log(`\x1b[33m[proton-native-reload] Reading:\x1b[0m ${mainFile}`);
    console.log(`\x1b[33m[proton-native-reload] Watching:\x1b[0m ${mainPath}\n`);

    let app = spawn('node_modules/.bin/babel-node', [mainFile]);

    app.stdout.on('data', (data) => {
        console.log('\n\x1b[32m-------------------------- \x1b[0m( Output! ) \x1b[32m--------------------------')
        console.log(`Output -> \x1b[0m ${data}\n`);
    });

    app.stderr.on('data', (data) => {
        console.log('\n\x1b[31m-------------------------- \x1b[0m( Error! ) \x1b[31m--------------------------')
        console.log(`Error -> \x1b[0m ${data}\n`);
    });

    return app;
}
