import * as mc from 'mojang-minecraft';

/**
 * イベントを取得する
 *
 * 詳細はイベントの例文を参照(events/readme.md)
 */
function events() {
  const events: mc.Events = mc.world.events;
}

/**
 * 次元を取得する
 *
 * 詳細は`dimension.ts`を参照
 */
function getDimension() {
  // 基本的には3種の次元だけを取得できる
  const overworld: mc.Dimension = mc.world.getDimension(mc.MinecraftDimensionTypes.overworld);
  const nether: mc.Dimension = mc.world.getDimension(mc.MinecraftDimensionTypes.nether);
  const theEnd: mc.Dimension = mc.world.getDimension(mc.MinecraftDimensionTypes.theEnd);
}

/**
 * ワールド全体のプレイヤーを取得する
 */
function getPlayers() {
  const players: mc.PlayerIterator = mc.world.getPlayers();

  for (let player of players) {
    player.runCommand(`say ${player.nameTag}`);
  }
}

/**
 * 音楽を操作する
 *
 * 設定は /music とほぼ同じ
 */
function music() {
  const trackID = 'record.cat';
  // 音楽の設定
  const options = new mc.MusicOptions();
  // 再生終了時の音楽のフェードオーバーラップを指定する
  options.fade = 5;
  // 繰り返すか
  options.loop = false;
  // 相対的な音量
  options.volume = 1.0;

  mc.world.events.beforeChat.subscribe((event) => {
    if (event.message === 'play') {
      // 音楽を再生する
      event.sender.runCommand('say play');
      mc.world.playMusic(trackID, options);
    }

    if (event.message === 'stop') {
      // 音楽を停止する
      mc.world.stopMusic();
    }

    if (event.message === 'queue') {
      // 次に再生する音楽を設定する
      mc.world.queueMusic(trackID, options);
    }
  });
  // 音楽を再生する
}

/**
 * 効果音を再生する
 */
function sound() {
  const soundID = 'mob.pig.say';

  const options = new mc.SoundOptions();
  options.pitch = 1.0;
  options.volume = 1.0;

  mc.world.events.beforeChat.subscribe((event) => {
    if (event.message === 'play') {
      options.location = event.sender.location;
      mc.world.playSound(soundID, options);
    }
  });
}

/**
 * ワールドのスコアボード
 */
function scoreboard() {
  mc.world.scoreboard;
}

/**
 * ワールドのダイナミックプロパティを操作する
 */
function dynamicProperty() {
  mc.world.getDynamicProperty('sample');
  mc.world.setDynamicProperty('sample', 0);
  mc.world.removeDynamicProperty('sample');
}
