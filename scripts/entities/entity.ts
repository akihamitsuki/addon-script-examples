import * as mc from 'mojang-minecraft';

const overworld = mc.world.getDimension('overworld');

function spawnEntity(player: mc.Player) {
  const dimension = mc.world.getDimension('overworld');
  const location = player.location;
  dimension.spawnEntity('minecraft:creeper', location);
}

/**
 * エンティティにステータス効果を追加する
 */
function effect(player: mc.Player) {
  const entity = overworld.spawnEntity('minecraft:creeper', player.location);

  // ステータス効果を追加する
  const effectType: mc.EffectType = mc.MinecraftEffectTypes.speed;
  const duration = 600;
  const amplifier = 3;
  const showParticles = false;
  entity.addEffect(effectType, duration, amplifier, showParticles);

  // ステータス効果を取得する
  const effect: mc.Effect = entity.getEffect(effectType);
  entity.runCommand(`say ${effect.displayName} 強さ${effect.amplifier} 残り${effect.duration}ティック`);
}

/**
 * エンティティの名前を取得・設定する
 */
function name(player: mc.Player) {
  const entity = overworld.spawnEntity('minecraft:creeper', player.location);
  // set: nameTagプロパティに文字列を代入する（この時点で変更される）
  entity.nameTag = 'Takumi';
  // get: nameTagプロパティから設定されている名前を取得する
  player.runCommand(`say ${entity.nameTag}`);
}

/**
 * エンティティのコンポーネントを取得する
 */
function component(player: mc.Player) {
  const entity = overworld.spawnEntity('minecraft:creeper', player.location);

  // 指定したコンポーネントを取得する（対応するコンポーネントのクラスに型変換する）
  const movement = entity.getComponent('minecraft:movement') as mc.EntityMovementComponent;
  // 対応するコンポーネントごとにできることが異なる（それぞれ別のクラス）
  movement.setCurrent(1.0); // クリーパーの初期値は0.2

  // そのエンティティの持っているすべてのコンポーネントを取得する
  const components: mc.IEntityComponent[] = entity.getComponents();
  components.forEach((component) => {
    entity.runCommand(`say ${component.id}`);
  });

  // そのコンポーネントを持っているかを判定する
  const isCharged: boolean = entity.hasComponent('minecraft:is_charged');
  if (isCharged) {
    entity.runCommand('say このクリーパーは帯電しています。');
  } else {
    entity.runCommand('say このクリーパーは帯電していません。');
  }

  // setComponentは無い
  // 変更は取得したコンポーネントの値を変更した時点で適用される
  // コンポーネント自体の追加はここではできない（はず）
  // あらかじめエンティティファイルに記述しておき、イベントを起こして追加する
}

/**
 * タグを取得・設定する
 */
function tag(player: mc.Player) {
  const entity = overworld.spawnEntity('minecraft:creeper', player.location);
  const tagName = 'new_tag';

  // タグを追加する
  entity.addTag(tagName);

  // そのエンティティが持っているすべてのタグを取得する
  const tags: string[] = entity.getTags();
  tags.forEach((tag) => {
    entity.runCommand(`say ${tag}`);
  });

  // そのタグを持っているか判定する
  if (entity.hasTag(tagName)) {
    entity.runCommand(`say ${tagName} を持っています`);
  }

  // タグを削除する
  entity.removeTag(tagName);
  entity.runCommand(`say ${tagName} を削除しました`);

  // 再び判定すると持っていないことがわかる
  if (!entity.hasTag(tagName)) {
    entity.runCommand(`say ${tagName} を持っていません`);
  }
}

/**
 * エンティティの移動（テレポート）
 */
function teleport(player: mc.Player) {
  // プレイヤーを高さ+10の位置に移動
  const location = player.location;
  location.y += 10;
  // 座標だけでなく、次元と向きを指定も必須
  player.teleport(location, player.dimension, player.rotation.x, player.rotation.y);
}

function getClosestEntity(player: mc.Player): mc.Entity | undefined {
  // 検索条件
  const query = new mc.EntityQueryOptions();
  // 基準は自分の位置
  query.location = player.location;
  // 自分を除く
  query.excludeNames = [player.nameTag];
  // 近い順から1体
  query.closest = 1;
  // 検索条件をつけてエンティティを取得し、配列で取得する
  const entities = [...player.dimension.getEntities(query)];
  // 配列内に値があれば
  if (entities.length) {
    // 1体目のエンティティを取り出す(配列は0番から始まる)
    return entities[0];
  }
  // 存在しなければ未定義を返す
  return undefined;
}

