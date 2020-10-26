// Modules
import { config } from 'dotenv';
import { Types } from 'mongoose';
import moment from 'moment';
import { UserVerify } from './queries';
import User from '../../models/user';
import Likes from '../../models/likes';
import Comments from '../../models/comment';
import generator from 'generate-password';
import nodemailer from 'nodemailer';

// Environment variables
config();

// User registration function
export const UserSignIn = async (_, input) => {
    try {
        // We create a new User object with the data sent by the user
        const user = new User({
            name: input.User.name,
            last_name: input.User.last_name,
            email: input.User.email,
            password: input.User.password,
            photo: 'profile.png',
            theme: false,
            creation_date: moment().format(),
        });

        // We encrypt the user's password
        user.password = await user.encryptPassword(user.password);

        // We save the user in the database
        await user.save();

        // We create an email object to verify the creation of the user
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${process.env.EMAIL_ACCOUNT}`,
                pass: `${process.env.EMAIL_PASSWORD}`,
            },
        });

        // We fill in the email data and send it to the user
        await transporter.sendMail({
            from: `${process.env.EMAIL_ACCOUNT}`,
            to: `${user.email}`,
            subject: 'Registration to library of toth',
            text: `Welcome ${user.name} ${user.last_name}, your account registration has been successful`,
        });

        // We return the following message if everything worked correctly
        return {
            status: true,
            message: 'Registered user',
            typeMessage: 'success',
        };
    } catch (error) {
        // If the email to register is already in use, we return the following message
        if (error.errors.email) {
            return {
                status: false,
                message: 'The email is already in use',
                typeMessage: 'warning',
            };
        }

        // Any other error the following message is returned
        return {
            status: false,
            message: 'Server error',
            typeMessage: 'danger',
        };
    }
};

// User data update function
export const UserUpdateData = async (_, input) => {
    try {
        // We verify that the user's ID and Token match
        const verify = await UserVerify(_, input);

        // In case the ID and the Token do not match, we return the following message
        if (!verify.status) {
            return {
                status: false,
                message: verify.message,
                typeMessage: verify.typeMessage,
            };
        }

        // We obtain the data sent by the user
        const { _id, password, new_password, name, last_name } = input.User;

        // We look for the user and extract only the password
        const user = await User.findById({ _id }, { password: 1 });

        // We verify that the password is valid
        const passwordIsValid = await user.validatePassword(password);

        // In case the password is invalid we return the following message
        if (!passwordIsValid) {
            return {
                status: false,
                message: 'Invalid password',
                typeMessage: 'warning',
            };
        }

        // If all the data available to change were sent, the following is done
        if (name && last_name && new_password) {
            // We encrypt the new password
            const aux_password = await user.encryptPassword(new_password);

            // We update all the data in the database
            await User.updateOne(
                { _id },
                { password: aux_password, name, last_name }
            );

            // We return the following message
            return {
                status: true,
                message: 'Datos actualizados',
                typeMessage: 'success',
            };
        }

        // If you only want to change the name or surname, we do the following
        if (name || last_name) {
            // If the name data exists, it is saved in the database
            if (name) {
                await User.updateOne({ _id }, { name });
            }

            // If the lastname data exists, it is saved in the database
            if (last_name) {
                await User.updateOne({ _id }, { last_name });
            }

            // We return the following message
            return {
                status: true,
                message: 'Updated data',
                typeMessage: 'success',
            };
        }

        // If you want to change the password, do the following
        if (new_password) {
            // We encrypt the new password
            const aux_password = await user.encryptPassword(new_password);

            // We update the new password in the database
            await User.updateOne({ _id }, { password: aux_password });

            // We return the following message if everything worked correctly
            return {
                status: true,
                message: 'Password update',
                typeMessage: 'success',
            };
        }
    } catch (error) {
        // In case of any error, the following message is returned
        return {
            status: false,
            message: 'Server error',
            typeMessage: 'danger',
        };
    }
};

// Users theme value update function
export const UserUpdateTheme = async (_, input) => {
    try {
        // We verify that the ID and Token match
        const verify = await UserVerify(_, input);

        // If the ID and the Token do not match, we return the following message
        if (!verify.status) {
            return {
                status: false,
                message: verify.message,
                typeMessage: verify.typeMessage,
            };
        }

        // We obtain the data sent by the user
        const { _id, value } = input.User;

        // We update the theme in the database
        await User.updateOne({ _id }, { theme: value });

        // We return the following message if everything worked correctly
        return {
            status: true,
            message: 'Updated theme',
            typeMessage: 'success',
        };
    } catch (error) {
        // In case of any error we return the following message
        return {
            status: false,
            message: 'Server error',
            typeMessage: 'danger',
        };
    }
};

// Function to recover the users account
export const UserRecoverAccount = async (_, input) => {
    try {
        // We obtain the data sent by the user
        const { email } = input.User;

        // We look for the user in the database and we only obtain the ID, first name, last name and email
        const user = await User.findOne(
            { email },
            { _id: 1, name: 1, last_name: 1, email: 1 }
        );

        // If the user does not exist we return the following message
        if (!user) {
            return {
                status: false,
                message: 'User not found',
                typeMessage: 'warning',
            };
        }

        // We generate the new password for the user of length 10 and with numbers
        const passwordEmail = generator.generate({
            length: 10,
            numbers: true,
        });

        // We encrypt the new password
        const passwordDB = await user.encryptPassword(passwordEmail);

        // We update the password in the database
        await User.updateOne({ _id: user._id }, { password: passwordDB });

        // We generate an Email object
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${process.env.EMAIL_ACCOUNT}`,
                pass: `${process.env.EMAIL_PASSWORD}`,
            },
        });

        // We fill in the email data and send it to the user
        await transporter.sendMail({
            from: `${process.env.EMAIL_ACCOUNT}`,
            to: `${user.email}`,
            subject: 'New password',
            text: `Hello ${user.name} ${user.last_name} its a new password: ${passwordEmail}`,
        });

        // We return the following message if everything worked correctly
        return {
            status: true,
            message: 'A new password was sent to your email',
            typeMessage: 'success',
        };
    } catch (error) {
        // In case of any error we return the following message
        return {
            status: false,
            message: 'Server error',
            typeMessage: 'danger',
        };
    }
};

