import type { VehicleFeature } from "@/types";

/**
 * NX（乗り換えオーナー向け）の機能データ。
 * 設定状況（settingStatus）を持つ機能は「充電スケジュール」ページの設定一覧に表示。
 * priority S/A/B はドアアシストページの候補リスト表示順に使用。
 * 出典: docs/input/concierge_app_mock_system_overview.md, ユーザー提供の機能候補表
 */
export const vehicleFeatures: VehicleFeature[] = [
  {
    id: "door-assist",
    name: "ドア開スイッチ＋安心降車アシスト",
    category: "乗降",
    icon: "door",
    priority: "S",
    tagline: "XVとはドアの開け方が変わっています",
    description:
      "NXはe-Latch（電動ラッチ）を採用しており、ドアハンドルを引くと内部スイッチが反応してドアが解放されます。また「安心降車アシスト」は後方からの接近車両を検知した場合にドア開放をアシストする機能です。",
    differenceNote:
      "従来の機械式ドアハンドルと操作感が大きく異なります。焦って強く引くとロック状態と誤認しやすいため、最初に操作感を確認しておくことをおすすめします。",
    steps: [
      {
        label: "ドアハンドルを軽く引く",
        detail: "ロック解除後、軽く引くだけでラッチが作動しドアが開きます。強く引く必要はありません。",
      },
      {
        label: "降車前に周囲を確認する",
        detail: "後方から自転車・バイクが接近している場合、開放抑制インジケーターが点灯します。",
      },
      {
        label: "インジケーターが消えたら降車",
        detail: "インジケーター消灯後、ハンドルを再度軽く引いてドアを開けてください。",
      },
    ],
    ctaLabel: "動作を確認する",
  },
  {
    id: "charge-schedule",
    name: "充電スケジュール",
    category: "充電",
    icon: "bolt",
    priority: "S",
    tagline: "まず最初に、充電をあなたの生活に合わせましょう",
    description:
      "NX450h+はPHEVのため、自宅での充電スケジュールを設定することで夜間の電力安価帯に自動充電が可能です。帰宅後すぐに充電を開始するか、指定時刻から開始するかを選択できます。",
    differenceNote:
      "XVには外部充電という概念がありませんでした。PHEVを使いこなす根本となる設定です。",
    settingStatus: { state: "not_configured", label: "未設定" },
    steps: [
      {
        label: "マルチメディアシステムを開く",
        detail: "ホーム画面から「車両設定」→「充電」を選択します。",
      },
      {
        label: "充電タイマーをONにする",
        detail: "充電開始時刻（例：23:00）と目標充電量（80%推奨）を設定します。",
      },
      {
        label: "毎日繰り返しをONにする",
        detail: "曜日ごとに異なるスケジュールも設定可能です。",
      },
    ],
    ctaLabel: "設定を開く",
  },
  {
    id: "ev-mode",
    name: "EV / HVモードの使い分け",
    category: "走行",
    icon: "bolt",
    priority: "S",
    tagline: "街中・高速、それぞれおすすめの走り方があります",
    description:
      "NX450h+はEVモード（電気のみ）、AUTO EV-HVモード（自動切換え）、HVモード（エンジン主体）の3種類から選択できます。街中の短距離走行はEVモード、長距離・高速走行はHVモードが効率的です。",
    differenceNote:
      "XV/e-BOXERとはエネルギーの使い分け思想が大きく異なります。PHEVのメリットを活かすにはモードの違いを理解することが重要です。",
    steps: [
      { label: "EVモード", detail: "バッテリーのみで走行。自宅周辺の短距離や駐車場内での移動に最適。" },
      { label: "AUTO EV-HVモード", detail: "速度・負荷に応じてEV/HVを自動切換え。通常走行はこのモードを推奨。" },
      { label: "HVモード", detail: "エンジンを積極的に使用。高速道路・山道など電力消費が多い場面に適切。" },
    ],
    ctaLabel: "モードを確認する",
  },
  {
    id: "driver-profile",
    name: "ドライバー登録／マイセッティング",
    category: "パーソナライズ",
    icon: "users",
    priority: "S",
    tagline: "最初に「あなたのNX」にしましょう",
    description:
      "ドライバーを登録すると、シート位置・ミラー角度・マルチメディア設定・エアコンなどをドライバー単位で自動保存・呼び出しできます。複数人で乗車する場合も、乗り込んだドライバーを選ぶだけで全設定が切り替わります。",
    differenceNote:
      "NXではドライバー登録を初期設定で行うことで、その後の体験全体がパーソナライズされます。後から設定し直すより初回が最もラクです。",
    settingStatus: { state: "configured", label: "YANAGI 登録済み" },
    ctaLabel: "設定を確認する",
  },
  {
    id: "seat-memory-1",
    name: "シートメモリー 1",
    category: "シート",
    icon: "users",
    priority: "A",
    tagline: "よく使うシート位置をワンタッチで呼び出せます",
    description:
      "ドアパネルのメモリーボタン（M・1・2）でシート位置・ドアミラー角度を記憶します。メモリー1には現在のドライバー設定が保存されています。",
    settingStatus: { state: "configured", label: "運転席設定 1 登録済み" },
    steps: [
      { label: "シート・ミラーを好みの位置に調整", detail: "ステアリング位置も含めて調整できます。" },
      { label: "「SET」ボタンを3秒長押し", detail: "ドア内側のメモリーパネルにあります。" },
      { label: "メモリーボタン（1または2）を押す", detail: "ビープ音で登録完了を確認してください。" },
    ],
    ctaLabel: "設定を更新する",
  },
  {
    id: "seat-memory-2",
    name: "シートメモリー 2",
    category: "シート",
    icon: "users",
    priority: "A",
    tagline: "同乗者・家族のシート位置を登録できます",
    description:
      "メモリー2には別のドライバーやご家族の設定を保存できます。未設定の場合、メモリーボタン「2」を押しても反応しません。",
    settingStatus: { state: "not_configured", label: "未設定" },
    steps: [
      { label: "別ドライバーのシート・ミラーを調整", detail: "乗車する方が自分で調整するとスムーズです。" },
      { label: "「SET」ボタンを3秒長押し", detail: "ドア内側のメモリーパネルにあります。" },
      { label: "メモリーボタン「2」を押す", detail: "ビープ音で登録完了を確認してください。" },
    ],
    ctaLabel: "設定を開く",
  },
  {
    id: "bluetooth",
    name: "Bluetooth",
    category: "コネクティビティ",
    icon: "sparkles",
    priority: "A",
    tagline: "スマートフォンと接続して音楽や電話を楽しめます",
    description:
      "iPhoneまたはAndroidスマートフォンをBluetooth接続することで、Apple CarPlay / Android Auto、ハンズフリー通話、音楽再生が利用できます。",
    settingStatus: { state: "configured", label: "美咲のiPhone 設定済み" },
    steps: [
      { label: "スマートフォンのBluetooth設定を開く", detail: "「NX」デバイスを選択して接続します。" },
      { label: "マルチメディアで「接続機器」を開く", detail: "ペアリングリクエストが表示されたら「承認」を選択します。" },
      { label: "Apple CarPlay / Android Autoを有効化", detail: "ホーム画面から起動できるようになります。" },
    ],
    ctaLabel: "接続設定を確認する",
  },
  {
    id: "digital-key",
    name: "デジタルキー",
    category: "コネクティビティ",
    icon: "shield-check",
    priority: "A",
    tagline: "スマホをキーとして使えることをご存じですか？",
    description:
      "スマートフォンをNXのデジタルキーとして登録すると、物理キーなしでドアの施解錠・エンジン始動が可能になります。信頼できる家族や知人と一時的にキーを共有することもできます。",
    differenceNote:
      "存在を知らないと検索すらしない典型的な機能です。設定はLexusアプリから行います。",
    settingStatus: { state: "not_configured", label: "未設定" },
    steps: [
      { label: "Lexusアプリをスマートフォンにインストール", detail: "App Store / Google Playから入手可能です。" },
      { label: "アプリでデジタルキーを登録", detail: "車両のVINと連絡先メールアドレスが必要です。" },
      { label: "NX側でアクティベーションを完了", detail: "マルチメディア画面の案内に従い認証します。" },
    ],
    ctaLabel: "Lexusアプリを開く",
  },
  {
    id: "advanced-park",
    name: "Advanced Park / Remote Park",
    category: "駐車支援",
    icon: "car",
    priority: "A",
    tagline: "駐車が苦手なら、この機能がおすすめです",
    description:
      "Advanced Parkはセンサーとカメラで駐車スペースを認識し、ハンドル・アクセル・ブレーキを自動制御して駐車を完了します。Remote Parkはスマートフォンから車外操作で駐車が可能です（装備による）。",
    differenceNote:
      "XVにはないタイプの高度な駐車支援です。NXの車幅に慣れるまでの間、特に有効です。",
    usageStatus: { state: "unused", label: "未使用" },
    ctaLabel: "機能を確認する",
  },
  {
    id: "lexus-safety",
    name: "Lexus Safety System + (LSS+)",
    category: "運転支援",
    icon: "shield-check",
    priority: "A",
    tagline: "EyeSightをお使いでしたね。NXではここが変わります",
    description:
      "LSS+はプリクラッシュセーフティ（PCS）・レーントレーシングアシスト（LTA）・ドライバーモニタリングシステム・レーダークルーズコントロール（DRCC）などを統合した運転支援パッケージです。",
    differenceNote:
      "スバルEyeSightと似た機能ですが、操作方法・スイッチ位置・支援範囲が異なります。「似ているからこそ差分を確認」することが重要です。",
    settingStatus: { state: "not_configured", label: "未設定" },
    usageStatus: { state: "partial_use", label: "一部利用中" },
    steps: [
      { label: "ステアリングスイッチで機能をONにする", detail: "LTAはONにしておくと高速道路で有効になります。" },
      { label: "DRCC目標車速を設定する", detail: "ステアリング右側の「+/-」ボタンで速度を設定します。" },
      { label: "BSM（ブラインドスポットモニター）を有効化", detail: "車両設定メニューから常時ONに設定できます。" },
    ],
    ctaLabel: "設定を確認する",
  },
  {
    id: "hud",
    name: "ヘッドアップディスプレイ（HUD）",
    category: "ディスプレイ",
    icon: "sparkles",
    priority: "A",
    tagline: "視線を動かさず操作できるよう設定しましょう",
    description:
      "フロントガラスに速度・ナビ案内・安全情報を投影します。表示高さ・明るさ・表示内容をドライバーの目線に合わせてカスタマイズできます。",
    settingStatus: { state: "not_configured", label: "未設定" },
    usageStatus: { state: "unused", label: "未使用" },
    steps: [
      { label: "HUDスイッチをONにする", detail: "インストルメントパネル左側のスイッチで起動します。" },
      { label: "表示高さを調整する", detail: "同スイッチの上下で投影位置を調整します。正面視線に合わせてください。" },
      { label: "表示内容をカスタマイズ", detail: "車両設定 → HUD設定から、表示する情報を選択できます。" },
    ],
    ctaLabel: "設定を開く",
  },
  {
    id: "panoramic-view",
    name: "パノラミックビュー／駐車支援",
    category: "駐車支援",
    icon: "car",
    priority: "B",
    tagline: "XVより大きくなった車幅を、カメラがサポートします",
    description:
      "前後左右の4カメラ映像を合成し、車両を真上から見た鳥瞰図を表示します。NXはXVより全幅が広いため、駐車枠への収め方に慣れるまでこの機能が特に有効です。",
    differenceNote:
      "XVにも後方支援はありましたが、NXは周辺監視・駐車支援がより高度化されています。",
    usageStatus: { state: "unused", label: "未使用" },
    ctaLabel: "機能を確認する",
  },
  {
    id: "eco-drive",
    name: "先読みエコドライブ",
    category: "走行",
    icon: "bolt",
    priority: "B",
    tagline: "NXは、あなたの走り方を学習します",
    description:
      "過去の走行データ（よく使う道・減速地点・信号タイミング）を学習し、エネルギー効率が高くなるようEV/HV制御をサポートします。走行を重ねるほど精度が向上します。",
    differenceNote:
      "「車が使うほど自分にFitする」というコンシェルジュ思想と相性のよい機能です。",
    settingStatus: { state: "learning", label: "学習中（2週間使用後に有効化）" },
    ctaLabel: "学習状況を確認する",
  },
];

