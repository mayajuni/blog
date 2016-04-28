/**
 * Created by mayaj on 2016-04-28.
 */
import * as request from 'supertest';
require('should');

import * as app from "../server-node";

const server: any = request('http://localhost:3000');
/*const server: any = request(app);*/

const url = '/api/bookmark';
const logout = (done) => server.get('/api/login/logout').end(done);
const login = (done) => server.post('/api/login').send({userId: 'test', password: 'test'}).end(done);

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
};

describe('bookmark', () => {
    describe('테스트', () => {
        describe('로그인전', () => {
            it(`북마크 데이터 가져오기 GET ${url}`, checkGet);
            it(`북마크 tag 검색 조건으로 가져오기 GET ${url}`, checkSearchTagGet);
        });
        describe('로그인후', () => {
            beforeEach(login);

            it(`북마크 데이터 가져오기 GET ${url}`, checkGet);
            it(`북마크 tag 검색 조건으로 가져오기 GET ${url}`, checkSearchTagGet);
            it(`북마크 url 정보 가져오기 ${url}/getUrlInfo/:url`, (done) => {
                const paramUrl = 'www.naver.com';
                server
                    .get(`${url}/getUrlInfo/${paramUrl}`)
                    .expect(200)
                    .expect("Content-type",/json/)
                    .end((err, res) => {
                        if(err) throw err;

                        res.status.should.equal(200);
                        res.error.should.equal(false);
                        res.body.should.be.a.Array();
                        res.body.should.have.property('title');
                        res.body.should.have.property('og:title');
                        res.body.should.have.property('og:description');
                        res.body.should.not.have.property('og:image');

                        done();
                    })
            });
            it(`북마크 저장 POST ${url}`);
            it(`북마크 수정 PUT ${url}`);
            it(`북마크 삭제 DELETE ${url}`);
        });
    });
    describe('오류테스트', () => {
        describe('로그인전', () => {
            beforeEach(logout);
            it(`북마크 저장 오류(로그인 필수)`);
            it(`북마크 수정 오류(로그인 필수)`);
            it(`북마크 삭제 오류(로그인 필수)`);
        });

        describe('로그인후', () => {
            beforeEach(login);

        });
    });
});