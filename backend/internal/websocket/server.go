package websocket

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/backend/internal/models"
)

// Client represents a connected WebSocket client
type Client struct {
	Conn *websocket.Conn
	Mu   sync.Mutex
}

// WebSocketServer manages WebSocket connections and broadcasts
type WebSocketServer struct {
	clients      map[*Client]bool
	clientsMutex sync.RWMutex
	register     chan *Client
	unregister   chan *Client
	broadcast    chan []byte
}

// NewWebSocketServer creates a new WebSocket server
func NewWebSocketServer() *WebSocketServer {
	return &WebSocketServer{
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan []byte),
	}
}

// Start begins the WebSocket server operation
func (s *WebSocketServer) Start() {
	go s.run()
}

// run handles WebSocket events in a separate goroutine
func (s *WebSocketServer) run() {
	for {
		select {
		case client := <-s.register:
			s.clientsMutex.Lock()
			s.clients[client] = true
			s.clientsMutex.Unlock()
			log.Println("Client connected to WebSocket")

		case client := <-s.unregister:
			s.clientsMutex.Lock()
			if _, ok := s.clients[client]; ok {
				delete(s.clients, client)
				client.Conn.Close()
			}
			s.clientsMutex.Unlock()
			log.Println("Client disconnected from WebSocket")

		case message := <-s.broadcast:
			s.broadcastToClients(message)
		}
	}
}

// broadcastToClients sends a message to all connected clients
func (s *WebSocketServer) broadcastToClients(message []byte) {
	s.clientsMutex.RLock()
	defer s.clientsMutex.RUnlock()

	for client := range s.clients {
		client.Mu.Lock()
		err := client.Conn.WriteMessage(websocket.TextMessage, message)
		client.Mu.Unlock()

		if err != nil {
			log.Printf("Error broadcasting to client: %v", err)
			client.Conn.Close()
			delete(s.clients, client)
		}
	}
}

// HandleWebSocket sets up the WebSocket route handler
func (s *WebSocketServer) HandleWebSocket(app *fiber.App) {
	// Middleware to upgrade HTTP connections to WebSocket
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return c.SendStatus(fiber.StatusUpgradeRequired)
	})

	// WebSocket endpoint
	app.Get("/ws/telemetry", websocket.New(func(conn *websocket.Conn) {
		client := &Client{Conn: conn}

		// Register the client
		s.register <- client

		// Handle disconnection
		defer func() {
			s.unregister <- client
		}()

		// Keep the connection alive
		for {
			_, _, err := conn.ReadMessage()
			if err != nil {
				break
			}
		}
	}))
}

// BroadcastTelemetry sends new telemetry data to all connected clients
func (s *WebSocketServer) BroadcastTelemetry(telemetry models.Telemetry) {
	data, err := json.Marshal(telemetry)
	if err != nil {
		log.Printf("Error marshaling telemetry data: %v", err)
		return
	}

	s.broadcast <- data
}
