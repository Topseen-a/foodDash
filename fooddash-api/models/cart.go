package models

import "gorm.io/gorm"


type Cart struct {
	gorm.Model
	UserID uint `json:"user_id" gorm:"uniqueIndex"`
	CartItems []CartItem `json:"items" gorm:"foreignKey:CartID"`
}


type CartItem struct {
	gorm.Model
	CartID uint `json:"cart_id"`
	MenuItemID uint `json:"menu_item_id"`
	MenuItem MenuItem `json:"menu_item" gorm:"foreignKey:MenuItemID"`
	Quantity int `json:"quantity" gorm:"not null"`
	SpecialInstructions string `json:"special_instructions"`
}


type AddToCartInput struct {
	MenuItemID uint `json:"menu_item_id" binding:"required"`
	Quantity int `json:"quantity" binding:"required,min=1"`
	SpecialInstructions string `json:"special_instructions"`
}


type UpdateCartItemInput struct {
	Quantity int `json:"quantity" binding:"required,min=1"`
	SpecialInstructions string `json:"special_instructions"`
}