package httpserver

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/sanalkhokhlov/smtp-service/backend/store/service"
)

type Server struct {
	DataStore  *service.DataStore
	httpserver *http.Server
}

func (s *Server) Run(port int) {
	router := s.makeRouter()

	s.httpserver = &http.Server{
		Addr:              fmt.Sprintf(":%d", port),
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
		WriteTimeout:      5 * time.Second,
		IdleTimeout:       30 * time.Second,
	}
	err := s.httpserver.ListenAndServe()
	log.Printf("http server terminated, %s", err)
}

func (s *Server) makeRouter() *gin.Engine {
	r := gin.Default()

	r.Use(static.Serve("/", static.LocalFile("./dist", true)))
	r.NoRoute(s.notFoundHandler)

	api := r.Group("/api")
	{
		emails := api.Group("/emails")
		{
			emails.GET("/", s.getEmails)
			emails.POST("/delete-multiple", s.deleteMultipleEmails)
			emails.DELETE("/id", s.deleteEmail)
			emails.GET("/:id/source/*action", s.downloadEmail)
		}
	}

	return r
}

func (s *Server) notFoundHandler(c *gin.Context) {
	if strings.HasPrefix(c.Request.URL.Path, "/api") {
		c.JSON(http.StatusNotFound, gin.H{"message": "not found"})
		return
	}

	c.File("./dist/index.html")
}
