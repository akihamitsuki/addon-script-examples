import * as mc from 'mojang-minecraft';
import { log, toString } from '../utilities.js';

/**
 * entityCreate
 *
 * このイベントは、新しいエンティティが作成されたときに発生します。
 */
export function onEntityCreate(event: mc.EntityCreateEvent) {
  // イベントを起こしたエンティティ
  const entity: mc.Entity = event.entity;

  log(`${entity.id} が 座標(${toString(entity.location)}) に出現しました。`);
}

/**
 * entityHit
 *
 * このイベントは、エンティティがヒット（近接攻撃）し、他のエンティティやブロックに影響を与える可能性があるときに発生します。
 */
export function onEntityHit(event: mc.EntityHitEvent) {
  // イベントを起こしたエンティティ
  const attacker: mc.Entity = event.entity;
  // 攻撃が当たったブロック
  const block: mc.Block = event.hitBlock;
  // 攻撃が当たったエンティティ
  const victim: mc.Entity = event.hitEntity;

  if (block !== undefined) {
    log(`${attacker.id} が ${block.id} を破壊しだしました。`);
  }

  if (victim !== undefined) {
    log(`${attacker.id} が ${victim.id} に近接攻撃しました。`);
  }

  if (block === undefined && victim === undefined) {
    log(`${attacker.id} の攻撃は誰にも当たりませんでした。`);
  }
}

/**
 * entityHurt
 *
 * エンティティがダメージを受けたとき
 */
export function onEntityHurt(event: mc.EntityHurtEvent) {
  // ダメージの理由
  const cause: string = event.cause;
  // ダメージ量
  const damage: number = event.damage;
  // ダメージを与えたエンティティ
  const attacker: mc.Entity = event.damagingEntity;
  // ダメージを受けたエンティティ
  const victim: mc.Entity = event.hurtEntity;
  // ダメージを与えた発射物
  const projectile: mc.Entity = event.projectile;

  if (projectile === undefined) {
    log(`${attacker.id} が ${victim.id} に ${cause} で ${damage} のダメージを与えました。`);
  } else {
    log(`${attacker.id} が ${victim.id} に ${cause}(${projectile.id}) で ${damage} のダメージ。`);
  }
}

/**
 * dataDrivenEntityTriggerEvent
 *
 * コンポーネントが変化するイベントが発生したとき
 *
 * クリーパーが帯電クリーパーになるとき
 * 羊から羊毛を刈ったとき
 */
export function onDataDrivenEntityTriggerEvent(event: mc.DataDrivenEntityTriggerEvent) {
  // イベントを起こしたエンティティ
  const entity: mc.Entity = event.entity;
  // イベントを起こしたエンティティのidentifier
  const identifier: string = event.id;
  // 変更されたコンポーネント
  const modiffiers: mc.DefinitionModifier[] = event.modifiers;

  modiffiers.forEach(function (moddifer) {
    moddifer.componentGroupsToAdd.forEach(function (component) {
      log(`${identifier} の　${component}コンポーネント が追加されました。`);
    });
    moddifer.componentGroupsToRemove.forEach(function (component) {
      log(`${identifier} の　${component}コンポーネント が削除されました。`);
    });
  });
}

/**
 * beforeDataDrivenEntityTriggerEvent
 *
 * コンポーネントが変化するイベントが実行される前
 */
export function onDeforeDataDrivenEntityTriggerEvent(event: mc.BeforeDataDrivenEntityTriggerEvent) {
  // イベントを停止させるか
  event.cancel;
  // イベントを起こしたエンティティ
  const entity: mc.Entity = event.entity;
  // イベントを起こしたエンティティのidentifier
  const identifier: string = event.id;
  // これから変更されるコンポーネント
  const modiffiers: mc.DefinitionModifier[] = event.modifiers;

  modiffiers.forEach(function (moddifer) {
    moddifer.componentGroupsToAdd.forEach(function (component) {
      log(`${identifier} の　${component}コンポーネント が追加されようとしています。`);
    });
    moddifer.componentGroupsToRemove.forEach(function (component) {
      log(`${identifier} の　${component}コンポーネント が削除されようとしています。`);
    });
  });
}

export function registerEntityEvents() {
  // mc.world.events.entityCreate.subscribe(onEntityCreate);
  mc.world.events.entityHit.subscribe(onEntityHit);
  mc.world.events.entityHurt.subscribe(onEntityHurt);
  // mc.world.events.dataDrivenEntityTriggerEvent.subscribe(onDataDrivenEntityTriggerEvent);
  // mc.world.events.beforeDataDrivenEntityTriggerEvent.subscribe(
  //   onDeforeDataDrivenEntityTriggerEvent
  // );
}
