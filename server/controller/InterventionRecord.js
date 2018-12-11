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

