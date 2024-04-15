FROM openjdk:17-jdk-slim
WORKDIR /app
COPY . /app
EXPOSE 8080

RUN sed -i -e 's/\r$//' gradlew
CMD ["./gradlew", "bootRun"]