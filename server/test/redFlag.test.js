
import chai from 'chai';
import chaiHttp from 'chai-http';
import Helper from '../Helper';
import app from '../index';
import {
    newRecord, location, token, update,
} from '../model/resources';

const { expect } = chai;
chai.use(chaiHttp);

describe('it should get all red flag records', () => {
    beforeEach((done) => {
        const sql = `CREATE TABLE IF NOT EXISTS BASE_REPORT(
            ID SERIAL, recordid INTEGER NOT NULL, comment VARCHAR(250), createdby INTEGER NOT NULL,status VARCHAR(25), location VARCHAR(125),
            reportcategoryid INTEGER NOT NULL,type VARCHAR(50), createdon timestamp 
        );`;
        Helper.executeQuery(sql)
            .then((result) => {
                const sql = `INSERT INTO BASE_REPORT(recordid,comment,createdby,status, location, reportcategoryid,type, createdon)
            values (3400, 'heloo',1, 'IN DRAFT', '',1,'red-flag', now()),
            (3401, 'heloo',1, 'IN DRAFT', '',1,'red-flag', now()),
            (3402, 'heloo',2, 'UNDER INVESTIGATIION', '',1,'red-flag', now());`;
                Helper.executeQuery(sql)
                    .then((result) => {
                        const sql = `CREATE TABLE IF NOT EXISTS BASE_ATTACHMENT (attachmentid SERIAL, recordid INTEGER NOT NULL,videotitle VARCHAR(50), 
                videopath VARCHAR(255),imagetitle  VARCHAR(50), imagepath VARCHAR(255), datecreated timestamp);`;
                        Helper.executeQuery(sql)
                            .then((result) => {
                                const sql = `INSERT INTO BASE_ATTACHMENT(recordid, videotitle,videopath,imagetitle,imagepath, datecreated)
                    VALUES (3400, 'heloo','','heAVE','', NOW()),
                    (3400, 'heloo-1','','heAVE1','', NOW()),
                    (3401, 'hi','','hi','', NOW());`;
                                Helper.executeQuery(sql)
                                    .then(result => done())
                                    .catch((err) => { console.log(err); done(); });
                            })
                            .catch((err) => { console.log(err); done(); });
                    })
                    .catch((err) => { console.log(err); done(); });
            })
            .catch((err) => { console.log(err); done(); });
    });
    afterEach((done) => {
        const sql = 'DROP TABLE IF EXITS BASE_REPORT CASCADE';
        Helper.executeQuery(sql)
            .then((result) => {
                const sql = 'DROP TABLE IF EXISTS BASE_ATTACHMENT CASCADE';
                Helper.executeQuery(sql)
                    .then(result => done())
                    .catch(error => done());
            })
            .catch(error => done());
    });
    it('response should be an object', (done) => {
        chai.request(app).get('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .end((err, res) => {
                expect(res).to.be.an('object');
                done();
            });
    });
    it('response to have property status', (done) => {
        chai.request(app).get('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .end((err, res) => {
                expect(res.body).to.have.property('status');
                done();
            });
    });
    it('response to have property data', (done) => {
        chai.request(app).get('/api/v1/red-flags').type('form').set('authorization', token)
            .end((err, res) => {
                expect(res.body).to.have.property('data');
                done();
            });
    });
    it('response should have a status of 200', (done) => {
        chai.request(app).get('/api/v1/red-flags').set('authorization', token).type('form')
            .set('content-type', 'application/json')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('data should be an array', (done) => {
        chai.request(app).get('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .end((err, res) => {
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
});
describe('it should get a red flag records', () => {
    beforeEach((done) => {
        const sql = `CREATE TABLE IF NOT EXISTS BASE_REPORT(
            ID SERIAL, recordid INTEGER NOT NULL, comment VARCHAR(250), createdby INTEGER NOT NULL,status VARCHAR(25), location VARCHAR(125),
            reportcategoryid INTEGER NOT NULL,type VARCHAR(50), createdon timestamp 
        );`;
        Helper.executeQuery(sql)
            .then((result) => {
                const sql = `INSERT INTO BASE_REPORT(recordid,comment,createdby,status, location, reportcategoryid,type, createdon)
            values (3400, 'heloo',1, 'IN DRAFT', '',1,'red-flag', now()),
            (3401, 'heloo',1, 'IN DRAFT', '',1,'red-flag', now()),
            (3402, 'heloo',2, 'UNDER INVESTIGATIION', '',1,'red-flag', now());`;
                Helper.executeQuery(sql)
                    .then((result) => {
                        const sql = `CREATE TABLE IF NOT EXISTS BASE_ATTACHMENT(attachmentid SERIAL, recordid INTEGER NOT NULL,videotitle VARCHAR(50), 
                videopath VARCHAR(255),imagetitle  VARCHAR(50), imagepath VARCHAR(255), datecreated timestamp);`;
                        Helper.executeQuery(sql)
                            .then((result) => {
                                const sql = `INSERT INTO BASE_ATTACHMENT(recordid, videotitle,videopath,imagetitle,imagepath, datecreated)
                    VALUES (3400, 'heloo','','heAVE','', NOW()),
                    (3400, 'heloo-1','','heAVE1','', NOW()),
                    (3401, 'hi','','hi','', NOW());`;
                                Helper.executeQuery(sql)
                                    .then(result => done());
                            });
                    });
            })
            .catch(err => done());
    });
    afterEach((done) => {
        const sql = 'DROP TABLE IF EXITS BASE_REPORT CASCADE;';
        Helper.executeQuery(sql)
            .then((result) => {
                const sql = 'DROP TABLE IF EXISTS BASE_ATTACHMENT CASCADE;';
                Helper.executeQuery(sql)
                    .then(result => done())
                    .catch(error => done());
            })
            .catch(error => done());
    });
    it('response should be an object', (done) => {
        chai.request(app).get('/api/v1/red-flags/3400').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .end((err, res) => {
                expect(res).to.be.an('object');
                done();
            });
    });
    it('response to have property status', (done) => {
        chai.request(app).get('/api/v1/red-flags/3400').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .end((err, res) => {
                expect(res.body).to.have.property('status');
                done();
            });
    });
    it('response to have property data', (done) => {
        chai.request(app).get('/api/v1/red-flags/3402').type('form').set('authorization', token)
            .end((err, res) => {
                expect(res.body).to.have.property('data');
                done();
            });
    });
    it('response should have a status of 200', (done) => {
        chai.request(app).get('/api/v1/red-flags/3401').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('data should be an array', (done) => {
        chai.request(app).get('/api/v1/red-flags/3400').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .end((err, res) => {
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
});
describe('it should post red flag records', () => {
    beforeEach((done) => {
        const sql = `CREATE TABLE IF NOT EXISTS BASE_REPORT(
            ID SERIAL, recordid INTEGER NOT NULL, comment VARCHAR(250), createdby INTEGER NOT NULL,status VARCHAR(25), location VARCHAR(125),
            reportcategoryid INTEGER NOT NULL,type VARCHAR(50), createdon timestamp 
        );`;
        Helper.executeQuery(sql)
            .then((result) => {
                const sql = `CREATE TABLE IF NOT EXISTS BASE_ATTACHMENT (attachmentid SERIAL, recordid INTEGER NOT NULL,videotitle VARCHAR(50), 
            videopath VARCHAR(255),imagetitle  VARCHAR(50), imagepath VARCHAR(255), datecreated timestamp);`;
                Helper.executeQuery(sql)
                    .then((result) => {
                        done();
                    })
                    .catch((err) => { console.log(err); done(); });
            })
            .catch((err) => { console.log(err); done(); });
    });
    afterEach((done) => {
        const sql = 'DROP TABLE IF EXITS BASE_REPORT CASCADE';
        Helper.executeQuery(sql)
            .then((result) => {
                const sql = 'DROP TABLE IF EXISTS BASE_ATTACHMENT CASCADE';
                Helper.executeQuery(sql)
                    .then(result => done())
                    .catch(error => done());
            })
            .catch(error => done());
    });
    it('response should be an object', (done) => {
        chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .send(newRecord)
            .end((err, res) => {
                expect(res).to.be.an('object');
                done();
            });
    });
    it('response to have property status', (done) => {
        chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .send(newRecord)
            .end((err, res) => {
                expect(res.body).to.have.property('status');
                done();
            });
    });
    it('response to have property data', (done) => {
        chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .send(newRecord)
            .end((err, res) => {
                expect(res.body).to.have.property('data');
                done();
            });
    });
    it('response should have a status of 201', (done) => {
        chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .send(newRecord)
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('data should be an array', (done) => {
        chai.request(app).post('/api/v1/red-flags').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .send(newRecord)
            .end((err, res) => {
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
});
describe('it should patch a red flag records', () => {
    beforeEach((done) => {
        const sql = 'DROP TABLE IF EXISTS BASE_REPORT CASCADE;';
        Helper.executeQuery(sql)
            .then((result) => {
                const sql = `CREATE TABLE IF NOT EXISTS BASE_REPORT(
                ID SERIAL, recordid INTEGER NOT NULL, comment VARCHAR(250), createdby INTEGER NOT NULL,status VARCHAR(25), location VARCHAR(125),
                reportcategoryid INTEGER NOT NULL,type VARCHAR(50), createdon timestamp 
            );`;
                Helper.executeQuery(sql)
                    .then((result) => {
                        const sql = `INSERT INTO BASE_REPORT(recordid,comment,createdby,status, location, reportcategoryid,type, createdon)
                values (3401, 'heloo',1, 'IN DRAFT', '',1,'red-flag', now())`;
                        Helper.executeQuery(sql)
                            .then(result => done())
                            .catch((err) => { console.log('eroor', err); done(); });
                    })
                    .catch((err) => { console.log('error-1', err); done(); });
            })
            .catch(error => done());
    });
    afterEach((done) => {
        const sql = 'DROP TABLE IF EXISTS BASE_REPORT CASCADE;';
        Helper.executeQuery(sql)
            .then(result => done())
            .catch(error => done());
    });
    it('response should be an object', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/location').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .send(location)
            .end((err, res) => {
                expect(res).to.be.an('object');
                done();
            });
    });
    it('response to have property status', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/location').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .send(location)
            .end((err, res) => {
                expect(res.body).to.have.property('status');
                done();
            });
    });
    it('response to have property data', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/location').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .send(location)
            .end((err, res) => {
                expect(res.body).to.have.property('data');
                done();
            });
    });
    it('response should have a status of 201', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/location').type('form').set('authorization', token)
            .set('content-type', 'application/json')
            .send(location)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('data should be an array', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/location').type('form').set('authorization', token)
            .set('content-type', 'application/json')
            .send(location)
            .end((err, res) => {
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
});
describe('it should patch a red flag comment', () => {
    beforeEach((done) => {
        const sql = 'DROP TABLE IF EXISTS BASE_REPORT CASCADE;';
        Helper.executeQuery(sql)
            .then((result) => {
                const sql = `CREATE TABLE IF NOT EXISTS BASE_REPORT(
                ID SERIAL, recordid INTEGER NOT NULL, comment VARCHAR(250), createdby INTEGER NOT NULL,status VARCHAR(25), location VARCHAR(125),
                reportcategoryid INTEGER NOT NULL,type VARCHAR(50), createdon timestamp 
            );`;
                Helper.executeQuery(sql)
                    .then((result) => {
                        const sql = `INSERT INTO BASE_REPORT(recordid,comment,createdby,status, location, reportcategoryid,type, createdon)
                values (3401, 'heloo',1, 'IN DRAFT', '',1,'red-flag', now())`;
                        Helper.executeQuery(sql)
                            .then(result => done())
                            .catch((err) => { console.log('eroor', err); done(); });
                    })
                    .catch((err) => { console.log('error-1', err); done(); });
            })
            .catch(error => done());
    });
    afterEach((done) => {
        const sql = 'DROP TABLE IF EXISTS BASE_REPORT CASCADE;';
        Helper.executeQuery(sql)
            .then(result => done())
            .catch(error => done());
    });
    it('response should be an object', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/comment').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .send(location)
            .end((err, res) => {
                expect(res).to.be.an('object');
                done();
            });
    });
    it('response to have property status', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/comment').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .send(location)
            .end((err, res) => {
                expect(res.body).to.have.property('status');
                done();
            });
    });
    it('response to have property data', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/comment').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .send(location)
            .end((err, res) => {
                expect(res.body).to.have.property('data');
                done();
            });
    });
    it('response should have a status of 200', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/comment').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .send(location)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('data should be an array', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/comment').type('form').set('content-type', 'application/json')
            .set('authorization', token)
            .send(location)
            .end((err, res) => {
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
});
describe('it should delete a red flag record', () => {
    beforeEach((done) => {
        const sql = 'DROP TABLE IF EXISTS BASE_REPORT CASCADE;';
        Helper.executeQuery(sql)
            .then((result) => {
                const sql = `CREATE TABLE IF NOT EXISTS BASE_REPORT(
                ID SERIAL, recordid INTEGER NOT NULL, comment VARCHAR(250), createdby INTEGER NOT NULL,status VARCHAR(25), location VARCHAR(125),
                reportcategoryid INTEGER NOT NULL,type VARCHAR(50), createdon timestamp 
            );`;
                Helper.executeQuery(sql)
                    .then((result) => {
                        const sql = `INSERT INTO BASE_REPORT(recordid,comment,createdby,status, location, reportcategoryid,type, createdon)
                values (3401, 'heloo',1, 'IN DRAFT', '',1,'red-flag', now())`;
                        Helper.executeQuery(sql)
                            .then(result => done())
                            .catch((err) => { console.log('eroor', err); done(); });
                    })
                    .catch((err) => { console.log('error-1', err); done(); });
            })
            .catch(error => done());
    });
    afterEach((done) => {
        const sql = 'DROP TABLE IF EXISTS BASE_REPORT CASCADE;';
        Helper.executeQuery(sql)
            .then(result => done())
            .catch(error => done());
    });
    it('response should be an object', (done) => {
        chai.request(app).delete('/api/v1/red-flags/3401').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .end((err, res) => {
                expect(res).to.be.an('object');
                done();
            });
    });
    it('response to have property status', (done) => {
        chai.request(app).delete('/api/v1/red-flags/3401').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .end((err, res) => {
                expect(res.body).to.have.property('status');
                done();
            });
    });
    it('response to have property data', (done) => {
        chai.request(app).delete('/api/v1/red-flags/3401').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .end((err, res) => {
                expect(res.body).to.have.property('data');
                done();
            });
    });
    it('response should have a status of 200', (done) => {
        chai.request(app).delete('/api/v1/red-flags/3401').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('data should be an array', (done) => {
        chai.request(app).delete('/api/v1/red-flags/3401').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .end((err, res) => {
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
});

describe('it should update red-flag status', () => {
    beforeEach((done) => {
        const sql = 'DROP TABLE IF EXISTS BASE_REPORT CASCADE;';
        Helper.executeQuery(sql)
            .then((result) => {
                const sql = `CREATE TABLE IF NOT EXISTS BASE_REPORT(
                ID SERIAL, recordid INTEGER NOT NULL, comment VARCHAR(250), createdby INTEGER NOT NULL,status VARCHAR(25), location VARCHAR(125),
                reportcategoryid INTEGER NOT NULL,type VARCHAR(50), createdon timestamp 
            );`;
                Helper.executeQuery(sql)
                    .then((result) => {
                        const sql = `INSERT INTO BASE_REPORT(recordid,comment,createdby,status, location, reportcategoryid,type, createdon)
                values (3401, 'heloo',1, 'IN DRAFT', '',1,'red-flag', now())`;
                        Helper.executeQuery(sql)
                            .then(result => done())
                            .catch((err) => { console.log('eroor', err); done(); });
                    })
                    .catch((err) => { console.log('error-1', err); done(); });
            })
            .catch(error => done());
    });
    afterEach((done) => {
        const sql = 'DROP TABLE IF EXISTS BASE_REPORT CASCADE;';
        Helper.executeQuery(sql)
            .then(result => done())
            .catch(error => done());
    });
    it('response should be an object', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/status').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .send(update)
            .end((err, res) => {
                expect(res).to.be.an('object');
                done();
            });
    });
    it('response to have property status', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/status').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .send(update)
            .end((err, res) => {
                expect(res.body).to.have.property('status');
                done();
            });
    });
    it('response to have property data', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/status').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .send(update)
            .end((err, res) => {
                expect(res.body).to.have.property('data');
                done();
            });
    });
    it('response should have a status of 200', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/status').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .send(update)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('data should be an array', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/status').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .send(update)
            .end((err, res) => {
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
    it('data should be hve property status', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/status').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .send(update)
            .end((err, res) => {
                expect(res.body.data[0]).to.have.property('id');
                done();
            });
    });
    it('data should be hve property message', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/status').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .send(update)
            .end((err, res) => {
                expect(res.body.data[0]).to.have.property('message');
                done();
            });
    });
    it('message should be Updated Intervention status', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/status').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .send(update)
            .end((err, res) => {
                expect(res.body.data[0].message).to.equal('Updated Red Flag record status');
                done();
            });
    });
    it('data[0].id to equal 3401', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/status').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .send(update)
            .end((err, res) => {
                expect(res.body.data[0].id).to.equal(3401);
                done();
            });
    });
    it('response should have property status', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/status').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .send(update)
            .end((err, res) => {
                expect(res.body).to.have.property('status');
                done();
            });
    });
    it('status to equal 200', (done) => {
        chai.request(app).patch('/api/v1/red-flags/3401/status').type('form')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .send(update)
            .end((err, res) => {
                expect(res.body.status).to.equal(200);
                done();
            });
    });
});