export function getFeatureById(id: string): VehicleFeature | undefined {
  return vehicleFeatures.find((feature) => feature.id === id);
}

/** 充電スケジュールページに表示する「設定状況」一覧 */
export const settingsFeatureIds = [
  "charge-schedule",
  "driver-profile",
  "seat-memory-1",
  "seat-memory-2",
  "bluetooth",
  "digital-key",
  "hud",
  "eco-drive",
];

export function getSettingsFeatures(): VehicleFeature[] {
  return settingsFeatureIds
    .map((id) => vehicleFeatures.find((f) => f.id === id))
    .filter((f): f is VehicleFeature => Boolean(f));
}

/** ドアアシストページに表示する「候補リスト」（S→A→B 順） */
export function getFeatureCandidates(): VehicleFeature[] {
  const order: Record<string, number> = { S: 0, A: 1, B: 2 };
  return [...vehicleFeatures].sort(
    (a, b) => (order[a.priority] ?? 9) - (order[b.priority] ?? 9)
  );
}

/** 運転支援設定ページに表示する機能リスト */
export const drivingAssistFeatureIds = [
  "lexus-safety",
  "advanced-park",
  "hud",
  "panoramic-view",
];

export function getDrivingAssistFeatures(): VehicleFeature[] {
  return drivingAssistFeatureIds
    .map((id) => vehicleFeatures.find((f) => f.id === id))
    .filter((f): f is VehicleFeature => Boolean(f));
}
