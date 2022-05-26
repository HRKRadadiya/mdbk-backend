import { Dialect, Sequelize } from 'sequelize'
import config from './config'

const dbName = config.db.dbname as string
const dbUser = config.db.username as string
const dbHost = config.db.host
const dbDriver = config.db.dialect as Dialect
const dbPassword = config.db.password
const dbPort = config.db.port

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
	host: dbHost,
	dialect: dbDriver,
	port: dbPort
})

export default sequelizeConnection
