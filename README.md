# Dependency Version Checker

# Overview

Fetches dependency files in repository, extract its dependencies, checks whether dependencies up to date and finally sends outdated dependencies as an email in every 24 hours if dependencies are not updated. Currently supports npm and composer packages in github.

# Requirements

- User makes a request with repository name and email address(es).
- Application looks for whether package.json or composer.json exist in `/` directory.
- If it founds, parse dependency file and extracts its dependencies.
- It compares version by the help of related registry.
- Finally if dependencies are outdated, for every 24 hours it sends outdated dependencies as an email until user updates dependencies. If dependencies are up to date mail is sent for once after 24 hours.


# Usage

```
clone the repository

Get API key from sendgrid and in docker-compose.yml file set SENDGRID_API_KEY environment variable under mail-sender service.

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

If you want to test expiration time, in docker-compose.yml file set EXPIRATION_PERIOD environment variable under api and mail-sender service. Value is second. 

docker-compose build

docker-compose up -d

```

Dependency Version Checker consists of 5 main services: `api`, `expiration`, `version-checker`, `mail-sender` and `common`. They communicate each other with `NATS streaming server`.

## api
Api gets repository datas and email list from user and sends these information immediately to `expiration` service.

## expiration
Expiration service adds incoming datas to a queue with a predetermined delay(24 hours). When the time is up, it sends data to `version-checker` service.

## version-checker
Version checker service gets expired datas and performs the following steps:
  - fetches dependency files from repository provider.
  - parses and extracts dependencies.
  - checks versions from related registry.
After these steps, it sends datas to `mail-sender` service.

There are 4 main components in `version-checker`:
  - clients
  - file-fetchers
  - file-parsers
  - update checkers

All base classes are placed into `shared` folder. It contains base classes for clients, file-fetchers, file-parsers, update-checkers and registries. Type of fetchers, parsers and checkers are categorized by registry type. `package-managers` folder contains registry (npm, composer...) types. All registry types are seperate. They have their own implementations in same structure but in different logic. This approach aims to seperation and independence.

## mail-sender
Mail sender service sends email and if dependencies are not up to date, its sends datas to `expiration` service again.

## common
Common includes shared code for reusability.

# Event Flow

 ```
  data: {
    "provider": "github",
    "repoName": "hkaankarakoc/docker-react",
    "emailList": ["kaankarakoc09@gmail.com"]
  } 
 ```
 - User makes a request to `localhost:5000/api/checkVersion` endpoint with the required datas.
 - If data can pass the request validation middleware in api, it is sent to `expiration` service.
 - After 24 hours passed, this data is sent to `version-checker` service.
 - In `version-checker` service:
    - Firstly fetcher and client are created (`NpmFileFetcher` and `GithubClient`) and fetched dependency files `package.json`.
    - File parser (`NpmFileParser`) is created. Dependency files are parsed and its dependencies are extracted.
    - Update checker (`NpmUpdateChecker`) is created. Versions checked from `npm` registry.
  - A data which consists dependencies and email list are sent to `mail-sender` service.
  - In `mail-sender` service, datas are sent as an email. If these dependencies are not up to date, it is sent again `expiration` service.
