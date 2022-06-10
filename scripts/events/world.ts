import * as mc from 'mojang-minecraft';
import { log } from '../utilities.js';

/**
 * tick
 *
 * このイベントはtick毎（1秒間に20回）に発生します。
 */
export function tick(event: mc.TickEvent) {
  // このイベントが起きてからのティック数
  const tick: number = event.currentTick;
  // 前回のティックからの時間
  const delta: number = event.deltaTime;

  if (tick % 200 === 0) {
    // ティックは0.05秒に1回だが、毎回厳密に0.05秒になるわけではない
    log(`前回のティックから ${delta}秒 経過しました。`);
  }
}

/**
 * weatherChange
 *
 * 天候が変化したときに発生するイベント
 */
export function onWeatherChage(event: mc.WeatherChangeEvent) {
  // イベントが発生した次元名（ここは文字列であることに注意）
  const dimensionName: string = event.dimension;
  // 変更後の天候が雨かどうか
  const isRaining: boolean = event.raining;
  // 変更後の天候が雷雨かどうか
  const isLightning: boolean = event.lightning;

  // {(雨でない) かつ (雷でない)} ならば 晴れ
  const isClear = !isRaining && !isLightning;

  if (isClear) {
    log(`${dimensionName} の天候は「晴れ」です。`);
  }
  // 雨だが雷ではない
  else if (isRaining && !isLightning) {
    log(`${dimensionName} の天候は「雨」です。`);
  }
  // 雨ではないが雷(これは起こらないはず)
  else if (isRaining && !isLightning) {
    log(`${dimensionName} の天候は「雷」です。`);
  }
  // 雨かつ雷
  else if (isRaining && isLightning) {
    log(`${dimensionName} の天候は「雷雨」です。`);
  }
}

/**
 * worldInitialize
 *
 * このイベントは、World 上でスクリプト環境が初期化されたときに発火します。
 * さらに、World Initialize イベントのスコープ内で動的プロパティを登録することができます。
 */

export function onWorldInitialize(event: mc.WorldInitializeEvent) {
  event.propertyRegistry;
}

export function registerWorldEvents() {
  mc.world.events.tick.subscribe(tick);
  mc.world.events.weatherChange.subscribe(onWeatherChage);
  mc.world.events.worldInitialize.subscribe(onWorldInitialize);
}
