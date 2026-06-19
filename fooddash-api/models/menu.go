package models

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name         string     `json:"name"`
	Description  string     `json:"description"`
	DisplayOrder int        `json:"display_order"`
	Items        []MenuItem `json:"items,omitempty" gorm:"foreignKey:CategoryID"`
}

type MenuItem struct {
	gorm.Model
	CategoryID  uint    `json:"category_id"`
	Name        string  `json:"name" gorm:"not null"`
	Description string  `json:"description"`
	Price       float64 `json:"price" gorm:"not null"`
	ImageURL    string  `json:"image_url"`
	IsAvailable bool    `json:"is_available" gorm:"default:true"`
	SoldOutNote string  `json:"sold_out_note" gorm:"default:''"`
}

type CreateMenuItemInput struct {
	CategoryID  uint    `json:"category_id" binding:"required"`
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Price       float64 `json:"price" binding:"required,gt=0"`
	ImageURL    string  `json:"image_url"`
}

type CreateCategoryInput struct {
	Name         string `json:"name" binding:"required"`
	Description  string `json:"description"`
	DisplayOrder int    `json:"display_order"`
}
