package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// 封裝訊息格式
type Message struct {
	Sender    string `json:"sender"` //發送者的名稱
	Text      string `json:"text"` //訊息內容
	Timestamp string `json:"timestamp"` //時間標記
}

// WebSocket 升級器
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // 允許所有跨來源請求（開發階段）
	},
}

// 所有連線的 client
var clients = make(map[*websocket.Conn]bool) //儲存所有連線中的使用者
var broadcast = make(chan Message) //用來傳遞訊息給 handleMessages() 進行廣播

// 把 HTTP 連線升級為 WebSocket
func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket 升級失敗: %v", err)
		return
	}
	defer ws.Close()

	clients[ws] = true
	log.Println("✅ 新連線加入")

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("讀取訊息錯誤: %v", err)
			delete(clients, ws)
			break
		}
		broadcast <- msg
	}
}

// 廣播訊息給所有連線
func handleMessages() {
	for {
		msg := <-broadcast
		for client := range clients {
			err := client.WriteJSON(msg) //使用 WriteJSON() 把 msg 傳給每一個使用者
			if err != nil {
				log.Printf("寫入錯誤: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func main() {
	http.HandleFunc("/ws", handleConnections)

	go handleMessages()

	fmt.Println("🚀 Server 啟動於 :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("伺服器啟動失敗:", err)
	}
}
