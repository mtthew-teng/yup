package main

import (
	"github.com/mtthew-teng/Turion-GSW-Take-Home/config"
	"github.com/mtthew-teng/Turion-GSW-Take-Home/server"
)

func main() {
	config.ConnectDB()
	server.StartUDPServer()
}
