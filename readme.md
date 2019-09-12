# AWS Signature for API Gateway

A lightweight utility for signing AWS API Gateway Request with IAM authorization.

Some methods are reused from [aws4](https://raw.githubusercontent.com/mhart/aws4/)

## Usage

### include apigatewayv4

``` javascript
const apigatewayv4 = require("./apigatewayv4");
```

### prepare the options

``` javascript
 const options = {
    secretAccessKey: "", //required
    accessKeyId: "", //required
    region: "", //required
    service: "execute-api", //default for API Gateway
  };
```

### prepare the request

```javascript
//all the properties are mandatary, provide '' if not applicable.
const request = {
    url: '', // Full URL
    method: '', //Method
    path: '', //Relative Path
    data: '', //Payload
    query: '',//Query string
    headers: {
    },//Headers
  };
```

### calculate sign

```javascript
  const authorization = apigatewayv4.calculateAuthorization(
    options,
    request
  );
```
