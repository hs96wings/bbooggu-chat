## [bbooggu-chat](https://bbooggu.shop)

### 뿌꾸샵을 만들게 된 계기

- [spacesheep](https://spacesheep.co.kr/) 502 Bad GateWay (푸슝 유료화로 인해 서버가 자주 터짐)
- [pushoong](https://pushoong.com/) 광고로 인해 입력창이 가려짐 (푸슝 유료화로 인해 안 쓰는 사람들이 많아짐)

채팅 대피소가 필요해서 만들었다

### 사용한 기술

- Node.JS
- MySQL
- Socket.io
- NginX

### 참고사항 
- [socket.io를 간단히 배운 곳](https://youtu.be/UoKoPP91Qx0)
- [이전 프로젝트 코드 참고](https://github.com/hs96wings/ontelier)
- [커스텀 Alert](https://sweetalert2.github.io/)
---

2023-03-28  
CSS, HTML 정리: 쓰지 않는 CSS 선택자들 정리

2023-04-12
익명 채팅방의 단점: 익명을 믿고 온라인 범죄를 저지를 수 있다  
이 문제를 해결하기 위해 IP 차단을 도입하기로 했다

1. express-ipfilter

아이피 목록을 미리 파일 내에 적어두고 하는 방식인 것 같고  
외부에서 수정하기 어려울 것 같아서 사용하지 않기로 했다

2. table에 IP를 모아두고 들어있는지 비교

서비스가 크지 않으므로 단순 filter만 적용하면 될 것 같아서 blackList를 모아두는 Table을 따로 만들어 IP가 blackList에 들어 있으면 차단하기로 했다

메시지를 저장할 때 ip 주소도 같이 저장해주고 admin 페이지에서 나쁜 채팅을 적은 채팅의 ip 주소를 차단하는 방법을 이용하였다

3. 해결해야 할 문제

메인에 접속할 때 블랙리스트인지 확인하는 방식이라 채팅 도중에 차단이 불가능하다  
채팅에 socket.id도 같이 저장하여 socket.id를 disconnect() 하는 방법으로 구현 시도해볼거 같다
