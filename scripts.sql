CREATE TABLE BASE_USER (userid SERIAL, firstname varchar(50) NOT NULL, lastname varchar(50) NOT NULL, email varchar(100) NOT NULL,
    phonenumber varchar(25) NOT NULL, username varchar(50) NOT NULL, hashpassword varchar(100) NOT NULL, 
    profile_pic_path varchar(250), roleid INTEGER NOT NULL, rolename varchar(50) NOT NULL, datecreated timestamp NOT NULL
);