const _ = require("lodash");
const bcrypt = require("bcrypt")
const createErrors = require("http-errors")

const userJoiSchema = require("../models/user.validate");
const UserModel = require("../models/user");
const { signInAccessToken, signInRefreshToken, verifyRefreshToken } = require("../helpers/jwt_helper");

exports.register_user = async (req, res, next) => {
    try {

        const validateData = await userJoiSchema.validateAsync({ ...req.body });
        const usersLength = await UserModel.countDocuments() + 1;
        const foundUser = await UserModel.findOne({ email: req.body.email });

        if (!_.isEmpty(foundUser)) return next(createErrors.Conflict("User already exists"));

        let hashPassword = await bcrypt.hash(req.body.password, 10);

        const user = new UserModel({ id: usersLength, email: validateData.email, password: hashPassword });

        let response = await user.save();

        if (_.isEmpty(response)) return next(createErrors.Conflict("Something went wrong!"));
        response = JSON.parse(JSON.stringify(response));
        const token = await signInAccessToken(response._id);
        const refreshToken = await signInRefreshToken(response._id);
        response.token = { token, refreshToken };
        delete response.password;
        return res.send({ status: "SUCCESS", response })
    } catch (error) {
        if (error.isJoi) return next(createErrors.BadRequest("Invalid Email or Password!"))
        return next(error)
    }
}


exports.login_user = async (req, res, next) => {
    try {

        const validateData = await userJoiSchema.validateAsync({ ...req.body });

        let response = await UserModel.findOne({ email: req.body.email });
        if (_.isEmpty(response)) return next(createErrors.NotFound("User does not exist"))

        const passwordmatch = await bcrypt.compare(req.body.password, response.password);

        if (!passwordmatch) return next(createErrors.BadRequest("Password does not match"));

        response = JSON.parse(JSON.stringify(response));

        const token = await signInAccessToken(response._id);
        const refreshToken = await signInRefreshToken(response._id);
        response.token = { token, refreshToken };
        delete response.password;
        return res.send({ status: "SUCCESS", response })
    } catch (error) {
        if (error.isJoi) return next(createErrors.BadRequest("Invalid Email or Password!"))
        return next(error)
    }
}


exports.refresh_token = async (req, res, next) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) return next(createErrors.BadRequest("Refresh token required"));
        const userId = await verifyRefreshToken(refresh_token);
        const access_token = await signInAccessToken(userId);
        const refreshToken = await signInRefreshToken(userId);
        return res.send({ token: { access_token, refresh_token: refreshToken } })
    } catch (error) {
        return next(error);
    }
}