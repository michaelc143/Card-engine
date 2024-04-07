FROM openjdk:17-jdk-slim
WORKDIR /app
COPY . /app
EXPOSE 8080
ENV MYSQL_HOST=db2 \
    MYSQL_PORT=3306 \
    MYSQL_DATABASE=full_house_badger \
    MYSQL_USER=root \
    MYSQL_PASSWORD=lucky_badger

CMD ["./gradlew", "bootRun"]