import app from '../index'
import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import Helper from '../Helper';
import {newRecord, location, createuser, user, token} from '../model';
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);


describe('It should test all the end points', () => {
    describe('it should get all red flag records',() => {
        it('response should be an object', (done) => {
            chai.request(app).get('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .set('authorization', token).end((err,res) => {
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response to have property status', (done) => {
            chai.request(app).get('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .set('authorization', token).end((err,res) => {
                expect(res.body).to.have.property('status');
                done();
            })
        })
        it('response to have property data', (done) => {
            chai.request(app).get('/api/v1/red-flags').type('form').set('authorization', token).end((err,res) => {
                expect(res.body).to.have.property('data');
                done();
            })
        })
        it('response should have a status of 200',(done)=>{
            chai.request(app).get('/api/v1/red-flags').set('authorization', token).type('form')
            .set('content-type', 'application/json').end((err,res) => {
                
                expect(res).to.have.status(200);
                done();
            })
        })
       
        it('data should be an array', (done) => {
            chai.request(app).get('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .set('authorization', token).end((err,res) => {
                expect(res.body.data).to.be.an('array');
                done();
            })
        })
    })
    describe('it should get a red flag records',() => {
        it('response should be an object', (done) => {
            chai.request(app).get('/api/v1/red-flags/14').type('form').set('content-type', 'application/json')
            .end((err,res) => {
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response to have property status', (done) => {
            chai.request(app).get('/api/v1/red-flags/12').type('form').set('content-type', 'application/json')
            .end((err,res) => {
                expect(res.body).to.have.property('status');
                done();
            })
        })
        it('response to have property report', (done) => {
            chai.request(app).get('/api/v1/red-flags/12').type('form').end((err,res) => {
                expect(res.body).to.have.property('report');
                done();
            })
        })
        it('response should have a status of 200',(done)=>{
            chai.request(app).get('/api/v1/red-flags/12').type('form')
            .set('content-type', 'application/json').end((err,res) => {
                
                expect(res).to.have.status(200);
                done();
            })
        })
       
        it('report should be an array', (done) => {
            chai.request(app).get('/api/v1/red-flags/13').type('form')
            .set('content-type', 'application/json').end((err,res) => {
                expect(res.body.report).to.be.an('array');
                done();
            })
        })
    })
    describe('it should post red flag records',() => {
        it('response should be an object', (done) => {
            chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .send(newRecord).end((err,res) => {
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response to have property status', (done) => {
            chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .send(newRecord).end((err,res) => {
                expect(res.body).to.have.property('status');
                done();
            })
        })
        it('response to have property data', (done) => {
            chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .send(newRecord).end((err,res) => {
                expect(res.body).to.have.property('data');
                done();
            })
        })
        it('response should have a status of 201',(done)=>{
            chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .send(newRecord).end((err,res) => {
                
                expect(res).to.have.status(201);
                done();
            })
        })
       
        it('data should be an array', (done) => {
            chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .send(newRecord).end((err,res) => {
                expect(res.body.data).to.be.an('array');
                done();
            })
        })
        
    })
    describe('it should patch a red flag records',() => {
        it('response should be an object', (done) => {
            chai.request(app).patch('/api/v1/red-flags/13/location').type('form')
            .set('content-type', 'application/json').send(location).end((err,res) => {
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response to have property status', (done) => {
            chai.request(app).patch('/api/v1/red-flags/13/location').type('form')
            .set('content-type', 'application/json').send(location).end((err,res) => {
                expect(res.body).to.have.property('status');
                done();
            })
        })
        it('response to have property data', (done) => {
            chai.request(app).patch('/api/v1/red-flags/13/location').type('form').set('content-type', 'application/json')
            .send(location).end((err,res) => {
                expect(res.body).to.have.property('data');
                done();
            })
        })
        it('response should have a status of 201',(done)=>{
            chai.request(app).patch('/api/v1/red-flags/13/location').type('form').set('content-type', 'application/json')
            .send(location).end((err,res) => {
                
                expect(res).to.have.status(202);
                done();
            })
        })
       
        it('data should be an array', (done) => {
            chai.request(app).patch('/api/v1/red-flags/13/location').type('form').set('content-type', 'application/json')
            .send(location).end((err,res) => {
                expect(res.body.data).to.be.an('array');
                done();
            })
        })
        
    })
    describe('it should patch a red flag comment',() => {
        it('response should be an object', (done) => {
            chai.request(app).patch('/api/v1/red-flags/13/comment').type('form').set('content-type', 'application/json')
            .send(location).end((err,res) => {
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response to have property status', (done) => {
            chai.request(app).patch('/api/v1/red-flags/13/comment').type('form').set('content-type', 'application/json')
            .send(location).end((err,res) => {
                expect(res.body).to.have.property('status');
                done();
            })
        })
        it('response to have property data', (done) => {
            chai.request(app).patch('/api/v1/red-flags/13/comment').type('form').set('content-type', 'application/json')
            .send(location).end((err,res) => {
                expect(res.body).to.have.property('data');
                done();
            })
        })
        it('response should have a status of 201',(done)=>{
            chai.request(app).patch('/api/v1/red-flags/13/comment').type('form').set('content-type', 'application/json')
            .send(location).end((err,res) => {
                
                expect(res).to.have.status(202);
                done();
            })
        })
       
        it('data should be an array', (done) => {
            chai.request(app).patch('/api/v1/red-flags/13/comment').type('form').set('content-type', 'application/json')
            .send(location).end((err,res) => {
                expect(res.body.data).to.be.an('array');
                done();
            })
        })
        
    })
    describe('it should delete a red flag record',() => {
        it('response should be an object', (done) => {
            chai.request(app).delete('/api/v1/red-flags/12').type('form').set('content-type', 'application/json').end((err,res) => {
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response to have property status', (done) => {
            chai.request(app).delete('/api/v1/red-flags/13').type('form').set('content-type', 'application/json').end((err,res) => {
                expect(res.body).to.have.property('status');
                done();
            })
        })
        it('response to have property data', (done) => {
            chai.request(app).delete('/api/v1/red-flags/14').type('form').set('content-type', 'application/json').end((err,res) => {
                expect(res.body).to.have.property('data');
                done();
            })
        })
        it('response should have a status of 200',(done)=>{
            chai.request(app).delete('/api/v1/red-flags/15').type('form').set('content-type', 'application/json').end((err,res) => {
                
                expect(res).to.have.status(200);
                done();
            })
        })
       
        it('data should be an array', (done) => {
            chai.request(app).delete('/api/v1/red-flags/16').type('form').set('content-type', 'application/json').end((err,res) => {
                expect(res.body.data).to.be.an('array');
                done();
            })
        })
        
    })
    describe('it should sign up a user',() => {
        beforeEach( done => {
            let sql = `CREATE TABLE IF NOT EXISTS BASE_USER (userid SERIAL, firstname varchar(50) NOT NULL, lastname varchar(50) NOT NULL, 
            email varchar(100) NOT NULL, phonenumber varchar(25) NOT NULL, username varchar(50) NOT NULL, 
            hashpassword varchar(100) NOT NULL, profile_pic_path varchar(250),
             roleid INTEGER NOT NULL, rolename varchar(50) NOT NULL, datecreated timestamp NOT NULL)`
             Helper.executeQuery(sql)
             .then((result)=> done())
             .catch(err => done());
        })
        afterEach(done => {
            let sql = 'DROP TABLE IF EXISTS BASE_USER CASCADE';
            Helper.executeQuery(sql)
            .then((result) => done())
            .catch((err) => done());
        })
        it('response should be an object', (done) => {
            chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser).end((err,res) => {
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response to have property status', (done) => {
            chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser).end((err,res) => {
                expect(res.body).to.have.property('status');
                done();
            })
        })
        
        it('response should have a status of 201',(done)=>{
            chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser).end((err,res) => {
                
                expect(res).to.have.status(201);
                done();
            })
        })
        it('response to have property data', function(done){
            chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser).end((err,res)=> {
                expect(res.body).to.have.property('data');
                done();
            })
        })
        it('data should be an array', function(done){
            chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser).end((err,res)=> {
                expect(res.body.data).to.be.an('array');
                done();
            })
        })
        it('data should have property token', function(done){
            chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser).end((err,res)=> {
                expect(res.body.data[0]).to.have.property('token');
                done();
            })
        })
        it('data should have property user', function(done){
            chai.request(app).post('/api/v1/auth/signup').type('form').send(createuser).end((err,res)=> {
                expect(res.body.data[0]).to.have.property('user');
                done();
            })
        })
    })
    describe('it should login a user',() => {
        beforeEach( done => {
            let sql = `CREATE TABLE IF NOT EXISTS BASE_USER (userid SERIAL, firstname varchar(50) NOT NULL, lastname varchar(50) NOT NULL, 
            email varchar(100) NOT NULL, phonenumber varchar(25) NOT NULL, username varchar(50) NOT NULL, 
            hashpassword varchar(100) NOT NULL, profile_pic_path varchar(250),
             roleid INTEGER NOT NULL, rolename varchar(50) NOT NULL, datecreated timestamp NOT NULL)`
             Helper.executeQuery(sql)
             .then((result)=> {
                 let sql = `INSERT INTO BASE_USER(email,hashpassword,firstname,lastname,phonenumber,username,datecreated,roleid,rolename)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`
                 Helper.executeQuery(sql, ['onuorahchibuike@gmail.com','$2b$10$m5Gq941CoJ/Bhvq56PKS..qP0dDre8V0mFLk8j9t94ysaMYNf6LAa','charles','onuorah','08163113450','charlesinto', 'NOW()', 1, 'SUPER ADMINISTRATOR'])
                 .then((result) => done())
                 .catch((error) =>  done());
                })
             .catch(err => done());
        })
        afterEach(done => {
            let sql = 'DROP TABLE IF EXISTS BASE_USER CASCADE';
            Helper.executeQuery(sql)
            .then((result) => done())
            .catch((err) => done());
        })
        it('response should be an object', (done) => {
            chai.request(app).post('/api/v1/auth/login').type('form').send(user).end((err,res) => {
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response to have property status', (done) => {
            chai.request(app).post('/api/v1/auth/login').type('form').send(user).end((err,res) => {
                expect(res.body).to.have.property('status');
                done();
            })
        })
        
        it('response should have a status of 200',(done)=>{
            chai.request(app).post('/api/v1/auth/login').type('form').send(user).end((err,res) => {
                
                expect(res).to.have.status(200);
                done();
            })
        })
        it('response to have property data', function(done){
            chai.request(app).post('/api/v1/auth/login').type('form').send(user).end((err,res)=> {
                expect(res.body).to.have.property('data');
                done();
            })
        })
        it('data should be an array', function(done){
            chai.request(app).post('/api/v1/auth/login').type('form').send(user).end((err,res)=> {
                expect(res.body.data).to.be.an('array');
                done();
            })
        })
        it('data should have property token', function(done){
            chai.request(app).post('/api/v1/auth/login').type('form').send(user).end((err,res)=> {
                expect(res.body.data[0]).to.have.property('token');
                done();
            })
        })
        it('data should have property user', function(done){
            chai.request(app).post('/api/v1/auth/login').type('form').send(user).end((err,res)=> {
                expect(res.body.data[0]).to.have.property('user');
                done();
            })
        })
    })
})