import { SUPER_ADMINISTRATOR } from '../types/constants';

/**
 *
 *
 * @class InterventionRecord
 */
class RecordData {
    getAllInterventionRecord(rolename) {
        if (rolename === SUPER_ADMINISTRATOR) {
            return `SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
            R.status,R.reportcategoryid, R.type,
            R.createdon, A.attachmentid,A.videotitle,A.videopath,
            A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
            WHERE R.type = $1;`;
        }
        return `SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                R.status,R.reportcategoryid, R.type,
                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                 where R.type = $1 AND R.createdby = $2;`;
    }

    insertIntoBaseAttachement() {
        return `INSERT INTO BASE_ATTACHMENT(recordid,imagetitle,imagepath, datecreated) VALUES ${imageparams}`;
    }

    getInterventionRecord(rolename) {
        if (rolename === SUPER_ADMINISTRATOR) {
            return `SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
            R.status,R.reportcategoryid, R.type,
            R.createdon, A.attachmentid,A.videotitle,A.videopath,
            A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
            WHERE R.type = $1 and R.recordid = $2;`;
        }
        return `SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                R.status,R.reportcategoryid, R.type,
                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                 where R.type = $1 AND R.createdby = $2 and R.recordid = $3;`;
    }
}

export default RecordData;
