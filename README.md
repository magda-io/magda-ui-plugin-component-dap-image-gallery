# Magda UI Plugin Component DAP Thumbnail Viewer

A Magda UI Plugin Component that allows users to view the thumbnails of the files / distributions that are harvested from CSIRO DAP system.

This plugin requires Magda v2.2.0 or higher.

> Since Magda v2.2.0, users can load more than one "Extra Visualisation Section" type Magda UI Plugin Components. To allow this, the component is required to be packaged as a library and exported to global scope `MagdaPluginComponentExtraVisualisationSections.xxxx`. Here, `MagdaPluginComponentExtraVisualisationSections` should be an object with key `xxxx` set to the plugin component. e.g. the DAP thumbnail viewer plugin choose to export itself to `MagdaPluginComponentExtraVisualisationSections.DAPThumbnailViewer`.


More about Magda UI Plugin Component see: https://github.com/magda-io/magda-plugin-ui-component-examples

## How to Run Locally

```bash
yarn start
```

Access: http://localhost:8080/

## How to Deploy with Magda / Config

1> Build the bundle

```bash
yarn build
```

2> Upload files in `dist` folder to your own web service.

3> Config Magda Web Server Module

```yaml
web-server:
  externalUIComponents:
    - "https://exmaple.com/assets/libs/MagdaPluginComponentExtraVisualisationSections_DAPThumbnailViewer.js"
```

You also need to configure Magda Gateway module `CSP` config accordingly to make sure scripts from `exmaple.com` are allowed. e.g.:

```yaml
gateway:
  csp:
    browserSniff: false
    directives:
      scriptSrc:
      - "'self'"
      - "'unsafe-inline'"
      - exmaple.com
      - exmaple.com
      - "blob:"
      objectSrc:
      - "'none'"
      workerSrc:
      - "'self'"
      - "blob:"
```

For more information, please refer to this issue:

https://github.com/magda-io/magda/issues/3099


