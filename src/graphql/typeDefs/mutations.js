// Export of existing mutations
export const Mutations = () => {
    return `
    type Mutation {
        ${UserSignIn}
        ${UserUpdateData}
        ${UserUpdateTheme}
        ${UserRecoverAccount}
        ${UserLikeBook}
        ${UserRemoveBook}
        ${UserCommentBook}
        ${UserRemoveComment}
    }
    `;
};

// Mutation for user registration
const UserSignIn = `
    UserSignIn(User: UserSignInData): User
`;

// Mutation for updating user data
const UserUpdateData = `
    UserUpdateData(User: UserUpdateData): User
`;

// Mutation for updating user settings
const UserUpdateTheme = `
    UserUpdateTheme(User: UserUpdateTheme): User
`;

// Mutation to recover user account
const UserRecoverAccount = `
    UserRecoverAccount(User: UserRecoverAccount): User
`;

// Mutation for saving user books
const UserLikeBook = `
    UserLikeBook(User: UserLikeBook): User
`;

// Mutation to remove user books
const UserRemoveBook = `
    UserRemoveBook(User: UserRemoveBook): User
`;

// Mutation to register a user comment
const UserCommentBook = `
    UserCommentBook(User: UserCommentBook): ListComments
`;

// Mutation to remove a user comment
const UserRemoveComment = `
    UserRemoveComment(User: UserRemoveComment): ListComments
`;