// User likes registration function
export const UserLikeBook = async (_, input) => {
    try {
        // We verify that the ID and Token of the user match
        const verify = await UserVerify(_, input);

        // In case the ID and the Token match, we return the following message
        if (!verify.status) {
            return {
                status: false,
                message: verify.message,
                typeMessage: verify.typeMessage,
            };
        }

        // We obtain the data sent by the user
        const {
            _id,
            key,
            title,
            author,
            description,
            year_publication,
            cover,
        } = input.User;

        // We look for the user's likes
        const UserLikes = await Likes.findOne(
            { _id_user: _id },
            {
                _id_user: 1,
                books: 1,
            }
        );

        // If the user does not have a list of likes we do the following
        if (!UserLikes) {
            // The list of likes is created with the book received
            const like = new Likes({
                _id_user: _id,
                books: [
                    {
                        _id: key,
                        title,
                        author,
                        description,
                        year_publication,
                        cover,
                    },
                ],
            });

            // The list is saved in the database
            await like.save();

            // We return the following message if everything worked correctly
            return {
                status: true,
                message: 'Save book',
                typeMessage: 'success',
                likes: like.books,
            };
        }

        const book = {
            _id: key,
            title,
            author,
            description,
            year_publication,
            cover,
        };

        // The new like is added to the user's list
        UserLikes.books.push(book);

        // The updated list is saved in the database
        await UserLikes.save();

        // We return the following message if everything worked correctly
        return {
            status: true,
            message: 'Libro guardado',
            typeMessage: 'success',
            likes: UserLikes.books,
        };
    } catch (error) {
        // We get the error message
        const message = error.errors.books.properties.message;

        // If the error is due to a duplicate in the list of likes, we return the following message
        if (message.includes('Duplicate values in array `_id`')) {
            return {
                status: false,
                message: 'The book is already on the list of likes',
                typeMessage: 'info',
            };
        }

        // Any other error the following message is returned
        return {
            status: false,
            message: 'Server error',
            typeMessage: 'danger',
        };
    }
};

