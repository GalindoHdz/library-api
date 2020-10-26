# Project compilation
FROM node:14.8.0-alpine3.10 as builder
WORKDIR /api
COPY . ./
RUN npm install && npm run build

# Project build
FROM node:14.8.0-alpine3.10
ENV PORT=4000
ARG DB_URL
ARG TOKEN_SECRET 
ARG TOKEN_EXPIRES
ARG EMAIL_ACCOUNT
ARG EMAIL_PASSWORD
ARG LIBRARY_KEY
EXPOSE ${PORT}
WORKDIR /api
COPY package.json ./
COPY --from=builder /api/dist ./dist
COPY ./src/photos ./dist/photos
RUN npm install --production
CMD ["npm","start"]