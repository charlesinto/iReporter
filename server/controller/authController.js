import bcrypt from 'bcrypt';
import Helper from '../Helper';
import { USER_ROLE } from '../types/constants';

class Auth {
    constructor() {
        this.signUpUser = this.signUpUser.bind(this);
        this.login = this.login.bind(this);
    }

    signUpUser(req, res) {
        const account = Helper.trimWhiteSpace(req.body);
        if (!Helper.validateKey(account, ['email', 'password', 'firstname', 'lastname', 'phonenumber', 'username'])) {
            return Helper.displayMessage(res, 400, 'Bad Request,one or more keys is missing');
        }
        if (Helper.validateInput(res, account)) {
            const {
                email, password, firstname, lastname, phonenumber, username, profile_pic_path,
            } = account;
            const sql = 'SELECT * FROM BASE_USER WHERE email = $1';
            Helper.executeQuery(sql, [email])
                .then((result) => {
                    if (result.rowCount > 0) {
                        return Helper.displayMessage(res, 406, 'User already exists');
                    }
                    const sql = `INSERT INTO BASE_USER(email,hashpassword,firstname,lastname,phonenumber,username,
                        profile_pic_path,datecreated,roleid,rolename)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
                    const hashpassword = bcrypt.hashSync(password, 10);
                    Helper.executeQuery(sql, 
                        [email, hashpassword, firstname, lastname, phonenumber, username, profile_pic_path, 'NOW()', 2, USER_ROLE])
                        .then((result) => {
                            const sql = 'SELECT * FROM BASE_USER where email = $1';
                            Helper.executeQuery(sql, [email])
                                .then((result) => {
                                    const {
                                        userid, email, username, roleid, rolename, phonenumber,
                                         firstname, lastname, datecreated, profile_pic_path,
                                    } = result.rows[0];
                                    Helper.assignToken({
                                        userid, email, username, roleid, rolename,
                                    })
                                        .then((token) => {
                                            res.statusCode = 201;
                                            res.setHeader('content-type', 'application/json');
                                            res.json({
                                                status: 201,
                                                data: [{
                                                    token,
                                                    user: {
                                                        email,
                                                        username,
                                                        roleId: roleid,
                                                        firstname,
                                                        lastname,
                                                        phonenumber,
                                                        rolename,
                                                        datecreated,
                                                        profile_pic_path,
                                                    },
                                                },
                                                ],
                                            });
                                        })
                                        .catch(error => Helper.displayMessage(res, 412, error));
                                })
                                .catch(error => Helper.displayMessage(res, 503, error));
                        })
                        .catch(error => Helper.displayMessage(res, 503, error));
                })
                .catch(error => Helper.displayMessage(res, 503, error));
        }
        return false;
    }

    login(req, res) {
        const credentials = Helper.trimWhiteSpace(req.body);
        if (!Helper.validateKey(credentials, ['email', 'password'])) {
            return Helper.displayMessage(res, 400, 'Bad Request,one or more keys is missing');
        }
        if (Helper.validateInput(res, credentials)) {
            const { email, password } = credentials;
            const sql = 'SELECT * FROM BASE_USER WHERE email = $1';
            Helper.executeQuery(sql, [email])
                .then((result) => {
                    if (result.rowCount > 0) {
                        const {
                            userid, email, hashpassword, username, roleid,
                            rolename, phonenumber, firstname, lastname,
                            datecreated, profile_pic_path,
                        } = result.rows[0];
                        if (bcrypt.compareSync(password, hashpassword)) {
                            Helper.assignToken({
                                userid, email, username, roleid, rolename,
                            })
                                .then((token) => {
                                    res.statusCode = 200;
                                    res.setHeader('content-type', 'application/json');
                                    res.json({
                                        status: 200,
                                        data: [{
                                            token,
                                            user: {
                                                email,
                                                username,
                                                roleId: roleid,
                                                firstname,
                                                lastname,
                                                phonenumber,
                                                rolename,
                                                datecreated,
                                                profile_pic_path,
                                            },
                                        },
                                        ],
                                    });
                                })
                                .catch(error => Helper.displayMessage(res, 412, error));
                        } else {
                            Helper.displayMessage(res, 404, 'Wrong email or password');
                        }
                    } else {
                        Helper.displayMessage(res, 404, 'Wrong email or password');
                    }
                });
        }
    }
}

export default Auth;
