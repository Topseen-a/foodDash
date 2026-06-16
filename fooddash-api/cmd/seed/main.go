package main

import (
	"log"
	"fooddash-api/config"
	"fooddash-api/db"
	"fooddash-api/models"

	"github.com/joho/godotenv"
)


func main() {
	godotenv.Load(); db.Connect(config.Load())
	cats := []models.Category {
		{Name:"Burgers",Description:"Flame-grilled burgers",DisplayOrder:1},
		{Name:"Drinks",Description:"Cold beverages",DisplayOrder:2},
		{Name:"Desserts",Description:"Sweet treats",DisplayOrder:3},
	}

	for i := range cats { 
		db.DB.FirstOrCreate(&cats[i], models.Category{Name:cats[i].Name}) 
	}

	items := []models.MenuItem{
		{CategoryID:cats[0].ID, Name:"Classic Burger", Price:1500, IsAvailable:true},
		{CategoryID:cats[0].ID, Name:"Cheese Burger", Price:1800, IsAvailable:true},
		{CategoryID:cats[0].ID, Name:"Chicken Burger", Price:1600, IsAvailable:true},
		{CategoryID:cats[0].ID, Name:"Veggie Burger", Price:1400, IsAvailable:true},
		{CategoryID:cats[1].ID, Name:"Coca-Cola", Price:400, IsAvailable:true},
		{CategoryID:cats[1].ID, Name:"Fresh Orange Juice", Price:600, IsAvailable:true},
		{CategoryID:cats[1].ID, Name:"Bottled Water", Price:200, IsAvailable:true},
		{CategoryID:cats[2].ID, Name:"Chocolate Brownie", Price:800, IsAvailable:true},
		{CategoryID:cats[2].ID, Name:"Cheesecake", Price:900, IsAvailable:true},
		{CategoryID:cats[2].ID, Name:"Ice Cream", Price:700, IsAvailable:true},
	}

	for i := range items { db.DB.FirstOrCreate(&items[i], models.MenuItem{Name:
		items[i].Name}) 
	}

	log.Println("Seed complete.")
}