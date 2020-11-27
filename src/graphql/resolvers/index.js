//Modules
import {
  UserLogIn,
  UserVerify,
  UserData,
  BookSearch,
  BookForSubjects,
  UserLikesData,
  BookCommentData,
} from './queries';
import {
  UserSignIn,
  UserUpdateData,
  UserUpdateTheme,
  UserRecoverAccount,
  UserLikeBook,
  UserRemoveBook,
  UserCommentBook,
  UserRemoveComment,
} from './mutations';

//Resolvers
export const resolvers = {
  Query: {
    UserLogIn,
    UserVerify,
    UserData,
    BookSearch,
    BookForSubjects,
    UserLikesData,
    BookCommentData,
  },
  Mutation: {
    UserSignIn,
    UserUpdateData,
    UserUpdateTheme,
    UserRecoverAccount,
    UserLikeBook,
    UserRemoveBook,
    UserCommentBook,
    UserRemoveComment,
  },
};
