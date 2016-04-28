/**
 * Created by mayaj on 2016-04-28.
 */
import * as request from 'supertest';
require('should');

import * as app from "../server-node";

const server: any = request('http://localhost:3000');
/*const server: any = request(app);*/

const url = '/api/bookmark';
describe('bookmark', () => {
    describe('테스트', () => {
        describe('로그인전', () => {
            it(`북마크 데이터 가져오기 GET ${url}`, (done) => {
                server.get(url)
                    .expect("Content-type",/json/)
                    .expect(200)
                    .end((err, res) => {
                        if(err) throw err;
                        res.error.should.equal(false);
                        res.body.should.be.a.Array();
                        res.status.should.equal(200);
                        done();
                    })
            });
            it(`북마크 tag 검색 조건으로 가져오기 GET ${url}`, (done) => {
                server.get(url)
                    .query({tegs: ['123','333','444']})
                    .expect("Content-type",/json/)
                    .expect(200)
                    .end((err, res) => {
                        if(err) throw err;

                        res.status.should.equal(200);
                        res.error.should.equal(false);
                        res.body.should.be.a.Array();
                        /* 데이터 검증 */
                        if(res.body) {
                            for(const bookmark of res.body) {
                                let isOk = false;
                                bookmark.should.be.a.instanceof(Object);
                                bookmark.tags.should.be.a.instanceof(Array);

                                for(const tag of bookmark.tags) {
                                    if(tag == '123' || tag == '123' || tag == '123') {
                                        isOk=true;
                                        break;
                                    }
                                }
                                if(!isOk) {
                                    return done(new Error('Tag 데이터 검증에 실패하였습니다.'));
                                }
                            }
                        }

                        done();
                    })
            });
        });

        describe('로그인후', () => {
            beforeEach((done) => {
                server.post('/api/login')
                    .send({userId: 'test', password: 'test'})
                    .end(done);
            });

            it(`북마크 데이터 가져오기 GET ${url}`, (done) => {
                server.get(url)
                    .expect("Content-type",/json/)
                    .expect(200)
                    .end((err, res) => {
                        if(err) throw err;
                        res.error.should.equal(false);
                        res.body.should.be.a.Array();
                        res.status.should.equal(200);
                        done();
                    })
            });
            it(`북마크 tag 검색 조건으로 가져오기 GET ${url}`, (done) => {
                server.get(url)
                    .query({tegs: ['123','333','444']})
                    .expect("Content-type",/json/)
                    .expect(200)
                    .end((err, res) => {
                        if(err) throw err;

                        res.status.should.equal(200);
                        res.error.should.equal(false);
                        res.body.should.be.a.Array();
                        /* 데이터 검증 */
                        if(res.body) {
                            for(const bookmark of res.body) {
                                let isOk = false;
                                bookmark.should.be.a.instanceof(Object);
                                bookmark.tags.should.be.a.instanceof(Array);

                                for(const tag of bookmark.tags) {
                                    if(tag == '123' || tag == '123' || tag == '123') {
                                        isOk=true;
                                        break;
                                    }
                                }
                                if(!isOk) {
                                    return done(new Error('Tag 데이터 검증에 실패하였습니다.'));
                                }
                            }
                        }

                        done();
                    })
            });

            afterEach((done) => {
                done();
            });
        });
    });
    describe('오류테스트', () => {
        describe('로그인전', () => {
            beforeEach((done) => {
                server.get('/api/login/logout')
                    .end(done);
            });

            afterEach((done) => {
                done();
            });
        });

        describe('로그인후', () => {
            beforeEach((done) => {
                server.post('/api/login')
                    .send({userId: 'test', password: 'test'})
                    .end(done);
            });

            afterEach((done) => {
                done();
            });
        });
    });
});