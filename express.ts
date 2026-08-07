import 'dotenv/config';
import repoCard from './api/pin.ts';
import langCard from './api/top-langs.ts';
import gistCard from './api/gist.ts';
import express from 'express';
// @ts-expect-error TS7016: Could not find a declaration file for module cors.
import cors from 'cors';

const app = express();
const router = express.Router();

if (process.env.NODE_ENV === 'development') {
	app.use(cors({ origin: '*' }));
	app.set('etag', false);
}

router.get('/pin', repoCard);
router.get('/top-langs', langCard);
router.get('/gist', gistCard);

app.use('/api', router);

const port = Number(process.env.port) || 9000;
app.listen(port, '0.0.0.0', () => {
	console.log(`Server running on port ${port}`);
});
