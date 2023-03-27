"use strict";

const socket = io();

const chatList = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");
const inputImage = document.querySelector(".input-image");
const displayContainer = document.querySelector(".display-container");
const lockChat = document.querySelector(".chat-lock");
const alertInfo = document.querySelector(".info");
const moreChat = document.querySelector(".more-chat");
const moreChatId = document.querySelector(".chat-id");
const alertUpdate = document.querySelector(".update");

window.onload = function () {
  displayContainer.scrollTo(0, displayContainer.scrollHeight);
};

chatInput.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    send();
    chatInput.value = "";
  }
});

function infoAlert() {
  Swal.fire({
    title: '뿌요미 대피소',
    icon: 'info',
    html: '스쉽 터지면 오세요<br>최종 업데이트: 2023-03-28',
    footer: 'Made By&nbsp;<a href="https://twitter.com/bluenery1023">@bluenery1023</a>',
    confirmButtonText: '닫기'
  })
}

alertInfo.addEventListener("click", () => {
  infoAlert();
})

function updateAlert() {
  Swal.fire({
    title: '최근 업데이트 내역',
    icon: 'success',
    html: '230328 02:50 이전대화 불러오기<br>230328 01:50 커스텀 알림창<br>230328 00:50 난잡한 코드 정리',
    confirmButtonText: '확인'
  })
}

alertUpdate.addEventListener('click', () => {
  updateAlert();
})

function send() {
  let m = chatInput.value;
  m = m.trim();
  m = m.replace(/ㅅㅂ/gi, '💜'); // purple
  m = m.replace(/개새끼/gi, '💚'); // green
  m = m.replace(/시발/gi, '💜'); // purple
  m = m.replace(/병신/gi, '🧡'); // orange
  m = m.replace(/ㅄ/gi, '🧡'); // orange
  m = m.replace(/ㅂㅅ/gi, '🧡'); // orange

  const param = {
    msg: m,
  };
  socket.emit("chatting", param);
}

sendButton.addEventListener("click", () => {
  send();
  chatInput.value = "";
});

moreChat.addEventListener("click", () => {
  let id = moreChatId.value;
  
  if (id > 20) {
    $.ajax({
      type: 'POST',
      url: '/more',
      data: JSON.stringify({
        'id': id,
      }),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      error: function(req, status, err) {
        console.error(err);
      },
      success: function(result) {
        for (let i = 0; i < 10; i++) {
          var li = document.createElement("li");
          if (result["result"][i]["msg"] == null) {
            var dom = '<span class="time">' + result["result"][i]["time"] + '</span>'
            + '<span class="img-message"><img src="/' + result["result"][i]["img"] + '" /></span>';
          } else {
            var dom = '<span class="time">' + result["result"][i]["time"] + '</span>'
            + '<span class="message">' + result["result"][i]["msg"] + '</span>';
          }
          li.innerHTML = dom;
          chatList.insertBefore(li, chatList.firstChild);
        }
        moreChatId.value -= 10;
      }
    }); 
  }

  displayContainer.scrollTo(0, 0);
})

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
    const dom = `<span class="time">${this.time}</span>
      <span class="img-message"><img src="/${this.img}" /></span>`;
    li.innerHTML = dom;
    chatList.appendChild(li);
  };
}
console.log(socket);