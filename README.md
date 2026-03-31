프론트 연결 예시
fetch('http://localhost:5000/api/test')
.then((res) => res.json())
.then((data) => console.log(data));
