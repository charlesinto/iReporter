CREATE TABLE BASE_USER (userid SERIAL, firstname varchar(50) NOT NULL, lastname varchar(50) NOT NULL, email varchar(100) NOT NULL,
    phonenumber varchar(25) NOT NULL, username varchar(50) NOT NULL, hashpassword varchar(100) NOT NULL, 
    profile_pic_path varchar(250), roleid INTEGER NOT NULL, rolename varchar(50) NOT NULL, datecreated timestamp NOT NULL
);


CREATE TABLE BASE_REPORT(
    ID SERIAL, recordid INTEGER NOT NULL, comment VARCHAR(250), createdby INTEGER NOT NULL,status VARCHAR(25), location VARCHAR(125),
    reportcategoryid INTEGER NOT NULL,type VARCHAR(50), createdon timestamp 
);

CREATE TABLE BASE_REPORT_VIDEO(
    videoid SERIAL, recordid INTEGER NOT NULL,videotitle VARCHAR(50), videopath VARCHAR(255), datecreated timestamp
);

CREATE TABLE BASE_REPORT_PHOTO(
    imageid SERIAL, recordid INTEGER NOT NULL,imagetitle  VARCHAR(50), imagepath VARCHAR(255), datecreated timestamp
);

INSERT INTO BASE_REPORT(recordid,comment,createdby,status, location, reportcategoryid,type, createdon)
values (3400, 'heloo',1, 'in draf', '',1,'red-flag', now()),
(3401, 'heloo',1, 'RESOLBED', '',1,'red-flag', now()),
(3402, 'heloo',2, 'UNDER INVESTIGATIION', '',1,'red-flag', now());

INSERT INTO BASE_REPORT_VIDEO(recordid,videotitle,videopath,datecreated)
values (3400, 'heloo','', now()),
(3400, 'heloo-1','', now()),
(3401, 'hi','', now());

INSERT INTO BASE_REPORT_PHOTO(recordid,imagetitle,imagepath,datecreated)
values (3400, 'heAVE','', now()),
(3400, 'heAVE1','', now()),
(3401, 'hi','', now());


CREATE TABLE  BASE_ATTACHMENT(attachmentid SERIAL, recordid INTEGER NOT NULL,videotitle VARCHAR(50), 
videopath VARCHAR(255),imagetitle  VARCHAR(50), imagepath VARCHAR(255), datecreated timestamp);

INSERT INTO BASE_ATTACHMENT(recordid, videotitle,videopath,imagetitle,imagepath, datecreated)
VALUES (3400, 'heloo','','heAVE','', NOW()),
(3400, 'heloo-1','','heAVE1','', NOW()),
(3401, 'hi','','hi','', NOW());


INSERT INTO BASE_REPORT(recordid,comment,createdby,status, location, reportcategoryid,type, createdon)
values (3402, 'heloo',1, 'UNDER INVESTIGATION', '',1,'red-flag', now());
