# Library Toth API

This container is an example of using graphql with nodejs, it is alse used the google-books api is used.
[Demo](https://api-toth.herokuapp.com/graphql)

## Getting Started

### Download

```sh
docker pull luis3120/library-api
```

### Run

```sh
docker run -d -p 4000:4000 \
-e DB_URL= \
-e TOKEN_SECRET= \
-e TOKEN_EXPIRES= \
-e EMAIL_ACCOUNT= \
-e EMAIL_PASSWORD= \
-e LIBRARY_KEY= \
luis3120/library-api
```

#### Environment Variables

-   DB_URL: URLI connection of mongoDB
-   TOKEN_SECRET: Encryption token of users passwords
-   TOKEN_EXPIRES: Token expires time for users
-   EMAIL_ACCOUNT: Email for the container
-   EMAIL_PASSWORD: Email password
-   LIBRARY_KEY: Token of google-books-api

#### Volumes

It is optional to save the user's profile images

-   `/api/dist/photos` - File location of users profile images

```sh
docker run -d -p 4000:4000 \
-e DB_URL= \
-e TOKEN_SECRET= \
-e TOKEN_EXPIRES= \
-e EMAIL_ACCOUNT= \
-e EMAIL_PASSWORD= \
-e LIBRARY_KEY= \
-v localhost/images:/api/dist/photos \
luis3120/library-api
```

## Built With

-   [NodeJS](https://nodejs.org/en/)
-   [GraphQL](https://www.graphql.com/)
-   [Google Books API](https://developers.google.com/books)
-   [Moongose](https://mongoosejs.com/)
-   [Axios](https://github.com/axios/axios)
-   [Nodemailer](https://nodemailer.com/about/)

## Authors

-   [Luis Antonio Galindo Hernández](https://github.com/GalindoHdz)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/GalindoHdz/library-api/blob/main/LICENSE) file for details.
