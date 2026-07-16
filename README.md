# REST API for Socio-Demographic Data Analysis

**Stefano Caggegi**  
Bachelor's Degree in Data Analysis for Social Sciences  
University of Macerata  
Advanced Programming Methods  
Academic Year 2025/2026

---

# Introduction

This project has been entirely developed using the JavaScript programming language running on the Node.js runtime environment.

The web service follows the principles of the REST (Representational State Transfer) architectural style and exposes an API (Application Programming Interface) consisting of five endpoints for analyzing any dataset stored inside the project's `data/` directory as a `.json` file structured as an Array of Objects.

The project already includes a socio-demographic dataset inside the `data/` directory:

- `db.json`

The Postman collection provided with the project is configured to run against the `db.json` dataset loaded by the server.

Datasets supported by the server must follow a structure similar to the following:

```json
[
  {
    "field1": "value",
    "field2": 123,
    "field3": "value"
  },
  {
    "field1": "value",
    "field2": 456,
    "field3": "value"
  }
]
```

The project also includes a client application that provides a command-line interface for interacting with the server.

---

# Folder Structure

```text
analisiSocioDemo/
│
├── client/
│   ├── client.js
│   └── utils.js
│
├── server/
│   ├── data/
│   │   ├── db.json  
│   │
│   ├── modules/
│   │   ├── apireqbody.js
│   │   ├── middlewares.js
│   │   ├── paths.js
│   │   ├── statistics.js
│   │
│   └── server.js
│
├── db.postman_collection.json
├── package.json
├── package-lock.json
└── README.md
```

The project is organized by separating client and server components.

The `server/` directory contains all scripts that manage server-side functionality. The `modules/` directory contains modules implementing specific functionalities such as middleware, routing, and statistical computations, improving maintainability and code reuse. The `data/` directory stores the datasets used by the application.

The `client/` directory contains the application that allows users to interact with the server through a command-line interface.

---

# Server Features

The server is a Node.js application implemented in `server.js` using the Express framework.

It exposes a RESTful API that enables statistical analysis of datasets.

In addition to retrieving:

- the entire dataset,
- the list of available fields,
- the list of all distinct values for a field,

the server can also:

- calculate statistical metrics on a selected field,
- group records by a field and compute statistics on another field.

The application allows the calculation of the mode on both numerical and categorical variables since the implemented function supports both types of values. However, limiting mode calculations only to categorical variables would require only a minor modification through an already available middleware.

---

# Available Metrics

| Metric | Description | Accepted Values | Returned Format |
|----------|----------|----------|----------|
| sum | Sum of all values | number | number |
| mean | Arithmetic mean | number | number |
| median | Median | number | number |
| min | Minimum value | number | number |
| max | Maximum value | number | number |
| range | Difference between maximum and minimum | number | number |
| mode | Most frequent value(s) | string or number | array |
| freqabs | Absolute frequencies | string or number | object |
| freqrel | Relative frequencies | string or number | object |
| freqperc | Percentage frequencies | string or number | object |
| allvalue | Returns all values | string or number | array |

---

# API Endpoints

All API endpoints accept and return JSON data.

Whenever a request is invalid, the server returns a JSON error message in the following format:

```json
{
  "error": "error description"
}
```

---

## GET /dataset

Returns the complete dataset loaded by the server.

No request body is required.

---

## GET /properties

Returns all available dataset fields.

Example response:

```json
[
  "field_name"
]
```

---

## POST /data/statistics/modality

Request body:

```json
{
  "field": "field_name"
}
```

Returns all distinct values (modalities) associated with the specified field.

Example response:

```json
{
  "field_name": [
    "value1",
    "value2"
  ]
}
```

---

## POST /data/statistics/descriptive

Request body:

```json
{
  "field": "field_name",
  "metric": "metric_name"
}
```

Calculates the selected metric for the specified field.

Example:

```json
{
  "field": "age",
  "metric": "mean"
}
```

Response:

```json
{
  "mean": 31.6
}
```

---

## POST /data/group

Request body:

```json
{
  "groupBy": "field_name",
  "aggregatedField": "field_name",
  "metric": "metric_name"
}
```

Groups dataset records according to the values of the `groupBy` field and calculates the selected metric on the values of `aggregatedField`.

Example response:

```json
{
  "Male": 34.2,
  "Female": 31.8
}
```

---

# Client Features

The client application, implemented in `client.js`, provides a simple terminal interface based on an iterative menu.

The client allows users to:

- select the desired server operation,
- enter request parameters,
- send HTTP requests,
- display server responses.

The client has been specifically designed to communicate only with the endpoints exposed by the server application.

---

# Running the Project

The Node.js runtime environment is required.

Install dependencies:

```bash
npm install
```

This command creates the `node_modules/` directory and installs all required dependencies.

Start the server:

```bash
npm start
```

Start the client in another terminal:

