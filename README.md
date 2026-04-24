# 🌳 Forest of Learning (공부의 숲)

<p align="center">
  <b>습관 + 집중 + 보상으로 지속 가능한 학습을 만드는 플랫폼</b><br/>
  <i>Build habits. Stay focused. Earn rewards.</i>
</p>

---

## 🔗 Live Demo

<p align="center">
  👉 <a href="https://forest-of-learning-frontend.vercel.app/" target="_blank">서비스 바로가기</a>
</p>

---

## 📌 Overview

**공부의 숲**은  
사용자의 학습 습관 형성과 집중력 향상을 돕기 위해 제작된 서비스입니다.

단순한 기록이 아닌

- 📅 Habit (습관)
- ⏱ Focus (집중)
- 🎯 Point (보상)
- 👥 Study (스터디)

를 결합하여  
👉 **“사용자가 계속 학습을 이어가도록 만드는 구조”**를 설계하는 데 초점을 맞췄습니다.

---

## ✨ Features

### 🏡 Study

- 스터디 생성 / 수정 / 삭제
- 비밀번호 기반 접근 인증
- 스터디 상세 정보 관리

---

### 📅 Habit

- 습관 생성 및 체크
- 주간 단위 기록 시각화

---

### ⏱ Focus

- 타이머 기반 집중 기능
- 시작 / 일시정지 / 종료 상태 관리
- 집중 완료 시 포인트 자동 지급

---

### 🎯 Point System

- 집중 시간 기반 포인트 획득
- 누적 포인트 관리

---

### 😀 Emoji Reaction

- 스터디별 이모지 반응 기능
- 사용자 참여도 표현

---

### 🧠 UX Features

- 최근 조회 스터디
- 세션 기반 인증 유지
- 반응형 UI

---

## 🛠 Tech Stack

<p align="center">

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react"/>
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite"/>
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js"/>
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express"/>
<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma"/>
<img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql"/>

</p>

---

## 🏗 Architecture

```bash
src/
├── api/
├── assets/
├── components/
├── contexts/
├── feature/
│ ├── focus/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── utils/
│ │
│ ├── study/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── shared/
│ │ ├── studyDetail/
│ │ ├── utils/
│
├── images/
│ ├── button/
│ ├── focus/
│ ├── habit/
│ ├── icon/
│
├── mocks/
│ ├── background/
│ ├── emoji/
│ ├── focus/
│ ├── habit/
│ ├── point/
│ ├── study/
│
├── pages/
├── router/
├── shared/
│ ├── components/
│ ├── mocks/
│ ├── images/
│ ├── layouts/
│ ├── routes/
│ ├── utils/
│
├── lib/
├── styles/
├── utils/
├── main.jsx
└── index.html
```

👉 기능 단위(feature-based) 구조와 공통 모듈(shared)을 분리하여  
확장성과 유지보수성을 고려한 구조로 설계했습니다.

---

## 🧠 Key Design Decisions

### 1. Client / Server 역할 분리

- Client → 실시간 상태 (타이머)
- Server → 결과 데이터 저장

👉 불필요한 상태 저장 제거

---

### 2. Focus 구조 개선 (핵심 설계)

초기에는 상태 기반 구조로 설계했습니다.

- remainingTime
- pausedAt
- 진행 상태 저장

👉 문제: 데이터 복잡도 증가 + 유지보수 어려움

---

개선 방향:

👉 **결과 중심 데이터 구조**

- 클라이언트에서 상태 계산
- 서버는 완료된 세션(FocusSession)만 저장

👉 구조 단순화 + 안정성 확보

---

### 3. API 구조 최적화

- N+1 문제 해결
- 데이터 통합 조회

👉 성능 개선

---

## 🚨 Troubleshooting

### 🔹 Session Authentication

- 문제: 인증 유지 실패
- 원인: credentials 누락 (쿠키 미전달)
- 해결: fetch + CORS 설정

---

### 🔹 N+1 API 문제

- 문제: API 과다 호출
- 원인: 스터디별 반복 요청
- 해결: 백엔드 통합 조회

---

### 🔹 CORS 배포 문제

- 문제: 배포 환경 통신 실패
- 원인: origin 불일치
- 해결: 환경 변수 기반 설정

---

### 🔹 Focus 구조 문제

- 상태 저장 → 결과 저장 구조로 개선

---

## 📊 Results

- API 호출 구조 개선 → **목록 조회 성능 향상**
- 상태 관리 단순화 → **렌더링 안정성 확보**
- 인증 구조 개선 → **사용자 경험 개선**

---

## 👥 Team & Roles

| 이름       | 역할          | 담당 기능                                                                                                          |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------------------------ |
| **정슬기** | ⭐ PM / Focus | 전체 일정 관리, 요구사항 정의, 데이터 구조 설계, API 명세 설계 주도, DB 설계 및 ERD 작성, 포인트 로직 및 상태 처리 |
| **전강민** | API / Habit   | API 구현, 요청/응답 처리, Prisma 연동, 데이터 흐름 관리, 습관 상태 관리 및 데이터 처리                             |
| **박소정** | Study         | 스터디 CRUD, 목록 조회, 검색, 정렬, 페이지네이션                                                                   |
| **원세빈** | Detail        | 상세 페이지 UI, 스터디 상세 데이터 연결, 습관 기록표 UI, 응원 이모지 기능                                          |
| **최광헌** | Habit         | 습관 CRUD, 습관 체크/해제 기능, 습관 데이터 처리                                                                   |
| **심현수** | Focus         | 타이머 UI, 집중 기능, 집중 완료 흐름 구현                                                                          |

---

<details>
<summary>📌 역할별 세부 작업 보기</summary>

### ⭐ PM / Focus - 정슬기

- 전체 일정 관리 및 마일스톤 설정
- 기능 정의 및 요구사항 정리
- 데이터 구조 및 프로젝트 구조 설계
- API 명세 설계 주도
- DB 설계 및 ERD 작성
- 컨벤션 및 에러 처리 기준 정의
- PR 리뷰 및 코드 품질 관리
- 포인트 로직 및 Focus 상태 처리

### ⚙ API / Habit - 전강민

- Study / Habit / Focus API 구현
- 공통 API 함수 구조 설계
- 요청/응답 처리
- Prisma DB 연동
- API 테스트 및 수정
- 습관 상태 관리 및 데이터 처리

### 📦 Study - 박소정

- 스터디 목록 조회
- 스터디 생성 / 수정 / 삭제
- 검색 및 정렬
- 페이지네이션 처리

### 📄 Detail - 원세빈

- 상세 페이지 레이아웃 구현
- 스터디 정보 UI 구성
- 습관 기록표 UI 구현
- 상세 데이터 API 연결
- 응원 이모지 기능 구현

### ✅ Habit - 최광헌

- 습관 생성
- 습관 목록 조회
- 습관 체크 / 해제
- 습관 데이터 처리

### ⏱ Focus - 심현수

- 타이머 UI 구현
- 집중 기능 구현
- 집중 완료 흐름 구현

</details>

---

## 💬 What I Learned

- 문제는 하나의 레이어가 아니라 여러 구조가 연결되어 발생한다
- 단순 해결보다 **구조를 단순화하는 것이 더 중요하다**
- 기능 구현보다 **설계가 더 중요한 문제**라는 것을 경험했다

---

## 🔥 One Line

👉 **“지속 가능한 학습을 만드는 구조를 고민한 프로젝트”**
