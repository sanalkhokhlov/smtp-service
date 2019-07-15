package smtp

import (
	"bytes"
	"fmt"
	"mime"
	"net"
	"net/mail"
	"strings"
	"time"

	"github.com/sanalkhokhlov/smtp-service/backend/store"
	"github.com/sanalkhokhlov/smtp-service/backend/store/service"

	"github.com/mhale/smtpd"
)

var wordDecoder = new(mime.WordDecoder)

type Server struct {
	DataStore *service.DataStore
}

func (s *Server) mailHandler(origin net.Addr, from string, to []string, data []byte) {
	msg, _ := mail.ReadMessage(bytes.NewReader(data))
	var date time.Time
	var err error
	if date, err = msg.Header.Date(); err != nil {
		date = time.Now()
	}

	subject, _ := wordDecoder.DecodeHeader(msg.Header.Get("Subject"))
	newItem := store.Email{
		From:    from,
		To:      msg.Header.Get("To"),
		MailID:  msg.Header.Get("Message-Id"),
		Headers: msg.Header,
		Subject: subject,
		Date:    &date,
		Source:  data,
		Tags:    []string{},
	}
	for _, h := range msg.Header["X-Tag"] {
		for _, t := range strings.Split(h, ",") {
			newItem.Tags = append(newItem.Tags, strings.TrimSpace(t))
		}
	}

	_, err = s.DataStore.CreateEmail(newItem)
	if err != nil {
		panic(err)
	}
}

func (s *Server) Run(port int) {
	smtpd.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", port), s.mailHandler, "MySMTPApp", "")
}
