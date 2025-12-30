/**
 * ダッシュボード設定ファイル
 * ここにAPIキーと各種設定を記入してください
 */

const CONFIG = {
    // ========================================
    // 天気 API 設定 (OpenWeatherMap)
    // 取得方法: https://openweathermap.org/api で無料登録
    // ========================================
    weather: {
        apiKey: 'de09f9e9086456e1e8317b9a15618e7a',  // ← ここにAPIキーを入力
        city: 'Tokyo',                           // 都市名（英語）
        units: 'metric',                         // metric: 摂氏, imperial: 華氏
        lang: 'ja'                               // 日本語表示
    },

    // ========================================
    // 背景画像 API 設定 (Unsplash)
    // 取得方法: https://unsplash.com/developers で無料登録
    // ========================================
    unsplash: {
        accessKey: 'twpND1wbjc7hC50mmNxj7qvI5RSm8yfj49JWTRIoADE',  // ← ここにAccess Keyを入力
        query: 'nature,landscape',               // 検索キーワード
        orientation: 'landscape'                 // landscape, portrait, squarish
    },

    // ========================================
    // Google Calendar 設定
    // 公開カレンダーのiCal URLを使用（認証不要）
    // 取得方法: Googleカレンダー → 設定 → カレンダーの統合 → 公開URL
    // ========================================
    calendar: {
        // iCal形式のURL（公開カレンダー）
        icalUrl: '',  // ← ここにiCalのURLを入力（空の場合はデモデータ表示）
        maxEvents: 5  // 表示するイベント数
    },

    // ========================================
    // RSS ニュースフィード設定
    // ========================================
    rss: {
        feeds: [
            { name: 'NHKニュース', url: 'https://www.nhk.or.jp/rss/news/cat0.xml' },
            { name: 'Yahoo!ニュース', url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml' },
            { name: 'Zenn', url: 'https://zenn.dev/feed' }
        ],
        maxItems: 6,  // 表示するニュース数
        // RSS2JSON API（CORS回避用、無料）
        proxyUrl: 'https://api.rss2json.com/v1/api.json?rss_url='
    },

    // ========================================
    // スライドショー設定
    // ========================================
    slideshow: {
        enabled: false,          // スライドショーの有効/無効（自動切り替えなし）
        interval: 30000,         // 切り替え間隔（ミリ秒）30秒
        transitionDuration: 1000 // フェード時間（ミリ秒）
    },

    // ========================================
    // 背景写真更新間隔
    // ========================================
    background: {
        updateInterval: 3600000   // 1時間ごとに背景を更新
    },

    // ========================================
    // テーマカラー設定
    // ========================================
    theme: {
        // デフォルトアクセントカラー（HSL形式）
        defaultAccentHue: 210,   // 青系
        // プリセットカラー
        presets: [
            { name: 'ブルー', hue: 210 },
            { name: 'パープル', hue: 270 },
            { name: 'ピンク', hue: 330 },
            { name: 'レッド', hue: 0 },
            { name: 'オレンジ', hue: 30 },
            { name: 'グリーン', hue: 150 },
            { name: 'シアン', hue: 180 }
        ]
    },

    // ========================================
    // 時刻表示設定
    // ========================================
    clock: {
        showSeconds: true,       // 秒を表示
        use24Hour: true          // 24時間表示
    }
};
