# --- Stage 1: Build the JAR ---
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# 1. Copy only the pom.xml first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# 2. Copy the source code and build the project
COPY src ./src
RUN mvn clean package -DskipTests

# --- Stage 2: Run the App ---
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# 3. Copy only the compiled JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# 4. Run the Spring Boot application
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
