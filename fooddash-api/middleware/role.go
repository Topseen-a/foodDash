package middleware

import (
	"fooddash-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RequireStaff(c *gin.Context) {
	user, _ := c.MustGet("currentUser").(models.User)
	if user.Role != models.RoleStaff {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Staff access required"})
		return
	}
	c.Next()
}
