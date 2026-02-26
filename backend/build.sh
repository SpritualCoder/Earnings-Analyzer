#!/usr/bin/env bash

# Install system dependencies
apt-get update
apt-get install -y tesseract-ocr poppler-utils

# Install python dependencies
pip install -r requirements.txt