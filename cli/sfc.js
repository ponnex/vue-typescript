#!/usr/bin/env node

const shell = require('shelljs');
const fs = require('fs');
const _ = require('lodash');
const folders = ['pages', 'components'];

let rootDir = __dirname.split('/');
rootDir.pop();
rootDir = rootDir.join('/');

function Capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

String.prototype.capitalize = function() {
    return Capitalize(this);
}

String.prototype.formatCapitalized = function() {
    if (this.includes('-')) {
        let results = this.split('-');
        return _.map(results, (result) => Capitalize(result)).join('');
    }

    return Capitalize(this);
}

function iterate() {
    _.each(folders, (folder) => {
        fs.readdir(`${rootDir}/src/${folder}`, (err, folderNames) => {
            if (err) return;

            _.each(folderNames, (name) => {
                generateSFC(`${rootDir}/src/${folder}/${name}`, name);
            });
        });
    });
}

function generateSFC(directoryLocation, folderName) {
    let directoryTarget = `${directoryLocation}/${folderName}`;
    let tsFile = shell.cat(`${directoryTarget}.component.ts`),
        scssFile = shell.cat(`${directoryTarget}.component.scss`),
        htmlFile = shell.cat(`${directoryTarget}.component.html`),
        vueSFCTemplate = "";
    
    tsFile = tsFile.replace(/template\:.+\)\,?/i, '');
    tsFile = tsFile.replace(/(\/.+\.component)('|")/g, '$1.vue$2');
    vueSFCTemplate = `<template>\n${htmlFile.toString()}\n</template>\n\n<script lang="ts">\n${tsFile.toString()}\n</script>\n\n<style lang="scss">\n${scssFile.toString()}\n</style>`;

    shell.touch(`${directoryTarget}.component.vue`);
    shell.ShellString(vueSFCTemplate).to(`${directoryTarget}.component.vue`);

    generateRoutes();
}

function generateRoutes() {
    let prodFile = `${rootDir}/src/main.routes.prod.ts`;
    let mainRouteFile = shell.cat(`${rootDir}/src/main.routes.ts`);
    mainRouteFile = mainRouteFile.replace(/(\/.+\.component)/g, '$1.vue');
    
    shell.touch(prodFile);
    shell.ShellString(mainRouteFile.toString()).to(prodFile);
}

iterate();