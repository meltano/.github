const core = require('@actions/core');
const fs = require('fs');
const github = require('@actions/github');
const githubLabelSync = require('github-label-sync');
const process = require('process');
const yaml = require('js-yaml');

const config = yaml.load(fs.readFileSync(core.getInput('config'), 'utf8'));
const octokit = github.getOctokit(core.getInput('token'));

const logAndExit = function (err) {
    console.log(err);
    process.exit(1);
}

String.prototype.toTitleCase = function() {
    return this.replace(/(^|[\s\/\:\-])\S/g, (x) => { return x.toUpperCase(); });
}

// Auto-generates aliases from the label name and manually specified aliases.
// Generates alernative aliases with the text:
// - UPPERCASE
// - lowercase
// - Title Case
// - With '::' repalced by '/'
// - With '/' repalced by '::'
// For example, a label named 'valuestream/Meltano' would receive the following aliases:
// - 'VALUESTREAM/MELTANO'
// - 'valuestream/meltano'
// - 'Valuestream/Meltano'
// - 'valuestream::Meltano'
// - 'VALUESTREAM::MELTANO'
// - 'valuestream::meltano'
// - 'Valuestream::Meltano'
// A label named 'wont fix' with the alias 'wontfix' would receive the following aliases:
// - 'WONT FIX'
// - 'Wont Fix'
// - 'wontfix'
// - 'WONTFIX'
// - 'Wontfix'
const generateAliases = function (labels) {
    for (const label of labels) {
        const aliases = new Set(
            [label['name'], ...(label['aliases'] ?? [])].flatMap((text) => {
                return [
                    text,
                    text.toUpperCase(),
                    text.toLowerCase(),
                    text.toTitleCase(),
                ].flatMap((text) => {
                    return [
                        text.replace('::', '/'),
                        text.replace('/', '::'),
                    ];
                });
            })
        );
        aliases.delete(label['name']);
        label['aliases'] = Array.from(aliases);
    }
    return labels;
}

for (const org of config['orgs']) {
    octokit.rest.repos.listForOrg({ org: org }).then((data) => {
        for (const repo of data['data']) {
            if (repo['archived']) continue;
            githubLabelSync({
                // Avoid broadly destructive actions - if allowAddedLabels is
                // false all labels not specified in the config will be deleted
                allowAddedLabels: true,
                accessToken: core.getInput('token'),
                dryRun: core.getBooleanInput('dry-run'),
                labels: generateAliases(config['labels']),
                repo: repo['full_name'],
            }).then((diff) => {
                console.log(`\n\n ${repo['full_name']}:\n${JSON.stringify(diff, null, 4)}`)
            }).catch(logAndExit);
        }
    }).catch(logAndExit);
}
