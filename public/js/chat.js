"use strict";

const socket = io();

const nickname = document.querySelector("#nickname");
const chatList = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");
const inputImage = document.querySelector(".input-image");
const displayContainer = document.querySelector(".display-container");
const lockChat = document.querySelector(".chat-lock");

chatInput.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    send();
    chatInput.value = "";
  }
});

function send() {
  /** 230212 긴급 필터링 추가 */
  let m = chatInput.value;
  m = m.trim();
  m = m.replace("녹음", "ㄴㅇ").replace("녹화", "ㄴㅎ");
  m = m.replace("염병", "❤️");
  m = m.replace("ㅅㅂ", "💙");
  m = m.replace("시발", "💚");
  m = m.replace("ㅈㄹ", "💛").replace("지랄", "💛");
  m = m.replace("미친", "🧡").replace("ㅁㅊ", "🧡");

  const param = {
    name: nickname.value,
    msg: m,
  };
  socket.emit("chatting", param);
}

sendButton.addEventListener("click", () => {
  send();
  chatInput.value = "";
});

inputImage.addEventListener("change", (e) => {
  const formData = new FormData();
  formData.append("img", inputImage.files[0]);
  axios
    .post("/img", formData)
    .then((res) => console.log(res))
    .catch((error) => console.error(error));
});

socket.on("image", async (image) => {
  const buffer = Buffer.from(image);
  await fs.writeFile("/uploads", buffer).catch(console.error);
});

socket.on("chatting", (data) => {
  const { name, msg, time } = data;
  const item = new LiModel(name, msg, time);
  item.makeLi();

  if (lockChat.checked === false)
    displayContainer.scrollTo(0, displayContainer.scrollHeight);
});

function LiModel(name, msg, time) {
  this.name = name;
  this.msg = msg;
  this.time = time;

  this.makeLi = () => {
    const li = document.createElement("li");
    li.classList.add(nickname.value === this.name ? "sent" : "received");
    const dom = `<span class="profile">
            <span class="user">${this.name}</span>
            </span>
            <span class="message">${this.msg}</span>
        <span class="time">${this.time}</span>`;
    li.innerHTML = dom;
    chatList.appendChild(li);
  };
}

console.log(socket);
