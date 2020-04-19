# ORGS-COMMENTS

*ORGS-MEMBERS* is the codebase for organization's member related API

## App Stack

```
nodejs + express
github API v3
```

## Prerequisite
- node version >= 8.0
- npm
- docker (if you wanted to run this app locally via docker)

## Run Application
```
npm install
npm run launch:app
```

OR via *Docker*

```
docker build -t orgs-members .
docker run --name orgs-members  -p <YOUR_PORT>:9001 -d orgs-members
```

and to stop

```
docker stop orgs-members
```

## Run Test
Test defined into 3 parts, they are E2E, integration, and unit test
- To run all tests :
```
npm run test
```
- To run E2E tests only :
```
npm run test:e2e
```

## API List

If you run this app on your local, the `base-url` will be `http://localhost:9001`  by default, unless you overwrite the `PORT` env in the `.env` file

### Get Organization's Members

Use this endpoint to get list of members for the organization in the request param.
The members displayed is sorted by the number of their followers in descending order

```
GET {{base-url}}/orgs/:organization_name/members
```

Request example :
```
curl -X GET \
  http://localhost:9001/orgs/xendit/members \
  -H 'cache-control: no-cache'
```

Successful Response example :
```
[
    {
        "login": "user1",
        "avatar_url": "https://avatars3.githubusercontent.com/u/4651658?v=4",
        "followers": 30,
        "following": 24
    },
    {
        "login": "user2",
        "avatar_url": "https://avatars2.githubusercontent.com/u/11002383?v=4",
        "followers": 30,
        "following": 30
    },
    {
        "login": "user3",
        "avatar_url": "https://avatars0.githubusercontent.com/u/7030099?v=4",
        "followers": 19,
        "following": 11
    }
]
```

Failed Response example :
```
{
    "code": "ORGANIZATION_NOT_FOUND_ERROR",
    "message": "Organization not found!"
}
```
