import express, { Request, Response } from 'express';
import { Client } from 'discord.js';
import { Connection as db } from '../struct/Database';
import { wakeUp } from '../util/wakeup';

const app = express();
const client = new Client();
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

app.get('/leaderboard/resolved', async (req: Request, res: Response) => {
	const limit = Number(req.query.limit) || 0;

	const data = await db.db('musico')
		.collection('levels')
		.find()
		.sort({ exp: -1 })
		.limit(limit)
		.toArray();

	const resolved = [];

	for (const userID of data.map(m => m.user)) {
		const user = await client.users.fetch(userID).catch(() => undefined);

		resolved.push(user);
	}

	return res.status(200).json({ data: [...resolved, ...data], status: true, total: resolved.length });
});

app.get('/leaderboard/:user', async (req: Request, res: Response) => {
	const data = await db.db('musico')
		.collection('levels')
		.findOne({ user: req.params.user! });

	if (!data) return res.status(404).json({ status: false });
	return res.status(200).json({ data: { ...data }, status: true });
});

app.get('/resolve', async (req: Request, res: Response) => {
	const userID = req.query.user as string;
	const user = await client.users.fetch(userID).catch(() => undefined);
	if (!user) return res.status(404).json({ status: false });

	return res.status(200).json({ data: user });
});

client.on('ready', () => {
	client.user?.setStatus('invisible');
	process.stdout.write(`READY: [${client.user?.tag}]`)
})

export const init = async () => {
	await db.connect();
	await client.login(process.env.TOKEN);
	wakeUp();
	return app.listen(PORT, () => process.stdout.write(`App listening to port: ${PORT}`));
}