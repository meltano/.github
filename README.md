# .github repository

This repository contains the workflow for synchronizing labels between all repositories in the `meltano` namespace. 

To add a new label, add new entry to the `labels.yml` file:

```yaml
  - name: "label name"
    description: "label description
    color: "0075CA" #hex color
    aliases:
     - "other labels to rename"
```

To test a PR, run the ["Sync Labels" workflow](https://github.com/meltano/.github/actions/workflows/sync_labels.yml) on your branch with the "dry run" option selected.

Note that no labels will currently be deleted if they do not match the configuration.
