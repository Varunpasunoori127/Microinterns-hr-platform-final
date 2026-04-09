# ---------- BUILD STAGE ----------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy only pom first (better caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy rest of code
COPY src ./src

# Build jar
RUN mvn clean package -DskipTests

# ---------- RUN STAGE ----------
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy built jar
COPY --from=build /app/target/*.jar app.jar

# Use Render's PORT (IMPORTANT)
ENV PORT=8080
EXPOSE 8080

ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Run app
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dserver.port=$PORT -jar /app/app.jar"]