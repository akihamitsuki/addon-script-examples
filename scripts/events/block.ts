import * as mc from 'mojang-minecraft';
import { log } from '../utilities';

/**
 * blockBreak
 *
 * ブロックが破壊されたとき
 */
export function onBlockBreak(event: mc.BlockBreakEvent) {
  // イベントが発生したブロック（壊したあとなので破壊したブロックは取得しない。多くの場合で空気ブロック）
  const block: mc.Block = event.block;
  // 壊したブロックの種類や状態などについての組み合わせ(permutation)情報
  const permutation: mc.BlockPermutation = event.brokenBlockPermutation;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // イベントを発生させたプレイヤー
  const player: mc.Player = event.player;

  // 壊したブロックの位置
  const location = `${dimension.id}(${block.x}, ${block.y}, ${block.z})`;

  log(`${player.nameTag} が ${location} の ${permutation.type.id} を破壊しました。`);
}

/**
 * blockExplode
 *
 * ブロックが爆発で破壊されたとき
 */
export function onBlockExplode(event: mc.BlockExplodeEvent) {
  // イベントが発生したブロック
  const block: mc.Block = event.block;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // 爆発を起こしたエンティティ
  const entity: mc.Entity = event.source;

  const location = `${dimension.id}(${block.x}, ${block.y}, ${block.z})`;
  log(`${entity.id} が ${location} の ${block.id} を爆発で破壊しました。`);
}

/**
 * blockPlace
 *
 * ブロックを置いたとき
 */
export function onBlockPlace(event: mc.BlockPlaceEvent) {
  // イベントが発生したブロック
  const block: mc.Block = event.block;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // イベントを発生させたプレイヤー
  const player: mc.Player = event.player;

  const location = `${dimension.id}(${block.x}, ${block.y}, ${block.z})`;
  log(`${player.nameTag} が ${location} に ${block.id} を置きました。`);
}

export function registerBlockEvents() {
  mc.world.events.blockBreak.subscribe(onBlockBreak);
  mc.world.events.blockExplode.subscribe(onBlockExplode);
  mc.world.events.blockPlace.subscribe(onBlockPlace);
}
