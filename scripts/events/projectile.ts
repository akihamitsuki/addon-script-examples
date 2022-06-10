import * as mc from 'mojang-minecraft';
import { log, toString } from '../utilities.js';

/**
 * projectileHit
 *
 * 発射物が何かに当たったとき
 */
export function projectileHit(event: mc.ProjectileHitEvent) {
  // eventから取得できる情報
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // 当たったブロック情報
  const hitBlock: mc.BlockHitInformation = event.blockHit;
  // 当たったエンティティ情報
  const hitEntity: mc.EntityHitInformation = event.entityHit;
  // 当たったときの発射物のベクトル
  const vector: mc.Vector = event.hitVector;
  // 当たったときの発射物の位置（当たった相手の位置ではない）
  const location: mc.Location = event.location;
  // 当たった発射物
  const projectile: mc.Entity = event.projectile;
  // イベントを発生させたエンティティ
  const sourse: mc.Entity = event.source;

  log(`${sourse.id} が発射した ${projectile.id} が (${toString(location)}) で`);

  // 当たったブロックがあれば(未定義でなければ)
  if (hitBlock !== undefined) {
    // これが当たったブロック
    const block: mc.Block = hitBlock.block;
    // 当たった面
    const face: mc.Direction = hitBlock.face;
    // 当たった位置
    const faceLocX: number = hitBlock.faceLocationX;
    const faceLocY: number = hitBlock.faceLocationY;

    log(`ブロック(${block.type.id}) の ${face}(${faceLocX}, ${faceLocY})面 に当たりました。　`);
  }

  if (hitEntity !== undefined) {
    // 現在EntityHitInformationにはentity情報しか入っていない
    const entity: mc.Entity = hitEntity.entity;

    log(`エンティティ(${entity.id}) に当たりました。`);
  }
}

export function registerProjectileEvents() {
  mc.world.events.projectileHit.subscribe(projectileHit);
}
