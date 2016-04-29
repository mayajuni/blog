/**
 * Created by mayaj on 2016-04-27.
 */
import * as request from 'supertest';
require('should');

import * as app from "../server-node";

const server: any = request.agent('http://localhost:3000');
/*const server: any = request.agent(app);*/

describe('Login', () => {
    const url = '/api/login';
    describe('테스트', () => {
        it('로그인 테스트 POST /api/login ', (done) => {
            server.post(url)
                .send({userId: 'test', password: 'test'})
                .end(function(err,res){
                    if (err) {
                        throw err;
                    }
                    res.error.should.equal(false);
                    res.status.should.equal(200);
                    res.body.should.have.property('userId');
                    res.body.userId.should.equal('test');
                    res.body.should.have.property('name');
                    res.body.name.should.equal('테스트');
                    res.body.should.have.property('token');
                    res.body.should.not.have.property('password');
                    done();
                });
        });
        it('토큰 로그인 POST /api/login/token', (done) => {
            server.post(`${url}/token`)
                .send({token: '35dd4f963944d204a7ed56e67db3bf7aaadcd28214ccc11b821f2560a0647701'})
                .expect(200)
                .end(function(err,res){
                    if (err) {
                        throw err;
                    }
                    res.error.should.equal(false);
                    res.status.should.equal(200);
                    res.body.should.have.property('userId');
                    res.body.userId.should.equal('test');
                    res.body.should.have.property('name');
                    res.body.name.should.equal('테스트');
                    res.body.should.have.property('token');
                    res.body.should.not.have.property('password');
                    done();
                });
        });
        it('나의 로그인 정보 가지고 오기 GET /api/login', (done) => {
            server.get(url)
                .expect("Content-type",/json/)
                .expect(200)
                .end(function(err,res){
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('userId');
                    res.body.userId.should.equal('test');
                    res.body.should.have.property('name');
                    res.body.name.should.equal('테스트');
                    res.body.should.have.property('token');
                    res.body.should.not.have.property('password');
                    done();
                });
        });

        it('로그아웃 테스트 GET /api/login/logout', (done) => {
            server.get(`${url}/logout`)
                .expect(200)
                .end(done);
        }); 
    });

    describe('오류 테스트', () => {
        it('로그인 에러 테스트(아이디나 비밀번호 잘못 됐을경우) POST /api/login ', (done) => {
            server.post(url)
                .send({userId: 'sdksdfmn', password: 'test'})
                .end(function(err,res){
                    if (err) {
                        throw err;
                    }

                    res.should.have.property('error');
                    res.error.text.should.equal('check_id_pw');
                    res.status.should.equal(400);
                    done();
                });
        });

        it('로그인 에러 테스트(userId가 없는경우) POST /api/login ', (done) => {
            server.post(url)
                .send({password: 'test'})
                .end(function(err,res){
                    if (err) {
                        throw err;
                    }

                    res.should.have.property('error');
                    res.error.text.should.equal('userId');
                    res.status.should.equal(400);
                    done();
                });
        });

        it('로그인 에러 테스트(password가 없는경우) POST /api/login ', (done) => {
            server.post(url)
                .send({userId: 'test'})
                .end(function(err,res){
                    if (err) {
                        throw err;
                    }

                    res.should.have.property('error');
                    res.error.text.should.equal('password');
                    res.status.should.equal(400);
                    done();
                });
        });

        it('토큰 로그인 에러 테스트(token이 없는경우) POST /api/login/token ', (done) => {
            server.post(`${url}/token`)
                .send({})
                .end(function(err,res){
                    if (err) {
                        throw err;
                    }

                    res.should.have.property('error');
                    res.error.text.should.equal('token');
                    res.status.should.equal(400);
                    done();
                });
        });

        it('토큰 로그인 에러 테스트(잘못된 토큰) POST /api/login/token ', (done) => {
            server.post(`${url}/token`)
                .send({token: '테스트토큰'})
                .end(function(err,res){
                    if (err) {
                        throw err;
                    }

                    res.should.have.property('error');
                    res.error.text.should.be.exactly('bad_token');
                    res.status.should.equal(400);
                    done();
                });
        }); 
    });
});
