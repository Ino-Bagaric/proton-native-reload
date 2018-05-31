const fs = require('fs');

module.exports = () => {
    const cwd = process.cwd();

    if (!fs.existsSync(`${cwd}/package.json`)) {
        return false;
    }

    if (!fs.existsSync(`${cwd}/node_modules/.bin/babel-node`)) {
        return false;
    }

    const pkg = JSON.parse(fs.readFileSync(cwd + '/package.json'))

    if (!pkg.dependencies['proton-native']) {
        return false;
    }

    if (!pkg.build['protonNodeVersion']) {
        return false;
    }

    return true;
}
