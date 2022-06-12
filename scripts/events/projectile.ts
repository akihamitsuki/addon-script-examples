import * as mc from 'mojang-minecraft';
import { getDistance, log, getDistanceFromBlockCenter } from '../utilities.js';

/**
 * projectileHit
 *
 * 発射物が何かに当たったとき
 */
export function projectileHit(event: mc.ProjectileHitEvent) {
  // eventから取得できる情報
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;

  // 発射したエンティティ
  const shooter: mc.Entity = event.source;
  // 当たったブロック情報
  const hitBlock: mc.BlockHitInformation = event.blockHit;
  // 当たったエンティティ情報
  const hitEntity: mc.EntityHitInformation = event.entityHit;

  // 当たった発射物
  const projectile: mc.Entity = event.projectile;
  // 当たったときの発射物の位置（当たった相手の位置ではない。projectile.locationとはわずかに異なる）
  const projectileLocation: mc.Location = event.location;
  // 当たったときの投射物の方向ベクトル
  const vector: mc.Vector = event.hitVector;

  // ブロックに当たったとき
  if (hitBlock !== undefined) {
    // これが当たったブロック
    const block: mc.Block = hitBlock.block;
    // 当たった面
    const face: mc.Direction = hitBlock.face;
    // 当たった位置
    const faceLocX: number = hitBlock.faceLocationX;
    const faceLocY: number = hitBlock.faceLocationY;

    if (block.id === mc.MinecraftBlockTypes.target.id) {
      const distance: number = getDistanceFromBlockCenter(faceLocX, faceLocY);
      log(`ブロック面の中心から ${distance} 離れた場所に当たりました。`);

      let point: number | string = 0;
      if (distance < 0.1) {
        point = 10;
        log(`大当たり! 経験値 +${point}`);
      } else if (distance < 0.3) {
        point = 3;
        log(`当たり! 経験値 +${point}`);
      } else {
        point = '-1L';
        log(`はずれ! レベル -1`);
      }
      dimension.runCommand(`xp ${point} ${shooter.nameTag}`);
    }
  }

  // エンティティに当たったとき
  if (hitEntity !== undefined) {
    // 現在EntityHitInformationにはentity情報しか入っていない
    const entity: mc.Entity = hitEntity.entity;
    // 当たったエンティティの頭の中心位置を取得する
    const headLocation: mc.Location = entity.headLocation;
    // 頭の位置と発射物の位置が、特定の距離以内であるかを判定（距離単位はブロック）
    // これは2点間の距離だけを判定しているので、必ずしも頭に当たっているわけではない
    const isHeadShot: boolean = headLocation.isNear(projectileLocation, 0.7);
    if (isHeadShot) {
      log(`Head Shot! ${shooter.nameTag} -> ${entity.id}`);
      // NOTE: ここでkill()を使うとなぜかマインクラフト本体が落ちる
      // entity.kill();
    } else {
      log(`頭との距離: ${getDistance(headLocation, projectileLocation)}ブロック`);
    }
  }
}

export function registerProjectileEvents() {
  mc.world.events.projectileHit.subscribe(projectileHit);
}
