package store

import "time"

type Email struct {
	ID      string              `json:"id" bson:"_id"`
	From    string              `json:"from"`
	To      string              `json:"to"`
	MailID  string              `json:"mailId"`
	Date    *time.Time          `json:"date"`
	Subject string              `json:"subject"`
	Headers map[string][]string `json:"headers,omitempty"`
	Source  []byte              `json:"-"`
	Tags    []string            `json:"tags"`
}

type ListOptions struct {
	Skip        *int
	Limit       *int
	SearchQuery *string
}
