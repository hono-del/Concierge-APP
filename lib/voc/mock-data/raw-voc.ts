/**
 * デモ用Raw VoC初期データ（7件・要件最低6件）
 * 原文の大量転載ではなく、デモ用に短く要約したサンプル文章。
 * 出典: docs/input/voc_knowledge_system_overview_requirements.md #6, #19
 */

export interface SeedRawVoc {
  id: string;
  sourceId: string;
  rawTitle: string;
  rawText: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
}

export const seedRawVoc: SeedRawVoc[] = [
  {
    id: "raw-door-01",
    sourceId: "src-minkara",
    rawTitle: "後席の左ドアが外からだけ開かない",
    rawText:
      "納車2か月のNX450h+です。後席左側のドアが、車外からハンドルを引いても開かないことがあります。車内からは問題なく開きます。スマートキーは携帯しています。同じ症状の方いますか？",
    sourceName: "みんカラ NX Q&A",
    sourceUrl: "https://minkara.carview.co.jp/car/lexus/nx/qa/?ci=3&q=1023",
    publishedAt: "2026-05-12",
  },
  {
    id: "raw-elatch-01",
    sourceId: "src-minkara",
    rawTitle: "e-Latchのタッチセンサーが反応しないことがある",
    rawText:
      "後席のe-Latch（外側の開閉センサー）を押しても無反応な時があります。数回押すと開きます。ディーラーに相談する前に確認できることはありますか？",
    sourceName: "みんカラ NX Q&A",
    sourceUrl: "https://minkara.carview.co.jp/car/lexus/nx/qa/?ci=3&q=1109",
    publishedAt: "2026-06-02",
  },
  {
    id: "raw-battery-01",
    sourceId: "src-minkara",
    rawTitle: "1週間放置したら12Vバッテリーが上がった",
    rawText:
      "出張で1週間車を動かさなかったところ、スマートキーでの解錠ができずバッテリーが上がっていました。ハイブリッド用バッテリーとは別に12Vバッテリーがあると聞きましたが、対策はありますか？",
    sourceName: "みんカラ NX Q&A",
    sourceUrl: "https://minkara.carview.co.jp/car/lexus/nx/qa/?ci=3&q=1157",
    publishedAt: "2026-06-20",
  },
  {
    id: "raw-carplay-01",
    sourceId: "src-cskreview",
    rawTitle: "Apple CarPlayが走行中に切断される",
    rawText:
      "高速道路走行中、CarPlayの接続が数分おきに切れます。ケーブルは純正品を使用。ソフトウェアバージョンは古いままかもしれません。同様の報告はありますか？",
    sourceName: "CSK REVIEW CHANNEL",
    sourceUrl: "https://cskreview.com/nxfuguai/#carplay",
    publishedAt: "2026-04-28",
  },
  {
    id: "raw-navifreeze-01",
    sourceId: "src-cskreview",
    rawTitle: "ナビ画面が時々フリーズする",
    rawText:
      "ナビゲーション操作中に画面がフリーズし、数秒〜数十秒操作を受け付けなくなることがあります。再起動すると直ります。特定の操作で起きやすい気がします。",
    sourceName: "CSK REVIEW CHANNEL",
    sourceUrl: "https://cskreview.com/nxfuguai/#navifreeze",
    publishedAt: "2026-05-30",
  },
  {
    id: "raw-noise-01",
    sourceId: "src-testdrive",
    rawTitle: "低速時に足回りからコトコト音",
    rawText:
      "段差を超えた後、低速走行中に足回りから小さなコトコト音が続くことがあります。速度を上げると聞こえなくなります。試乗した複数のNXオーナーからも同様の声を聞きました。",
    sourceName: "試乗マニアのドライブジャーナル",
    sourceUrl: "https://bicyclenet.jp/lexus-nx-issues-checklist/#noise",
    publishedAt: "2026-05-18",
  },
  {
    id: "raw-elatch-02",
    sourceId: "src-testdrive",
    rawTitle: "冬場、手袋をしているとe-Latchの反応が悪い気がする",
    rawText:
      "厚手の手袋をしたままe-Latchに触れると反応しないことが多いです。素手やタッチ位置を変えると開くことが多いという声を複数のオーナーから聞きました。",
    sourceName: "試乗マニアのドライブジャーナル",
    sourceUrl: "https://bicyclenet.jp/lexus-nx-issues-checklist/#elatch-glove",
    publishedAt: "2026-06-10",
  },
];
