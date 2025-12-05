# backend/Dockerfile

# 1. Etapa de Construcción
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
# Copiamos primero el pom.xml para aprovechar la caché de Docker
COPY pom.xml .
RUN mvn dependency:go-offline
# Copiamos el código y compilamos
COPY src ./src
RUN mvn clean package -DskipTests

# 2. Etapa de Ejecución
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]