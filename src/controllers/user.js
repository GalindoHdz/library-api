// Modules
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import User from '../models/user';

// Environment varibles
config();

// Token verification function for REST
const UserVerify = async (_id, token) => {
    try {
        // We decode the token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        // If the Token and the ID do not match, we return the following message
        if (_id !== decoded._id) {
            return {
                status: false,
                message: 'Invalid token for the user',
                typeMessage: 'warning',
            };
        }

        // We are looking for the user ID
        const user = await User.findById(decoded._id, { _id: 1 });

        // If the user ID is not found we return the following message
        if (!user) {
            return {
                status: false,
                message: 'Username does not exist',
                typeMessage: 'warning',
            };
        }

        // We return the following message if everything worked correctly
        return {
            status: true,
            message: 'Valid token',
            typeMessage: 'success',
        };
    } catch (error) {
        // In case of any error during the process we return the following message
        return {
            status: false,
            message: 'Server error',
            typeMessage: 'danger',
        };
    }
};

// Function to update the user's profile photo
export const UserUpdatePhoto = async (req, res) => {
    try {
        // We obtain the following data from the user
        const { _id, token } = req.body;

        // We verify that the ID and the token match
        const verify = await UserVerify(_id, token);

        // In case the ID and the token do not match, we return the following message
        if (!verify.status) {
            return res.status(400).json({
                status: false,
                message: verify.message,
                typeMessage: verify.typeMessage,
            });
        }

        // We obtain the photo sent by the user
        const photo = req.files.photo;

        // In case the photo does not exist or is not an image, we will return the following message
        if (!photo || photo.mimetype.substring(0, 5) !== 'image') {
            return res.status(400).json({
                status: false,
                message: 'An image was not submitted for the profile photo',
                typeMessage: 'warning',
            });
        }

        // If the photo weighs more than 500 KB we return the following message
        if (photo.size > 500000) {
            return res.status(400).json({
                status: false,
                message: 'The photo must not weigh more than 500KB',
                typeMessage: 'warning',
            });
        }

        // We look for the path of the user's image
        const user = await User.findById(_id, { photo: 1 });

        // We generate the new path for the user's photo
        const path = `${_id}.${photo.mimetype.substring(6)}`;

        // If the generated route is different from the one stored in the database or the auxiliary photo, then we delete the photo from the server
        if (user.photo !== path && user.photo !== 'profile.png') {
            fs.unlinkSync(`./src/photos/${user.photo}`);
        }

        // We save the new photo on the server
        photo.mv(`./src/photos/${_id}.${photo.mimetype.substring(6)}`);

        // We update the path of the photo in the database
        await User.updateOne(
            { _id },
            { photo: `${_id}.${photo.mimetype.substring(6)}` }
        );

        // We return the following message if everything worked correctly
        return res.status(200).json({
            status: true,
            message: 'Updated profile picture',
            typeMessage: 'success',
        });
    } catch (error) {
        // If an error occurs during the process, we return the following message
        res.status(400).json({
            status: false,
            message: 'Server error ',
            typeMessage: 'danger',
        });
    }
};

// Function to get user profile photo
export const UserGetPhoto = async (req, res) => {
    try {
        // We obtain the address of the requested photo
        const url = path.join(__dirname, `../photos/${req.params.path}`);

        // We access the photo
        fs.accessSync(url);

        // We return the photo
        res.sendFile(url);
    } catch (error) {
        // In case of any error we obtain the address of the auxiliary photo
        const url = path.join(__dirname, '../photos/profile.png');

        // We return the auxiliary photo
        res.sendFile(url);
    }
};
