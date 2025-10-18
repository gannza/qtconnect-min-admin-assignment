@echo off
echo 🚀 Setting up Admin Panel...

REM Check if Node.js version is correct
node -v
echo 📦 Node.js version checked

REM Install dependencies
echo 📥 Installing dependencies...
npm install

REM Create necessary directories
echo 📁 Creating directories...
if not exist "src\components\ui" mkdir "src\components\ui"
if not exist "src\store\slices" mkdir "src\store\slices"
if not exist "src\store\api" mkdir "src\store\api"
if not exist "src\utils" mkdir "src\utils"
if not exist "src\hooks" mkdir "src\hooks"
if not exist "src\pages" mkdir "src\pages"
if not exist "src\proto" mkdir "src\proto"

echo ✅ Setup complete!
echo.
echo To start development:
echo   npm run dev
echo.
echo To build for production:
echo   npm run build
pause
