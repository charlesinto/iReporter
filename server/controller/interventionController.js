import Helper from '../Helper';
import { INTERVENTION_RECORD, SUPER_ADMINISTRATOR, IN_DRAFT } from '../types/constants';
import RecordData from './recordData';

const Record = new RecordData();

class InterventionController {
    getInterventionRecord(req, res) {
        if (req.token) {
            const user = req.token;
            const { rolename, userid } = user;
            const sql = Record.getAllInterventionRecord(rolename);
            if (rolename === SUPER_ADMINISTRATOR) {
                return Helper.callServer(res, sql, [INTERVENTION_RECORD]);
            }
            return Helper.callServer(res, sql, [INTERVENTION_RECORD, userid]);
        }
    }

    getASingleRecord(req, res) {
        if (/^\d+$/.test(req.params.id)) {
            const flagId = parseInt(req.params.id);
            if (req.token) {
                const { rolename, userid } = req.token;
                const sql = Record.getInterventionRecord(rolename);
                if (rolename === SUPER_ADMINISTRATOR) {
                    return Helper.callServer(res, sql, [INTERVENTION_RECORD, flagId]);
                }
                return Helper.callServer(res, sql, [INTERVENTION_RECORD, flagId, userid]);
            }
        } else {
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            res.json({
                status: 400,
                error: 'Route not registered',
            });
        }
    }

    createNewRecord(req, res) {
        const flagRecord = Helper.trimWhiteSpace(req.body);
        const { userid, rolename } = req.token;
        if (!Helper.validateKey(flagRecord, ['comment', 'location', 'type'])) {
            return Helper.displayMessage(res, 400, 'Bad Request,one or more keys is missing');
        }
        const {
            createdBy, type, location, Images, Videos, comment,
        } = flagRecord;
        const recordid = 3000 + new Date().getUTCMilliseconds();
        let imageparams = ''; let
            videoparams = '';
        if (Videos.length) {
            const videos = [];
            for (let i = 0; i < Videos.length; i++) {
                videos.push(`(${recordid},'${Videos[i].videotitle}','${Videos[i].videopath}', NOW())`);
            }
            videoparams = videos.join();
            const sql = `
                INSERT INTO BASE_ATTACHMENT(recordid,videotitle,videopath, datecreated) VALUES ${videoparams}
            `;

            Helper.executeQuery(sql)
                .then((result) => {
                    if (Images.length) {
                        const images = [];
                        for (let i = 0; i < Images.length; i++) {
                            images.push(`(${recordid},'${Images[i].imagetitle}','${Images[i].imagepath}', NOW())`);
                        }
                        imageparams = images.join();
                        const sql = `
                        INSERT INTO BASE_ATTACHMENT(recordid,imagetitle,imagepath, datecreated) VALUES ${imageparams}
                    `;

                        Helper.executeQuery(sql)
                            .then(result => Helper.insertRecord(res, recordid, comment, userid, location, type))
                            .catch((error) => { Helper.displayMessage(res, 500, error); });
                    } else {
                        return Helper.insertRecord(res, recordid, comment, userid, location, type);
                    }
                })
                .catch((error) => { Helper.displayMessage(res, 500, error); });
        } else if (Images.length) {
            const images = [];
            for (let i = 0; i < Images.length; i++) {
                images.push(`(${recordid},'${Images[i].imagetitle}','${Images[i].imagepath}', NOW())`);
            }
            imageparams = images.join();
            const sql = `
            INSERT INTO BASE_ATTACHMENT(recordid,imagetitle,imagepath, datecreated) VALUES ${imageparams}
            `;

            Helper.executeQuery(sql)
                .then(result => Helper.insertRecord(res, recordid, comment, userid, location, type))
                .catch((error) => { Helper.displayMessage(res, 500, error); });
        } else {
            return Helper.insertRecord(res, recordid, comment, userid, location, type);
        }
    }

    updateInterventionComment(req, res) {
        const flagRecord = Helper.trimWhiteSpace(req.body);
        const { userid } = req.token;
        if (!Helper.validateKey(flagRecord, ['comment'])) {
            return Helper.displayMessage(res, 400, 'comment is required');
        }
        if (/^\d+$/.test(req.params.id)) {
            const { comment } = flagRecord;
            const requestId = parseInt(req.params.id);
            const sql = 'SELECT * FROM BASE_REPORT WHERE recordid = $1 AND createdby = $2 AND type = $3';
            Helper.executeQuery(sql, [requestId, userid, INTERVENTION_RECORD])
                .then((result) => {
                    if (result.rows.length) {
                        if (result.rows[0].status === IN_DRAFT) {
                            const sql = `
                            UPDATE BASE_REPORT SET comment = $1 WHERE recordid = $2 AND type = $3
                        `;
                            Helper.executeQuery(sql, [comment, requestId, INTERVENTION_RECORD])
                                .then((result) => {
                                    const sql = `
                                SELECT R.id,R.recordid,R.comment,R.createdby,R.comment,
                                R.status,R.reportcategoryid, R.type,
                                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                                WHERE R.recordid = $1;
                            `;
                                    return Helper.callServer(res, sql, [requestId]);
                                })
                                .catch(error => Helper.displayMessage(res, 500, error));
                        } else {
                            return Helper.displayMessage(res, 406, 'can not perform action');
                        }
                    } else {
                        return Helper.displayMessage(res, 404, 'record not found');
                    }
                })
                .catch(error => Helper.displayMessage(res, 500, error));
        } else {
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            return res.json({
                status: 400,
                error: 'Route not registered',
            });
        }
    }

