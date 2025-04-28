# Laplusblog

Blog repository

postsに記事をmarkdownで記載することで自動的に記事投稿ができる

## 画像変換メモ

imagemagickを使って、ブログ用の画像に変換する

- 画像の形式をWebPにして解像度を落とす

  ```bash
  convert input.jpg  -quality 80 -resize '1920x1920>' output.webp
   ```

- 画像を横方向に結合する

  ```bash
  convert image1.jpg image2.jpg +append output.jpg
  ```
