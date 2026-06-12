package db

import (
	"log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"fooddash-api/config"
	"fooddash-api/models"
)


// DB is the global database connection shared by all handlers.
var DB *gorm.DB


func Connect(cfg config.Config) {
	var err error
	DB, err = gorm.Open(postgres.Open(cfg.DSN()), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info), // logs every SQL query
	})
	if err != nil { log.Fatal("DB connection failed: ", err) }

	// AutoMigrate creates/updates all tables — no manual SQL ever needed.
	err = DB.AutoMigrate(
		&models.User{}, &models.Category{}, &models.MenuItem{},
		&models.Cart{}, &models.CartItem{},
		&models.Order{}, &models.OrderItem{},
	)
	if err != nil { log.Fatal("AutoMigrate failed: ", err) }
	log.Println("Database connected and migrated.")
}