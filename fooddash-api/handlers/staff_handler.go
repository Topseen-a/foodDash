package handlers

import (
	"fooddash-api/db"
	"fooddash-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var validTransitions = map[models.OrderStatus][]models.OrderStatus{
	models.StatusReceived:  {models.StatusPreparing, models.StatusCancelled},
	models.StatusPreparing: {models.StatusReady, models.StatusCancelled},
	models.StatusReady:     {models.StatusDelivered, models.StatusPickedUp},
	models.StatusDelivered: {},
	models.StatusPickedUp:  {},
	models.StatusCancelled: {},
}

func isValidTransition(from, to models.OrderStatus) bool {
	for _, s := range validTransitions[from] {
		if s == to {
			return true
		}
	}
	return false
}

func GetTodaysOrders(c *gin.Context) {
	var orders []models.Order
	query := db.DB.Where("DATE(created_at) = CURRENT_DATE").Order("created_atasc").Preload("Items.MenuItem")

	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": orders})
}

func UpdateOrderStatus(c *gin.Context) {
	var order models.Order
	if err := db.DB.First(&order, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
		return
	}

	var input models.UpdateOrderStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !isValidTransition(order.Status, input.Status) {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":     "invalid status transition",
			"current":   order.Status,
			"requested": input.Status,
			"allowed":   validTransitions[order.Status],
		})
		return
	}

	if err := db.DB.Model(&order).Update("status", input.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := db.DB.Create(&models.OrderEvent{OrderID: order.ID, Status: input.Status}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.DB.Preload("Items.MenuItem").Preload("Events").First(&order, order.ID)
	c.JSON(http.StatusOK, gin.H{"data": order})
}

func GetMenuAdmin(c *gin.Context) {
	var categories []models.Category
	err := db.DB.Order("display_orderasc").Preload("Items").Find(&categories).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": categories})
}

func CreateMenuItem(c *gin.Context) {
	var input models.CreateMenuItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cat models.Category
	if err := db.DB.First(&cat, input.CategoryID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "category not found"})
		return
	}

	item := models.MenuItem{CategoryID: input.CategoryID, Name: input.Name, Description: input.Description, Price: input.Price, ImageURL: input.ImageURL, IsAvailable: true}
	if err := db.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": item})
}

func UpdateMenuItem(c *gin.Context) {
	var item models.MenuItem
	if err := db.DB.First(&item, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	var input models.CreateMenuItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.DB.Model(&item).Updates(models.MenuItem{CategoryID: input.CategoryID, Name: input.Name, Description: input.Description, Price: input.Price, ImageURL: input.ImageURL})
	c.JSON(http.StatusOK, gin.H{"data": item})
}

func ToggleAvailability(c *gin.Context) {
	var item models.MenuItem
	if err := db.DB.First(&item, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	db.DB.Model(&item).Update("is_available", !item.IsAvailable)
	c.JSON(http.StatusOK, gin.H{"data": item})
}

func CreateCategory(c *gin.Context) {
	var input models.CreateCategoryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existing models.Category
	if err := db.DB.Where("name = ?", input.Name).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "category already exists"})
		return
	}

	cat := models.Category{Name: input.Name, Description: input.Description, DisplayOrder: input.DisplayOrder}

	if err := db.DB.Create(&cat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": cat})
}

func GetDailySummary(c *gin.Context) {
	type Summary struct {
		TotalOrders  int64            `json:"total_orders"`
		TotalRevenue float64          `json:"total_revenue"`
		ByStatus     map[string]int64 `json:"by_status"`
	}
	var total int64
	var revenue float64
	db.DB.Model(&models.Order{}).Where("DATE(created_at) = CURRENT_DATE").Count(&total)
	db.DB.Model(&models.Order{}).Where("DATE(created_at) = CURRENT_DATE AND status != ?", models.StatusCancelled).Select("COALESCE(SUM(total_amount),0)").Scan(&revenue)
	statuses := []models.OrderStatus{
		models.StatusReceived, models.StatusPreparing, models.StatusReady,
		models.StatusDelivered, models.StatusPickedUp, models.StatusCancelled,
	}
	byStatus := map[string]int64{}
	for _, s := range statuses {
		var count int64
		db.DB.Model(&models.Order{}).Where("DATE(created_at) = CURRENT_DATE AND status = ?", s).Count(&count)
		byStatus[string(s)] = count
	}
	c.JSON(http.StatusOK, gin.H{"data": Summary{TotalOrders: total,
		TotalRevenue: revenue, ByStatus: byStatus}})
}

func SetSoldOutNote(c *gin.Context) {
	var item models.MenuItem
	if err := db.DB.First(&item, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	var input struct {
		Note string `json:"note"`
	}

	err := c.ShouldBindJSON(&input)
	if err != nil {
		return
	}

	db.DB.Model(&item).Update("sold_out_note", input.Note)
	c.JSON(http.StatusOK, gin.H{"data": item})
}
