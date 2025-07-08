package main

import (
	"backend/internal/api"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/hello", api.HelloHandler)
	mux.HandleFunc("/api/echo", api.EchoHandler)

	log.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
