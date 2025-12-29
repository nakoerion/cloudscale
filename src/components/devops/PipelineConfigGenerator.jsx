import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileCode, Copy, Download, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PIPELINE_CONFIGS = {
  "github-actions": {
    name: "GitHub Actions",
    icon: "🐙",
    filename: ".github/workflows/deploy.yml",
    template: `name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run linter
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build application
        run: npm run build
        
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          
      - name: Deploy to production
        env:
          DEPLOY_KEY: \${{ secrets.DEPLOY_KEY }}
        run: npm run deploy`
  },
  "gitlab-ci": {
    name: "GitLab CI",
    icon: "🦊",
    filename: ".gitlab-ci.yml",
    template: `stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:\${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
    - npm test
  coverage: '/Statements\\s*:\\s*(\\d+\\.?\\d*)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:\${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  only:
    - main
    - develop

deploy_production:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST $DEPLOY_WEBHOOK
  environment:
    name: production
    url: https://app.example.com
  only:
    - main
  when: manual`
  },
  "bitbucket-pipelines": {
    name: "Bitbucket Pipelines",
    icon: "🪣",
    filename: "bitbucket-pipelines.yml",
    template: `image: node:18

pipelines:
  default:
    - step:
        name: Test
        caches:
          - node
        script:
          - npm ci
          - npm run lint
          - npm test
        artifacts:
          - coverage/**

  branches:
    main:
      - step:
          name: Build
          caches:
            - node
          script:
            - npm ci
            - npm run build
          artifacts:
            - dist/**
            
      - step:
          name: Deploy to Production
          deployment: production
          script:
            - pipe: atlassian/aws-elasticbeanstalk-deploy:1.0.2
              variables:
                AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID
                AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY
                APPLICATION_NAME: 'my-app'
                ENVIRONMENT_NAME: 'production'
                ZIP_FILE: 'dist.zip'
                
    develop:
      - step:
          name: Deploy to Staging
          deployment: staging
          script:
            - npm ci
            - npm run build
            - npm run deploy:staging

definitions:
  caches:
    node: node_modules`
  },
  "jenkins": {
    name: "Jenkins",
    icon: "👨‍🔧",
    filename: "Jenkinsfile",
    template: `pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 18'
    }
    
    environment {
        CI = 'true'
    }
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Unit Tests') {
                    steps {
                        sh 'npm test'
                    }
                    post {
                        always {
                            junit 'test-results/**/*.xml'
                            publishHTML([
                                reportDir: 'coverage',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                sh 'npm run deploy'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}`
  },
  "circleci": {
    name: "CircleCI",
    icon: "⭕",
    filename: ".circleci/config.yml",
    template: `version: 2.1

orbs:
  node: circleci/node@5.0.0

jobs:
  test:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - node/install-packages:
          pkg-manager: npm
      - run:
          name: Run linter
          command: npm run lint
      - run:
          name: Run tests
          command: npm test
      - store_test_results:
          path: test-results
      - store_artifacts:
          path: coverage

  build:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - node/install-packages
      - run:
          name: Build application
          command: npm run build
      - persist_to_workspace:
          root: .
          paths:
            - dist

  deploy:
    docker:
      - image: cimg/base:stable
    steps:
      - attach_workspace:
          at: .
      - run:
          name: Deploy to production
          command: |
            # Add your deployment commands here
            echo "Deploying to production..."

workflows:
  version: 2
  build-test-deploy:
    jobs:
      - test
      - build:
          requires:
            - test
      - deploy:
          requires:
            - build
          filters:
            branches:
              only: main`
  }
};

export default function PipelineConfigGenerator() {
  const [selectedPlatform, setSelectedPlatform] = useState("github-actions");
  const config = PIPELINE_CONFIGS[selectedPlatform];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(config.template);
    toast.success("Configuration copied to clipboard!");
  };

  const downloadConfig = () => {
    const blob = new Blob([config.template], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = config.filename;
    a.click();
    toast.success("Configuration downloaded!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-violet-600" />
          Pipeline Configuration Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <TabsList className="grid w-full grid-cols-5">
            {Object.entries(PIPELINE_CONFIGS).map(([key, platform]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <span>{platform.icon}</span>
                <span className="hidden sm:inline">{platform.name.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(PIPELINE_CONFIGS).map(([key, platform]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{platform.name}</h3>
                  <p className="text-sm text-slate-600">File: <code className="text-xs bg-slate-100 px-2 py-0.5 rounded">{platform.filename}</code></p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadConfig}>
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                </div>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs overflow-x-auto max-h-96 overflow-y-auto">
                <code>{platform.template}</code>
              </pre>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  What's Included
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Automated testing on every commit</li>
                  <li>• Code linting and quality checks</li>
                  <li>• Production build optimization</li>
                  <li>• Automated deployment to production</li>
                  <li>• Environment-specific configurations</li>
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}