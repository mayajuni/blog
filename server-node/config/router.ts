/**
 * Created by mayaj on 2016-04-23.
 */


export function Router(app) {
    app.use('/', (req, res) => res.send('hollow world'));
}