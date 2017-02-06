# Java WebSockets

This is a simple app to demonstrate how to configure, manage, and use web sockets using Java Spring Boot. It requires Gradle, Java 8, and Nodejs 4.

## Getting Started

```bash
$ git clone https://github.com/skuttleman/java-web-sockets.git
$ cd java-web-sockets
$ gradle clean assemble
$ java -jar build/libs/java-socket-0.1.0.jar
```

Their are two UIs. Visit them at [http://localhost:8080/socket/manager](http://localhost:8080/socket/manager) and [http://localhost:8080/socket/client](http://localhost:8080/socket/client).

## Tests

### Unit Tests

There are javascript and java unit tests only for socket related code. Run them with `gradle test`.

### Acceptance Tests

Acceptance tests run with Rspec. Run them as follows.

```bash
$ gradle clean assemble
$ cd Acceptance
$ bundle install
$ bundle exec rspec
```