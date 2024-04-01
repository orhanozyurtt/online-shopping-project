import User from '../db/models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Response from '../lib/Response.js';
import CustomError from '../lib/Error.js';
import { HTTP_CODES } from '../config/Enum.js';

class UserController {
  async store(req, res) {
    try {
    } catch (error) {
      let errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (user) {
        throw new CustomError(
          HTTP_CODES.CONFLICT,
          `${name} is already registered`,
          'please register another email address'
        );
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name: name,
        email: email,
        password: passwordHash,
      });
      const token = jwt.sign({ id: newUser._id }, 'SECRETOKEN', {
        expiresIn: '1h',
      });
      const cookieOptions = {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        httpOnly: true,
        secure: false,
      };
      const result = {
        token: token,
        user: newUser,
      };
      res
        .status(HTTP_CODES.CREATED)
        .cookie('token', token, cookieOptions)
        .json(
          Response.successResponse(result, 'registered', HTTP_CODES.CREATED)
        );
    } catch (error) {
      let errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new CustomError(
          HTTP_CODES.BAD_REQUEST,
          'Please provide email and password',
          'please provide email and password'
        );
      }
      const user = await User.findOne({ email: email });

      if (!user) {
        throw new CustomError(
          HTTP_CODES.NOT_FOUND,
          'User not found',
          'please check your email and password'
        );
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new CustomError(
          HTTP_CODES.UNAUTHORIZED,
          'Invalid credentials',
          'please check your email and password'
        );
      }
      //! tokeni gizle
      const token = jwt.sign({ id: user._id }, 'SECRETOKEN', {
        expiresIn: '1h',
      });
      const cookieOptions = {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        httpOnly: true,
        secure: false,
      };
      const result = {
        token: token,
        user: user,
      };
      res
        .status(HTTP_CODES.OK)
        .cookie('token', token, cookieOptions)
        .json(Response.successResponse(result, 'registered', HTTP_CODES.OK));
    } catch (error) {
      let errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }
  //!test et
  async logout(req, res) {
    try {
      res.clearCookie('token');
      res
        .status(HTTP_CODES.OK)
        .json(Response.successResponse({}, 'logged out', HTTP_CODES.OK));
    } catch (error) {
      let errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }
  async forgotPassword(req, res) {
    return res.json();
  }
  async resetPassword(req, res) {
    return res.json();
  }
}

export default new UserController();
