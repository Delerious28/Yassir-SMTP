import dotenv from 'dotenv';
import { startSendWorker } from './send-worker.js';
import { startImapWorker } from './imap-worker.js';
import { startPlanner } from './planner.js';

dotenv.config();

startSendWorker();
startImapWorker();
startPlanner();
