# Personal Dashboard - 構築マニュアル

Androidタブレット向けDAKboard風パーソナルダッシュボードです。天気、時刻、カレンダー、ToDo、ニュースを一画面に表示し、美しい背景写真とスライドショー機能を備えています。

## 🚀 クイックスタート

### 方法1: ローカルサーバーで起動（推奨）

```bash
# このフォルダで以下のコマンドを実行
python -m http.server 8000
```

ブラウザで `http://localhost:8000` にアクセス

### 方法2: ファイルを直接開く

`index.html` をダブルクリックしてブラウザで開く

> ⚠️ **注意**: 直接開く場合、CORS制約によりRSSニュースが表示されない場合があります

---

## 🔧 API設定

各機能を有効にするには、`config.js` にAPIキーを設定してください。

### 1. 天気（OpenWeatherMap）

1. [OpenWeatherMap](https://openweathermap.org/api) でアカウント作成（無料）
2. API Keys からキーを取得
3. `config.js` の `weather.apiKey` に設定

```javascript
weather: {
    apiKey: 'de09f9e9086456e1e8317b9a15618e7a',
    city: 'Tokyo',  // お住まいの都市名（英語）
    ...
}
```

### 2. 背景写真（Unsplash）

1. [Unsplash Developers](https://unsplash.com/developers) でアカウント作成
2. New Application を作成
3. Access Key を取得
4. `config.js` の `unsplash.accessKey` に設定

```javascript
unsplash: {
    accessKey: 'twpND1wbjc7hC50mmNxj7qvI5RSm8yfj49JWTRIoADE',
    query: 'nature,landscape',  // 検索キーワード
    ...
}
```

### 3. Googleカレンダー

1. Googleカレンダーを開く
2. 設定 → カレンダーを選択 → 「カレンダーの統合」
3. 「iCal形式の公開URLアドレス」をコピー
4. `config.js` の `calendar.icalUrl` に設定

```javascript
calendar: {
    icalUrl: 'ここにiCal URLを貼り付け',
    maxEvents: 5
}
```

### 4. RSSニュース

デフォルトでNHKとYahoo!ニュースが設定されています。変更する場合：

```javascript
rss: {
    feeds: [
        { name: 'NHKニュース', url: 'https://www.nhk.or.jp/rss/news/cat0.xml' },
        { name: 'Yahoo!ニュース', url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml' },
        // ここに追加
    ],
    maxItems: 6
}
```

---

## 📱 Androidタブレットでの全画面表示

### Chrome での設定

1. タブレットの Chrome で `http://[PCのIPアドレス]:8000` にアクセス
2. メニュー（⁝）→ 「ホーム画面に追加」
3. 追加されたアイコンをタップして起動

### 全画面モードを維持する設定

1. 設定 → ディスプレイ → 「ナビゲーションバーを非表示」を有効に
2. またはKioskアプリ（Fully Kiosk Browser等）を使用

### 画面の常時点灯

1. 設定 → ディスプレイ → 「画面のタイムアウト」を「なし」に設定
2. 電源接続時のみ常時点灯にする場合：
   - 開発者オプション → 「充電中は画面をオンのまま」を有効に

---

## 🎨 カスタマイズ

### テーマカラー変更

ダッシュボード右上の⚙️アイコンから変更可能です。

### スライドショー設定

```javascript
slideshow: {
    enabled: true,      // true: 有効, false: 無効
    interval: 30000,    // 切り替え間隔（ミリ秒）
}
```

### 背景更新間隔

```javascript
background: {
    updateInterval: 300000  // 5分 = 300000ms
}
```

---

## 📁 ファイル構成

```
タブレット用/
├── index.html    # メインHTML
├── style.css     # スタイルシート
├── script.js     # メインロジック
├── config.js     # 設定ファイル（APIキーはここ）
└── README.md     # このファイル
```

---

## 🔒 セキュリティ注意事項

- `config.js` にはAPIキーが含まれます
- ローカルネットワーク外からアクセスさせない場合は問題ありません
- 公開サーバーにデプロイする場合は、サーバーサイドでAPIを呼び出すよう変更してください

---

## 💡 トラブルシューティング

### 天気/ニュースが表示されない

- APIキーが正しく設定されているか確認
- ネットワーク接続を確認
- ブラウザのコンソール（F12）でエラーを確認

### 背景画像が表示されない

- Unsplash APIキーを確認
- API制限（50回/時間）に達していないか確認

### カレンダーが表示されない

- カレンダーが「公開」設定になっているか確認
- iCal URLが正しくコピーされているか確認

---

## 📄 ライセンス

このプロジェクトはMITライセンスの下で提供されています。
