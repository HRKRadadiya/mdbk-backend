import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const setSwagger = (app: Application) => {
	app.use(
		'/api-doc',
		swaggerUi.serve,
		swaggerUi.setup(require('../../MDBK.json'))
	)
}


export default setSwagger;
