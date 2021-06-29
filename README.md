# MHFA

Work-in-progress.

## Contributing

As of right now this project should be relative to the Growing Up Patterns.

```
- 📁 growingupnyc-patterns
- 📁 mhfa
```

If you do not have the [Growing Up NYC Patterns](https://github.com/NYCOpportunity/growingupnyc-patterns) set up this way, clone them before cloning this package.

```shell
$ git clone https://github.com/NYCOpportunity/growingupnyc-patterns
$ git clone https://github.com/CityOfNewYork/mhfa
$ cd mhfa
```

Then install dependencies and start the [Patterns CLI](https://github.com/CityOfNewYork/patterns-cli) development server.

```shell
$ npm install
$ npm start
```

## CHANGELOG

### JavaScript Enhancements to Integrate

* [ ] Google Translate Element (need to pull example from [one of our sites, ACCESS?](https://github.com/CityOfNewYork/ACCESS-NYC/blob/main/wp-content/themes/access/src/js/modules/google-translate-element.js))
* [ ] Web Share Component (available in the [Patterns Scripts library](https://github.com/CityOfNewYork/patterns-scripts/tree/main/src/web-share))

### v0.0.0-5

Implemented of [NYCO WP Archive Vue](https://github.com/CityOfNewYork/nyco-wp-archive-vue) application for filtering Services.

### v0.0.0-4

Implemented first round of content and design of Services.

### v0.0.0-3

Integrated the following items.

* [x] Integrate the icons
* [x] Potentially use CDN for Styles and Icons (SVGs)
* [x] Get JavaScript to work (modules need to be implemented on an as needed basis)
* [x] Single program template (Trauma Support)

### v0.0.0-2

Integrated the following items.

* [x] Styles (locally compiled)
* [x] Scripts (CDN)
* [x] Default layout
* [x] Partials directory with some objects and components
* [x] Homepage template
* [x] Archive template

To dos.

* [ ] Integrate the icons
* [ ] Get JavaScript to work
* [ ] Potentially use CDN for Styles and Icons (SVGs)

### v0.0.0-1

Initialized an NPM/Node.js project.

```
$ npm init
```

Installed the @NYCOpportunity [Patterns CLI](https://github.com/CityOfNewYork/patterns-cli) and [Growing Up NYC Patterns](https://github.com/NYCOpportunity/growingupnyc-patterns).

```shell
$ npm install @nycopportunity/pttrn
```

The **Growing Up NYC Patterns** need to be installed as a local file dependency.

```
$ cd ../
$ git clone https://github.com/NYCOpportunity/growingupnyc-patterns
$ cd mhfa
$ npm install ../growingupnyc-patterns
```

The path **../growingupnyc-patterns** would vary if Growing Up Patterns is already cloned locally.

Ran the [pttrn scaffold command](https://github.com/CityOfNewYork/patterns-cli/#scaffold) to set up the project.

```shell
$ npx pttrn scaffold
```

Added [Pattern NPM scripts](https://github.com/CityOfNewYork/patterns-cli/#npm-scripts) to the project.

```json
  "scripts": {
    "start": "cross-env NODE_ENV=development concurrently \"pttrn -w\" \"pttrn serve -w\" -p \"none\"",
    "version": "npm run default && git add .",
    "prepublishOnly": "git push && git push --tags",
    "publish": "cross-env NODE_ENV=production pttrn publish",
    "default": "cross-env NODE_ENV=production pttrn"
  },
```

Added **.gitignore** to the project.

```shell
$ touch .gitignore
```

Updated README.md

---

![The Mayor's Office for Economic Opportunity](NYCMOEO_SecondaryBlue256px.png)

[The Mayor's Office for Economic Opportunity](http://nyc.gov/opportunity) (NYC Opportunity) is committed to sharing open source software that we use in our products. Feel free to ask questions and share feedback. **Interested in contributing?** See our open positions on [buildwithnyc.github.io](http://buildwithnyc.github.io/). Follow our team on [Github](https://github.com/orgs/CityOfNewYork/teams/nycopportunity) (if you are part of the [@cityofnewyork](https://github.com/CityOfNewYork/) organization) or [browse our work on Github](https://github.com/search?q=nycopportunity).