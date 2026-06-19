package routes

import (
	"fooddash-api/handlers"
	"fooddash-api/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api/v1")

	auth := api.Group("/auth")
	auth.POST("/register", handlers.RegisterUser)
	auth.POST("/login", handlers.LoginUser)
	api.GET("/categories", handlers.GetCategories)
	api.GET("/menu", handlers.GetFullMenu)

	cust := api.Group("")
	cust.Use(middleware.RequireAuth)
	cart := cust.Group("/cart")
	cart.GET("", handlers.GetCart)
	cart.POST("/items", handlers.AddToCart)
	cart.PATCH("/items/:id", handlers.UpdateCartItem)
	cart.DELETE("/items/:id", handlers.RemoveCartItem)
	cart.DELETE("", handlers.ClearCart)
	orders := cust.Group("/orders")
	orders.POST("", handlers.PlaceOrder)
	orders.GET("", handlers.GetMyOrders)
	orders.GET("/:id", handlers.GetOrder)

	staff := api.Group("/staff")
	staff.Use(middleware.RequireAuth, middleware.RequireStaff)
	staff.GET("/orders", handlers.GetTodaysOrders)
	staff.PATCH("/orders/:id/status", handlers.UpdateOrderStatus)
	staff.GET("/menu", handlers.GetMenuAdmin)
	staff.POST("/menu", handlers.CreateMenuItem)
	staff.PUT("/menu/:id", handlers.UpdateMenuItem)
	staff.PATCH("/menu/:id/availability", handlers.ToggleAvailability)
	staff.POST("/categories", handlers.CreateCategory)
	staff.GET("/summary", handlers.GetDailySummary)
	staff.PATCH("/menu/:id/sold-out-note", handlers.SetSoldOutNote)
}
