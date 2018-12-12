import { records } from '../model';
import Helper from '../Helper';
import {SUPER_ADMINISTRATOR, USER_ROLE, INTERVENTION, IN_DRAFT} from '../types';

export const getInterventionRecord = (req,res) => {
    if(req.token){
        const user = req.token;
        const {rolename, userid} = user;
        if(rolename === SUPER_ADMINISTRATOR){
            let sql =
            `SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
            R.status,R.reportcategoryid, R.type,
            R.createdon, A.attachmentid,A.videotitle,A.videopath,
            A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
            WHERE R.type = $1;`;
           return callServer(res,sql,[INTERVENTION])

        }
        else if(rolename == USER_ROLE){
            let sql =
            `SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
            R.status,R.reportcategoryid, R.type,
            R.createdon, A.attachmentid,A.videotitle,A.videopath,
            A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
             where R.type = $1 AND R.createdby = $2;`;
           return  callServer(res,sql,[INTERVENTION, userid])
        }
    }
}

export const getASingleRecord = (req,res) => {
    if(/^\d+$/.test(req.params.id)){
        const flagId = parseInt(req.params.id)
        if(req.token){
            const {rolename, userid} = req.token;
            if(rolename === SUPER_ADMINISTRATOR){
                let sql = `
                SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                R.status,R.reportcategoryid, R.type,
                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                 where R.type = $1 AND R.recordid = $2;
                `
                return callServer(res,sql,[INTERVENTION, flagId])
            }
            else if (rolename === USER_ROLE){
                let sql = `
                SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                R.status,R.reportcategoryid, R.type,
                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                 where (R.type = $1 AND R.recordid = $2) AND R.createdby = $3;
                `
                return callServer(res,sql,[INTERVENTION,flagId,userid])
            }
        }
        
    }else{
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        res.json({
            status: 400,
            error: "Invalid request id"
        })
    }
}

export const createNewRecord = (req,res) => {
    const flagRecord = Helper.trimWhiteSpace(req.body);
    const { userid, rolename} = req.token;
    if(!Helper.validateKey(flagRecord, ['comment','location', 'type'])){
        return Helper.displayMessage(res,400,'Bad Request,one or more keys is missing')
    }
    const { createdBy,type,location, Images, Videos, comment } = flagRecord;
    const recordid = 3000 + new Date().getUTCMilliseconds();
    let imageparams = '', videoparams = '';
    if(Videos.length){

        const videos = [];
        for(let i = 0; i < Videos.length; i++){
            videos.push(`(${recordid},'${Videos[i].videotitle}','${Videos[i].videopath}', NOW())`);
        }
        videoparams = videos.join()
        let sql = `
            INSERT INTO BASE_ATTACHMENT(recordid,videotitle,videopath, datecreated) VALUES ${videoparams}
         `

         Helper.executeQuery(sql)
         .then(result => {
            if(Images.length){
                const images = [];
                for(let i = 0; i < Images.length; i++){
                    images.push(`(${recordid},'${Images[i].imagetitle}','${Images[i].imagepath}', NOW())`);
                }
                 imageparams = images.join()
                 let sql = `
                    INSERT INTO BASE_ATTACHMENT(recordid,imagetitle,imagepath, datecreated) VALUES ${imageparams}
                 `
        
                 Helper.executeQuery(sql)
                 .then(result => {
                    return insertRecord(res,recordid,comment,userid,location,type)
                 })
                 .catch(error => {Helper.displayMessage(res,500,error)})
            }
            else{
                return insertRecord(res,recordid,comment,userid,location,type)
            }
            
         })
         .catch(error => {Helper.displayMessage(res,500,error)})
    }
    else if (Images.length){
        const images = [];
        for(let i = 0; i < Images.length; i++){
            images.push(`(${recordid},'${Images[i].imagetitle}','${Images[i].imagepath}', NOW())`);
        }
        imageparams = images.join();
        let sql = `
        INSERT INTO BASE_ATTACHMENT(recordid,imagetitle,imagepath, datecreated) VALUES ${imageparams}
        `

        Helper.executeQuery(sql)
        .then(result => {
        return insertRecord(res,recordid,comment,userid,location,type)
        })
        .catch(error => {Helper.displayMessage(res,500,error)})
    }
    else{
        return insertRecord(res,recordid,comment,userid,location,type)
    }
}

