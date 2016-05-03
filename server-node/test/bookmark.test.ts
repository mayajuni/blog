/**
 * Created by mayaj on 2016-04-28.
 */
import * as request from 'supertest';
require('should');

import * as app from "../server-node";

const server: any = request.agent('http://localhost:3000');
/*const server: any = request.agent(app);*/

const url = '/api/bookmark';
const logout = (done) => server.get('/api/login/logout').end(done);
const login = (done) => server.post('/api/login').send({userId: 'test', password: 'test'}).end(done);
let another: any;

// 북마크 데이터 가져오기 GET
const checkGet = (done) => {
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
};
// 북마크 tag 검색 조건으로 가져오기 GET ${url}
const checkSearchTagGet = (done) => {
    const tags = another.tags;
    server.get(url)
        .query({tags: tags})
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
                        for(const param of tags) {
                            if(tag == param) {
                                isOk=true;
                                break;
                            }
                        }
                        if(isOk) {
                            break
                        }
                    }
                    if(!isOk) {
                        return done(new Error('Tag 데이터 검증에 실패하였습니다.'));
                    }
                }
            }

            done();
        })
};

describe('bookmark', () => {
    /* 테스트 데이터 넣기 */
    before((done) => {
        server.post(`${url}/test`)
            .expect(200)
            .expect("Content-type",/json/)
            .end((err, res) => {
                if(err) {
                    throw err;
                }

                another = res.body;
                done();
            });
    });
    
    describe('테스트', () => {
        describe('로그인전', () => {
            it(`북마크 데이터 가져오기 GET ${url}`, checkGet);
            it(`북마크 tag 검색 조건으로 가져오기 GET ${url}`, checkSearchTagGet);
        });
        describe('로그인후', () => {
            let _id: string = '';
            before(login);

            it(`북마크 데이터 가져오기 GET ${url}`, checkGet);
            it(`북마크 tag 검색 조건으로 가져오기 GET ${url}`, checkSearchTagGet);
            it(`북마크 url 정보 가져오기 ${url}/getUrlInfo/:url`, (done) => {
                const paramUrl = encodeURIComponent('www.naver.com');
                server
                    .get(`${url}/getUrlInfo/${paramUrl}`)
                    .expect(200)
                    .expect("Content-type",/json/)
                    .end((err, res) => {
                        if(err) throw err;

                        res.error.should.equal(false);
                        res.body.should.be.a.Object();
                        res.body.should.have.property('title');
                        res.body.should.have.property('og:title');
                        res.body.should.have.property('og:description');
                        res.body.should.have.property('og:image');

                        done();
                    })
            });
            it(`북마크 저장 POST ${url}`, (done) => {
                server
                    .post(url)
                    .send({title: '테스트', memo: '테스트입니다.', tags: ['test1', 'test2', 'test3'], url: 'naver.com', imgUrl: 'http://static.naver.net/www/mobile/edit/2016/0407/mobile_17004159045.png'})
                    .expect(200)
                    .expect("Content-type",/json/)
                    .end((err, res) => {
                        if(err) throw err;
                        res.body.should.be.a.Object();
                        res.body.should.have.property('title');
                        res.body.should.have.property('regDt');
                        res.body.should.have.property('tags');
                        res.body.should.have.property('_id');
                        res.body.should.have.property('url');
                        _id = res.body._id;
                        done();
                    });
            });
            it(`북마크 수정 PUT ${url}`, (done) => {
                server
                    .put(url)
                    .send({_id: _id, title: '테스트 변경처리', memo: '변경 테스트입니다.', tags: ['test1'], url: 'http://fdjskbn.com'})
                    .expect(200)
                    .end(done);
            });
            it(`북마크 삭제 DELETE ${url}/:_id`, (done) => {
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
            it(`북마크 저장 오류(로그인 필수)`, (done) => {
                server
                    .post(url)
                    .send({title: '테스트', memo: '테스트입니다.', tags: ['test1', 'test2', 'test3'], url: 'naver.com', imgUrl: 'http://static.naver.net/www/mobile/edit/2016/0407/mobile_17004159045.png'})
                    .expect(401)
                    .end((err, res) => {
                        if(err) throw err;

                        res.should.have.property('error');
                        res.error.text.should.equal('need_login');
                        done();
                    });
            });
            it(`북마크 수정 오류(로그인 필수)`, (done) => {
                server
                    .put(url)
                    .send({title: '테스트 변경처리', memo: '변경 테스트입니다.', tags: ['test1'], url: 'http://fdjskbn.com'})
                    .expect(401)
                    .end((err, res) => {
                        if(err) throw err;

                        res.should.have.property('error');
                        res.error.text.should.equal('need_login');
                        done();
                    });
            });
            it(`북마크 삭제 오류(로그인 필수)`, (done) => {
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

            describe('북마크 저장 필수값 체크', () => {
                const params: any = {
                    title: '테스트',
                    tags: ['test1', 'test2', 'test3'],
                    url: 'naver.com'
                };

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
            describe('북마크 수정 필수값 체크', () => {
                const params: any = {
                    _id: '테스트',
                    title: '테스트',
                    tags: ['test1', 'test2', 'test3'],
                    url: 'naver.com'
                };

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
            it('북마크 삭제 필수값 체크', (done) => {
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

            it(`북마크 남의것 수정 오류`, (done) => {
                server
                    .put(url)
                    .send({_id: another._id, title: '테스트 변경처리', memo: '변경 테스트입니다.', tags: ['test1'], url: 'http://fdjskbn.com'})
                    .expect(400)
                    .end((err, res) => {
                        if (err) throw err;

                        res.should.have.property('error');
                        res.error.text.should.equal('no_authority');
                        done();
                    });
            });
            it(`북마크 남의것 삭제 오류`, (done) => {
                server
                    .delete(`${url}/${another._id}`)
                    .expect(400)
                    .end((err, res) => {
                        if (err) throw err;

                        res.should.have.property('error');
                        res.error.text.should.equal('no_authority');
                        done();
                    });
            });
        });
    });

    /* 테스트 데이터 삭제 */
    after((done) => {
        server.delete(`${url}/test`)
            .expect(200)
            .end(done);
    });
});