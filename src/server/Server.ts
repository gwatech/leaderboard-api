import express, { Request, Response } from 'express';
import { Connection as db } from '../struct/Database';
import { wakeUp } from '../util/wakeup';

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/', (req: Request, res: Response) => res.status(200).json({ status: true }));

app.get('/leaderboard', async (req: Request, res: Response) => {
	const limit = Number(req.query.limit) || 0;

	const data = await db.db('musico')
		.collection('levels')
		.find()
		.sort({ exp: -1 })
		.limit(limit)
		.toArray();

	return res.status(200).json({
		total: data.length,
		data: [...data],
		status: true
	});
});

app.get('/leaderboard/:user', async (req: Request, res: Response) => {
	const data = await db.db('musico')
		.collection('levels')
		.findOne({ user: req.params.user! });

	if (!data) return res.status(404).json({ status: false });
	return res.status(200).json({ ...data, status: true });
});

export const init = async () => {
	await db.connect();
	wakeUp();
	return app.listen(PORT, () => process.stdout.write(`App listening to port: ${PORT}`));
}