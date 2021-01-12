import Env from 'dotenv';
Env.config();

import * as Server from './server/Server';

Server.init();