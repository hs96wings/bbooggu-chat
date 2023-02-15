"use strict";

const socket = io();

const chatList = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");
const inputImage = document.querySelector(".input-image");
const displayContainer = document.querySelector(".display-container");
const lockChat = document.querySelector(".chat-lock");

window.onload = function () {
  displayContainer.scrollTo(0, displayContainer.scrollHeight);
};

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
  axios.post("/img", formData).then((res) => {
    console.log(res);

    const param = {
      img: res.data.img,
    };
    socket.emit("imaging", param);
  });
});

socket.on("imaging", async (data) => {
  const { img, time } = data;
  const item = new ImgModel(img, time);
  item.makeLi();

  if (lockChat.checked === false)
    displayContainer.scrollTo(0, displayContainer.scrollHeight);
});

socket.on("chatting", (data) => {
  const { msg, time } = data;
  const item = new LiModel(msg, time);
  item.makeLi();

  if (lockChat.checked === false)
    displayContainer.scrollTo(0, displayContainer.scrollHeight);
});

function LiModel(msg, time) {
  this.msg = msg;
  this.time = time;

  this.makeLi = () => {
    const li = document.createElement("li");
    li.classList.add("received");
    const dom = `
            <span class="time">${this.time}</span>
            <span class="message">${this.msg}</span>`;
    li.innerHTML = dom;
    chatList.appendChild(li);
  };
}

function ImgModel(img, time) {
  this.img = img;
  this.time = time;

  this.makeLi = () => {
    const li = document.createElement("li");
    li.classList.add("received");
    const dom = `<span class="time">${this.time}</span>
      <span class="img-message"><img src="/${this.img}" /></span>`;
    li.innerHTML = dom;
    chatList.appendChild(li);
  };
}
console.log(socket);
