# EPA_Non-geo_Metadata_Editor

The EPA Non-Geo Metadata Editor is a web-based tool to create records compliant with EPA's Metadata Technical Specification. It includes a JSON version of the Technical Specification that can be reused in other geospatial and non-geo metadata editor tools. The code is released as public domain.

## Project setup

By default non-production builds target deployment to root folder and production builds target `/epa-open-data-metadata-editor` folder. Please modify `vue.config.js` to change this behavior.

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Lints and fixes files

```
yarn run lint
```
