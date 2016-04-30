/**
 * Created by mayaj on 2016-05-01.
 */
import * as request from 'supertest';
require('should');

import * as app from "../server-node";

const server: any = request.agent('http://localhost:3000');
/*const server: any = request.agent(app);*/

const url = '/api/board';
const logout = (done) => server.get('/api/login/logout').end(done);
const login = (done) => server.post('/api/login').send({userId: 'test', password: 'test'}).end(done);