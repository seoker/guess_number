# 部署到 GitHub Pages 說明

## 前置準備

1. 確保你的專案已經推送到 GitHub 上
2. Repository 名稱應該是 `guess_number`（與 vite.config.js 中的 base 路徑一致）

## 部署步驟

### 1. 初始化 Git 並推送到 GitHub（如果還沒做的話）

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/guess_number.git
git push -u origin main
```

### 2. 在 GitHub 上啟用 GitHub Pages

1. 前往你的 GitHub repository 頁面
2. 點擊 `Settings` 標籤
3. 在左側選單中找到 `Pages`
4. 在 `Source` 部分選擇 `Deploy from a branch`
5. 選擇 `gh-pages` 分支
6. 點擊 `Save`

### 3. 部署應用

執行以下命令來部署：

```bash
npm run deploy
```

這個命令會：
- 執行 `npm run build` 來建構專案
- 使用 `gh-pages` 將 `dist` 資料夾推送到 GitHub 的 `gh-pages` 分支

### 4. 等待部署完成

部署完成後，你的遊戲將會在以下網址可用：
```
https://YOUR_USERNAME.github.io/guess_number/
```

## 重要提醒

- 確保 `vite.config.js` 中的 `base: '/guess_number/'` 與你的 repository 名稱一致
- 每次更新程式碼後，需要重新執行 `npm run deploy` 來更新網站
- 部署後可能需要等待幾分鐘才能看到更新

## 故障排除

如果遇到問題：

1. 檢查 GitHub Actions 是否有錯誤訊息
2. 確認 `gh-pages` 分支是否成功創建
3. 檢查 `vite.config.js` 中的 base 路徑是否正確
4. 確認 GitHub Pages 設定是否正確

## 自動化部署（可選）

如果你想要在每次 push 到 main 分支時自動部署，可以設定 GitHub Actions。詳細設定請參考 GitHub Actions 文檔。
