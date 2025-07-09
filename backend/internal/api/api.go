package api

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

// DB is the shared global database connection
var DB *sql.DB

// InitDB initializes the MySQL database connection using the provided DSN.
func InitDB(dataSourceName string) {
	var err error
	DB, err = sql.Open("mysql", dataSourceName)
	if err != nil {
		log.Fatalf("Error opening DB: %v", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatalf("Error connecting to DB: %v", err)
	}
}
