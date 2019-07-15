package engine

import (
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/google/uuid"
	"github.com/sanalkhokhlov/smtp-service/backend/store"
)

const mongoEmails = "emails"

type Mongo struct {
	conn *mgo.Database
}

func NewMongo(conn *mgo.Database) (*Mongo, error) {
	index := mgo.Index{
		Key:        []string{"date"},
		Background: true,
	}

	err := conn.C(mongoEmails).EnsureIndex(index)
	if err != nil {
		return nil, err
	}

	return &Mongo{
		conn,
	}, nil
}

func (m *Mongo) GetEmails(options store.ListOptions) (emails []store.Email, count int, err error) {
	emails = []store.Email{}
	findParams := bson.M{}
	if options.SearchQuery != nil {
		findParams["$or"] = []bson.M{
			bson.M{"subject": bson.M{"$regex": bson.RegEx{Pattern: *options.SearchQuery, Options: "i"}}},
			bson.M{"from": bson.M{"$regex": bson.RegEx{Pattern: *options.SearchQuery, Options: "i"}}},
			bson.M{"to": bson.M{"$regex": bson.RegEx{Pattern: *options.SearchQuery, Options: "i"}}},
			bson.M{"tags": bson.M{"$in": []bson.RegEx{bson.RegEx{Pattern: *options.SearchQuery, Options: "i"}}}},
		}
	}

	query := m.conn.C(mongoEmails).Find(findParams).Select(bson.M{
		"_id":     1,
		"date":    1,
		"mailid":  1,
		"from":    1,
		"to":      1,
		"subject": 1,
		"tags":    1,
	})
	if options.Limit != nil {
		query.Limit(*options.Limit)
	}

	if options.Skip != nil {
		query.Skip(*options.Skip)
	}

	err = query.Sort("-date").All(&emails)
	if err != nil {
		return emails, count, err
	}

	count, err = m.conn.C(mongoEmails).Find(findParams).Count()
	return emails, count, err
}

func (m *Mongo) CreateEmail(email store.Email) (emailID string, err error) {
	email.ID = uuid.New().String()
	err = m.conn.C(mongoEmails).Insert(&email)
	return email.ID, err
}

func (m *Mongo) GetEmail(emailID string) (email store.Email, err error) {
	err = m.conn.C(mongoEmails).FindId(emailID).One(&email)
	return email, err
}

func (m *Mongo) DeleteEmail(emailID string) (err error) {
	return m.conn.C(mongoEmails).RemoveId(emailID)
}

func (m *Mongo) DeleteMultipleEmails(emailIDs []string) (err error) {
	_, err = m.conn.C(mongoEmails).RemoveAll(bson.M{
		"_id": bson.M{"$in": emailIDs},
	})
	return err
}
