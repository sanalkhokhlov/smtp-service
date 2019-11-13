FROM golang:1.12-alpine3.9 AS build-backend

WORKDIR /go/src/github.com/sanalkhokhlov/smtp-service/backend
ADD backend /go/src/github.com/sanalkhokhlov/smtp-service/backend

RUN go build -o /bin/app main.go

FROM node:10.6-alpine as build-frontend

WORKDIR /frontend
ADD frontend/package.json frontend/package-lock.json ./
RUN npm i

ADD frontend .
RUN npm run build

FROM alpine:3.9
COPY --from=build-backend /bin/app /app
COPY --from=build-frontend /frontend/dist /dist

EXPOSE 3000
EXPOSE 2525
CMD ["/app"]