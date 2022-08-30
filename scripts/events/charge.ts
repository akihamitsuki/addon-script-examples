import * as mc from 'mojang-minecraft';

// 弓・トライデント・釣り竿・ヤギの角: start, release
// クロスボウ: start, complete, release
// stopがどこで使われるのか未確認

/**
 * itemStartCharge
 * チャージできるアイテムのチャージを開始したとき
 *
 * 弓・トライデント: 使用を開始したとき
 * クロスボウ: 使用を開始したとき
 *
 * スケルトンやピレジャーなどの弓攻撃では発生しない
 */
function onItemStartCharge(event: mc.ItemStartChargeEvent) {
  // チャージに使用したアイテム
  const item: mc.ItemStack = event.itemStack;
  // 使用者
  const user: mc.Entity = event.source;
  // このアイテムのチャージが完了するまでのティック
  // 弓: 72000ティック
  // クロスボウ: 25ティック
  // -> 弓はそもそも完了判定無しの扱いなので、大きな数は「完了しない」を意味しているのかも
  const duration: number = event.useDuration;

  user.dimension.runCommand(`say ${user.nameTag} が ${item.id} のチャージを開始。完了まで ${duration}ティック。`);
  if (item.id === mc.MinecraftItemTypes.bow.id) {
    user.runCommand(`effect @s levitation 9999 5 true`);
  } else if (item.id === mc.MinecraftItemTypes.crossbow.id) {
    user.runCommand(`effect @s blindness 9999 0 true`);
  }
}

/**
 * itemStopCharge
 *
 * チャージできるアイテムのチャージを停止したとき？
 * 1.19.21: 弓・クロスボウで確認できなくなった
 * いずれも完了前にやめた場合 `release` になる
 */
function onItemStopCharge(event: mc.ItemStopChargeEvent) {
  // チャージに使用したアイテム
  const item: mc.ItemStack = event.itemStack;
  // 使用者
  const user: mc.Entity = event.source;
  // このアイテムのチャージが完了するまでのティック
  const duration: number = event.useDuration;

  user.dimension.runCommand(`${user.nameTag} が ${item.id} のチャージを停止`);
  if (item.id === mc.MinecraftItemTypes.bow.id) {
    user.runCommand(`effect @s levitation 0`);
  } else if (item.id === mc.MinecraftItemTypes.crossbow.id) {
    user.runCommand(`effect @s blindness 0`);
  }
}

/**
 * itemCompleteCharge
 *
 * チャージできるアイテムのチャージを完了したとき
 * 弓: 最大まで引き絞っても完了しない
 * クロスボウ: 最後まで引き絞ったとき
 */
function onItemCompleteCharge(event: mc.ItemCompleteChargeEvent) {
  // チャージに使用したアイテム
  const item: mc.ItemStack = event.itemStack;
  // 使用者
  const user: mc.Entity = event.source;
  // このアイテムのチャージが完了するまでのティック
  const duration: number = event.useDuration;

  user.dimension.runCommand(`say ${user.nameTag} が ${item.id} のチャージを完了。`);
  if (item.id === mc.MinecraftItemTypes.bow.id) {
    user.runCommand(`effect @s levitation 0`);
  } else if (item.id === mc.MinecraftItemTypes.crossbow.id) {
    user.runCommand(`effect @s blindness 0`);
  }
}

/**
 * itemReleaseCharge
 *
 * チャージできるアイテムをチャージから解放したとき
 * 弓: 途中でやめたとき、発射したとき
 * クロスボウ: 途中でやめたとき
 */
function onItemReleaseCharge(event: mc.ItemReleaseChargeEvent) {
  // チャージに使用したアイテム
  const item: mc.ItemStack = event.itemStack;
  // 使用者
  const user: mc.Entity = event.source;
  // このアイテムのチャージが完了するまでのティック
  const duration: number = event.useDuration;

  user.dimension.runCommand(`say ${user.nameTag} が ${item.id} のチャージを解放。`);
  if (item.id === mc.MinecraftItemTypes.bow.id) {
    user.runCommand(`effect @s levitation 0`);
  } else if (item.id === mc.MinecraftItemTypes.crossbow.id) {
    user.runCommand(`effect @s blindness 0`);
  }
}

export function toggleChargeEvents(toggle: boolean) {
  if (toggle) {
    mc.world.events.itemStartCharge.subscribe(onItemStartCharge);
    mc.world.events.itemStopCharge.subscribe(onItemStopCharge);
    mc.world.events.itemCompleteCharge.subscribe(onItemCompleteCharge);
    mc.world.events.itemReleaseCharge.subscribe(onItemReleaseCharge);
  } else {
    mc.world.events.itemStartCharge.unsubscribe(onItemStartCharge);
    mc.world.events.itemStopCharge.unsubscribe(onItemStopCharge);
    mc.world.events.itemCompleteCharge.unsubscribe(onItemCompleteCharge);
    mc.world.events.itemReleaseCharge.unsubscribe(onItemReleaseCharge);
  }
}
