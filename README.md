# LOTTERY 🍀

<br/>
<p align="center">
  <img src="https://jh8459.s3.ap-northeast-2.amazonaws.com/lottery/lottery_logo.png"/>
</p>
<br/>

## 📌 복권 당첨 정보 구독 서비스 LOTTERY 사용 방법

- 슬랙 워크스페이스에 <a href="https://lottery.jh8459.com/" target="_blank">LOTTERY🍀</a> 앱을 설치해주세요.
- `/로또`, `/스피또`, `/구독` 명령어를 제공합니다.

<br/>
<br/>

## ℹ️ 복권 당첨 정보 구독 서비스 LOTTERY 서비스 소개

- 매주 토요일 시행되는 로또 정보와 매일 갱신되는 스피또 당첨 결과및 잔여 재고 정보를 크롤링합니다 :)
- 이메일 구독 기능을 활용시 구독자들에게 매주 일요일 09시에 회차별 당첨 번호 정보 당첨금액에 대한 통계 정보를 이메일로 발송합니다.
- 슬랙 워크스페이스 앱 설치시 다양한 명령어를 통하여 복권별 당첨금액 정보와 잔여 매수에 대한 통계 정보를 전달하며 구독 기능또한 제공합니다.

<br/>
<br/>

## ℹ️ 복권 당첨 정보 구독 서비스 LOTTERY 아키텍쳐 소개

<p align="center">
  <img alt="TypeScript" src ="https://img.shields.io/badge/TypeScript-3178C6.svg?&style=for-the-badge&logo=TypeScript&logoColor=white"/> 
  <img alt="NestJS" src ="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white"/> 
  <img alt="Express" src ="https://img.shields.io/badge/Express-000000.svg?&style=for-the-badge&logo=Express&logoColor=white"/> 
  <img alt="React" src ="https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=white"/> 
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white"/>
  <img alt="MariaDB" src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariaDB&logoColor=white"/>
  <img alt="Redis" src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white"/>
</p>

<br/>
<br/>

- Linux 기반 홈서버(Nas)에 주요 서비스들을 Docker 컨테이너 환경으로 구동되고 있습니다.
- 주요 서비스 컨테이너로는 **크롤러 서버(express)**, **API 서버(nestjs)** 그리고 **캐싱(redis)** 컨테이너와 **SPA(React)** 컨테이너로 구성되어 있습니다.
- **Docker Hub**와 **Github Action**을 통해 CI/CD를 구축하였습니다.

<br/>
<br/>
  
#### 1️⃣ 크롤러 서버(express)

- 매주 토요일 시행되는 로또 추첨결과를 크롤링하는 기능을 담당합니다.
- 매일 스피또 당첨 결과 정보를 크롤링하여 등수 별 잔여 매수 정보를 갱신하는 기능을 담당합니다.
- 크롤링한 정보를 정규화하여 DB에 저장합니다.
- 최신 회차 정보는 빠르게 제공하기 위하여 <strong>Redis</strong>에 캐싱합니다.

<br/>
<br/>
  
#### 2️⃣ API 서버(nestjs)

- <strong>Redis</strong>에 캐싱되어 있는 정보를 토대로 정기적으로 뉴스레터 메일과 슬랙 앱 알림을 발송하는 서비스를 담당합니다.

> - 커스텀 된 HTML 기반의 이메일 템플릿으로 구독자에게 로또 당첨 정보 뉴스레터를 전달합니다.
> - 슬랙에서 정식 제공하는 <a href="https://api.slack.com/tools/bolt-js" target="_blank"><strong>Bolt</strong></a> 라이브러리를 사용하여 워크스페이스에 복권 당첨 정보를 제공하는 서비스를 담당합니다.
> - 슬랙 앱 사용시 불편사항을 접수받기 위한 웹사이트의 문의사항 API 기능을 제공합니다.
> - <strong>`Slack Incoming Webhook`</strong> 기능을 사용하여 개인 채널에서 실시간으로 문의사항을 모니터링합니다.

- E2E 테스트를 통해 서비스의 품질을 자동으로 테스트합니다.

<br/>
<br/>

#### 3️⃣ 캐싱(redis)

- 빠른 정보 제공을 위한 캐싱 기능을 제공합니다.
- 다중 인스턴스로 구성된 분산 환경에서 원활한 스케쥴링 작업을 위한 `lock` 기능을 제공합니다.

<br/>
<br/>

#### 4️⃣ SPA(React)

- 워크스페이스에 슬랙 앱 설치를 돕고, 불편사항 피드백을 받기 위한 웹 사이트를 제공합니다.
- 모바일 환경에서도 불편하지 않은 사용자 경험을 위해 반응형 레이아웃을 제공합니다.

<br/>
<br/>
