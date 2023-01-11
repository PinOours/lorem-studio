@echo off
set node=%cd%\bin\app\node.exe
set nodescripts=.\bin\node-scripts
set localName="loremcraft-1.19.2"
set localMinecraft=%cd%\.minecraft
set minecraft=%appdata%\.minecraft
set localVersion=%cd%\bin\forge\%localName%
set minecraftVersion=%minecraft%\versions
set update=%1

if [%update%]==[] ( start /B /WAIT %cd%\bin\update.bat)

@echo on
%node% %nodescripts%\wget.js
%node% %nodescripts%\unzip.js
@echo off

rename %cd%\lorem-studio-modpack lorem-studio
mkdir %localMinecraft%\mods
copy %cd%\lorem-studio %localMinecraft%\mods /Y

mkdir %minecraftVersion%\%localName%\
copy %cd%\bin\forge\%localName% %minecraftVersion%\%localName%\
copy %minecraft%\launcher_profiles.json %cd%\bin

%node% %nodescripts%\profileEditor.js

copy %cd%\bin\launcher_profiles.json %appdata%\.minecraft\

del /s /q /f %cd%\bin\*.zip
rmdir %cd%\lorem-studio /Q /S
rmdir %cd%\bin\forge\%localName% /Q /S
rmdir %cd%\bin\lorem-studio-files /Q /S
del /s /q /f %cd%\bin\launcher_profiles.json