# API Specifications
This package contains the canonical API specifications for Cloud CNC.

## APIs

### HTTP
The HTTP API is used between the client and API server(s) for administrative tasks (eg: creating a
file, deleting a machine). The HTTP API is documented via the OpenAPI V3 specification allowing for
client and server code generation.

### Websocket
The Websocket API is used between the client, API server(s), and command relays for direct machine/
relay communication. The Websocket API is documented via the AsyncAPI V2 specification.