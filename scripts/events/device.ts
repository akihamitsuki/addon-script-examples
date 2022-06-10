import * as mc from 'mojang-minecraft';
import { log } from '../utilities';

/**
 * buttonPush
 *
 * このイベントは、ボタンが押されたときに発火します。
 */
export function onButtonPush(event: mc.ButtonPushEvent) {
  // ボタンのブロック情報
  const button: mc.Block = event.block;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // ボタンを押したエンティティ
  const user: mc.Entity = event.source;

  const location = `${user.location.x} ${user.location.y} ${user.location.z}`;
  dimension.runCommand(`summon lightning_bolt ${location}`);
}

/**
 * leverActivate
 *
 * レバーが動作したとき
 */
export function onLeverActivate(event: mc.LeverActionEvent) {
  // レバーのブロック情報
  const lever: mc.Block = event.block;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // レバーが有効になっているか
  const isPowered: boolean = event.isPowered;
  // イベントを発生させたプレイヤー
  const player: mc.Player = event.player;

  if (isPowered) {
    dimension.runCommand('time set midnight');
  } else {
    dimension.runCommand('time set noon');
  }
}

/**
 * pistonActivate
 *
 * ピストンが動作したとき（動作した後）
 */
export function onPistonActivate(event: mc.PistonActivateEvent) {
  // ピストンのブロック情報
  const block: mc.Block = event.block;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // ピストンが伸びているか
  const isExpanding: boolean = event.isExpanding;
  // イベントが発生したピストン
  const piston: mc.BlockPistonComponent = event.piston;

  if (isExpanding) {
    log(`after: true`);
  } else {
    log(`after: false`);
  }
}

/**
 * beforePistonActivate
 *
 * ピストンが動作する前
 */
export function onBeforePistonActivate(event: mc.BeforePistonActivateEvent) {
  // イベントを停止させるか
  event.cancel;
  // ピストンのブロック情報
  const block: mc.Block = event.block;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // ピストンが伸びているか
  const isExpanding: boolean = event.isExpanding;
  // イベントが発生したピストン
  const piston: mc.BlockPistonComponent = event.piston;

  if (isExpanding) {
    log(`before: true`);
  } else {
    log(`before: false`);
  }
}

export function registerDeviceEvents() {
  mc.world.events.buttonPush.subscribe(onButtonPush);
  mc.world.events.leverActivate.subscribe(onLeverActivate);
  mc.world.events.pistonActivate.subscribe(onPistonActivate);
  mc.world.events.beforePistonActivate.subscribe(onBeforePistonActivate);
}
