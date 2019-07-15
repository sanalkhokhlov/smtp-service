package engine

import "github.com/sanalkhokhlov/smtp-service/backend/store"

type Engine interface {
	GetEmails(options store.ListOptions) (emails []store.Email, count int, err error)
	CreateEmail(email store.Email) (emailID string, err error)
	GetEmail(emailID string) (email store.Email, err error)
	DeleteEmail(emailID string) (err error)
	DeleteMultipleEmails(emailIDs []string) (err error)
}
