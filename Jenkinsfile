
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Downloading project from GitHub...'
                checkout scm
            }
        }

        stage('Verify Docker') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker --version'
                    } else {
                        bat 'docker --version'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker build -t deadlock-codex:latest .'
                    } else {
                        bat 'docker build -t deadlock-codex:latest .'
                    }
                }
            }
        }

        stage('Verify Image') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker image inspect deadlock-codex:latest'
                    } else {
                        bat 'docker image inspect deadlock-codex:latest'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Deadlock Codex Docker image built!'
        }

        failure {
            echo 'FAILED: Please check the Jenkins console output.'
        }
    }
}
