import * as mc from 'mojang-minecraft';

// item use
// アイテムを使ったとき

/**
 * itemUse
 *
 * 特定のアイテムが使用を始めたとき(右クリックした時点で発生)
 * アイテムが消費されたときではない
 */
function onItemUse(event: mc.ItemUseEvent) {
  const item: mc.ItemStack = event.item;
  const user: mc.Entity = event.source;

  user.dimension.runCommand(`itemUse: ${user.nameTag} が ${item.id} を使用しました。`);
}

/**
 * beforeItemUse
 *
 * 特定のアイテムが使用されるとき
 */
function onBeforeItemUse(event: mc.BeforeItemUseEvent) {
  // イベントを停止させるか
  event.cancel;
  // 影響を受けるアイテム
  const item: mc.ItemStack = event.item;
  // イベントを起こしたエンティティ
  const user: mc.Entity = event.source;

  user.dimension.runCommand(`beforeItemUse: ${user.nameTag} が ${item.id} を使用します。`);
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
function onItemStartUseOn(event: mc.ItemStartUseOnEvent) {
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

  const blockLoc = `${blockLocation.x} ${blockLocation.y} ${blockLocation.z}`;
  const buildLoc = `${buildBlockLocation.x} ${buildBlockLocation.y} ${buildBlockLocation.z}`;
  user.dimension.runCommand(`itemStartUseOn: ${user.nameTag} が ${item.id} を ${blockLoc}(${buildLoc}) に使用します。`);
}

/**
 * itemStopUseOn
 *
 * アイテムをブロックに対して使用するのをやめたとき
 */
function onItemStopUseOn(event: mc.ItemStopUseOnEvent) {
  // ブロックを置くときにターゲットにした位置
  const blockLocation: mc.BlockLocation = event.blockLocation;
  // 使用するアイテム
  const item: mc.ItemStack = event.item;
  // 使用したエンティティ
  const user: mc.Entity = event.source;

  const location = `${blockLocation.x} ${blockLocation.y} ${blockLocation.z}`;
  user.dimension.runCommand(`itemStopUseOn: ${user.nameTag} が ${item.id} を ${location} に使用します。`);
}

/**
 * itemUseOn
 *
 * このイベントは、エンティティやプレイヤーによってブロック上で特定のアイテムが使用されたときに発生します。
 */
function onItemUseOn(event: mc.ItemUseOnEvent) {
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

  const location = `${blockLocation.x} ${blockLocation.y} ${blockLocation.z}`;
  user.dimension.runCommand(`itemUseOn: ${user.nameTag} が ${item.id} を ${location} に使用しました。`);
}

/**
 * beforeItemUseOn
 *
 * このイベントは、エンティティやプレイヤーのブロック上でアイテムが使用される前に発生します。
 */
function onBeforeItemUseOn(event: mc.BeforeItemUseOnEvent) {
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
    const location = `${blockLocation.x} ${blockLocation.y} ${blockLocation.z}`;
    user.dimension.runCommand(`beforeItemUseOn: ${user.nameTag} が ${item.id} を ${location} に使用します。`);
  }
}

/**
 * itemDefinitionEvent
 *
 * カスタムアイテムの場合、そのアイテムの定義されたコンポーネントの基本セットが変更されたときにこのイベントがトリガされます。
 * このイベントは、カスタムデータ駆動型アイテムの場合のみ発生することに注意してください。
 */
function onItemDefinitionEvent(event: mc.ItemDefinitionTriggeredEvent) {
  event.eventName;
  event.item;
  event.source;

  event.source.dimension.runCommand(`itemDefinitionEvent`);
}

/**
 * beforeItemDefinitionEvent
 *
 * カスタムアイテムの場合、このイベントは、トリガーされたイベントに応じて、アイテムの定義されたコンポーネントのセットが変更される前にトリガーされます。
 * このイベントは、カスタムデータドリブンアイテムに対してのみ発生することに注意してください。
 */
function onBeforeItemDefinitionEvent(event: mc.BeforeItemDefinitionTriggeredEvent) {
  // イベントを停止させるか
  event.cancel;
  // イベント名
  event.eventName;
  // 影響を受けるアイテム
  event.item;
  // イベントを起こしたエンティティ
  event.source;

  event.source.dimension.runCommand(`beforeItemDefinitionEvent`);
}

/**
 * イベント登録用
 */
export function toggleItemEvents(toggle: boolean) {
  if (toggle) {
    mc.world.events.itemStartUseOn.subscribe(onItemStartUseOn);
    mc.world.events.itemStopUseOn.subscribe(onItemStopUseOn);
    mc.world.events.itemUse.subscribe(onItemUse);
    mc.world.events.beforeItemUse.subscribe(onBeforeItemUse);
    mc.world.events.itemUseOn.subscribe(onItemUseOn);
    mc.world.events.beforeItemUseOn.subscribe(onBeforeItemUseOn);
    mc.world.events.itemDefinitionEvent.subscribe(onItemDefinitionEvent);
    mc.world.events.beforeItemDefinitionEvent.subscribe(onBeforeItemDefinitionEvent);
  } else {
    mc.world.events.itemStartUseOn.unsubscribe(onItemStartUseOn);
    mc.world.events.itemStopUseOn.unsubscribe(onItemStopUseOn);
    mc.world.events.itemUse.unsubscribe(onItemUse);
    mc.world.events.beforeItemUse.unsubscribe(onBeforeItemUse);
    mc.world.events.itemUseOn.unsubscribe(onItemUseOn);
    mc.world.events.beforeItemUseOn.unsubscribe(onBeforeItemUseOn);
    mc.world.events.itemDefinitionEvent.unsubscribe(onItemDefinitionEvent);
    mc.world.events.beforeItemDefinitionEvent.unsubscribe(onBeforeItemDefinitionEvent);
  }
}
