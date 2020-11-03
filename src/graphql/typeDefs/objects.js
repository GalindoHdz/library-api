// Export of existing objects
export const Objects = () => {
    return `
        ${User}
        ${Likes}
        ${Book}
        ${Search}
        ${ListComments}
        ${Comment}
    `;
};

// Object for users
const User = `
    type User {
        _id: ID
        token: String
        name: String
        last_name: String
        email: String
        photo: String
        likes: [Likes]
        theme: Boolean
        status: Boolean
        message: String
        typeMessage: String
    }
`;

// Object for user likes
const Likes = `
    type Likes {
        _id: ID
        title: String
        author: String
        description: String
        year_publication: String
        cover: String
    }
`;

// Object for books
const Book = `
    type Book {
        _id: String
        title: String
        author: String
        description: String
        year_publication: String
        cover: String
    }
`;

// Object for searches
const Search = `
    type Search {
        status: Boolean
        message: String
        typeMessage: String
        Books: [Book]
    }
`;

// Object for the book comment list
const ListComments = `
    type ListComments {
        status: Boolean
        message: String
        typeMessage: String
        comments: [Comment]
    }
`;

// Object for comments
const Comment = `
    type Comment {
        _id: ID
        user: ID
        text: String
        creation_date: String
    }
`;
