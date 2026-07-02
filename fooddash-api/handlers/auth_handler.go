package handlers

import (
	"fooddash-api/config"
	"fooddash-api/db"
	"fooddash-api/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var cfg config.Config

func SetConfig(c config.Config) {
	cfg = c
}

func RegisterUser(c *gin.Context) {
	var input models.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
		return
	}

	user := models.User{
		Name:         input.Name,
		Email:        input.Email,
		PasswordHash: string(hash),
	}

	if err := db.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": user})
}

func RegisterStaff(c *gin.Context) {
	var input models.RegisterStaffInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if cfg.StaffCode == "" || input.StaffCode != cfg.StaffCode {
		c.JSON(http.StatusForbidden, gin.H{"error": "Invalid staff code"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
		return
	}

	user := models.User{
		Name:         input.Name,
		Email:        input.Email,
		PasswordHash: string(hash),
		Role:         models.RoleStaff,
	}

	if err := db.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": user})
}

func LoginUser(c *gin.Context) {
	var input models.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User

	if err := db.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  user.ID,
		"role": user.Role,
		"exp":  time.Now().Add(24 * time.Hour).Unix(),
	})

	signed, err := token.SignedString([]byte(cfg.JWTSecret))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": signed, "user": user})
}
