# proton-native-reload

For use during development of proton-native application.

This tool will watch files in the proton-native app directory and on any changes your app will be restarted

# Installation

The best way to use this is to install tool globally, by using

```bash
npm install -g proton-native-reload
```

Or you can install it as development dependency

```bash
npm install --save-dev proton-native-reload
```

# Usage

Navigate to you proton-native application directory and simply run

```bash
proton-native-reload
```
By default the entry file is `./index.js` and the path to watch is `./`; you can define the entry file by passing a valid file path as argument.

```bash
# implicit file:
proton-native-reload src/app/index.js
# or more explicit:
proton-native-reload --main-file=src/app/index.js
```

To define the watch path pass a valid folder path as argument.

```bash
# implicit folder:
proton-native-reload build/
# or more explicit:
proton-native-reload --watch-path=build
```