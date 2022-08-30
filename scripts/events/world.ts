import * as mc from 'mojang-minecraft';

const overworld = mc.world.getDimension(mc.MinecraftDimensionTypes.overworld);

/**
 * tick
 *
 * このイベントはtick毎（1秒間に20回）に発生します。
 */
function tick(event: mc.TickEvent) {
  // このイベントが起きてからのティック数
  const tick: number = event.currentTick;
  // 前回のティックからの時間
  const delta: number = event.deltaTime;

  // (200ティック = 10秒)に1回実行
  if (tick % 200 === 0) {
    // ティックは1秒間に20回起こることになっているが、毎回厳密に0.05秒になるわけではない
    overworld.runCommand(`say 前回のティックから ${delta}秒 経過しました。`);
  }
}

/**
 * weatherChange
 *
 * 天候が変化したときに発生するイベント
 */
function onWeatherChage(event: mc.WeatherChangeEvent) {
  // イベントが発生した次元名（ここは文字列であることに注意）
  const dimensionName: string = event.dimension;
  // 変更後の天候が雨かどうか
  const isRaining: boolean = event.raining;
  // 変更後の天候が雷かどうか
  const isLightning: boolean = event.lightning;

  // {(雨でない) かつ (雷でない)} ならば 晴れ
  const isClear = !isRaining && !isLightning;

  if (isClear) {
    overworld.runCommand(`say ${dimensionName} の天候は「晴れ」です。`);
  }
  // 雨だが雷ではない
  else if (isRaining && !isLightning) {
    overworld.runCommand(`say ${dimensionName} の天候は「雨」です。`);
  }
  // 雨ではないが雷(これは起こらないはず)
  else if (!isRaining && isLightning) {
    overworld.runCommand(`say ${dimensionName} の天候は「雷」です。`);
  }
  // 雨かつ雷
  else if (isRaining && isLightning) {
    overworld.runCommand(`say ${dimensionName} の天候は「雷雨」です。`);
  }
}

/**
 * worldInitialize
 *
 * ワールドが初期化される時に実行される
 * 現在はダイナミックプロパティの登録しかない
 */
function onWorldInitialize(event: mc.WorldInitializeEvent) {
  // ダイナミックプロパティの登録
  event.propertyRegistry;
}

export function toggleWorldEvents(toggle: boolean) {
  if (toggle) {
    mc.world.events.tick.subscribe(tick);
    mc.world.events.weatherChange.subscribe(onWeatherChage);
  } else {
    mc.world.events.tick.unsubscribe(tick);
    mc.world.events.weatherChange.unsubscribe(onWeatherChage);
  }
}
