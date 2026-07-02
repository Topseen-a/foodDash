package models

import "gorm.io/gorm"


type Role string
const (RoleCustomer Role = "customer"; RoleStaff Role = "staff")


type User struct {
	gorm.Model
	Name string `json:"name" gorm:"not null"`
	Email string `json:"email" gorm:"uniqueIndex;not null"`
	PasswordHash string `json:"-"`
	Role Role `json:"role" gorm:"default:customer"`
}


type RegisterInput struct {
		Name string `json:"name" binding:"required"`
		Email string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=8"`
}


type LoginInput struct {
		Email string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
}

type RegisterStaffInput struct {
		Name string `json:"name" binding:"required"`
		Email string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=8"`
		StaffCode string `json:"staff_code" binding:"required"`
}