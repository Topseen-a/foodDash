package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"fooddash-api/db"
	"fooddash-api/models"
)


func GetCategories(c *gin.Context) {
	var categories []models.Category

	if err := db.DB.Order("display_order asc").Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": categories})
}


func GetFullMenu(c *gin.Context) {
	var categories []models.Category

	err := db.DB.Order("display_order asc").Preload("Items", "is_available = ?", true).Find(&categories).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": categories})
}