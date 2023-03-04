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
                labels: config['labels'],
                repo: repo['full_name'],
            }).then((diff) => {
                console.log(`\n\n ${repo['full_name']}:\n${JSON.stringify(diff, null, 4)}`)
            }).catch(logAndExit);
        }
    }).catch(logAndExit);
}
