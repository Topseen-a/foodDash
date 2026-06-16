package handlers

import (
	"fooddash-api/db"
	"fooddash-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)


func PlaceOrder(c *gin.Context) {
	user, _ := c.MustGet("currentUser").(models.User)
	var input models.PlaceOrderInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Type == models.TypeDelivery && input.DeliveryAddress == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Delivery address is required"})
		return
	}

	cart, _ := getOrCreateCart(user.ID)
	var fullCart models.Cart
	db.DB.Preload("CartItems.MenuItem").First(&fullCart, cart.ID)

	if len(fullCart.CartItems) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is empty"})
		return
	}

	var total float64
	for _, item := range fullCart.CartItems {
		total += item.MenuItem.Price * float64(item.Quantity)
	}

	var order models.Order
	err := db.DB.Transaction(func(tx *gorm.DB) error {
		order = models.Order{
			UserID: user.ID,
			Type: input.Type,
			Status: models.StatusReceived,
			TotalAmount: total,
			DeliveryAddress: input.DeliveryAddress,
		}

		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		for _, ci := range fullCart.CartItems {
			oi := models.OrderItem{
				OrderID: order.ID,
				MenuItemID: ci.MenuItemID,
				Quantity: ci.Quantity,
				UnitPrice: ci.MenuItem.Price,
				SpecialInstructions: ci.SpecialInstructions,
			}

			if err := tx.Create(&oi).Error; err != nil {
				return err
			}
		}

		return tx.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return	
	}

	db.DB.Preload("Items.MenuItem").First(&order, order.ID)
	c.JSON(http.StatusCreated, gin.H{"data": order})
}


func GetMyOrders(c *gin.Context) {
	user, _ := c.MustGet("currentUser").(models.User)
	var orders []models.Order
	err := db.DB.Where("user_id = ?", user.ID).Order("created_at desc").Preload("Items.MenuItem").Find(&orders).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": orders})
}


func GetOrder(c *gin.Context) {
	user, _ := c.MustGet("currentUser").(models.User)
	var order models.Order
	err := db.DB.Where("id = ? AND user_id = ?", c.Param("id"), user.ID).Preload("Items.MenuItem").First(&order).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}