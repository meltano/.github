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
        for (const repo in data['data']) {
            console.log(repo);
            console.log(`${JSON.stringify(repo, null, 4)}`);
            githubLabelSync({
                // Avoid broadly destructive actions - if allowAddedLabels is
                // false all labels not specified in the config will be deleted
                allowAddedLabels: true,
                accessToken: core.getInput('token'),
                dryRun: true, // core.getBooleanInput('dry-run'),
                labels: config['labels'],
                repo: repo['full_name'],
            }).then((diff) => {
                console.log(`\n\n Repository: ${repo['full_name']}:\n${diff}`)
            }).catch(logAndExit);
        }
    }).catch(logAndExit);
}
