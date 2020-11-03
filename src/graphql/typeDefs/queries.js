// Export of existing queries
export const Queries = () => {
    return `
    type Query {
        ${UserLogIn}
        ${UserVerify}
        ${UserData}
        ${BookSearch}
        ${BookForSubjects}
        ${UserLikesData}
        ${BookCommentData}
    }`;
};

// Query for user login
const UserLogIn = `
    UserLogIn(User: UserLogInData): User
`;

// Query for user verification
const UserVerify = `
    UserVerify(User: UserVerifyData): User
`;

// Query to get user data
const UserData = `
    UserData(User: UserVerifyData): User
`;

// Query to find books
const BookSearch = `
    BookSearch(word: String!): Search
`;

// Query to search for books by subject
const BookForSubjects = `
    BookForSubjects(subject: String!): Search
`;

// Query to get the user's books
const UserLikesData = `
    UserLikesData(User: UserVerifyData): User
`;

// Query to get the book comments
const BookCommentData = `
    BookCommentData(book: String!): ListComments
`;
