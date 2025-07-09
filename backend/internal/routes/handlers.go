package routes

import (
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"
	"joeyfoxx/backend/internal/api"
	"joeyfoxx/backend/internal/models"
)

// responseMessage is a simple struct to send JSON messages
type responseMessage struct {
	Message string `jsonx:"message"`
}

// LoginHandler handles user login requests
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var creds models.Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if creds.Username == "" || creds.Password == "" {
		http.Error(w, "Missing username or password", http.StatusBadRequest)
		return
	}

	var storedHash string
	err := api.DB.QueryRow("SELECT password FROM users WHERE username = ?", creds.Username).Scan(&storedHash)
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(creds.Password))
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(responseMessage{Message: "Login successful"})
}

// RegisterHandler handles user registration requests
func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var creds models.Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if creds.Username == "" || creds.Password == "" || creds.Email == "" {
		http.Error(w, "Missing username, password, or email", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	_, err = api.DB.Exec("INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
		creds.Username, string(hashedPassword), creds.Email)
	if err != nil {
		http.Error(w, "Username or email already taken", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(responseMessage{Message: "User registered successfully"})
}
