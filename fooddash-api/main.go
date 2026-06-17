package main

import (
	"fooddash-api/config"
	"fooddash-api/db"
	// "fooddash-api/handlers"
	"fooddash-api/middleware"
	"fooddash-api/routes"
	// "fooddash-api/ws"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file — using environment variables")
	}

	cfg := config.Load()
	// handlers.SetConfig(cfg)
	db.Connect(cfg)

	r := gin.Default()
	r.Use(cors.New(middleware.CORSConfig()))

	// go ws.GlobalHub.Run()
	// r.GET("/ws/orders/:id", handlers.ServeWS)

	routes.SetupRoutes(r)
	log.Printf("Starting server on :%s", cfg.Port)
	r.Run(":" + cfg.Port)
}