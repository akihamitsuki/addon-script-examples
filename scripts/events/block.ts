import * as mc from 'mojang-minecraft';
import { log } from '../utilities';

/**
 * blockBreak
 *
 * ブロックが破壊されたとき
 */
export function onBlockBreak(event: mc.BlockBreakEvent) {
  // イベントが発生したブロック
  const block: mc.Block = event.block;
  // ブロックが破壊される前の順列情報
  const blockPermutation: mc.BlockPermutation = event.brokenBlockPermutation;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // イベントを発生させたプレイヤー
  const player: mc.Player = event.player;

  const location = `${dimension.id}(${block.x}, ${block.y}, ${block.z})`;
  // 破壊された後に発生するのでblockはほぼ空気ブロックになる。
  log(`${player.nameTag} が ${location} の ${block.id} を破壊しました。`);

  // 元のブロックはblockPermutationの方
  const propeties: mc.IBlockProperty[] = blockPermutation.getAllProperties();
  propeties.forEach(function (propety) {
    log(`${propety.name}`);
  });
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