```bash
npm run startClient
```

---

# Example Usage

The application workflow is based on client-server interaction.

Users interact with the client application, which builds and sends HTTP requests to the server.

The server validates incoming parameters, processes the dataset, and returns JSON responses that are displayed by the client.

After starting the server with:

```bash
npm start
```

the user is prompted to enter the dataset filename, including its extension.

The specified file must exist inside the `data/` directory.

If loading is successful, the following message is displayed:

```text
Server listening at http://localhost:3000
```

Once the client is started through:

```bash
npm run startClient
```

an interactive menu is displayed.

As an example, suppose the user wants to calculate the average value of the `age` field.

Selecting the descriptive statistics option prompts the user to enter:

- the field name,
- the metric name.

The client then sends the following request:

```json
{
  "field": "age",
  "metric": "mean"
}
```

The server returns a response such as:

```json
{
  "mean": 31.6
}
```

which is displayed in the terminal.

---

# Server Application Development

The server application was built using Express.js and follows a REST architecture based on a clear separation between:

- the server, responsible for managing data and processing requests,
- the client, responsible for sending requests and displaying responses.

Endpoints that simply retrieve information use the GET method.

Endpoints requiring user-provided parameters use the POST method.

This approach standardizes the way user data is provided through the Request Object body.

To improve maintainability and readability, all functionalities have been separated into dedicated modules.

## statistics.js

This module contains:

- statistical functions,
- data processing utilities,
- support functions used internally by exported functions.

## middlewares.js

This module defines all application-level middleware functions.

These functions validate user requests.

When invalid data is detected, the middleware immediately returns an error response without invoking `next()`.

## paths.js

This module defines an immutable object containing all API endpoint paths, centralizing endpoint management.

## apireqbody.js

This module defines immutable templates describing the request body format expected by API endpoints.

---

# Functional Programming Approach

Development initially followed an imperative programming style.

The project then progressively evolved toward a more functional approach through:

- higher-order functions,
- currying,
- function factories.

These techniques were adopted to increase generality, reusability, and maintainability.

---

# Internal Caching System

Most functions contained in `statistics.js` accept arrays as input.

This design choice was made partly to support an internal caching system.

The function:

```javascript
cacheDbByFields(db)
```

creates an object whose keys correspond to dataset fields and whose values are arrays containing all values associated with each field.

The function returns another function that receives a field name and returns the corresponding array of values.

Within `server.js`, endpoint callbacks access data through the `serverCache` variable, which stores the closure generated by `cacheDbByFields(db)`.

If values for the requested field are already cached, they are returned immediately.

Otherwise:

1. the dataset is traversed,
2. values are extracted,
3. cached,
4. returned.

This mechanism minimizes repeated dataset traversals and significantly improves performance.

---

# Server Startup Logic

The server is implemented as a single asynchronous function named `server()`.

All instructions are enclosed within a `try` block.

The first operation performed is loading the selected dataset into memory.

The last operation is starting the web server.

Consequently, if dataset loading fails, the server never starts.

Errors are handled through a `catch` block, which prints a descriptive message to the terminal.

The user launching the server is therefore responsible for choosing which dataset should be loaded and analyzed.

---

# Logging

All middleware functions generate log messages displayed on the server terminal.

Logs contain:

- request timestamps,
- descriptions of performed operations,
- validation failures,
- generated errors.

Complete behavior documentation can be found in the source code comments.

---

# Client Application Development

As with the server, client functionality is separated into modules.

The `utils.js` module contains all utility functions, while `client.js` contains only:

- menu logic,
- user interaction logic,
- invocation of imported functions.

The `utils.js` module implements all asynchronous functions responsible for:

- sending HTTP requests,
- receiving responses,
- displaying results.

Two functions are used internally:

```javascript
getFetch(api)
```

for GET requests and

```javascript
postFetch(api, reqBody)
```

for POST requests.

Both functions:

1. send HTTP requests,
2. wait for the response,
3. parse the JSON body,
4. return a JavaScript object.

The request header:

```javascript
Connection: close
```

is explicitly specified.

This choice prevents `ECONNRESET` errors caused by attempts to reuse connections already closed by the server.

Interestingly, this issue did not occur when requests were executed through Postman.

The module exports five asynchronous functions corresponding to the five server endpoints.

Each function builds the request body, sends the request, waits for the response, and displays the resulting output.

The client application ultimately provides an iterative text menu that allows users to select operations, enter parameters, and view server responses.

Additional implementation details can be found in the source code comments.

---

# Conclusions

This project provides a flexible solution for statistical analysis of JSON datasets through a REST API following a client-server architecture.

Code modularization, middleware-based validation, and the introduction of a caching mechanism contribute to improved maintainability, scalability, and efficiency.

The application is easily extensible, allowing new metrics and functionalities to be introduced with minimal modifications to the existing codebase.