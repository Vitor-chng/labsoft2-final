import express from 'express'
import { env } from './config/env'
import {logger} from './config/logger'
import { errorHandler } from "./middleware/errorHandler"
import {getRepository, MainDataSource} from './config/db/data-source'
import { ingressoRouter } from "./core/components/ingresso/router";
import { usuarioRouter } from "./core/components/usuario/router";



const PORT = env.serverPort
const log = logger({ context: 'App' })

async function main() {
	const app = express()
	const cors = require('cors')

	// Nao funciona com formdata, usar json raw
	app.use(express.json())

	await MainDataSource.initialize()
	log.info('Database connected successfully!')

	app.get(`/${env.appName}/health`, (req, res) => {
		return res.status(200).send()
	})

	app.get(`/get/other/back`, (req, res) => {
		console.log('foi')
		return res.status(200).send()
	})

	app.use(cors())

	app.use(errorHandler);

	app.use("/ingresso", ingressoRouter);
	app.use("/usuario", usuarioRouter);


	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})
}



main().catch(error => {
	log.error('catch main application')
	log.error(error)
	process.exit(1)
})
