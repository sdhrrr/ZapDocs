# Setup and Usage Instructions

## Overview
This tool converts JSON files into interactive HTML documentation. Follow these steps to set up and run the documentation generator.

## Prerequisites

### 1. Install Node.js
1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS version** (recommended for most users)
3. Run the installer and follow the setup wizard
4. Accept all default settings during installation

### 2. Verify Installation
3. In the command window, type: `node --version`
4. You should see something like `v18.17.0` or similar
5. Type: `npm --version`
6. You should see something like `9.6.7` or similar

If both commands show version numbers, Node.js is installed correctly.

## Setting Up the Project

### 1. Clone the Repository
1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. Navigate to where you want to download the project (e.g., Desktop):
   ```
   cd C:\Users\YourName\Desktop
   ```
4. Clone the repository by typing:
   ```
   git clone https://github.com/sdhrrr/ZapDocs
   ```
5. Navigate into the project folder:
   ```
   cd ZapDocs
   ```


### 2. Install Dependencies
1. Make sure you're in the project folder (you should already be there from step 1)
2. If not, navigate to the project folder:
   ```
   cd C:\Users\YourName\Desktop\ZapDocs
   ```
3. Install required packages by typing:
   ```
   npm install
   ```
4. Wait for installation to complete (may take 1-2 minutes)

**If you encounter errors during installation:**
- "Cannot find module" errors: Run the `npm install` command again
- Permission errors: Run command prompt as Administrator
- Network errors: Check your internet connection and try again

## Running the Documentation Generator

### Basic Usage
1. Open command prompt 
2. Navigate to the project folder:
   ```
   cd C:\Users\YourName\Desktop\ZapDocs
   ```
3. Run the generator with your JSON file:
   ```
   node generate.js your-file.json
   ```

### Example Commands
```
node generate.js examples\professional-sample.json
node generate.js examples\democracy-hierarchical.json
node generate.js my-project.json
```

### What Gets Generated
The tool automatically creates **two HTML files** in the `output` folder:
1. `filename.html` - Interactive visualization with graphs
2. `filename-documentation.html` - Detailed documentation page

**Example**: Running `node generate.js my-project.json` creates:
- `output\my-project.html`
- `output\my-project-documentation.html`

## Viewing the Results

### Opening the Generated Files
1. Navigate to the `output` folder in your file explorer
2. Double-click any `.html` file
3. It will open in your default web browser
4. No internet connection required - files work completely offline

### Sample Files Already Available
The `output` folder contains example files you can open right now:
- `professional-sample.html` - Enterprise project example
- `democracy-detailed.html` - Educational example

## File Structure Overview

```
ZapDocs/
├── generate.js              # Main program file
├── package.json            # Project configuration
├── examples/               # Sample JSON files to try
│   ├── professional-sample.json
│   └── democracy-hierarchical.json
├── output/                 # Generated HTML files appear here
└── templates/              # System files (don't modify)
```

**Note**: The tool automatically creates files in the `output` folder with the same name as your JSON file.

