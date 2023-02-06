"use strict"

const socket = io();

const nickname = document.querySelector("#nickname")
const chatList = document.querySelector(".chatting-list")
const chatInput = document.querySelector(".chatting-input")
const sendButton = document.querySelector(".send-button")
const inputImage = document.querySelector(".input-image")
const displayContainer = document.querySelector(".display-container")
const lockChat = document.querySelector(".chat-lock")

chatInput.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
            send()
            chatInput.value = ""
    }
})

function send() {
    const param = {
            name: nickname.value,
            msg: chatInput.value
    }
    socket.emit("chatting", param)
}

sendButton.addEventListener("click", () => {
    send();
})

inputImage.addEventListener("change", (e) => {
    if (e === undefined) {
        return
    }

    const formData = new FormData();
    e.forEach(v => {
        formData.append('file', v);
    })

    this.uploadImg({formData: formData})
});

socket.on('image', async image => {
    const buffer = Buffer.from(image);
    await fs.writeFile('/uploads', buffer).catch(console.error);
});

socket.on("chatting", (data) => {
    const { name, msg, time } = data;
    const item = new LiModel(name, msg, time);
    item.makeLi();

    if (lockChat.checked === false)
        displayContainer.scrollTo(0, displayContainer.scrollHeight)
})

function LiModel(name, msg, time) {
    this.name = name;
    this.msg = msg;
    this.time = time;

    this.makeLi = () => {
        const li = document.createElement("li");
        li.classList.add(nickname.value === this.name ? "sent" : "received")
        const dom = `<span class="profile">
            <span class="user">${this.name}</span>
            </span>
            <span class="message">${this.msg}</span>
        <span class="time">${this.time}</span>`;
        li.innerHTML = dom;
        chatList.appendChild(li);
    }
}

console.log(socket)