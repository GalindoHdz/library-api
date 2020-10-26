// Modules
import { Router } from 'express';
import { UserUpdatePhoto, UserGetPhoto } from '../controllers/user';

// Route of variable
const url = Router();

// Endpoints of API
url.post('/user/updatePhoto', UserUpdatePhoto);
url.get('/user/photos/:path', UserGetPhoto);

module.exports = url;
