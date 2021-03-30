# Dependency Version Checker

# Overview

Fetches your dependency files, extract its dependencies, checks whether dependencies up to date and finally sends outdated dependencies as an email in every 24 hours if dependencies are not updated.

Dependency Version Checker consists of 4 main services: `api`, `expiration`, `version-checker`, `mail-sender` and `common`. They communicate each other with `NATS streaming server`.

# Usage

```
clone the repository

Get API key from sendgrid and in docker-compose.yml file set SENDGRID_API_KEY environment variable under mail-sender service.

If you want to test expiration time, set EXPIRATION_PERIOD environment variable under api and mail-sender service. Value is second. 

At sendgrid dashboard set single sender.

`mail-sender/src/events/listeners/check-version-completed-listener.ts`
const message: EmailMessage = {
                to: data.repoMetadata.emailList,
                from: '',
                subject: 'Dependency Version Checker',
                text: content,
                html: content,
};

Paste the email address you get to 'from' field in message object above.

docker-compose build

docker-compose up -d

```

# api
Api gets repository datas and email list from user and sends these information immediately to `expiration` service.

# expiration
Expiration service adds incoming datas to a queue with a predetermined delay(24 hours). When the time is up, it sends data to `version-checker` service.

# version-checker
Version checker service gets expired datas and performs the following steps:
  - fetch dependency files from repository provider.
  - parses and extracts dependencies.
  - checks versions from related registry.
After these steps, it sends datas to `mail-sender` service.

There are 4 main components in `version-checker`:
  - clients
  - file-fetchers
  - file-parsers
  - update checkers

All base classes are placed into `shared` folder. It contains base classes for clients, file-fetchers, file-parsers and update-checkers. Type of fetchers, parsers and checkers are categorized by registry type. `package-managers` folder contains registry (npm, composer...) types. All registry types are seperate. They have their own implementations in same structure but in different logic. This approach aim to seperation and independence.

# mail-sender
Mail sender service sends email and if dependencies are not up to date, its sends datas to `expiration` service again.

# common
Common includes shared code for reusability.

# Event Flow

 ```
  data: {
    "provider": "github",
    "repoName": "hkaankarakoc/docker-react",
    "emailList": ["kaankarakoc09@gmail.com"]
  } 
 ```
 - User makes a request to `/api/checkVersion` endpoint with the required datas.
 - If data can pass the request validation middleware in api, it is sent to `expiration` service.
 - After 24 hours passed, this data is sent to `version-checker` service.
 - In `version-checker` service:
    - Firstly fetcher and client are created (`NpmFileFetcher` and `GithubClient`) and fetched dependency files `package.json`.
    - File parser is created. Dependency files are parsed and its dependencies are extracted.
    - Update checker is created. Versions checked from `npm` registry.
  - A data which consists dependencies and email list are sent to `mail-sender` service.
  - In `mail-sender` service, datas are sent as an email. If these dependencies are not up to date, it is sent again `expiration` service.
