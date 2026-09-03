const mongoose = require("mongoose");
const Channel = require("../models/Channel");

const channels = [
  {
    name: "心羽あん",
    subs: 4837,
    bits: 50645,
    avatar: "/assets/kokohaan.png",
    twitchUrl: "https://www.twitch.tv/kokohaan",
    role: "VTuber",
    description:
      "Konnichiwa! I'm a Japanese Apprentice Witch🧙‍♀️💫 I'm learning English through all kinds of games🎀I aim to create a win-win stream where English speakers who want to learn Japanese and I can learn together✨ ※All archives are available on Youtube.",
  },

  {
    name: "がぶ飲みちゃん",
    subs: 4744,
    bits: 25000,
    avatar: "/assets/gabunomichan.png",
    twitchUrl: "https://www.twitch.tv/gabuchan_sy",
    role: "VTuber",
    description:
      "がぶちゃんと申します😊醤油をがぶ飲みしていたら色黒になりました🙏平日22:30～配信中！⋆͛🎮⋆͛ I'm Gabu-chan! I have chugged soy sauce a lot🙋‍♀️♡Genshin impact/Honkai starrail / Resindet evil / SF6♡",
  },

  {
    name: "我妻まや",
    subs: 1643,
    bits: 1100,
    avatar: "/assets/mayasan.png",
    twitchUrl: "https://www.twitch.tv/agatsuma_maya",
    role: "VTuber",
    description:
      "流星街育ちの未亡人です～！あがつままやなので、略してママって呼んでね❤みんなを優しく包んで絞めあげます❤※AIイラスト使用してるorしたことある配信者さんはごめんなさい。先手ブロックしてることもあります。",
  },

  {
    name: "れんれんだよぉ",
    subs: 352,
    bits: 0,
    avatar: "/assets/lenlendayoo.png",
    twitchUrl: "https://www.twitch.tv/lenlendayoo",
    role: "VTuber",
    description:
      "※全てのゲームが下手 / 不定期で配信(日中〜夕方が多め) / スタンプいっぱいあるから使ってね♡ / ※AIイラストを使用している方はブロックしていることがあります",
  },

  {
    name: "ちさと_",
    subs: 301,
    bits: 0,
    avatar: "/assets/chisato.png",
    twitchUrl: "https://www.twitch.tv/chisato_ou",
    role: "VTuber",
    description:
      "ちさと です！不定期になりますが、VALORANTを中心に配信してます！",
  },

  {
    name: "AkarinVT",
    subs: 550,
    bits: 0,
    avatar: "/assets/AkarinVT.png",
    twitchUrl: "https://www.twitch.tv/akarinvt",
    role: "VTuber",
    description:
      "hi! my name is 岩倉あかりん/ Iwakura Akarin. I'm a white cat virtual YouTuber こんにちは！岩倉あかりんと申します。白猫バーチャルYouTuberです welcome to the channel! I do a lot of just chatting to chat. I play mostly FPS games but l would love to try other game genres as well 私は視聴者に対して「雑談」をたくさんします。私は主に FPS ゲームをプレイしますが、他のゲームジャンルも試してみたいと思っています language main is english but I am currently learning japanese so I would be glad if you could teach me 主に英語を話しますが、現在日本語を勉強中なので、教えていただけると嬉しいです",
  },

  {
    name: "はるこさん",
    subs: 123,
    bits: 0,
    avatar: "/assets/harukochan.png",
    twitchUrl: "https://www.twitch.tv/hal_ol",
    role: "VTuber",
    description:
      "はるこです。アヒルとコーヒーがすきです。",
  },

  {
    name: "さわ____",
    subs: 20,
    bits: 0,
    avatar: "/assets/sawasan.png",
    twitchUrl: "https://www.twitch.tv/sawa_430",
    role: "VTuber",
    description:
      "❆HoYoCREATORS&Endfield IndustriesCreators❆歯医者さんでお仕事しながら、原神メインにHoYoverseのゲームの配信をしています。最近エンドフィールド始めました(⑉･ ･⑉)",
  },

  {
    name: "みつのはの",
    subs: 5,
    bits: 0,
    avatar: "/assets/みつのはの.png",
    twitchUrl: "https://www.twitch.tv/8nohallo",
    role: "VTuber",
    description:
      "ゲームとカフェラテが好きです☕🌙",
  },

  {
    name: "餅乃さや",
    subs: 5,
    bits: 0,
    avatar: "/assets/餅乃さや.png",
    twitchUrl: "https://www.twitch.tv/mochino_saya",
    role: "VTuber",
    description:
      "ゲームとジャンクフード大好き管理不足栄養士🍡 21時頃〜牧場物語、原神、崩壊スターレイル、ゼンレスゾーンゼロなど配信してます🐰",
  },

  {
    name: "深白まお",
    subs: 20,
    bits: 0,
    avatar: "/assets/深白まお.png",
    twitchUrl: "https://www.twitch.tv/mishiromao",
    role: "VTuber",
    description:
      "深白まおと申します！ I'm Mao Mishiro!（ debut 23.04.01 / Twitch Partner 23.11.08 ）🎮 game | 🗣️ just chatting | 🎨 draw | 🎶 sing | 🤍 model : ramune 様 | ✉ contact : info@seedsglobal.jp",
  },

  {
    name: "狐白しゅろ",
    subs: 29,
    bits: 0,
    avatar: "/assets/狐白しゅろ.png",
    twitchUrl: "https://www.twitch.tv/kohakushuro",
    role: "VTuber",
    description:
      "こんしゅろ～🦊🎀ゲーム大好きなきつねの女の子です🤍ゆるくぽへぽへ一緒に過ごそう～!!",
  },

  {
    name: "TenZ",
    subs: 25,
    bits: 0,
    avatar: "/assets/Tenz.png",
    twitchUrl: "https://www.twitch.tv/tenz",
    role: "FPS Creator",
    description:
      "Hey I'm Tyson (TenZ), 25 year old from Vancouver Island, B.C. Now living in LA. Influencer for T1, Previously Professional VALORANT (Sentinels, Cloud9) and CS:GO (Cloud9). Half Vietnamese and Half French. Hope you enjoy your stay!",
  },
];

async function seedChannels() {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/twitchledger"
    );

    console.log("MongoDB Connected");

    await Channel.deleteMany({});

    await Channel.insertMany(channels);

    console.log(
      `${channels.length} channels inserted successfully`
    );

    await mongoose.connection.close();

    console.log("MongoDB Connection Closed");
  } catch (error) {
    console.error("Seed Failed:", error);
    process.exit(1);
  }
}

seedChannels();