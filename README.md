# Twitter Search Firebase Functions

Twitter search app for firebase functions (using cloud scheduler and pubsub.)

## Requirements

- Node.js v10.x.x
- firebase account
- twitter credentials

## How to Deploy

### Prerequirements

- Create firebase project.
- Change firebase billing plan to blaze (to use cloud scheduler).

### Edit config

```bash
$ cd firebase/functions
$ cp .env.tpl.json .env.json
$ $EDITOR .env.json # fill your enviroment vars
$ $EDITOR config.ts # fill your config
```

### Deploy via firabse-tools

```bash
$ npm i -g firebase-tools
$ cd firebase
$ firebase login
$ yarn run deploy:config
$ firebase deploy
```

### LICENSE

MIT
