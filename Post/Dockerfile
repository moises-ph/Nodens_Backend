FROM openjdk:20-rc-jdk
VOLUME /tmp
ARG JAR_FILE
COPY /target/Post-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 80
ENTRYPOINT exec java $JAVA_OPTS -jar /app.jar $ARGS