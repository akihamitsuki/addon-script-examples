import * as mc from 'mojang-minecraft';

/**
 * entityCreate
 *
 * 新しいエンティティが作成されたとき（自然スポーンを含む）
 */
function onEntityCreate(event: mc.EntityCreateEvent) {
  // イベントを起こしたエンティティ
  const entity: mc.Entity = event.entity;

  // 全てを表示すると多すぎるので羊に限定
  if (entity.id === mc.MinecraftEntityTypes.sheep.id) {
    const loc = `${entity.location.x} ${entity.location.y} ${entity.location.z}`;
    entity.dimension.runCommand(`say ${entity.id} が 座標(${loc}) に出現しました。`);
  }
}

/**
 * entityHit
 *
 * エンティティが近接攻撃、他のエンティティやブロックに影響を与える可能性があるとき
 * 遠距離攻撃は projecctileHit
 */
function onEntityHit(event: mc.EntityHitEvent) {
  // イベントを起こしたエンティティ
  const attacker: mc.Entity = event.entity;
  // 攻撃が当たったブロック
  const block: mc.Block = event.hitBlock;
  // 攻撃が当たったエンティティ
  const victim: mc.Entity = event.hitEntity;

  // 攻撃の当たったブロック情報があれば
  if (block !== undefined) {
    attacker.dimension.runCommand(`say ${attacker.id} が ${block.id} を破壊しだしました。`);
  }

  // 攻撃の当たったエンティティ情報があれば
  if (victim !== undefined) {
    attacker.dimension.runCommand(`say ${attacker.id} が ${victim.id} に近接攻撃しました。`);
  }

  // 上の両方の情報がなければ
  if (block === undefined && victim === undefined) {
    attacker.dimension.runCommand(`say ${attacker.id} の攻撃は誰にも当たりませんでした。`);
  }
}

/**
 * entityHurt
 *
 * エンティティがダメージを受けたとき
 */
function onEntityHurt(event: mc.EntityHurtEvent) {
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

  // 発射物による影響かどうかで処理を分ける
  if (projectile === undefined) {
    attacker.dimension.runCommand(
      `say ${attacker.id} が ${victim.id} に ${cause} で ${damage} のダメージを与えました。`
    );
  } else {
    attacker.dimension.runCommand(
      `say ${attacker.id} が ${victim.id} に ${cause}(${projectile.id}) で ${damage} のダメージを与えました。`
    );
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
function onDataDrivenEntityTriggerEvent(event: mc.DataDrivenEntityTriggerEvent) {
  // イベントを起こしたエンティティ
  const entity: mc.Entity = event.entity;
  // イベントを起こしたエンティティのidentifier
  const identifier: string = event.id;
  // 変更されたコンポーネント
  const modiffiers: mc.DefinitionModifier[] = event.modifiers;

  // 変更されたコンポーネントで繰り返し(同時複数変更される可能性がある)
  modiffiers.forEach(function (moddifer) {
    // 追加されるコンポーネントごとに繰り返し
    moddifer.componentGroupsToAdd.forEach(function (component) {
      // そのコンポーネント名を表示
      entity.dimension.runCommand(`say ${identifier} に　${component}コンポーネント が追加されました。`);
    });
    // 削除されるコンポーネントごとに繰り返し
    moddifer.componentGroupsToRemove.forEach(function (component) {
      // そのコンポーネント名を表示
      entity.dimension.runCommand(`say ${identifier} の　${component}コンポーネント が削除されました。`);
    });
  });
}

/**
 * beforeDataDrivenEntityTriggerEvent
 *
 * コンポーネントが変化するイベントが実行される前
 */
function onDeforeDataDrivenEntityTriggerEvent(event: mc.BeforeDataDrivenEntityTriggerEvent) {
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
      entity.dimension.runCommand(`say ${identifier} に　${component}コンポーネント が追加されようとしています。`);
    });
    moddifer.componentGroupsToRemove.forEach(function (component) {
      entity.dimension.runCommand(`say ${identifier} の　${component}コンポーネント が削除されようとしています。`);
    });
  });
}

export function toggleEntityEvents(toggle: boolean) {
  if (toggle) {
    mc.world.events.entityCreate.subscribe(onEntityCreate);
    mc.world.events.entityHit.subscribe(onEntityHit);
    mc.world.events.entityHurt.subscribe(onEntityHurt);
    mc.world.events.dataDrivenEntityTriggerEvent.subscribe(onDataDrivenEntityTriggerEvent);
    mc.world.events.beforeDataDrivenEntityTriggerEvent.subscribe(onDeforeDataDrivenEntityTriggerEvent);
  } else {
    mc.world.events.entityCreate.unsubscribe(onEntityCreate);
    mc.world.events.entityHit.unsubscribe(onEntityHit);
    mc.world.events.entityHurt.unsubscribe(onEntityHurt);
    mc.world.events.dataDrivenEntityTriggerEvent.unsubscribe(onDataDrivenEntityTriggerEvent);
    mc.world.events.beforeDataDrivenEntityTriggerEvent.unsubscribe(onDeforeDataDrivenEntityTriggerEvent);
  }
}
