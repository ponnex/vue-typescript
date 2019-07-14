#!/usr/bin/env node

const Shell = require('shelljs');
const Inquirer = require('inquirer');
const _ = require('lodash');

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

function askQuestion() {
    const questions = [
        {
            name: "GENERATE",
            type: "list",
            message: "What are the files to generate",
            choices: [ 'page', 'component', 'mixins' ]
        },
        {
            name: "FILE",
            type: "input",
            message: "What is the filename ?"
        }
    ];

    return Inquirer.prompt(questions);
}

function generatePageByName(location, name) {
    let sassFile = `${name}.component.scss`,
        htmlFile = `${name}.component.html`,
        tsFile = `${name}.component.ts`

    let tsTemplate = `import { Vue, Component } from 'vue-property-decorator';\nimport './${name}.component.scss';\n\n@Component({\n\ttemplate: require('./${name}.component.html')\n})\nexport default class ${name.formatCapitalized()}Component extends Vue {\n}`;
    let htmlTemplate = `<div>${name.formatCapitalized()} Component</div>`;

    Shell.touch(`${location}/${sassFile}`);
    Shell.touch(`${location}/${htmlFile}`);
    Shell.touch(`${location}/${tsFile}`);

    Shell.ShellString(tsTemplate).to(`${location}/${tsFile}`);
    Shell.ShellString(htmlTemplate).to(`${location}/${htmlFile}`);
}

function generateFileByExtension(location, name) {
    Shell.touch(`${location}/${name}`);
}

const run = async () => {
    let location = "";
    let commands = process.argv.slice(3);

    if (!commands.length) {
        commands = await askQuestion();
        commands = [
            commands.GENERATE,
            commands.FILE
        ];
    }

    switch(commands[0]) {
        case 'page': 
            location = `${__dirname}/../src/pages/${commands[1]}`;
            Shell.mkdir('-p', location);
            generatePageByName(location, commands[1]);
            return;
        case 'component': 
            location = `${__dirname}/../src/components/${commands[1]}`;
            Shell.mkdir('-p', location);
            generatePageByName(location, commands[1]);
            return;
        case 'mixins':
            location = `${__dirname}/../src/mixins`;
            Shell.mkdir('-p', location);
            Shell.touch(`${location}/${commands[1]}.ts`);
            return;
    }
}

run();