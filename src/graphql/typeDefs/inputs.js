// Export of existing inputs
export const Inputs = () => {
    return `
        ${UserSignInData}
        ${UserLogInData}
        ${UserVerifyData}
        ${UserUpdateData}
        ${UserUpdateTheme}
        ${UserRecoverAccount}
        ${UserLikeBook}
        ${UserRemoveBook}
        ${UserCommentBook}
        ${UserRemoveComment}
    `;
};

// Input for user registration
const UserSignInData = `
    input UserSignInData{
        name: String!
        last_name: String!
        email: String!
        password: String!
    }
`;

// Input for user login
const UserLogInData = `
    input UserLogInData{
        email: String!
        password: String!
    }
`;

// Input to verify users
const UserVerifyData = `
    input UserVerifyData{
        _id: ID!
        token: String!
    }
`;

// Input for updating user data
const UserUpdateData = `
    input UserUpdateData{
        _id: ID!
        token: String!
        password: String!
        new_password: String
        name: String
        last_name: String
    }
`;

// Input to update user settings
const UserUpdateTheme = `
    input UserUpdateTheme{
        _id: ID!
        token: String!
        value: Boolean!
    }
`;

// Input to recover user account
const UserRecoverAccount = `
    input UserRecoverAccount{
        email: String!
    }
`;

// Input to save user books
const UserLikeBook = `
    input UserLikeBook{
        _id: ID!
        token: String!
        key: ID!
        title: String!
        author: String!
        description: String!
        year_publication: String!
        cover: String!
    }
`;

// Input to remove user books
const UserRemoveBook = `
    input UserRemoveBook{
        _id: ID!
        token: String!
        key: ID!
    }
`;

// Input to record user comment
const UserCommentBook = `
    input UserCommentBook{
        _id: ID!
        token: String!
        book: String!
        text: String!
    }
`;

// Input to remove user comment
const UserRemoveComment = `
    input UserRemoveComment{
        _id: ID!
        token: String!
        book: String!
        _id_comment: ID!
    }
`;
