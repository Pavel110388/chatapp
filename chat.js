
// Přidej tento skript do <body> v index.html před chat.js:
// <script src="/socket.io/socket.io.js"></script>

document.addEventListener("DOMContentLoaded", () => {
	const input = document.querySelector(".input input");
	const sendBtn = document.querySelector(".send");
	const msgs = document.querySelector(".msgs");
	const nameInput = document.getElementById("name");

	// Připojení k Socket.IO serveru
	const socket = io();

	function getTime() {
		const d = new Date();
		return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	}

	function addMessage(text, author = "Já", time = null) {
		const row = document.createElement("div");
		row.className = author === "Já" ? "msg-row right" : "msg-row left";
		const bubble = document.createElement("div");
		bubble.className = "bubble";
		bubble.innerHTML = `
<div class="meta">${time || getTime()} ${author}</div>
<div>${text}</div>
		`;
		row.appendChild(bubble);
		msgs.appendChild(row);
		msgs.scrollTop = msgs.scrollHeight;
	}

	function sendMessage() {
		const text = input.value.trim();
		const name = nameInput ? nameInput.value.trim() : "Host";
		if (!text) return;
		addMessage(text, "Já");
		socket.emit("chat message", { text, author: name, time: getTime() });
		input.value = "";
	}

	sendBtn.addEventListener("click", sendMessage);
	input.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			sendMessage();
		}
	});

	// Přijímání zpráv od ostatních
	socket.on("chat message", (msgObj) => {
		if (msgObj.author !== (nameInput ? nameInput.value.trim() : "Host")) {
			addMessage(msgObj.text, msgObj.author, msgObj.time);
		}
	});
});
