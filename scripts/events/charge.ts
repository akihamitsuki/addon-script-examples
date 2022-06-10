import * as mc from 'mojang-minecraft';
import { log } from '../utilities';

/**
 * itemStartCharge
 *
 * このイベントは、チャージアイテムがチャージを開始したときに発生します。
 */
export function onItemStartCharge(event: mc.ItemStartChargeEvent) {
  // チャージに使用したアイテム
  const item: mc.ItemStack = event.itemStack;
  // 使用者
  const user: mc.Entity = event.source;
  // このアイテムのチャージが完了するまでのティック
  const duration: number = event.useDuration;

  log(`${user.nameTag} が ${item.id} のチャージを開始。完了まで ${duration}ティック。`);
}

/**
 * itemStopCharge
 *
 * このイベントは、チャージアイテムがチャージを停止したときに発生します。
 */
export function onItemStopCharge(event: mc.ItemStopChargeEvent) {
  // チャージに使用したアイテム
  const item: mc.ItemStack = event.itemStack;
  // 使用者
  const user: mc.Entity = event.source;
  // このアイテムのチャージが完了するまでのティック
  const duration: number = event.useDuration;

  log(`${user.nameTag} が ${item.id} のチャージを停止`);
}

/**
 * itemCompleteCharge
 *
 * チャージ可能なアイテムがチャージを完了すると発生するイベントです。
 */
export function onItemCompleteCharge(event: mc.ItemCompleteChargeEvent) {
  // チャージに使用したアイテム
  const item: mc.ItemStack = event.itemStack;
  // 使用者
  const user: mc.Entity = event.source;
  // このアイテムのチャージが完了するまでのティック
  const duration: number = event.useDuration;

  log(`${user.nameTag} が ${item.id} のチャージを完了。`);
}

/**
 * itemReleaseCharge
 *
 * このイベントは、チャージアイテムがチャージから解放されたときに発生する。
 */
export function onItemReleaseCharge(event: mc.ItemReleaseChargeEvent) {
  // チャージに使用したアイテム
  const item: mc.ItemStack = event.itemStack;
  // 使用者
  const user: mc.Entity = event.source;
  // このアイテムのチャージが完了するまでのティック
  const duration: number = event.useDuration;

  log(`${user.nameTag} が ${item.id} のチャージを解放。`);
}

export function registerChargeEvents() {
  mc.world.events.itemStartCharge.subscribe(onItemStartCharge);
  mc.world.events.itemStopCharge.subscribe(onItemStopCharge);
  mc.world.events.itemCompleteCharge.subscribe(onItemCompleteCharge);
  mc.world.events.itemReleaseCharge.subscribe(onItemReleaseCharge);
}