    updateInterventionLocation(req, res) {
        const flagRecord = Helper.trimWhiteSpace(req.body);
        const { userid } = req.token;
        if (!Helper.validateKey(flagRecord, ['location'])) {
            return Helper.displayMessage(res, 400, 'location is required');
        }
        if (/^\d+$/.test(req.params.id)) {
            const { location } = flagRecord;
            const requestId = parseInt(req.params.id);
            const sql = 'SELECT * FROM BASE_REPORT WHERE recordid = $1 AND createdby = $2 AND type = $3';
            Helper.executeQuery(sql, [requestId, userid, INTERVENTION_RECORD])
                .then((result) => {
                    if (result.rows.length) {
                        if (result.rows[0].status === IN_DRAFT) {
                            const sql = `
                            UPDATE BASE_REPORT SET location = $1 WHERE recordid = $2 AND type = $3
                        `;
                            Helper.executeQuery(sql, [location, requestId, INTERVENTION_RECORD])
                                .then((result) => {
                                    const sql = `
                                SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                                R.status,R.reportcategoryid, R.type,
                                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                                WHERE R.recordid = $1;
                            `;
                                    return Helper.callServer(res, sql, [requestId]);
                                })
                                .catch(error => Helper.displayMessage(res, 500, error));
                        } else {
                            return Helper.displayMessage(res, 406, 'can not perform action');
                        }
                    } else {
                        return Helper.displayMessage(res, 404, 'record not found');
                    }
                })
                .catch(error => Helper.displayMessage(res, 500, error));
        } else {
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            return res.json({
                status: 400,
                error: 'Route unregistered',
            });
        }
    }

    deleteInterventionRecord(req, res) {
        const flagRecord = Helper.trimWhiteSpace(req.body);
        const { userid } = req.token;
        if (/^\d+$/.test(req.params.id)) {
            const requestId = parseInt(req.params.id);
            const sql = 'SELECT * FROM BASE_REPORT WHERE recordid = $1 AND createdby = $2 AND type = $3';
            Helper.executeQuery(sql, [requestId, userid, INTERVENTION_RECORD])
                .then((result) => {
                    if (result.rows.length) {
                        if (result.rows[0].status === IN_DRAFT) {
                            const sql = `
                            DELETE FROM BASE_REPORT WHERE recordid = $1 AND type = $2;
                        `;
                            Helper.executeQuery(sql, [requestId, INTERVENTION_RECORD])
                                .then((result) => {
                                    const sql = 'DELETE FROM BASE_ATTACHMENT where recordid = $1 ';
                                    Helper.executeQuery(sql, [requestId])
                                        .then((result) => {
                                            res.statusCode = 200;
                                            res.setHeader('content-type', 'application/json');
                                            res.json({
                                                status: 200,
                                                data: [{
                                                    requestId,
                                                    message: 'intervention record has been deleted',
                                                }],
                                            });
                                        })
                                        .catch(error => Helper.displayMessage(res, 500, error));
                                })
                                .catch(error => Helper.displayMessage(res, 500, error));
                        } else {
                            return Helper.displayMessage(res, 406, 'can not perform action');
                        }
                    } else {
                        return Helper.displayMessage(res, 404, 'record not found');
                    }
                })
                .catch(error => Helper.displayMessage(res, 500, error));
        } else {
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            return res.json({
                status: 400,
                error: 'Invalid request',
            });
        }
        return '';
    }

    updateInterventionStatus(req, res) {
        if (req.token) {
            const update = Helper.trimWhiteSpace(req.body);
            const { userid, rolename, email } = req.token;
            if (rolename === SUPER_ADMINISTRATOR) {
                if (!Helper.validateKey(update, ['status'])) {
                    return Helper.displayMessage(res, 400, 'status is required');
                }
                if (/^\d+$/.test(req.params.id)) {
                    const { status } = update;
                    const requestId = parseInt(req.params.id);
                    const sql = 'SELECT * FROM BASE_REPORT WHERE recordid = $1 AND type = $2';
                    Helper.executeQuery(sql, [requestId, INTERVENTION_RECORD])
                        .then((result) => {
                            if (result.rows.length) {
                                const sql = `
                                UPDATE BASE_REPORT SET status = $1 WHERE recordid = $2 AND type = $3
                            `;
                                Helper.executeQuery(sql, [status, requestId, INTERVENTION_RECORD])
                                    .then((result) => {
                                        Helper.sendMail(email, `Intervention record #${requestId} Status Updated to ${status}`)
                                            .then((info) => {
                                                res.statusCode = 200;
                                                res.setHeader('content-type', 'application/json');
                                                return res.json({
                                                    status: 200,
                                                    data: [
                                                        {
                                                            id: requestId,
                                                            message: 'Updated Intervention record status',
                                                        },
                                                    ],
                                                });
                                            })
                                            .catch(error => Helper.displayMessage(res, 500, 'couldn\'t send email', error));
                                    })
                                    .catch(error => Helper.displayMessage(res, 500, error));
                            } else {
                                return Helper.displayMessage(res, 404, 'record not found');
                            }
                        })
                        .catch(error => Helper.displayMessage(res, 500, error));
                } else {
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    return res.json({
                        status: 400,
                        error: 'Invalid request',
                    });
                }
            } else {
                res.statusCode = 403;
                res.setHeader('content-type', 'application/json');
                return res.json({
                    status: 403,
                    error: 'Can not perform action, please contact administrator',
                });
            }
        }
        return '';
    }
}

export default InterventionController;
