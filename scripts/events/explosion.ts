import * as mc from 'mojang-minecraft';

/**
 * explosion
 *
 * 爆発が発生したとき
 */
function onExplosion(event: mc.ExplosionEvent) {
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // 爆発の影響を受けるブロック位置の配列
  const blockLocations: mc.BlockLocation[] = event.impactedBlocks;
  // 爆発した(する)エンティティ
  const explodeEntity: mc.Entity = event.source;

  // 爆発したエンティティがクリーパーなら
  if (explodeEntity.id === mc.MinecraftEntityTypes.creeper.id) {
    // 影響を受けるブロックでループ
    blockLocations.forEach(function (blockLocation) {
      // 対象ブロックを変更
      // 壊れることが確定したブロックなので、変更後のブロックが壊れることになる
      // 例え岩盤でもアイテム化する
      dimension.getBlock(blockLocation).setType(mc.MinecraftBlockTypes.bedrock);
    });
    // 爆発後なのでcancelはできない
  }
}

/**
 * beforeExplosion
 *
 * 爆発が起こる前
 */
function onBeforeExplosion(event: mc.BeforeExplosionEvent) {
  // イベントを停止させるか
  event.cancel;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // 爆発の影響を受けるブロック位置の配列
  const blockLocations: mc.BlockLocation[] = event.impactedBlocks;
  // 爆発した(する)エンティティ
  const explodeEntity: mc.Entity = event.source;

  // 爆発したエンティティがTNTなら
  if (explodeEntity.id === mc.MinecraftEntityTypes.tnt.id) {
    // 影響を受けるブロックでループ
    blockLocations.forEach(function (blockLocation) {
      // 対象ブロックを変更
      dimension.getBlock(blockLocation).setType(mc.MinecraftBlockTypes.goldBlock);
    });
    // 真にすると爆発させない -> ブロックの変更だけをして終わる
    event.cancel = true;
  }
}

export function toggleExplosionEvents(toggle: boolean) {
  if (toggle) {
    mc.world.events.explosion.subscribe(onExplosion);
    mc.world.events.beforeExplosion.subscribe(onBeforeExplosion);
  } else {
    mc.world.events.explosion.unsubscribe(onExplosion);
    mc.world.events.beforeExplosion.unsubscribe(onBeforeExplosion);
  }
}