// Function to remove user likes
export const UserRemoveBook = async (_, input) => {
    try {
        // We verify that the ID and Token of the user match
        const verify = await UserVerify(_, input);

        // In case the ID and the Token do not match, we return the following message
        if (!verify.status) {
            return {
                status: false,
                message: verify.message,
                typeMessage: verify.typeMessage,
            };
        }

        // We obtain the data sent by the user
        const { _id, key } = input.User;

        // We look for the user's likes
        const UserLikes = await Likes.findOne({ _id_user: _id }, { books: 1 });

        // Like is removed from the user's list
        UserLikes.books.pull(key);

        // The updated list is saved in the database
        await UserLikes.save();

        // We return the following message if everything worked correctly
        return {
            status: true,
            message: 'Book removed from likes list',
            typeMessage: 'success',
            likes: UserLikes.books,
        };
    } catch (error) {
        // If an error occurs, the following message is returned
        return {
            status: false,
            message: 'Server error',
            typeMessage: 'danger',
        };
    }
};

// Function to register user comments about books
export const UserCommentBook = async (_, input) => {
    try {
        // We verify that the ID and Token of the user match
        const verify = await UserVerify(_, input);

        // In case the ID and the Token do not match, we return the following message
        if (!verify.status) {
            return {
                status: false,
                message: verify.message,
                typeMessage: verify.typeMessage,
            };
        }

        // We obtain the data sent by the user
        const { _id, book, text } = input.User;

        // We are looking for comments on the book
        const BookComments = await Comments.findOne(
            { book },
            {
                _id: 1,
                user: 1,
                comments: 1,
            }
        );

        // If the book doesn't have a comment list then
        if (!BookComments) {
            // The comments list of the received book is created
            const comment = new Comments({
                book,
                comments: [
                    {
                        _id: new Types.ObjectId(),
                        user: _id,
                        text,
                        creation_date: moment().format(),
                    },
                ],
            });

            // The list is saved in the database
            await comment.save();

            // We return the following message if everything worked correctly
            return {
                status: true,
                message: 'Comment added',
                typeMessage: 'success',
                comments: comment.comments,
            };
        }

        // The new comment is added to the book list
        BookComments.comments.push({
            _id: new Types.ObjectId(),
            user: _id,
            text,
            creation_date: moment().format(),
        });

        // Updated list is saved in the database
        await BookComments.save();

        // We return the following message if everything worked correctly
        return {
            status: true,
            message: 'Comment added',
            typeMessage: 'success',
            comments: BookComments.comments,
        };
    } catch (error) {
        // Any other error the following message is returned
        return {
            status: false,
            message: 'Server error',
            typeMessage: 'danger',
        };
    }
};

// Function to remove user comments
export const UserRemoveComment = async (_, input) => {
    try {
        // We verify that the ID and Token of the user match
        const verify = await UserVerify(_, input);

        // In case the ID and the Token do not match, we return the following message
        if (!verify.status) {
            return {
                status: false,
                message: verify.message,
                typeMessage: verify.typeMessage,
            };
        }

        // We obtain the data sent by the user
        const { book, _id_comment } = input.User;

        // We are looking for comments on the book
        const ListComments = await Comments.findOne(
            {
                book,
            },
            {
                __v: 0,
            }
        );

        // The comment is removed from the list
        ListComments.comments.pull({ _id: _id_comment });

        // The updated list is saved in the database
        await ListComments.save();

        // We return the following message if everything worked correctly
        return {
            status: true,
            message: 'Comment deleted',
            typeMessage: 'success',
            comments: ListComments.comments,
        };
    } catch (error) {
        // Any other error the following message is returned
        return {
            status: false,
            message: 'Server error',
            typeMessage: 'danger',
        };
    }
};
