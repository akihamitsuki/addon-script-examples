import * as mc from 'mojang-minecraft';

/**
 * BlockBreakEvent
 *
 * ブロックがプレイヤーに破壊されたとき
 * https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/mojang-minecraft/blockpermutation
 */
export function onBlockBreak(event: mc.BlockBreakEvent) {
  // イベントが発生したブロック
  // 壊したあとの情報なので破壊したブロックは取得しない。多くの場合で空気ブロック
  const block: mc.Block = event.block;
  // 壊したブロックの種類や状態などについての組み合わせ(permutation)情報
  const permutation: mc.BlockPermutation = event.brokenBlockPermutation;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // イベントを発生させたプレイヤー
  const player: mc.Player = event.player;

  // イベントが発生したブロックの位置を文字列で取得
  const location = `${dimension.id}(${block.x}, ${block.y}, ${block.z})`;
  // 内容を表示
  dimension.runCommand(`say ${player.nameTag} が ${location} の ${permutation.type.id} を破壊しました。`);
}

/**
 * blockExplode
 *
 * ブロックが爆発で破壊されたとき
 * https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/mojang-minecraft/blockexplodeevent
 */
function onBlockExplode(event: mc.BlockExplodeEvent) {
  // イベントが発生したブロック
  // 破壊後の情報なので、おそらく空気ブロックになる。
  // 破壊前のブロック情報はBeforeExplosionEventで取得する
  const block: mc.Block = event.block;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // 爆発を起こしたエンティティ
  const entity: mc.Entity = event.source;

  // イベントが発生したブロックの位置を文字列で取得
  const location = `${dimension.id}(${block.x}, ${block.y}, ${block.z})`;
  // 内容を表示
  dimension.runCommand(`say ${entity.id} が ${location} のブロックを爆破しました。破壊後は ${block.id} です。`);
}

/**
 * blockPlace
 *
 * プレイヤーがブロックを置いたとき
 * https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/mojang-minecraft/blockplaceevent
 */
function onBlockPlace(event: mc.BlockPlaceEvent) {
  // イベントが発生したブロック
  const block: mc.Block = event.block;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // イベントを発生させたプレイヤー
  const player: mc.Player = event.player;

  // イベントが発生したブロックの位置を文字列で取得
  const location = `${dimension.id}(${block.x}, ${block.y}, ${block.z})`;
  // 内容を表示
  dimension.runCommand(`say ${player.nameTag} が ${location} に ${block.id} を置きました。`);
}

/**
 * イベントの登録を切り替える
 *
 * テスト用
 *
 * @param toggle
 */
export function toggleBlockEvents(toggle: boolean) {
  if (toggle) {
    mc.world.events.blockBreak.subscribe(onBlockBreak);
    mc.world.events.blockExplode.subscribe(onBlockExplode);
    mc.world.events.blockPlace.subscribe(onBlockPlace);
  } else {
    mc.world.events.blockBreak.unsubscribe(onBlockBreak);
    mc.world.events.blockExplode.unsubscribe(onBlockExplode);
    mc.world.events.blockPlace.unsubscribe(onBlockPlace);
  }
}
