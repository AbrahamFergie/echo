# game

[ ![Codeship Status for LearnersGuild/game](https://codeship.com/projects/8ee1a1d0-17e4-0134-1d69-2a776fb5d411/status?branch=master)](https://codeship.com/projects/158610)
[![Code Climate GPA](https://codeclimate.com/repos/579a4ec2e7852e0064005f1b/badges/4817694087b17643b7b7/gpa.svg)](https://codeclimate.com/repos/579a4ec2e7852e0064005f1b/feed)
[![Code Climate Issue Count](https://codeclimate.com/repos/579a4ec2e7852e0064005f1b/badges/4817694087b17643b7b7/issue_count.svg)](https://codeclimate.com/repos/579a4ec2e7852e0064005f1b/feed)
[![Test Coverage](https://codeclimate.com/repos/579a4ec2e7852e0064005f1b/badges/4817694087b17643b7b7/coverage.svg)](https://codeclimate.com/repos/579a4ec2e7852e0064005f1b/coverage)

This is the game service.

## GETTING STARTED

Welcome to [The Game](http://i.giphy.com/MGU6B1h1jSfja.gif).  Before you get going, be sure to read the [instructions for contributing](./CONTRIBUTING.md) **There isn't a CONTIRBUTING.md?**. Most of this content is private, so if you have any trouble accessing anything get in touch with your team lead for an invitation.

Before you can run game you need:
- To install and set up the [IDM service](https://github.com/LearnersGuild/idm)
- To install and set up the [LG bin](https://github.com/LearnersGuild/bin)
- For live data: an invitation the LG Team on Heroku

### SET UP THE GAME
#####1. Fork and clone the repository.

#####2. Setup and run [mehserve][mehserve]. 

Figure out which port you intend to use and create the mehserve config file:
```bash
echo 9005 > ~/.mehserve/game.learnersguild
```

#####3. Set your `NODE_ENV` environment variable:

```bash
export NODE_ENV=development
```

#####4. [Install RethinkDB][install-rethinkdb].

#####5. Create your `.env.development` file for your environment. 
Take out all comments in your final version. 
Example:
```
PORT=9005
APP_BASE_URL=http://game.learnersguild.dev
REDIS_URL=redis://localhost:6379
RETHINKDB_URL=rethinkdb://localhost:28015/game_development
# To support extending JWT sessions:
IDM_BASE_URL=http://idm.learnersguild.dev
CHAT_BASE_URL=http://echo.learnersguild.dev
CHAT_API_USER_SECRET='s3cr3t-p@ssw0rd'
CHAT_API_WEBHOOK_TOKEN_DM="<get from custom echo-chat webhook integration>"
JWT_PRIVATE_KEY="<get from IDM service>"
JWT_PUBLIC_KEY="<get from IDM service>"
CHAT_API_WEBHOOK_TOKEN_DM="<from when you setup the DM webhook as explained here: https://github.com/LearnersGuild/echo-chat/issues/50>"
```


##### 6. Install dependencies:

```bash
npm install
```


##### 7. Create a development & test databases:

```bash
npm run db:create
NODE_ENV=test npm run db:create
```

```bash
npm run db:migrate:up
NODE_ENV=test npm run db:migrate:up
```



###SYNC PRODUCTION DATABASES (Optional)

If you need to sync prod databases to your local setups: You'll need to be invited to the LG Team on Heroku for this to work. install heroku locally and use the heroku cli to log in locally. Run the heroku access command to confirm that you have access:

```bash
heroku access -a lg-game
```

Use the Resync command to sync the live game and idm data to your local environment. You must have [LG bin](https://github.com/LearnersGuild/bin) cloned and running for this to work.

To ensure the bin environments are ready for syncing with the database: 
```bash
/usr/local/bin/rethinkdb-export
ls -l /usr/local/bin/rethinkdb-export
```


**WARNING** You have access to the production systems and data now. Please be careful. You now have the [power](http://i.giphy.com/3o7WTF0VXxhnqUvYY0.gif) to cause a lot of damage.

In your `bin` folder:
```bash
./resyncdb lg-game game_development
./resyncdb lg-idm idm_development
```



###GENERATE TEST DATA (Optional)

In your `idm` repo directory, run:
```bash
# generate random users
npm run data:testdata
```

Continue in your `game` repo directory:
```bash
# find your user ID and write to `/tmp/users.txt`
npm run data:playtest -- --confirm --votes --users=tmp/users.txt "Playtest Chapter"
```

##### Run the server:

NOTE: you'll need the IDM service, mehserve, & the game all runing a the same time for the site to work.
```bash
npm start
```


Visit the server in your browser:
```bash
open http://game.learnersguild.dev
```


Start the workers
```bash
npm run workers
```


## CONTINUOUS INTEGRATION

We use [Codeship](https://codeship.com/) for continuous integration. The following files are responsible for CI configuration:

- `Dockerfile`: basic Docker image for the app
- `codeship-services.yml`: similar to `docker-compose.yml`, but for CI
- `codeship-steps.yml`: the steps to run on each service for CI
- `app.env.encrypted`: encrypted environment vars for the app (e.g., `NPM_AUTH_TOKEN`)
- `herokudeployment.env.encrypted`: encrypted environment vars for Heroku deployment (e.g., `HEROKU_API_KEY`)


## LICENSE

See the [LICENSE](./LICENSE) file.


[idm]: https://github.com/LearnersGuild/idm
[github-register-application]: https://github.com/settings/applications/new
[install-rethinkdb]: https://www.rethinkdb.com/docs/install/
[mehserve]: https://github.com/timecounts/mehserve
