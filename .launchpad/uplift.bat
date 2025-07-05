@echo off

cd /D "%~dp0\.."

if not exist ".launchpad" (
    echo ERROR: .launchpad/uplift.bat must be run from the project root directory
    exit /b 1
)

echo Uplifting the project...
echo .

launchpad uplift %*
if not "%ERRORLEVEL%" == "0" (
    echo.
    echo ERROR: The uplift has failed
    exit /b 1
)
