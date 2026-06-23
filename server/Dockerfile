# =============================================
# CashPilot - Backend Dockerfile
# =============================================

# Build stage
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy project files
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage (smaller image)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Environment variables (will be overridden by docker-compose .env)
ENV DB_URL=jdbc:postgresql://postgres:5432/cashpilot
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=123456
ENV SERVER_PORT=8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]