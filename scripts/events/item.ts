import * as mc from 'mojang-minecraft';
import { log, toString } from '../utilities';

// item use
// アイテムを使ったとき

/**
 * itemUse
 *
 * 特定のアイテムが使用を始めたとき(右クリックした時点で発生)
 * アイテムが消費されたときではない
 */
export function onItemUse(event: mc.ItemUseEvent) {
  const item: mc.ItemStack = event.item;
  const user: mc.Entity = event.source;

  log(`itemUse: ${user.nameTag} が ${item.id} を使用しました。`);
}

/**
 * beforeItemUse
 *
 * 特定のアイテムが使用されるとき
 */
export function onBeforeItemUse(event: mc.BeforeItemUseEvent) {
  // イベントを停止させるか
  event.cancel;
  // 影響を受けるアイテム
  const item: mc.ItemStack = event.item;
  // イベントを起こしたエンティティ
  const user: mc.Entity = event.source;

  log(`beforeItemUse: ${user.nameTag} が ${item.id} を使用します。`);
}

// item use on
// アイテムをブロックに向けて使ったとき
// ブロックを置いたときにも起動する

/**
 * itemStartUseOn
 *
 * アイテムをブロックに対して使用し始めたとき
 * ブロックを置くとき
 * ブロックに影響を与えられるアイテムをつかったとき
 */
export function onItemStartUseOn(event: mc.ItemStartUseOnEvent) {
  // ブロックを置くときにターゲットにした面
  const blockFace: mc.Direction = event.blockFace;
  // ブロックを置くときにターゲットにした位置
  const blockLocation: mc.BlockLocation = event.blockLocation;
  // ブロックが置かれる位置
  const buildBlockLocation: mc.BlockLocation = event.buildBlockLocation;
  // 使用するアイテム
  const item: mc.ItemStack = event.item;
  // 使用したエンティティ
  const user: mc.Entity = event.source;

  const location = `${toString(blockLocation)}(${toString(buildBlockLocation)})`;
  log(`itemStartUseOn: ${user.nameTag} が ${item.id} を ${location} に使用します。`);
}

/**
 * itemStopUseOn
 *
 * アイテムをブロックに対して使用するのをやめたとき
 */
export function onItemStopUseOn(event: mc.ItemStopUseOnEvent) {
  // ブロックを置くときにターゲットにした位置
  const blockLocation: mc.BlockLocation = event.blockLocation;
  // 使用するアイテム
  const item: mc.ItemStack = event.item;
  // 使用したエンティティ
  const user: mc.Entity = event.source;

  log(`itemStopUseOn: ${user.nameTag} が ${item.id} を ${toString(blockLocation)} に使用します。`);
}

/**
 * itemUseOn
 *
 * このイベントは、エンティティやプレイヤーによってブロック上で特定のアイテムが使用されたときに発生します。
 */
export function onItemUseOn(event: mc.ItemUseOnEvent) {
  // ブロックを置くときにターゲットにした面
  const blockFace: mc.Direction = event.blockFace;
  const faceLocX: number = event.faceLocationX;
  const faceLocY: number = event.faceLocationY;
  // ブロックを置くときにターゲットにした位置
  const blockLocation: mc.BlockLocation = event.blockLocation;
  // 使用するアイテム
  const item: mc.ItemStack = event.item;
  // 使用したエンティティ
  const user: mc.Entity = event.source;

  const location = `${toString(blockLocation)}`;
  log(`itemUseOn: ${user.nameTag} が ${item.id} を ${location} に使用しました。`);
}

/**
 * beforeItemUseOn
 *
 * このイベントは、エンティティやプレイヤーのブロック上でアイテムが使用される前に発生します。
 */
export function onBeforeItemUseOn(event: mc.BeforeItemUseOnEvent) {
  // ブロックを置くときにターゲットにした面
  const blockFace: mc.Direction = event.blockFace;
  const faceLocX: number = event.faceLocationX;
  const faceLocY: number = event.faceLocationY;
  // ブロックを置くときにターゲットにした位置
  const blockLocation: mc.BlockLocation = event.blockLocation;
  // 使用するアイテム
  const item: mc.ItemStack = event.item;
  // 使用したエンティティ
  const user: mc.Entity = event.source;

  // 砂はブロックの上にしか置けない
  if (item.id === 'minecraft:sand' && blockFace !== mc.Direction.up) {
    event.cancel = true;
  } else {
    const location = `${toString(blockLocation)}`;
    log(`beforeItemUseOn: ${user.nameTag} が ${item.id} を ${location} に使用します。`);
  }
}

/**
 * itemDefinitionEvent
 *
 * カスタムアイテムの場合、そのアイテムの定義されたコンポーネントの基本セットが変更されたときにこのイベントがトリガされます。
 * このイベントは、カスタムデータ駆動型アイテムの場合のみ発生することに注意してください。
 */
export function onItemDefinitionEvent(event: mc.ItemDefinitionTriggeredEvent) {
  event.eventName;
  event.item;
  event.source;

  log(`itemDefinitionEvent`);
}

/**
 * beforeItemDefinitionEvent
 *
 * カスタムアイテムの場合、このイベントは、トリガーされたイベントに応じて、アイテムの定義されたコンポーネントのセットが変更される前にトリガーされます。
 * このイベントは、カスタムデータドリブンアイテムに対してのみ発生することに注意してください。
 */
export function onBeforeItemDefinitionEvent(event: mc.BeforeItemDefinitionTriggeredEvent) {
  // イベントを停止させるか
  event.cancel;
  // イベント名
  event.eventName;
  // 影響を受けるアイテム
  event.item;
  // イベントを起こしたエンティティ
  event.source;

  log(`beforeItemDefinitionEvent`);
}

/**
 * イベント登録用
 */
export function registerItemEvents() {
  mc.world.events.itemStartUseOn.subscribe(onItemStartUseOn);
  mc.world.events.itemStopUseOn.subscribe(onItemStopUseOn);
  mc.world.events.itemUse.subscribe(onItemUse);
  mc.world.events.beforeItemUse.subscribe(onBeforeItemUse);
  mc.world.events.itemUseOn.subscribe(onItemUseOn);
  mc.world.events.beforeItemUseOn.subscribe(onBeforeItemUseOn);
  mc.world.events.itemDefinitionEvent.subscribe(onItemDefinitionEvent);
  mc.world.events.beforeItemDefinitionEvent.subscribe(onBeforeItemDefinitionEvent);
}
