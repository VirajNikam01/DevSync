# API

## authRouter
- POST /signin
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- POST /profile/edit
- POST profile/password

## connectionRequestRouter
- POST /request/send/intreated/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /feed