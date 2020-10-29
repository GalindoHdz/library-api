// Modules
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import Likes from '../../models/likes';
import Comments from '../../models/comment';
import axios from 'axios';

// Environment variables
config();

// User login function
export const UserLogIn = async (_, input) => {
    try {
        // We obtain the values ​​sent by the user
        const { email, password } = input.User;

        // We look for the user in the database with the email, we only read the ID and password (Encrypted)
        const user = await User.findOne({ email }, { _id: 1, password: 1 });

        // If the user does not exist, we return the following message
        if (!user) {
            return {
                status: false,
                message: 'Usuario no encontrado',
                typeMessage: 'warning',
            };
        }

        // We verify that the password is valid for the email
        const passwordIsValid = await user.validatePassword(password);

        // If the password is incorrect we return the following message
        if (!passwordIsValid) {
            return {
                status: false,
                message: 'Invalid password',
                typeMessage: 'warning',
            };
        }

        // We generate a token for the user using the ID of the database
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRES,
        });

        // We return the following message if everything worked correctly
        return {
            _id: user._id,
            token,
            status: true,
            message: 'Welcome',
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

// User verification function
export const UserVerify = async (_, input) => {
    try {
        // We get the values sent by the user
        const { _id, token } = input.User;

        // We verify that the received ID and Token match
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        // In case the ID and Token do not match we return the following message
        if (_id !== decoded._id) {
            return {
                status: false,
                message: 'Invalid token for the user',
                typeMessage: 'warning',
            };
        }

        // We search for the user in the database using the ID and extracting only the ID
        const user = await User.findById(decoded._id, { _id: 1 });

        // If the user does not exist we return the following message
        if (!user) {
            return {
                status: false,
                message: 'User does not exist',
                typeMessage: 'warning',
            };
        }

        // We return the following message if everything works correctly
        return {
            status: true,
            message: 'Invalid token',
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

// Function to obtain user data
export const UserData = async (_, input) => {
    try {
        // We verify the ID and Token with the UserVerify function
        const verify = await UserVerify(_, input);

        // In case the ID and the Token do not match, we return the following message
        if (!verify.status) {
            return {
                status: false,
                message: verify.message,
                typeMessage: verify.typeMessage,
            };
        }

        // We obtain the values ​​sent by the user
        const { _id } = input.User;

        // We look for the user by the ID and ignore the passsword, creation_date, __v
        const user = await User.findOne(
            { _id },
            { _id: 0, password: 0, creation_date: 0, __v: 0 }
        );

        // We return the following message if everything worked correctly
        return {
            status: true,
            message: 'Valid token',
            typeMessage: 'success',
            name: user.name,
            last_name: user.last_name,
            email: user.email,
            photo: user.photo,
            theme: user.theme,
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

// Function to search for books in general
export const BookSearch = async (_, { word }) => {
    try {
        // We normalize the string sent by the user to avoid errors in requests to the Google API
        word = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // We make the request to the Google API
        let response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${word}&key=${process.env.LIBRARY_KEY}&maxResults=40`
        );

        // We extract the number of books found
        const found = response.data.totalItems;

        // We extract the data from the books
        const data = response.data.items;

        // We generate an array for the books
        const Books = [];

        // For each element of the book data, the data to be displayed in the APP is extracted
        data.forEach((element) => {
            Books.push({
                _id: element.id,
                title: element.volumeInfo.title,
                author: element.volumeInfo.authors
                    ? element.volumeInfo.authors[0]
                    : null,
                description: element.volumeInfo.description,
                year_publication: element.volumeInfo.publishedDate,
                cover: element.volumeInfo.imageLinks
                    ? element.volumeInfo.imageLinks.smallThumbnail
                    : null,
            });
        });

        // We return the following message if everything worked correctly
        return {
            status: true,
            message: 'Found books',
            typeMessage: 'success',
            found,
            Books,
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

// Function to select the search by book subject
export const BookForSubjects = async (_, { subject }) => {
    // It is received on the subject of the book and the books are searched
    switch (subject) {
        case 'Arts':
            return SearchSubject('arts');
        case 'Fantasy':
            return SearchSubject('fantasy');
        case 'Biographies':
            return SearchSubject('biographies');
        case 'Science':
            return SearchSubject('science');
        case 'Recipes':
            return SearchSubject('recipes');
        case 'Romance':
            return SearchSubject('romance');
        case 'Religion':
            return SearchSubject('religion');
        case 'Mystery_and_Detective_Stories':
            return SearchSubject('mystery+and+Detective+Stories');
        case 'Music':
            return SearchSubject('music');
        case 'Medicine':
            return SearchSubject('medicine');
        case 'Plays':
            return SearchSubject('plays');
        case 'History':
            return SearchSubject('history');
        case 'Children':
            return SearchSubject('children');
        case 'Science_Fiction':
            return SearchSubject('science+fiction');
        case 'Textbook':
            return SearchSubject('textbook');
    }
};

// Function to search for books by subject
const SearchSubject = async (word) => {
    try {
        // We normalize the string sent by the user to avoid errors in requests to the Google API
        word = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // We make the request to the Google API
        let response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=subject:${word}&key=${process.env.LIBRARY_KEY}&maxResults=40`
        );

        // We extract the number of books found
        const found = response.data.totalItems;

        // We extract the data from the books
        const data = response.data.items;

        // We generate an array for the books
        const Books = [];

        // For each element of the book data, the data to be displayed in the APP is extracted
        data.forEach((element) => {
            Books.push({
                _id: element.id,
                title: element.volumeInfo.title,
                author: element.volumeInfo.authors
                    ? element.volumeInfo.authors[0]
                    : null,
                description: element.volumeInfo.description,
                year_publication: element.volumeInfo.publishedDate,
                cover: element.volumeInfo.imageLinks
                    ? element.volumeInfo.imageLinks.smallThumbnail
                    : null,
            });
        });

        // We return the following message if everything worked correctly
        return {
            status: true,
            message: 'Found books',
            typeMessage: 'success',
            found,
            Books,
        };
    } catch (error) {
        // In case of any error we return the following message
        return {
            status: false,
            message: 'Server error',
            typeMessage: 'danger',
            found,
            Books,
        };
    }
};

// Function to recover the user's likes
export const UserLikesData = async (_, input) => {
    try {
        // We verify the ID and Token with the UserVerify function
        const verify = await UserVerify(_, input);

        // In case the ID and the Token do not match, we return the following message
        if (!verify.status) {
            return {
                status: false,
                message: verify.message,
                typeMessage: verify.typeMessage,
            };
        }

        // We obtain the values ​​sent by the user
        const { _id } = input.User;

        // We search for the user by ID and extract only the list of likes
        const Books = await Likes.findOne({ _id_user: _id }, { books: 1 });

        // If the list books is empty we return the following message
        if (!Books) {
            return {
                status: true,
                message: 'No likes added',
                typeMessage: 'success',
                likes: [],
            };
        }

        // We return the following message if everything worked correctly
        return {
            status: true,
            message: 'Likes found',
            typeMessage: 'success',
            likes: Books.books,
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

// Function to retrieve the comments of the books
export const BookCommentData = async (_, { book }) => {
    try {
        // We search the book and extract only the comments
        const ListComments = await Comments.findOne({ book }, { comments: 1 });

        // In case the book does not have comments, we return the following message
        if (!ListComments) {
            return {
                status: true,
                message: 'Book without comments',
                typeMessage: 'success',
            };
        }

        // We return the following message if everything worked correctly
        return {
            status: true,
            typeMessage: 'success',
            message: 'Book comments',
            comments: ListComments.comments,
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
