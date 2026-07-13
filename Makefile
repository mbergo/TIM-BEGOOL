# Azure Deployment Makefile for TIM-Beergol AuroraOps
# Customize these variables or override them on the command line: e.g., make deploy APP_NAME=my-custom-beergol

APP_NAME ?= tim-beergol-auroraops
RG_NAME ?= rg-tim-beegol
PLAN_NAME ?= plan-tim-beegol
LOCATION ?= westeurope
SKU ?= B1
RUNTIME ?= NODE:20-lts

.PHONY: all help install build package create-infra deploy logs clean config-env

all: help

help:
	@echo "TIM-Beergol AuroraOps Azure Deployment CLI Automation"
	@echo "======================================================"
	@echo "Available commands:"
	@echo "  make install           - Install npm dependencies"
	@echo "  make build             - Build frontend production assets"
	@echo "  make package           - Create deployment zip file (deploy.zip)"
	@echo "  make create-infra      - Provision Azure resource group, app service plan, and web app"
	@echo "  make deploy            - Package and deploy application to Azure App Service"
	@echo "  make config-env KEY=x  - Configure an environment variable on Azure (e.g. make config-env KEY=GEMINI_API_KEY VALUE=yourkey)"
	@echo "  make logs              - Tail live log stream from Azure App Service"
	@echo "  make clean             - Clean up build folders and zip archives"
	@echo ""
	@echo "Configured Variables:"
	@echo "  App Name:         $(APP_NAME)"
	@echo "  Resource Group:   $(RG_NAME)"
	@echo "  App Service Plan: $(PLAN_NAME)"
	@echo "  Location:         $(LOCATION)"
	@echo "  Plan SKU:         $(SKU)"
	@echo "  Runtime:          $(RUNTIME)"

install:
	npm install

build:
	npm run build

package: build
	@echo "Creating deployment package deploy.zip..."
	@rm -f deploy.zip
	zip -r deploy.zip dist server.js package.json package-lock.json
	@echo "Package deploy.zip created successfully."

create-infra:
	@echo "Creating Azure Resource Group '$(RG_NAME)' in '$(LOCATION)'..."
	az group create --name $(RG_NAME) --location $(LOCATION)
	@echo "Creating Azure App Service Plan '$(PLAN_NAME)' (Linux, SKU '$(SKU)')..."
	az appservice plan create --name $(PLAN_NAME) --resource-group $(RG_NAME) --sku $(SKU) --is-linux --location $(LOCATION)
	@echo "Creating Azure Web App '$(APP_NAME)' with runtime '$(RUNTIME)'..."
	az webapp create --name $(APP_NAME) --resource-group $(RG_NAME) --plan $(PLAN_NAME) --runtime "$(RUNTIME)"
	@echo "Enabling HTTP logging for the Web App..."
	az webapp log config --name $(APP_NAME) --resource-group $(RG_NAME) --web-server-logging filesystem
	@echo "Infrastructure created successfully."

deploy: package
	@echo "Deploying deploy.zip to Azure Web App '$(APP_NAME)'..."
	az webapp deployment source config-zip --resource-group $(RG_NAME) --name $(APP_NAME) --src deploy.zip
	@echo "Deployment complete! Your app should be live soon."

config-env:
	@if [ -z "$(KEY)" ] || [ -z "$(VALUE)" ]; then \
		echo "Error: Both KEY and VALUE must be specified. Example: make config-env KEY=GEMINI_API_KEY VALUE=mykey"; \
		exit 1; \
	fi
	@echo "Setting environment variable $(KEY) on Azure Web App '$(APP_NAME)'..."
	az webapp config appsettings set --resource-group $(RG_NAME) --name $(APP_NAME) --settings $(KEY)="$(VALUE)"
	@echo "Environment variable set."

logs:
	az webapp log tail --resource-group $(RG_NAME) --name $(APP_NAME)

clean:
	npm run clean
	rm -f deploy.zip
