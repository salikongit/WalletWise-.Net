# WalletWise Backend (Spring Boot)

This project is a migration of the WalletWise backend from .NET to Spring Boot. It provides a comprehensive financial management API including Authentication, Investment suggestions (SIP, Lumpsum, Equity), Loan Management, Expense Tracking, and Admin Dashboard.

## Features
- **Authentication**: JWT-based security with OTP verification via Email (AWS SES).
- **Financial Profile**: Track Income, Expenses, Loans, and Savings.
- **Investment Logic**: Calculate SIP/Lumpsum returns, suggest investments based on risk profile (Logic migrated from .NET).
- **PDF Reports**: Generate financial reports using OpenPDF.
- **Admin Dashboard**: View user statistics and manage users.
- **HTTPS/SSL**: Secure communication on port 5001.

## Prerequisites
- Java 17 or higher
- Maven 3.8+
- MySQL 8.0+

## Setup & Configuration

### 1. Database
Create a MySQL database named `WalletWiseSpringbootDB`.
The application will automatically create tables (`ddl-auto=update`).

### 2. Configuration (`application.properties`)
Update `src/main/resources/application.properties` with your credentials:
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/WalletWiseSpringbootDB
spring.datasource.username=root
spring.datasource.password=your_password

# Authentication
jwt.secret=YourSecretKey
otp.expiration-minutes=5

# AWS SES (For OTP)
aws.accessKeyId=YOUR_AWS_ACCESS_KEY
aws.secretKey=YOUR_AWS_SECRET_KEY
aws.ses.from-email=noreply@walletwise.com
```

### 3. SSL Configuration
The server runs on port **5001** with SSL enabled.
A self-signed keystore is provided at `src/main/resources/keystore.p12`.
Password: `walletwise123`

## Build & Run

### Build
```bash
mvn clean install
```

### Run
```bash
java -jar target/walletwise-api-0.0.1-SNAPSHOT.jar
```
Or run using Maven:
```bash
mvn spring-boot:run
```

## Migration Notes
- **Lombok Removal**: The code has been refactored to remove all Lombok dependencies (`@Data`, `@Builder`, `@Slf4j`). All DTOs, Models, and Services now use standard Java getters/setters/constructors.
- **ORM**: Uses Hibernate/JPA.
- **Security**: Spring Security 6 with JWT.
