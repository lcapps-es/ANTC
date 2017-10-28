cd ..

cp manifest-firefox.json manifest.json
zip -r build/ANTC-firefox.zip . -x "build/*" ".git/*" "manifest-chrome.json" "manifest-firefox.json" "*.zip" "README.md" ".vscode/*"
rm manifest.json

cp manifest-chrome.json manifest.json
zip -r build/ANTC-chrome.zip . -x "build/*" ".git/*" "manifest-chrome.json" "manifest-firefox.json" "*.zip" "README.md" ".vscode/*"
rm manifest.json