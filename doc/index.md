## For ngrok

```bash
ngrok http {port}
```

## Sequelize

```bash
#migrate database
npx sequelize-cli db:migrate

#undo all migration from database
npx sequelize-cli db:migrate:undo:all

#undo last migration from database
npx sequelize-cli db:migrate:undo

#how to create new migration
npx sequelize-cli migration:create --name migrationName

#how to create new migration with model
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
```

## Seeder

```bash
npm run seed
or
yarn seed
```

| args   | Values                      | description                             |
| ------ | --------------------------- | --------------------------------------- |
| --down |                             | if you want to run down seed            |
| --path | `seeder file name with .ts` | path if you want to run specific seeder |
