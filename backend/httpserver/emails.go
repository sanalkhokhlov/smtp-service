package httpserver

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sanalkhokhlov/smtp-service/backend/store"
)

func (s *Server) getEmails(c *gin.Context) {
	options := store.ListOptions{}
	if skip, err := strconv.Atoi(c.Query("skip")); err == nil {
		options.Skip = &skip
	}

	if limit, err := strconv.Atoi(c.Query("limit")); err == nil {
		options.Limit = &limit
	}

	if searchQuery := c.Query("query"); searchQuery != "" {
		options.SearchQuery = &searchQuery
	}

	items, count, err := s.DataStore.GetEmails(options)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"count": count,
		"items": items,
	})
}

func (s *Server) downloadEmail(c *gin.Context) {
	emailID := c.Param("id")
	email, err := s.DataStore.GetEmail(emailID)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	if c.Param("action") == "/download" {
		header := c.Writer.Header()
		header["Content-type"] = []string{"application/octet-stream"}
		header["Content-Disposition"] = []string{fmt.Sprintf("attachment; filename=%s.eml", emailID)}
	}

	io.Copy(c.Writer, bytes.NewReader(email.Source))
	c.Status(http.StatusOK)
}

func (s *Server) deleteEmail(c *gin.Context) {
	emailID := c.Param("id")
	err := s.DataStore.DeleteEmail(emailID)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}

func (s *Server) deleteMultipleEmails(c *gin.Context) {
	var body []string
	if err := c.BindJSON(&body); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	err := s.DataStore.DeleteMultipleEmails(body)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}
