import { MongoClient } from 'mongodb';

class MongoDB extends MongoClient {
	public constructor() {
		super(process.env.DATABASE!, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	}
}

export const Connection = new MongoDB();

