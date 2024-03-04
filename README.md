# LOTTERY 🍀

<br/>
<p align="center">
  <img src="https://github.com/JH8459/LOTTERY/assets/83164003/f62202aa-0678-4936-ac77-78db1fc369e9"/>
</p>
<br/>

## 📌 로또 메일링 구독 서비스 LOTTERY 사용 방법

<details>
<summary><strong>개인 프로필 수정 및 정보 권한 설정</strong></summary>
  
#### 1️⃣ 개인 프로필 이메일 주소 수정

- LOTTERY🍀는 Github에 공개된 프로필 이메일 주소를 기반으로 메일 구독 서비스를 제공합니다.
- 따라서 Github 개인 프로필의 이메일란을 작성해주세요!

  <p align="center">
    <img src="https://github.com/JH8459/LOTTERY/assets/83164003/f53f96ba-4900-45a0-8642-a60fc381f9d8"/>
  </p>

#### 2️⃣ 계정 이메일 정보 권한 설정

- Github는 계정의 이메일 정보를 Private을 기본값으로 설정합니다 (**Emails - Keep My email addresses private** 옵션).
- 이메일 주소를 LOTTERY🍀가 알 수 있도록 Public으로 변경해주세요. (이메일 주소 공개 권한 수정이 어려우시다면 서비스 이용이 어렵습니다. 😭)

  <p align="center">
    <img src="https://github.com/JH8459/LOTTERY/assets/83164003/fc23db60-11de-4038-9668-03f4a307c5f1"/>
  </p>

</details>

<details>
<summary><strong>구독</strong></summary>
  
#### 1️⃣ Repository Watch

- 간단합니다! LOTTERY🍀 Repository의 Watch를 클릭하시면 구독이 시작됩니다.

</details>

<br/>
<br/>

## 📌 로또 메일링 구독 서비스 LOTTERY 구독 해지 방법

- Watch를 해제(Unwatch)해주시면 구독이 종료됩니다!

<br/>
<br/>

## ℹ️ 로또 메일링 구독 서비스 LOTTERY 서비스 소개

- 매주 토요일 시행되는 동행복권 로또 정보를 크롤링합니다 :)
- 구독자들에게 매주 일요일 09시에 회차별 당첨 번호 정보 당첨금액에 대한 통계 정보를 이메일로 발송합니다.

<br/>
<br/>


## ℹ️ 로또 메일링 구독 서비스 LOTTERY 아키텍쳐 소개

<p align="center">
  <img src="https://github.com/JH8459/LOTTERY/assets/83164003/16d3ea31-b8f1-4ca4-b9ba-8845be091904"/>
</p>

<p align="center">
  <img alt="TypeScript" src ="https://img.shields.io/badge/TypeScript-3178C6.svg?&style=for-the-badge&logo=TypeScript&logoColor=white"/> 
  <img alt="NestJS" src ="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white"/> 
  <img alt="Express" src ="https://img.shields.io/badge/Express-000000.svg?&style=for-the-badge&logo=Express&logoColor=white"/> 
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white"/>
  <img alt="MariaDB" src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariaDB&logoColor=white"/>
  <img alt="Redis" src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white"/>
  <img alt="Amazon AWS" src ="https://img.shields.io/badge/Amazon AWS-232F3E.svg?&style=for-the-badge&logo=Amazon AWS&logoColor=white"/>
</p>

<br/>
<br/>

- AWS EC2는 주요 서비스를 담당하며, 개인 NAS는 DB 저장을 담당합니다.
- 모든 인프라는 Docker 컨테이너 환경으로 구축되어 있으며 EC2 내부에서는 각 서비스 컨테이너들은 **Traefik**을 통하여 요청을 전달받습니다.
- 주요 서비스 컨테이너로는 **크롤러 서버(express)**, **API 서버(nestjs)** 2개로 구성되어 있습니다.
- Docker Hub와 Github Action을 통해 CI/CD를 구축하였습니다.

<br/>
<br/>

<details>
<summary><strong>크롤러 서버</strong></summary>
  
#### 1️⃣ 크롤러 서버(express)

- 매주 토요일 시행되는 로또 추첨결과를 크롤링하는 기능을 담당합니다.
- 크롤링한 정보를 정규화하여 DB에 저장합니다.
- 메일링에 담을 여러가지 정보들을 추가로 가공하여 Redis에 캐싱합니다.

</details>

<details>
<summary><strong>API 서버</strong></summary>
  
#### 1️⃣ API 서버(nestjs)

- Redis에 캐싱되어 있는 정보를 토대로 메일을 발송하는 서비스를 담당합니다.
- 구독자 이메일 주소 정보를 가져오는 Github API를 통해 구독자 정보를 가져옵니다.
- HTML 기반의 이메일 템플릿으로 구독자에게 로또 당첨 정보를 전달합니다.

</details>
