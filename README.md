# .github repository

This repository contains config files and workflows for all repositories in the [meltano](https://github.com/meltano) GitHub org (and occasionally the [MeltanoLabs](https://github.com/MeltanoLabs) GitHub org too).

## Label Synchronization

The file [`labels.yaml`](https://github.com/meltano/.github/blob/main/labels.yaml) specifies labels which are synchronized across all repositories in the [meltano](https://github.com/meltano) and [MeltanoLabs](https://github.com/MeltanoLabs) GitHub orgs. They are updated when the file is updated on the `main` branch, or when the label sync workflow is run manually.

To add a new label, add new entry to [`labels.yaml`](https://github.com/meltano/.github/blob/main/labels.yaml) under the `labels` key:

```yaml
  - name: "label name"
    description: "label description
    color: "0075CA" #hex color
    aliases:
     - "other labels to rename"
```

To test a PR, run the ["Sync Labels" workflow](https://github.com/meltano/.github/actions/workflows/sync_labels.yml) on your branch with the "dry run" option selected.

Note that no labels will currently be deleted if they do not match the configuration.
