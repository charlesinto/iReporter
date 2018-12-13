import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import Helper from '../Helper';
import { createuser, user } from '../model/resources';

const { expect } = chai;
chai.use(chaiHttp);

describe('it should sign up a user', () => {
    beforeEach((done) => {
        const sql = `CREATE TABLE IF NOT EXISTS BASE_USER (userid SERIAL, firstname varchar(50) NOT NULL, lastname varchar(50) NOT NULL, 
        email varchar(100) NOT NULL, phonenumber varchar(25) NOT NULL, username varchar(50) NOT NULL, 
        hashpassword varchar(100) NOT NULL, profile_pic_path varchar(250),
         roleid INTEGER NOT NULL, rolename varchar(50) NOT NULL, datecreated timestamp NOT NULL)`;
        Helper.executeQuery(sql)
            .then(result => done())
            .catch(err => done());
    });
    afterEach((done) => {
        const sql = 'DROP TABLE IF EXISTS BASE_USER CASCADE';
        Helper.executeQuery(sql)
            .then(result => done())
            .catch(err => done());
    });
    it('response should be an object', (done) => {
        chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser)
            .end((err, res) => {
                expect(res).to.be.an('object');
                done();
            });
    });
    it('response to have property status', (done) => {
        chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser)
            .end((err, res) => {
                expect(res.body).to.have.property('status');
                done();
            });
    });

    it('response should have a status of 201', (done) => {
        chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser)
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });
    it('response to have property data', (done) => {
        chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser)
            .end((err, res) => {
                expect(res.body).to.have.property('data');
                done();
            });
    });
    it('data should be an array', (done) => {
        chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser)
            .end((err, res) => {
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
    it('data should have property token', (done) => {
        chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser)
            .end((err, res) => {
                expect(res.body.data[0]).to.have.property('token');
                done();
            });
    });
    it('data should have property user', (done) => {
        chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser)
            .end((err, res) => {
                expect(res.body.data[0]).to.have.property('user');
                done();
            });
    });
});
describe('it should login a user', () => {
    beforeEach((done) => {
        const sql = `CREATE TABLE IF NOT EXISTS BASE_USER (userid SERIAL, firstname varchar(50) NOT NULL, lastname varchar(50) NOT NULL, 
        email varchar(100) NOT NULL, phonenumber varchar(25) NOT NULL, username varchar(50) NOT NULL, 
        hashpassword varchar(100) NOT NULL, profile_pic_path varchar(250),
         roleid INTEGER NOT NULL, rolename varchar(50) NOT NULL, datecreated timestamp NOT NULL)`;
        Helper.executeQuery(sql)
            .then((result) => {
                const sql = `INSERT INTO BASE_USER(email,hashpassword,firstname,lastname,phonenumber,username,datecreated,roleid,rolename)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
                Helper.executeQuery(sql, ['onuorahchibuike@gmail.com', '$2b$10$m5Gq941CoJ/Bhvq56PKS..qP0dDre8V0mFLk8j9t94ysaMYNf6LAa', 'charles', 'onuorah', '08163113450', 'charlesinto', 'NOW()', 1, 'SUPER ADMINISTRATOR'])
                    .then(result => done())
                    .catch(error => done());
            })
            .catch(err => done());
    });
    afterEach((done) => {
        const sql = 'DROP TABLE IF EXISTS BASE_USER CASCADE';
        Helper.executeQuery(sql)
            .then(result => done())
            .catch(err => done());
    });
    it('response should be an object', (done) => {
        chai.request(app).post('/api/v1/auth/login').type('form').send(user)
            .end((err, res) => {
                expect(res).to.be.an('object');
                done();
            });
    });
    it('response to have property status', (done) => {
        chai.request(app).post('/api/v1/auth/login').type('form').send(user)
            .end((err, res) => {
                expect(res.body).to.have.property('status');
                done();
            });
    });

    it('response should have a status of 200', (done) => {
        chai.request(app).post('/api/v1/auth/login').type('form').send(user)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
    it('response to have property data', (done) => {
        chai.request(app).post('/api/v1/auth/login').type('form').send(user)
            .end((err, res) => {
                expect(res.body).to.have.property('data');
                done();
            });
    });
    it('data should be an array', (done) => {
        chai.request(app).post('/api/v1/auth/login').type('form').send(user)
            .end((err, res) => {
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
    it('data should have property token', (done) => {
        chai.request(app).post('/api/v1/auth/login').type('form').send(user)
            .end((err, res) => {
                expect(res.body.data[0]).to.have.property('token');
                done();
            });
    });
    it('data should have property user', (done) => {
        chai.request(app).post('/api/v1/auth/login').type('form').send(user)
            .end((err, res) => {
                expect(res.body.data[0]).to.have.property('user');
                done();
            });
    });
});
