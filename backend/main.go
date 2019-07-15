package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/globalsign/mgo"
	"github.com/sanalkhokhlov/smtp-service/backend/httpserver"
	"github.com/sanalkhokhlov/smtp-service/backend/smtp"
	"github.com/sanalkhokhlov/smtp-service/backend/store/engine"
	"github.com/sanalkhokhlov/smtp-service/backend/store/service"
)

func main() {
	connectionString := "mongodb://mongodb:27017"
	mongoSession, err := mgo.Dial(connectionString)
	if err != nil {
		panic(err)
	}

	mongoEngine, err := engine.NewMongo(mongoSession.DB("smtp-service"))
	if err != nil {
		panic(err)
	}

	dataStore := &service.DataStore{mongoEngine}

	httpServer := &httpserver.Server{DataStore: dataStore}
	smtpServer := &smtp.Server{DataStore: dataStore}

	go httpServer.Run(3000)
	go smtpServer.Run(2525)

	ch := make(chan os.Signal, 10)
	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	<-ch

	log.Printf("Bye")
}
