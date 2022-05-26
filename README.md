## Step 1 : How To Clone Project

```bash
git clone --branch dev https://github.com/newbizstartkorea/mdbk_backend_sanjay.git
```

## Step 2 : If `Typescript` Not Install In Your Server Then Please Run Below Command

```bash
npm install -g typescript
npm install -g ts-node
```

## Step 3 : If `Sequelize CLI` Not Install In Your Server Then Please Run Below Command

```bash
npm install -g sequelize-cli
```

## Step 4 : How To Install Third Party Packages

```bash
npm run install
or
yarn
```

## Step 5 : Create `.env` File in Project Root Folder `(\)` Copy `\.env.prod` into `.env`

```bash
touch .env
cp .env.prod .env
```

## Step 6 : Change Below Config In `.env` File & Change `Mail & Database Credentials` in `.env`

```bash
NODE_ENV=production
APP_HOST="http://BACKEND_HOST/"
URL_HOST="http://FRONT END HOST"
```

## Step 7 : How to Seed Default Data In Database

```bash
npm run seed
or
yarn seed
```

## Step 8 : How to run server

```bash
npm run dev
or
yarn dev
```