export const updateInterventionComment = (req,res ) => {
    let flagRecord = Helper.trimWhiteSpace(req.body);
    const {userid} = req.token;
    if(!Helper.validateKey(flagRecord,['comment'])){
        return Helper.displayMessage(res,400,'comment is required')
    }
    if(/^\d+$/.test(req.params.id)){
        const { comment } = flagRecord;
        const requestId = parseInt(req.params.id)
        let sql =   `SELECT * FROM BASE_REPORT WHERE recordid = $1 AND createdby = $2 AND type = $3`;
        Helper.executeQuery(sql,[requestId, userid, INTERVENTION])
        .then(result => {
            if(result.rows.length){
                if(result.rows[0].status === IN_DRAFT){
                    let sql = `
                        UPDATE BASE_REPORT SET comment = $1 WHERE recordid = $2 AND type = $3
                    `
                    Helper.executeQuery(sql,[comment, requestId, INTERVENTION])
                    .then(result => {
                        let sql = `
                            SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                            R.status,R.reportcategoryid, R.type,
                            R.createdon, A.attachmentid,A.videotitle,A.videopath,
                            A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                            WHERE R.recordid = $1;
                        `
                        return callServer(res,sql,[requestId]);
                    })
                    .catch(error => {
                        return Helper.displayMessage(res,500, error)
                    })
                }else{

                    return Helper.displayMessage(res,406, `can not perform action`)
                }
                
            }else{
               return Helper.displayMessage(res,404,'record not found')
            }
        })
        .catch(error => Helper.displayMessage(res,500, error))
        
        
        
    }else{
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        return res.json({
            status: 400,
            error: "Invalid request"
        })
    }
}

export const updateInterventionLocation = (req,res) => {
    let flagRecord = Helper.trimWhiteSpace(req.body);
    const {userid} = req.token;
    if(!Helper.validateKey(flagRecord,['location'])){
        return Helper.displayMessage(res,400,'location is required')
    }
    if(/^\d+$/.test(req.params.id)){
        const { location } = flagRecord;
        const requestId = parseInt(req.params.id)
        let sql =   `SELECT * FROM BASE_REPORT WHERE recordid = $1 AND createdby = $2 AND type = $3`;
        Helper.executeQuery(sql,[requestId, userid, INTERVENTION])
        .then(result => {
            if(result.rows.length){
                if(result.rows[0].status === IN_DRAFT){
                    let sql = `
                        UPDATE BASE_REPORT SET location = $1 WHERE recordid = $2 AND type = $3
                    `
                    Helper.executeQuery(sql,[location, requestId, INTERVENTION])
                    .then(result => {
                        let sql = `
                            SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                            R.status,R.reportcategoryid, R.type,
                            R.createdon, A.attachmentid,A.videotitle,A.videopath,
                            A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                            WHERE R.recordid = $1;
                        `
                        return callServer(res,sql,[requestId]);
                    })
                    .catch(error => {
                        return Helper.displayMessage(res,500, error)
                    })
                }else{

                    return Helper.displayMessage(res,406, `can not perform action`)
                }
                
            }else{
               return Helper.displayMessage(res,404,'record not found')
            }
        })
        .catch(error => Helper.displayMessage(res,500, error))
        
        
        
    }else{
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        return res.json({
            status: 400,
            error: "Invalid request"
        })
    }
}

export const deleteInterventionRecord= (req,res) => {
    const flagRecord = Helper.trimWhiteSpace(req.body);
    const {userid} = req.token;
    if(/^\d+$/.test(req.params.id)){
        const { comment } = flagRecord;
        const requestId = parseInt(req.params.id)
        let sql =   `SELECT * FROM BASE_REPORT WHERE recordid = $1 AND createdby = $2 AND type = $3`;
        Helper.executeQuery(sql,[requestId, userid, INTERVENTION])
        .then(result => {
            if(result.rows.length){
                if(result.rows[0].status === IN_DRAFT){
                    let sql = `
                        DELETE FROM BASE_REPORT WHERE recordid = $1 AND type = $2;
                    `
                    Helper.executeQuery(sql,[requestId, INTERVENTION])
                    .then(result => {
                        let sql = `DELETE FROM BASE_ATTACHMENT where recordid = $1 `;
                        Helper.executeQuery(sql,[requestId])
                        .then(result => {
                            res.statusCode = 200;
                            res.setHeader('content-type', 'application/json');
                            res.json({
                                status: 200,
                                data: [{
                                    requestId,
                                    message: 'intervention record has been deleted'
                                }]
                            })
                        })
                        .catch(error => {
                        return Helper.displayMessage(res,500, error)
                        })
                    })
                    .catch(error => {
                        return Helper.displayMessage(res,500, error)
                    })
                }else{

                    return Helper.displayMessage(res,406, `can not perform action`)
                }
                
            }else{
               return Helper.displayMessage(res,404,'record not found')
            }
        })
        .catch(error => Helper.displayMessage(res,500, error))
    }else{
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        return res.json({
            status: 400,
            error: "Invalid request"
        })
    }
}

