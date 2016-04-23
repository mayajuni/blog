/**
 * Created by mayaj on 2016-04-23.
 */
import * as dotenv from 'dotenv';
import * as debug  from 'debug';
import {Server} from './config/app';
import {Logger} from './../util/logger';

dotenv.config({
    silent: true,
    path: '.env'
});

const port: number = process.env.PORT || 3000;
const app = new Server().app;
app.set('port', port);

app.listen(app.get('port'), () => {
    debug('Express server listening on port ' + port);
}).on('error', err => {
    Logger.errorLog.error(err);
});

