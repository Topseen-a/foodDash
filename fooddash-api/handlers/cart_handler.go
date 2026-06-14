package handlers

import (
	"fooddash-api/db"
	"fooddash-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)


func getOrCreateCart(userID uint) (models.Cart, error) {
	var cart models.Cart
	result := db.DB.Where(models.Cart{UserID: userID}).FirstOrCreate(&cart)
	return cart, result.Error
}


func loadCartWithItems(cartID uint) (models.Cart, error) {
	var cart models.Cart
	err := db.DB.Preload("CartItems.MenuItem").First(&cart, cartID).Error
	return cart, err
}


func GetCart(c *gin.Context) {
	user, _ := c.MustGet("currentUser").(models.User)
	cart, err := getOrCreateCart(user.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	cart, _ = loadCartWithItems(cart.ID)
	c.JSON(http.StatusOK, gin.H{"data": cart})
}


func AddToCart(c *gin.Context) {
	user, _ := c.MustGet("currentUser").(models.User)
	var input models.AddToCartInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var menuItem models.MenuItem
	if err := db.DB.First(&menuItem, input.MenuItemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu item not found"})
		return
	}

	if !menuItem.IsAvailable {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Item not available"})
		return
	}

	cart, _ := getOrCreateCart(user.ID)
	var existing models.CartItem

	result := db.DB.Where("cart_id = ? AND menu_item_id = ?", cart.ID, input.MenuItemID).First(&existing)
	
	if result.Error == nil {
		db.DB.Model(&existing).Update("quantity", existing.Quantity+input.Quantity)
	} else {
		db.DB.Create(&models.CartItem{CartID:cart.ID, MenuItemID: input.MenuItemID, Quantity: input.Quantity, SpecialInstructions: input.SpecialInstructions})
	}

	cart, _ = loadCartWithItems(cart.ID)
	c.JSON(http.StatusOK, gin.H{"data": cart})
}


func UpdateCartItem(c *gin.Context) {
	user, _ := c.MustGet("currentUser").(models.User)
	var input models.UpdateCartItemInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cart, _ := getOrCreateCart(user.ID)
	var item models.CartItem

	if err := db.DB.Where("id = ? AND cart_id = ?", c.Param("id"), cart.ID).First(&item).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	db.DB.Model(&item).Updates(models.CartItem{Quantity: input.Quantity, SpecialInstructions: input.SpecialInstructions})

	cart, _ = loadCartWithItems(cart.ID)
	c.JSON(http.StatusOK, gin.H{"data": cart})
}


func RemoveCartItem(c *gin.Context) {
	user, _ := c.MustGet("currentUser").(models.User)
	cart, _ := getOrCreateCart(user.ID)
	var item models.CartItem

	if err := db.DB.Where("id = ? AND cart_id = ?", c.Param("id"), cart.ID).First(&item).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
		return
	}

	db.DB.Delete(&item)

	cart, _ = loadCartWithItems(cart.ID)
	c.JSON(http.StatusOK, gin.H{"data": cart})
}


func ClearCart(c *gin.Context) {
	user, _ := c.MustGet("currentUser").(models.User)
	cart, _ := getOrCreateCart(user.ID)

	db.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{})
	c.JSON(http.StatusOK, gin.H{"message": "Cart cleared"})
}