# Mental Health for All

Mental Health for All provides a directory of resources for New Yorkers seeking help for anxiety, trauma, substance misuse, and more. This repository contains the content and source code for the site. The [NYCO Patterns CLI](https://github.com/CityOfNewYork/patterns-cli) generates a static build of the 20+ service pages styled using the [Growing Up Patterns](https://github.com/NYCOpportunity/growingupnyc-patterns). The service directory (or archive) uses the [NYCO WordPress Archive Vue](https://github.com/CityOfNewYork/nyco-wp-archive-vue/) to filter the services.

### Contributing

As of right now the project should be relative to the Growing Up Patterns when developing.

```
- 📁 growingupnyc-patterns
- 📁 mhfa
```

If you do not have the [Growing Up NYC Patterns](https://github.com/NYCOpportunity/growingupnyc-patterns) set up, clone them before cloning this package.

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

### Growing Up Patterns

The Growing Up Patterns are re-configured to use [custom **Mental Health for All** design tokens](config/tokens.js) (fonts, colors, media breakpoints, and background images). The [main site stylesheet](src/scss/_site.scss) and [Tailwindcss configuration](config/tailwindcss.js) use the tokens to generate custom CSS styles and utilities.

### Commands

Commands are stored in the [package.json](package.json) file and can be run using NPM. Commands follow this pattern.

```shell
$ npm run {{ command }}
```

Below is a description of the available commands.

Command    | Arguments         | Description
-----------|-------------------|-
`start`    |                   | Runs the Pattern CLI development server with watching and reloading.
`default`  |                   | Runs the default Pattern CLI build command.
`version`  | major/minor/patch | Hooks into the npm version script by regenerating the build with the version number.
`services` |                   | Regenerate all of the service `.slm` templates from the [config/services.js](config/services.js) file. This needs to be run if any changes are made to the [src/slm/service.slm](src/slm/service.slm) template or new services are added to [config/services.js](config/services.js).
`ghpages`  |                   | Run the default command and publish to the testing environment.

[Additional commands from the Patterns CLI](https://github.com/CityOfNewYork/patterns-cli#commands) can also be run. Most commands will require the `NODE_ENV` variable to be set.

---

![The Mayor's Office for Economic Opportunity](NYCMOEO_SecondaryBlue256px.svg)

[The Mayor's Office for Economic Opportunity](http://nyc.gov/opportunity) (NYC Opportunity) is committed to sharing open-source software that we use in our products. Feel free to ask questions and share feedback. **Interested in contributing?** See our open positions on [buildwithnyc.github.io](http://buildwithnyc.github.io/). Follow our team on [Github](https://github.com/orgs/CityOfNewYork/teams/nycopportunity) (if you are part of the [@cityofnewyork](https://github.com/CityOfNewYork/) organization) or [browse our work on Github](https://github.com/search?q=nycopportunity).