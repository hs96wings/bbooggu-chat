"use strict";

const alertInfo = document.querySelector(".info");

function infoAlert() {
    Swal.fire({
        title: '업데이트 준비 중',
        icon: 'success',
        html: '디자인 나중에 할 예정<br>기능 구현만 해둠',
        confirmButtonText: '확인'
    })
}
  
alertInfo.addEventListener('click', () => {
    infoAlert();
})