/**
 * Created by mayaj on 2016-05-01.
 */
const request = require('supertest');
require('should');

import * as app from "../server-node";

const server: any = request.agent('http://localhost:3000');
/*const server: any = request.agent(app);*/

const url = '/api/board';
const logout = (done) => server.get('/api/login/logout').end(done);
const login = (done) => server.post('/api/login').send({userId: 'test', password: 'test'}).end(done);

let another: any;
// 게시판 가지고 오기
const checkGet = (done) => {
    server.get(url)
        .expect("Content-type",/json/)
        .expect(200)
        .end((err, res) => {
            if(err) throw err;
            res.error.should.equal(false);
            res.body.should.be.a.Object();
            res.body.should.have.property('items');
            res.body.should.have.property('nowPage');
            res.body.should.have.property('totalCount');
            done();
        })
};

// 게시판 title 조건으로 가져오기 GET ${url}
const checkSearchGet = (done) => {
    const title = another.title.substr(0,3);
    const _menuId = another._menuId;
    server.get(url)
        .query({title: title, _menuId: _menuId})
        .expect(200)
        .end((err, res) => {
            if(err) throw err;

            res.error.should.equal(false);
            res.body.should.have.property('items');
            res.body.should.have.property('nowPage');
            res.body.should.have.property('totalCount');
            /* 데이터 검증 */
            if(res.body.items) {
                for(const board of res.body.items) {
                    board.should.be.a.instanceof(Object);

                    if(_menuId) {
                        if(_menuId != board._menuId) {
                            return done(new Error('_menuId 데이터 검증에 실패하였습니다.'));
                        }
                    }

                    if(title) {
                        if(!board.title.includes(title)) {
                            return done(new Error('title 데이터 검증에 실패하였습니다.'));
                        }
                    }
                }
            }

            done();
        })
};

describe('board', () => {
    /* 테스트 데이터 넣기 아이디 값이 다른 값으로 들어간다. */
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
            it(`게시판 데이터 가져오기 GET ${url}`, checkGet);
            it(`게시판 검색 조건으로 가져오기 GET ${url}`, checkSearchGet);
        });

        describe('로그인후', () => {
            let _id: string;
            const _menuId = '5726f8266a7a32bc143c6c8f';
            before(login);
            it(`게시판 데이터 가져오기 GET ${url}`, checkGet);
            it(`게시판 검색 조건으로 가져오기 GET ${url}`, checkSearchGet);
            it(`게시판 저장 POST ${url}`, (done) => {
                server
                    .post(url)
                    .send({title: '테스트', content: '테스트입니다.', _menuId: _menuId, tags: ['test1', 'test2', 'test3'], files: []})
                    .expect(200)
                    .expect("Content-type",/json/)
                    .end((err, res) => {
                        if(err) throw err;
                        res.body.should.be.a.Object();
                        res.body.should.have.property('title');
                        res.body.should.have.property('regDt');
                        res.body.should.have.property('tags');
                        res.body.should.have.property('_id');
                        res.body.should.have.property('content');
                        res.body.should.have.property('_menuId');
                        res.body.should.have.property('files');
                        _id = res.body._id;
                        done();
                    });
            });
            it(`게시판 수정 PUT ${url}`, (done) => {
                server
                    .put(url)
                    .send({_id: _id, title: '테스트 변경처리', content: '변경처리', _menuId: _menuId, tags: ['test1'], files: []})
                    .expect(200)
                    .end(done);
            });
            it(`게시판 삭제 DELETE ${url}/:_id`, (done) => {
                server
                    .delete(`${url}/${_id}`)
                    .expect(200)
                    .end(done);
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