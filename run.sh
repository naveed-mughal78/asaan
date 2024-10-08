#!/bin/bash

# Set your SonarQube token and project key
SONAR_TOKEN="sqp_cbc502abdf603da71464458f9afeafdb049a68b8"
PROJECT_KEY="codestructure"

# Generate and download the PDF report
curl -u $SONAR_TOKEN: "http://localhost:9000/api/cnesreport/report?key=$PROJECT_KEY&pdf=true" -o sonarqube-report.pdf

echo "PDF report downloaded as sonarqube-report.pdf"
