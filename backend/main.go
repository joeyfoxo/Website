package main

import (
	"fmt"
	"joeyfoxx/backend/internal/api"
	"joeyfoxx/backend/internal/routes"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Build DSN from environment variables
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASS"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	api.InitDB(dsn)
	defer api.DB.Close()

	// Register routes on DefaultServeMux
	http.HandleFunc("/login", routes.LoginHandler)
	http.HandleFunc("/register", routes.RegisterHandler)

	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
