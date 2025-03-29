# .github repository

This repository contains config files and workflows for all repositories in the [meltano](https:ithub.com/meltano) GitHub org (and occasionally the [MeltanoLabs](https:ithub.com/MeltanoLabs) GitHub org too).

## Label Synchronization

The file [`labels.yaml`](https:ithub.com/meltano/.github/blob/main/labels.yaml) specifies labels which are synchronized across all repositories in the [meltano](https:ithub.com/meltano) and [MeltanoLabs](https:ithub.com/MeltanoLabs) GitHub orgs. They are updated when the file is updated on the `main` branch, or when the label sync workflow is run manually.

To add a new label, add new entry to [`labels.yaml`](https:ithub.com/meltano/.github/blob/main/labels.yaml) under the `labels` key:

```yaml
  - name: "label name"
    description: "label description
    color: "0075CA" #hex color
    aliases:
     - "other labels to rename"
```

To test a PR, run the ["Sync Labels" workflow](https:ithub.com/meltano/.github/actions/workflows/sync_labels.yml) on your branch with the "dry run" option selected.

Note that no labels will currently be deleted if they do not match the configuration.

### Aliases

Some aliases are auto-generated from the label name and manually specified aliases.

Generates alternative aliases with the text:

- UPPERCASE
- lowercase
- Title Case
- With '::' replaced by '/'
- With '/' replaced by '::'

For example, a label named 'valuestream/Meltano' would receive the following aliases:

- 'VALUESTREAM/MELTANO'
- 'valuestream/meltano'
- 'Valuestream/Meltano'
- 'valuestream::Meltano'
- 'VALUESTREAM::MELTANO'
- 'valuestream::meltano'
- 'Valuestream::Meltano'

A label named 'wont fix' with the alias 'wontfix' would receive the following aliases:

- 'WONT FIX'
- 'Wont Fix'
- 'wontfix'
- 'WONTFIX'
- 'Wontfix'
