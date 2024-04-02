FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENV MYSQL_HOST=db2
ENV MYSQL_PORT=3306
ENV MYSQL_DATABASE=full_house_badger
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=lucky_badger

CMD ["java", "-jar", "app.jar"]