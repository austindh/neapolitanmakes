# neapolitanmakes
[neapolitanmakes.com](https://neapolitanmakes.com)

## Development
#### Run admin server:
```bash
# from /
$ ts-node app
```

#### Run admin frontend:
```bash
# from /admin
$ npm run start
```

## Building
#### Build blog site components
```bash
# from /admin
$ npm run babel
```

#### Build site CSS
```bash
# from /admin
$ npm run css
```

#### Build all pages for the site
```js
// /admin/generate-blog/index.js
build();
```
