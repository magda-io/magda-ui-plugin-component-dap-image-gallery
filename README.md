# Magda UI Plugin Component DAP Image Gallery

A Magda UI Plugin Component that allows users to preview available images that are contained in a CSIRO DAP system dataset.

This plugin requires Magda v2.2.0 or higher.

> Since Magda v2.2.0, users can load more than one "Extra Visualisation Section" type Magda UI Plugin Components. To allow this, the component is required to be packaged as a library and exported to global scope `MagdaPluginComponentExtraVisualisationSection.xxxx`. Here, `MagdaPluginComponentExtraVisualisationSection` should be an object with key `xxxx` set to the plugin component. e.g. the DAP Image Gallery plugin choose to export itself to `MagdaPluginComponentExtraVisualisationSection.DAPImageGallery`.


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
    # for production deployment, you will want to host the JS bundle yourself
    - "https://github.com/magda-io/magda-ui-plugin-component-dap-image-gallery/releases/download/v1.0.0/DAPImageGallery.js"
```

You also need to configure Magda Gateway module `CSP` config accordingly to make sure scripts from `github.com` are allowed (or whatever domain where hosts the JS bundle). e.g.:

```yaml
gateway:
  csp:
    directives:
      scriptSrc:
      - "'self'"
      - "'unsafe-inline'"
      - "blob:"
      # the following two domains are for downloading Magda UI plugins from github release
      - github.com
      # github.com will issue 301 redirection to this domain
      - objects.githubusercontent.com
```

4> As this UI plugin use [magda-preview-map](https://github.com/magda-io/magda-preview-map) as CORS resource proxy, you need to make sure the `magda-preview-map` module is disabled (by default, it will be deployed with other Magda core modules) and CSIRO DAP system domain (data.csiro.au) is on the `allowProxyFor` list (by default, the domain has been added).

To config `allowProxyFor` option of [magda-preview-map](https://github.com/magda-io/magda-preview-map), please check its helm chart document on the repo home page.




