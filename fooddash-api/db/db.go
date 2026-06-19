package db

import (
	"fooddash-api/config"
	"fooddash-api/models"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect(cfg config.Config) {
	var err error
	DB, err = gorm.Open(postgres.Open(cfg.DSN()), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("DB connection failed: ", err)
	}

	err = DB.AutoMigrate(
		&models.User{}, &models.Category{}, &models.MenuItem{},
		&models.Cart{}, &models.CartItem{},
		&models.Order{}, &models.OrderItem{},
		&models.OrderEvent{},
	)
	if err != nil {
		log.Fatal("AutoMigrate failed: ", err)
	}
	log.Println("Database connected and migrated.")
}
