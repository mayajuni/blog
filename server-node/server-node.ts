/**
 * Created by mayaj on 2016-04-23.
 */
import * as dotenv from 'dotenv';
import {Server} from './config/app';
import {Logger} from './module/logger';

dotenv.config({
    silent: true,
    path: '.env'
});

const port: number = process.env.PORT || 3000;
const app = new Server().app;
app.set('port', port);

app.listen(app.get('port'), () => {
    Logger.log('Express server listening on port ' + port);
}).on('error', err => {
    Logger.errorLog(err);
});

