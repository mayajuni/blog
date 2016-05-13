/**
 * Created by mayaj on 2016-05-02.
 */
const request = require('supertest');
require('should');

import * as app from "../server-node";

const server: any = request.agent('http://localhost:3000');
/*const server: any = request.agent(app);*/
const logout = done => server.get('/api/login/logout').end(done);
const login = done => server.post('/api/login').send({userId: 'test', password: 'test'}).end(done);


const url = '/api/file/';

describe('file', () => {
    describe('테스트', () => {
        let fileInfo:any;
        before(login);
        it(`파일 업로드 post ${url}`, done => {
            server
                .post(url)
                .attach('file', 'test/file/test.jpg')
                .expect(200)
                .expect("Content-type", /json/)
                .end((err, res) => {
                    if(err) throw err;
                    res.body.should.be.a.Object();
                    res.body.should.have.property('_id');
                    res.body.should.have.property('userId');
                    res.body.should.have.property('originalname');
                    res.body.should.have.property('filename');
                    res.body.should.have.property('path');
                    res.body.should.have.property('destination');
                    res.body.should.have.property('size');
                    res.body.should.have.property('mimetype');
                    res.body.should.have.property('needDelete');
                    fileInfo = res.body;
                    done();
                });
        });
        it(`파일 삭제 delete ${url}`, done => {
            server
                .delete(`${url + fileInfo._id}`)
                .expect(200)
                .end(done);
        });

        after(logout);
    });
    describe('오류 테스트', () => {
        describe('로그인전', () => {
            before(logout);
            it(`파일 업로드 오류(로그인 필수)`, done => {
                server
                    .post(url)
                    .expect(401)
                    .end((err, res) => {
                        if(err) throw err;

                        res.should.have.property('error');
                        res.error.text.should.equal('need_login');
                        done();
                    });
            });
            it(`북마크 수정 오류(로그인 필수)`, done => {
                server
                    .delete(`${url}123123123`)
                    .expect(401)
                    .end((err, res) => {
                        if(err) throw err;
                        res.should.have.property('error');
                        res.error.text.should.equal('need_login');
                        done();
                    });
            });
        });
        describe('로그인후', () => {
            before(login);
            it(`파일 업로드 오류(파일 필수)`, done => {
                server
                    .post(url)
                    .expect(400)
                    .end((err, res) => {
                        if(err) throw err;

                        res.should.have.property('error');
                        res.error.text.should.equal('not_file');
                        done();
                    });
            });
            it(`파일 업로드 없는 파일 삭제`, done => {
                server
                    .delete(`${url}573579a433825ab029057671`)
                    .expect(400)
                    .end((err, res) => {
                        if(err) throw err;
                        res.should.have.property('error');
                        res.error.text.should.equal('not_have');
                        done();
                    });
            });
            after(logout);
        });
    });
});
