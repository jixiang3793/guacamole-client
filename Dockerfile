FROM openjdk:8
MAINTAINER guozhixiang 13405902541@163.com
COPY target/client-0.0.1-SNAPSHOT.jar client.jar
ENTRYPOINT ["java","-jar","/client.jar"]
EXPOSE 9300