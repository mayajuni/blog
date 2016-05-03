/**
 * Created by mayaj on 2016-05-02.
 */
import * as request from 'supertest';
require('should');

import * as app from "../server-node";

const server: any = request.agent('http://localhost:3000');
/*const server: any = request.agent(app);*/

const url = '/api/menu';
const logout = (done) => server.get('/api/login/logout').end(done);
const login = (done) => server.post('/api/login').send({userId: 'test', password: 'test'}).end(done);

// 메뉴 가지고 오기
const checkGet = (done) => {
    server.get(url)
        .expect("Content-type",/json/)
        .expect(200)
        .end((err, res) => {
            if(err) throw err;
            res.error.should.equal(false);
            res.body.should.be.a.Array();
            done();
        })
};

describe('메뉴', () => {
    describe('Step1', () => {
        describe('테스트', () => {
            describe('로그인전', () => {
                it(`메뉴 데이터 가져오기 GET ${url}`, checkGet);
            });

            describe('로그인후', () => {
                let _id: string = '';
                before(login);

                it(`메뉴 데이터 가져오기 GET ${url}`, checkGet);
                it(`메뉴 저장 POST ${url}`, (done) => {
                    server
                        .post(url)
                        .send({name: 'test5', nickName: 'test2', url: '/test/test'})
                        .expect(200)
                        .expect("Content-type",/json/)
                        .end((err, res) => {
                            if(err) throw err;
                            res.body.should.be.a.Object();
                            res.body.should.have.property('_id');
                            res.body.should.have.property('name');
                            res.body.should.have.property('nickName');
                            res.body.should.have.property('url');
                            _id = res.body._id;
                            done();
                        });
                });
                it(`메뉴 수정 PUT ${url}`, (done) => {
                    server
                        .put(url)
                        .send({_id: _id, nickName: 'test21111', url: '/test/test1212', rank: 2})
                        .expect(200)
                        .end(done);
                });
                it(`메뉴 삭제 DELETE ${url}/:_id (${_id})`, (done) => {
                    server
                        .delete(`${url}/${_id}`)
                        .expect(200)
                        .end(done);
                });
            });
        });
        describe('오류테스트', () => {
            describe('로그인전', () => {
                before(logout);
                it(`메뉴 저장 오류(로그인 필수)`, (done) => {
                    server
                        .post(url)
                        .send({name: 'test', nickName: 'test2', url: '/test/test'})
                        .expect(401)
                        .end((err, res) => {
                            if(err) throw err;

                            res.should.have.property('error');
                            res.error.text.should.equal('need_login');
                            done();
                        });
                });
                it(`메뉴 수정 오류(로그인 필수)`, (done) => {
                    server
                        .put(url)
                        .send({_id: 'aaa', name: 'test', nickName: 'test21111', url: '/test/test1212', rank: 2})
                        .expect(401)
                        .end((err, res) => {
                            if(err) throw err;

                            res.should.have.property('error');
                            res.error.text.should.equal('need_login');
                            done();
                        });
                });
                it(`메뉴 삭제 오류(로그인 필수)`, (done) => {
                    server
                        .delete(`${url}/122`)
                        .expect(401)
                        .end((err, res) => {
                            if (err) throw err;

                            res.should.have.property('error');
                            res.error.text.should.equal('need_login');
                            done();
                        });
                });
            });

            describe('로그인후', () => {
                before(login);

                describe('메뉴 저장 필수값 체크', () => {
                    const params: any = {name: 'test', nickName: 'test2', url: '/test/test'};

                    for(const key in params) {
                        let testParams: any = {};
                        for(const sKey in params) {
                            if(key != sKey) {
                                testParams[sKey] = params[sKey];
                            }
                        }
                        it(`${key} 오류`, (done) => {
                            server
                                .post(url)
                                .send(testParams)
                                .expect(400)
                                .end((err, res) => {
                                    if (err) throw err;

                                    res.should.have.property('error');
                                    res.error.text.should.equal(key);
                                    done();
                                });
                        });
                    }
                });
                describe('메뉴 수정 필수값 체크', () => {
                    const params: any = {_id: '테스트', nickName: 'test2', url: '/test/test', rank: 4};

                    for(const key in params) {
                        let testParams: any = {};
                        for(const sKey in params) {
                            if(key != sKey) {
                                testParams[sKey] = params[sKey];
                            }
                        }
                        it(`${key} 오류`, (done) => {
                            server
                                .put(url)
                                .send(testParams)
                                .expect(400)
                                .end((err, res) => {
                                    if (err) throw err;

                                    res.should.have.property('error');
                                    res.error.text.should.equal(key);
                                    done();
                                });
                        });
                    }
                });
                it('메뉴 삭제 필수값 체크', (done) => {
                    server
                        .delete(`${url}`)
                        .expect(404)
                        .end((err, res) => {
                            if (err) throw err;

                            res.should.have.property('error');
                            res.error.text.should.equal('not_found');
                            done();
                        });
                });

                const _id = '5726dff7eb13914c0e8a3ac6';
                it(`메뉴 남의것 수정 오류`, (done) => {
                    server
                        .put(`${url}`)
                        .send({_id: _id, nickName: 'test2', url: '/test/test', rank: 1})
                        .expect(400)
                        .end((err, res) => {
                            if (err) throw err;

                            res.should.have.property('error');
                            res.error.text.should.equal('no_authority');
                            done();
                        });
                });
                it(`메뉴 남의것 삭제 오류`, (done) => {
                    server
                        .delete(`${url}/${_id}`)
                        .expect(400)
                        .end((err, res) => {
                            if (err) throw err;

                            res.should.have.property('error');
                            res.error.text.should.equal('no_authority');
                            done();
                        });
                });
                it(`중복이름 저장`, (done) => {
                    server
                        .post(url)
                        .send({name: 'test', nickName: 'test2', url: '/test/test'})
                        .expect(400)
                        .end((err, res) => {
                            if(err) throw err;

                            res.should.have.property('error');
                            res.error.text.should.equal('same_name');
                            done();
                        });
                });
            });
        });
    });

    describe('Step2', () => {
        let _step1Id: string;
        /* 테스트를 위한 step1 저장 */
        before((done) => {
            server.post('/api/login').send({userId: 'test', password: 'test'}).end(()=>{
                server
                    .post(url)
                    .send({name: 'test5', nickName: 'test2', url: '/test/test', subMenus: [{name: 'same', nickName: 'test'}]})
                    .expect(200)
                    .end((err, res) => {
                        if(err) throw err;
                        res.body.should.be.a.Object();
                        res.body.should.have.property('_id');
                        res.body.should.have.property('name');
                        res.body.should.have.property('nickName');
                        res.body.should.have.property('url');
                        _step1Id = res.body._id;
                        done();
                    });
            });
        });

        describe('테스트', () => {
            describe('로그인후', () => {
                let _id: string;
                const name = 'test5';
                before(login);
                it(`메뉴 저장 POST`, (done) => {
                    server
                        .post(`${url}/step2/${_step1Id}`)
                        .send({name: name, nickName: 'test2', url: '/test/test'})
                        .expect(200)
                        .end((err, res) => {
                            if(err) {
                                throw err;
                            }

                            server
                                .get(`${url}/step2/${_step1Id}/${name}`)
                                .expect(200)
                                .end((err, res) => {
                                    if(err) throw err;

                                    res.body.should.have.property('_id');
                                    _id = res.body._id;
                                    done();
                                });
                        });
                });
                it(`메뉴 수정 PUT`, (done) => {
                    server
                        .put(`${url}/step2/${_step1Id}`)
                        .send({_id: _id, nickName: 'test21111', url: '/test/test1212', rank: 2})
                        .expect(200)
                        .end(done);
                });
                it(`메뉴 삭제 DELETE ${url}/step2/:_id`, (done) => {
                    server
                        .delete(`${url}/step2/${_id}`)
                        .expect(200)
                        .end(done);
                });
            });
        });
        describe('오류테스트', () => {
            describe('로그인전', () => {
                before(logout);
                it(`메뉴 저장 오류(로그인 필수)`, (done) => {
                    server
                        .post(`${url}/step2/${_step1Id}`)
                        .send({name: 'test', nickName: 'test2', url: '/test/test'})
                        .expect(401)
                        .end((err, res) => {
                            if(err) throw err;

                            res.should.have.property('error');
                            res.error.text.should.equal('need_login');
                            done();
                        });
                });
                it(`메뉴 수정 오류(로그인 필수)`, (done) => {
                    server
                        .put(`${url}/step2/${_step1Id}`)
                        .send({_id: 'aaa', name: 'test', nickName: 'test21111', url: '/test/test1212', rank: 2})
                        .expect(401)
                        .end((err, res) => {
                            if(err) throw err;

                            res.should.have.property('error');
                            res.error.text.should.equal('need_login');
                            done();
                        });
                });
                it(`메뉴 삭제 오류(로그인 필수)`, (done) => {
                    server
                        .delete(`${url}/step2/122`)
                        .expect(401)
                        .end((err, res) => {
                            if (err) throw err;

                            res.should.have.property('error');
                            res.error.text.should.equal('need_login');
                            done();
                        });
                });
            });

            describe('로그인후', () => {
                before(login);

                describe('메뉴 저장 필수값 체크', () => {
                    const params: any = {name: 'test', nickName: 'test2', url: '/test/test'};

                    for(const key in params) {
                        let testParams: any = {};
                        for(const sKey in params) {
                            if(key != sKey) {
                                testParams[sKey] = params[sKey];
                            }
                        }
                        it(`${key} 오류`, (done) => {
                            server
                                .post(`${url}/step2/${_step1Id}`)
                                .send(testParams)
                                .expect(400)
                                .end((err, res) => {
                                    if (err) throw err;

                                    res.should.have.property('error');
                                    res.error.text.should.equal(key);
                                    done();
                                });
                        });
                    }
                });
                describe('메뉴 수정 필수값 체크', () => {
                    const params: any = {_id: '테스트', nickName: 'test2', url: '/test/test', rank: 4};

                    for(const key in params) {
                        let testParams: any = {};
                        for(const sKey in params) {
                            if(key != sKey) {
                                testParams[sKey] = params[sKey];
                            }
                        }
                        it(`${key} 오류`, (done) => {
                            server
                                .put(`${url}/step2/${_step1Id}`)
                                .send(testParams)
                                .expect(400)
                                .end((err, res) => {
                                    if (err) throw err;

                                    res.should.have.property('error');
                                    res.error.text.should.equal(key);
                                    done();
                                });
                        });
                    }
                });
                it('메뉴 삭제 필수값 체크', (done) => {
                    server
                        .delete(`${url}/step2/`)
                        .expect(404)
                        .end((err, res) => {
                            if (err) throw err;

                            res.should.have.property('error');
                            res.error.text.should.equal('not_found');
                            done();
                        });
                });

                it(`중복이름 저장`, (done) => {
                    server
                        .post(`${url}/step2/${_step1Id}`)
                        .send({name: 'same', nickName: 'test2', url: '/test/test'})
                        .expect(400)
                        .end((err, res) => {
                            if(err) throw err;

                            res.should.have.property('error');
                            res.error.text.should.equal('same_name');
                            done();
                        });
                });
            });
        });

        /* 모든 테스트가 끝난후 테스트 데이터는 삭제 시킨다. */
        after((done) => {
            server.post('/api/login').send({userId: 'test', password: 'test'}).end(()=>{
                server
                    .delete(`${url}/${_step1Id}`)
                    .expect(200)
                    .end(done);
            });
        });
    });
});