export const updateInterventionStatus = (req,res) => {
    if( req.token){
        const update = Helper.trimWhiteSpace(req.body);
        const { userid, rolename } = req.token;
        if(rolename === SUPER_ADMINISTRATOR){
            if(!Helper.validateKey(update, ['status'])){
                return Helper.displayMessage(res,400,'status is required');
            }
            if(/^\d+$/.test(req.params.id)){
                const { status } = update;
                const requestId = parseInt(req.params.id)
                let sql =   `SELECT * FROM BASE_REPORT WHERE recordid = $1 AND type = $2`;
                Helper.executeQuery(sql,[requestId, INTERVENTION])
                .then(result => {
                    if(result.rows.length){
                        let sql = `
                            UPDATE BASE_REPORT SET status = $1 WHERE recordid = $2 AND type = $3
                        `
                        Helper.executeQuery(sql,[status, requestId, INTERVENTION])
                        .then(result => {
                            res.statusCode = 200;
                            res.setHeader('content-type', 'application/json');
                            return res.json({
                                status: 200,
                                data: [
                                    {
                                        id: requestId,
                                        message: 'Updated Intervention record status'
                                    }
                                ]
                            })
                        })
                        .catch(error => {
                            return Helper.displayMessage(res,500, error)
                        })    
                    }else{
                       return Helper.displayMessage(res,404,'record not found')
                    }
                })
                .catch(error => Helper.displayMessage(res,500, error));    
            }else{
                res.statusCode = 400;
                res.setHeader('content-type', 'application/json');
                return res.json({
                    status: 400,
                    error: "Invalid request"
                })
            }
        }
        else{
            res.statusCode = 403;
            res.setHeader('content-type', 'application/json');
            return res.json({
                status: 403,
                error: "Can not perform action, please contact administrator"
            })
        }
    }
}
const callServer = (res, sql, params) => {
    if(typeof params.length !== 'undefined' && params.length > 0){
        Helper.executeQuery(sql,params)
        .then((result) => {
            if(!result.rows.length){
                res.statusCode = 404;
                res.setHeader('content-type', 'application/json');
                return res.json({
                    status: 404,
                    message: `record not found`
                })
            }
           const output = groupAttachment(result)
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            return res.json({
                status: 200,
                data: output
            })
        })
        .catch((error) => {
            return Helper.displayMessage(res,500,'Server error',error);
        })
    }else{
        Helper.executeQuery(sql)
        .then((result) => {
            if(!result.rows.length){
                res.statusCode = 404;
                res.setHeader('content-type', 'application/json');
                return res.json({
                    status: 404,
                    data: []
                })
            }
            const { rows } = result;
            const output = [];
            for(let i = 0; i < rows.length; i++){
                const {
                    recordid,comment,status,location,createdby,
                    createdon,type
                } = rows[i];
                let Videos = [];
                let Images = [];
                for(let k = 0; k < rows.length; k++){
                    if(rows[k].recordid === recordid){
                        const {imagetitle, videotitle,videopath,imagepath} = rows[k];
                        if(videopath !== null){
                            Videos.push({videopath,videotitle});
                        }
                        if(imagepath !== null){
                            Images.push({imagepath,imagetitle});
                        }
                        
                        
                    }
                }
                
                const array = output.filter(element => element.recordid === recordid )
                if(!array.length){
                    output.push({
                        recordid,
                        comment,
                        status,
                        location,
                        createdby,
                        createdon,
                        type,
                        Video:Videos,
                        Image: Images
                    })
                }
                
            }
            res.statusCode = 404;
            res.setHeader('content-type', 'application/json');
            return res.json({
                status: 404,
                message: `record not found`
            })
        })
        .catch((error) => {
            return Helper.displayMessage(res,500,'Server error',error);
        })
    }
    
    
}
const groupAttachment = (result) => {
    const { rows } = result;
    const output = [];
    for(let i = 0; i < rows.length; i++){
        const {
            recordid,comment,status,location,createdby,
            createdon,type
        } = rows[i];
        let Videos = [];
        let Images = [];
        for(let k = 0; k < rows.length; k++){
            if(rows[k].recordid === recordid){
                const {imagetitle, videotitle,videopath,imagepath} = rows[k];
                if(videopath !== null){
                    Videos.push({videopath,videotitle});
                }
                if(imagepath !== null){
                    Images.push({imagepath,imagetitle});
                }
                
                
            }
        }
        
        const array = output.filter(element => element.recordid === recordid )
        if(!array.length){
            output.push({
                recordid,
                comment,
                status,
                location,
                createdby,
                createdon,
                type,
                Video:Videos,
                Image: Images
            })
        }
        
    }
    return output;
}

const insertRecord = (res, recordid, comment, userid, location, type) => {
    const reportcategoryid = (type === INTERVENTION) ? 1 : 2
    let sql = `
        INSERT INTO BASE_REPORT(recordid,comment,createdby,status, location, reportcategoryid,type, createdon)
        VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
    `
    Helper.executeQuery(sql, [recordid, comment, userid, 'IN DRAFT',location, reportcategoryid, type, 'NOW()'])
    .then(result => {
        let sql = `
        SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
        R.status,R.reportcategoryid, R.type,
        R.createdon, A.attachmentid,A.videotitle,A.videopath,
        A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
         where R.recordid = $1;
        `
        Helper.executeQuery(sql, [recordid])
        .then((result) => {
            const output = groupAttachment(result)
            res.statusCode = 201;
            res.setHeader('content-type', 'application/json');
           return res.json({
                status: 201,
                data: [{
                    recordid,
                    message: 'Created intervention record',
                    report: output
                }]
            })
        })
        .catch(error => Helper.displayMessage(res,500,error))
    })
    .catch(error => Helper.displayMessage(res,500,error))
}

