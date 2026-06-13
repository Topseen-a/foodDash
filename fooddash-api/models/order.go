package models

import "gorm.io/gorm"


type OrderStatus string
type OrderType string


const (
	StatusReceived OrderStatus = "RECEIVED"
	StatusPreparing OrderStatus = "PREPARING"
	StatusReady OrderStatus = "READY"
	StatusDelivered OrderStatus = "DELIVERED"
	StatusPickedUp OrderStatus = "PICKED_UP"
	StatusCancelled OrderStatus = "CANCELLED"
	TypeDelivery OrderType = "delivery"
	TypePickup OrderType = "pickup"
)


type Order struct {
	gorm.Model
	UserID uint `json:"user_id"`
	Type OrderType `json:"type"`
	Status OrderStatus `json:"status" gorm:"default:RECEIVED"`
	TotalAmount float64 `json:"total_amount"`
	DeliveryAddress string `json:"delivery_address"`
	Items []OrderItem `json:"items" gorm:"foreignKey:OrderID"`
}


type OrderItem struct {
	gorm.Model
	OrderID uint `json:"order_id"`
	MenuItemID uint `json:"menu_item_id"`
	MenuItem MenuItem `json:"menu_item" gorm:"foreignKey:MenuItemID"`
	Quantity int `json:"quantity"`
	UnitPrice float64 `json:"unit_price"`
	SpecialInstructions string `json:"special_instructions"`
}


type PlaceOrderInput struct {
	Type OrderType `json:"type" binding:"required,oneof=delivery pickup"`
	DeliveryAddress string `json:"delivery_address"`
}


type UpdateOrderStatusInput struct {
	Status OrderStatus `json:"status" binding:"required"`
}