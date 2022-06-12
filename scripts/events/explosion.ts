import * as mc from 'mojang-minecraft';

/**
 * explosion
 *
 * 爆発が発生したとき
 */
export function onExplosion(event: mc.ExplosionEvent) {
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // 爆発の影響を受けるブロック位置の配列
  const blockLocations: mc.BlockLocation[] = event.impactedBlocks;
  // 爆発した(する)エンティティ
  const explodeEntity: mc.Entity = event.source;

  // 爆発したエンティティがTNTなら
  if (explodeEntity.id === 'minecraft:creeper') {
    // 影響を受けるブロックでループ
    blockLocations.forEach(function (blockLocation) {
      // 対象ブロックを変更
      // 壊れるブロックなので、変更後のブロックが壊れることになる
      dimension.getBlock(blockLocation).setType(mc.MinecraftBlockTypes.obsidian);
    });
    // 爆発後なのでcancelはできない
  }
}

/**
 * beforeExplosion
 *
 * 爆発が起こる前
 */
export function onBeforeExplosion(event: mc.BeforeExplosionEvent) {
  // イベントを停止させるか
  event.cancel;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // 爆発の影響を受けるブロック位置の配列
  const blockLocations: mc.BlockLocation[] = event.impactedBlocks;
  // 爆発した(する)エンティティ
  const explodeEntity: mc.Entity = event.source;

  // 爆発したエンティティがTNTなら
  if (explodeEntity.id === 'minecraft:tnt') {
    // 影響を受けるブロックでループ
    blockLocations.forEach(function (blockLocation) {
      // 対象ブロックを変更
      dimension.getBlock(blockLocation).setType(mc.MinecraftBlockTypes.goldBlock);
    });
    // 真にすると爆発させない
    event.cancel = true;
  }
}

export function registerExplosionEvents() {
  mc.world.events.explosion.subscribe(onExplosion);
  mc.world.events.beforeExplosion.subscribe(onBeforeExplosion);
}
