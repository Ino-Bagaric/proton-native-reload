#!/usr/bin/env node

'use strict';

const fs        = require('fs');
const { spawn } = require('child_process');
const terminate = require('terminate');

const pkg       = require('./lib/pkg');
const cwd       = require('./lib/cwd');

let app = startApp();

fs.watch('.', function (event, filename) {
    if (event === 'change' && filename) {
        terminate(app.pid, function (err) {
            if (!err) {
                console.log(`\n\x1b[32m[proton-native-reload] File \x1b[0m${filename} \x1b[32mhas been changed\x1b[0m\n`);
                app = startApp();
            }
        });
    }
});

function startApp() {
    if (!cwd()) {
        console.log('\n\x1b[31m[proton-native-reload] proton-native app not found!\x1b[0m');
        console.log('\x1b[31m[proton-native-reload] Please execute this command in \x1b[0mproton-native\x1b[31m project directory\x1b[0m\n');
        process.exit(0);
    }

    const dir  = process.cwd();
    let folder = dir.split('/');
    folder     = folder[folder.length - 1];

    console.log(`\n\x1b[33m[proton-native-reload] ${pkg.version}\x1b[0m`);
    console.log(`\x1b[33m[proton-native-reload] Starting\x1b[0m ${folder}\n`);

    let app = spawn('node_modules/.bin/babel-node', ['index.js']);

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
