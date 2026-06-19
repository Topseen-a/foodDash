package ws

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	OrderID uint
	Conn    *websocket.Conn
	Send    chan []byte
}

type Hub struct {
	clients    map[uint][]*Client
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

var GlobalHub = &Hub{
	clients:    make(map[uint][]*Client),
	register:   make(chan *Client, 256),
	unregister: make(chan *Client, 256),
}

func (h *Hub) Run() {
	for {
		select {
		case c := <-h.register:
			h.mu.Lock()
			h.clients[c.OrderID] = append(h.clients[c.OrderID], c)
			log.Printf("WS: client registered for order %d", c.OrderID)
			h.mu.Unlock()
		case c := <-h.unregister:
			h.mu.Lock()
			list := h.clients[c.OrderID]
			for i, cl := range list {
				if cl == c {
					h.clients[c.OrderID] = append(list[:i], list[i+1:]...)
					break
				}
			}
			if len(h.clients[c.OrderID]) == 0 {
				delete(h.clients, c.OrderID)
			}
			h.mu.Unlock()
		}
	}
}

func (h *Hub) Unregister(c *Client) {
	h.unregister <- c
}

func (h *Hub) BroadcastOrderUpdate(orderID uint, payload interface{}) {
	data, err := json.Marshal(payload)
	if err != nil {
		return
	}
	h.mu.RLock()
	defer h.mu.RUnlock()
	for _, c := range h.clients[orderID] {
		select {
		case c.Send <- data:
		default:
			close(c.Send)
		}
	}
}

func (h *Hub) Register(c *Client) {
	h.register <- c
}
