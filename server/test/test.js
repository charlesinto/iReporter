import app from '../index'
import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

const newRecord = {
    "createdOn":"23rd Dec, 2018",
    "createdBy":342,
    "type":"red-flag",
    "location":"",
    "status":"draft",
    "Images": [],
    "Videos":[],
    "comment":"london bridge is falling"
}

describe('It should test all the end points', () => {
    describe('it should get all red flag records',() => {
        it('response should be an object', function(done){
            chai.request(app).get('/api/v1/red-flags').type('form').set('content-type', 'application/json').end(function(err,res){
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response to have property status', function(done){
            chai.request(app).get('/api/v1/red-flags').type('form').set('content-type', 'application/json').end(function(err,res){
                expect(res.body).to.have.property('status');
                done();
            })
        })
        it('response to have property data', function(done){
            chai.request(app).get('/api/v1/red-flags').type('form').end(function(err,res){
                expect(res.body).to.have.property('data');
                done();
            })
        })
        it('response should have a status of 200',(done)=>{
            chai.request(app).get('/api/v1/red-flags').type('form').set('content-type', 'application/json').end(function(err,res){
                
                expect(res).to.have.status(200);
                done();
            })
        })
       
        it('data should be an array', function(done){
            chai.request(app).get('/api/v1/red-flags').type('form').set('content-type', 'application/json').end(function(err,res){
                expect(res.body.data).to.be.an('array');
                done();
            })
        })
    })
    describe('it should get all red flag records',() => {
        it('response should be an object', function(done){
            chai.request(app).get('/api/v1/red-flags/14').type('form').set('content-type', 'application/json').end(function(err,res){
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response to have property status', function(done){
            chai.request(app).get('/api/v1/red-flags/12').type('form').set('content-type', 'application/json').end(function(err,res){
                expect(res.body).to.have.property('status');
                done();
            })
        })
        it('response to have property data', function(done){
            chai.request(app).get('/api/v1/red-flags/12').type('form').end(function(err,res){
                expect(res.body).to.have.property('data');
                done();
            })
        })
        it('response should have a status of 200',(done)=>{
            chai.request(app).get('/api/v1/red-flags/12').type('form').set('content-type', 'application/json').end(function(err,res){
                
                expect(res).to.have.status(200);
                done();
            })
        })
       
        it('data should be an array', function(done){
            chai.request(app).get('/api/v1/red-flags/13').type('form').set('content-type', 'application/json').end(function(err,res){
                expect(res.body.data).to.be.an('array');
                done();
            })
        })
    })
    describe('it should post red flag records',() => {
        it('response should be an object', function(done){
            chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json').send(newRecord).end(function(err,res){
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response to have property status', function(done){
            chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json').send(newRecord).end(function(err,res){
                expect(res.body).to.have.property('status');
                done();
            })
        })
        it('response to have property data', function(done){
            chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json').send(newRecord).end(function(err,res){
                expect(res.body).to.have.property('data');
                done();
            })
        })
        it('response should have a status of 201',(done)=>{
            chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json').send(newRecord).end(function(err,res){
                
                expect(res).to.have.status(201);
                done();
            })
        })
       
        it('data should be an array', function(done){
            chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json').send(newRecord).end(function(err,res){
                expect(res.body.data).to.be.an('array');
                done();
            })
        })
        
    })
})