const core = require('@actions/core');
const fs = require('fs');
const github = require('@actions/github');
const githubLabelSync = require('github-label-sync');
const yaml = require('js-yaml');

const config = yaml.load(fs.readFileSync(core.getInput('config'), 'utf8'));
const octokit = github.getOctokit(core.getInput('github-token'))

for (const org in config['orgs']) {
    octokit.repos.listForOrg({ org: org }).then((data, headers, status) => {
        for (const repo in data) {
            githubLabelSync({
                // Avoid broadly destructive actions - if allowAddedLabels is
                // false all labels not specified in the config will be deleted
                allowAddedLabels: true,
                accessToken: core.getInput('github-token'),
                dryRun: core.getBooleanInput('dry-run'),
                labels: config['labels'],
                repo: repo['full_name'],
            }).then((diff) => {
                console.log(`\n\n Repository: ${repo['full_name']}:\n${diff}`)
            });
        }
    });
}
