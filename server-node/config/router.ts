/**
 * Created by mayaj on 2016-04-23.
 */
import * as login from '../router/login';
import * as bookmark from '../router/bookmark';

export function Router(app) {
    app.use('/api/login', login);
    app.use('/api/bookmark', bookmark);
}