/**
 * 指定箇所を向いてテレポート
 */
function teleportFacing(player: mc.Player) {
  // 最も近いエンティティを取得
  const entity = getClosestEntity(player);
  if (entity) {
    // どの地点を向くか(rotationの代わり)
    const facingLocation = entity.location;
    // その座標を向いて移動（座標は同じなので向きだけ変わる）
    player.teleportFacing(player.location, player.dimension, facingLocation);
    player.runCommand(`say 最も近いエンティティ(${entity.id})の方を向きました`);
  } else {
    player.runCommand('say 自分以外のエンティティが存在しませんでした。');
  }
}

/**
 * エンティティの向き
 */
// function rotation(player: mc.Player) {
//   const entity = getClosestEntity(player);
//   if (entity) {
//     // そのエンティティの向き
//     const rotation: mc.XYRotation = entity.rotation;
//     // 変更する
//     rotation.y += 30;
//     // テレポートを使わずに向きだけを変更する
//     entity.setRotation(rotation.x, rotation.y);
//   }
// }

/**
 * 速さを設定する
 *
 * 速さ(velocity): ベクトル(向きを含む) -> 南に時速20km
 * 速度(speed): スカラー(向きを含めない) -> (向きに関係なく)時速20km
 *
 */
// function velocity(player: mc.Player) {
//   player.setVelocity(new mc.Vector(0, 3, 0));
// }

/**
 * HP設定
 */
function health(player: mc.Player) {
  // healthコンポーネントを取得する
  const health = player.getComponent('minecraft:health') as mc.EntityHealthComponent;

  // hpを設定する
  // 最大値より減っているか
  if (health.current < health.value) {
    // 最大まで回復させる
    health.resetToMaxValue();
  } else {
    // 1に設定する
    health.setCurrent(1);
  }

  // 倒すだけなら、専用のメソッドがある
  // player.kill();
}

/**
 * スニーク判定
 */
function sneaking() {
  // 毎ティック判定する
  mc.world.events.tick.subscribe((event) => {
    // すべてのプレイヤーを取得して、一人ずつ処理を行う
    for (const player of mc.world.getPlayers()) {
      // スニークをしているかを判定
      if (player.isSneaking) {
        // していたら
        player.kill();
      }
    }
  });
}

/**
 * イベントを発生させる
 */
function triggerEvent(player: mc.Player) {
  const entity = overworld.spawnEntity('minecraft:creeper', player.location);

  // イベントの設定
  const spawnEvent = 'minecraft:become_charged';
  // エンティティとイベントが対応してない可能性があるので例外対応をする
  try {
    entity.triggerEvent(spawnEvent);
  } catch {
    // 対応していなかった場合はエラーが起きる
    entity.dimension.runCommand(`say ${entity.id} は ${spawnEvent} に対応していません。`);
  }
}

/**
 * エンティティの攻撃目標(target)を設定する
 */
function target(player: mc.Player) {
  const entity = getClosestEntity(player);
  if (!entity) {
    return;
  }
  player.runCommand(`say ${entity.id}の攻撃目標を${player.nameTag}に設定します。`);
  // そのエンティティの攻撃目標をプレイヤーに設定する
  entity.target = player;
}

/**
 * 向いている方向のベクトル
 */
function viewVector(player: mc.Player) {
  const vector: mc.Vector = player.viewVector;
  player.runCommand(`say (${vector.x}, ${vector.y}, ${vector.z})`);
}

/**
 * 向いている方向のブロックを取得する
 */
function getBlockFromViewVector(player: mc.Player) {
  const options = new mc.BlockRaycastOptions();
  options.includeLiquidBlocks = true;
  options.includePassableBlocks = true;
  options.maxDistance = 256;
  const block = player.getBlockFromViewVector(options);
  player.runCommand(`say ${block.id}`);
}

/**
 * 向いている方向のエンティティを取得する
 */
function getEntitiesFromViewVector(player: mc.Player) {
  const options = new mc.EntityRaycastOptions();
  options.maxDistance = 256;
  const entities = player.getEntitiesFromViewVector(options);

  if (entities.length) {
    for (const entity of entities) {
      player.runCommand(`say ${entity.id}`);
    }
  } else {
    player.runCommand(`say 見つかりませんでした。`);
  }
}
