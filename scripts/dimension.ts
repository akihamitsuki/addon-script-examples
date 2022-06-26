import * as mc from 'mojang-minecraft';

const dimension = mc.world.getDimension(mc.MinecraftDimensionTypes.overworld);

/**
 * エンティティを呼び出す
 */
export function spawnEntity() {
  // 呼び出す次元
  const dimension = mc.world.getDimension(mc.MinecraftDimensionTypes.overworld);
  // 呼び出すエンティティの種類
  const entityType: mc.EntityType = mc.MinecraftEntityTypes.creeper;
  // 呼び出す座標
  const spawnPosision: mc.Location = new mc.Location(0, 4, 0);

  // 次元(dimension)からメソッドを呼び出す
  const spawnedEntity = dimension.spawnEntity(entityType.id, spawnPosision);
  // 呼び出したエンティティ情報が返ってくるので、さらに詳しい情報を設定できる
}

/**
 * 爆発を起こす
 */
function explosion(player: mc.Player) {
  // 爆発させる位置
  const location = player.location;
  // 爆発範囲の半径(大きすぎると処理落ちする)
  const radius = 10;
  // 爆発の設定
  const explosionOption = new mc.ExplosionOptions();
  // 水中でも爆発させるか
  explosionOption.allowUnderwater = true;
  // ブロックを破壊するか
  explosionOption.breaksBlocks = true;
  // 延焼するか（破壊した箇所に炎を生成するか）
  explosionOption.causesFire = true;

  // どのエンティティが爆発を起こしたことにするか(?)
  // explosionOption.source

  // 以上の情報で爆発を起こす
  dimension.createExplosion(location, radius, explosionOption);
}

/**
 * ブロックを取得する
 */
function getBlock() {
  const block: mc.Block = dimension.getBlock(new mc.BlockLocation(0, 4, 0));
}

/**
 * その次元のエンティティをすべて取得する
 */
function getEntities() {
  const entities: mc.EntityIterator = dimension.getEntities();
  for (let entity of entities) {
    entity.runCommand(`say ${entity.id}`);
  }
}

/**
 * 指定のブロックにいるエンティティを取得する
 */
function getEntitiesAtBlockLocation() {
  const entities: mc.Entity[] = dimension.getEntitiesAtBlockLocation(new mc.BlockLocation(0, 4, 0));
  for (let entity of entities) {
    entity.runCommand(`say ${entity.id}`);
  }
}

/**
 * 光(ray)を投げて(cast)、光の当たったブロック情報を取得する
 */
function getBlockFromRay(player: mc.Player) {
  // この地点から
  // const location = new mc.Location(0, 255, 0);
  const location = player.location;
  // この方向に（今回は真下）
  const direction = new mc.Vector(0, -1, 0);

  // 設定
  const blockRaycastOptions = new mc.BlockRaycastOptions();
  // 液体を判定に含むか
  blockRaycastOptions.includeLiquidBlocks = true;
  // 光が通過できるブロック（ガラスなど）を判定に含むか
  blockRaycastOptions.includePassableBlocks = false;
  // どこまでの距離を判定に含めるか
  blockRaycastOptions.maxDistance = 256;

  // 以上の情報を使ってブロックを見つける
  const foundBlock: mc.Block = dimension.getBlockFromRay(location, direction, blockRaycastOptions);
  player.runCommand(`say 真下のブロックは「${foundBlock.id}」です。`);
}

/**
 * 光(ray)を投げて(cast)、光の当たったエンティティ情報を取得する
 */
function getEntitiesFromRay(player: mc.Player) {
  // この地点から
  // const location = new mc.Location(0, 255, 0);
  const location = player.location;
  // この方向に（今回は真下）
  const direction = new mc.Vector(0, -1, 0);
  // 設定
  const blockRaycastOptions = new mc.BlockRaycastOptions();
  // 液体を判定に含むか
  blockRaycastOptions.includeLiquidBlocks = true;
  // 通過できるブロックを判定に含むか
  blockRaycastOptions.includePassableBlocks = false;
  // どこまでを判定に含めるか
  blockRaycastOptions.maxDistance = 256;
  // 配列で取得される
  const dimension = mc.world.getDimension(mc.MinecraftDimensionTypes.overworld);
  const foundEntities: mc.Entity[] = dimension.getEntitiesFromRay(location, direction);
  if (foundEntities.length !== 0) {
    for (let entity of foundEntities) {
      entity.runCommand(`say ${entity.id}`);
    }
  } else {
    player.runCommand(`say 真下にエンティティは見つかりませんでした。`);
  }
}

/**
 * その次元にいるプレイヤーを取得する
 */
function getPlayers() {
  // ワールドにも同じく getPlayers() があるが、こちらはその次元のエンティティのみ
  const players: mc.PlayerIterator = dimension.getPlayers();
  for (let player of players) {
    player.runCommand(`say ${player.nameTag}`);
  }
}

/**
 * そのブロックが空気かどうか
 */
function isEmpty() {
  const isEmpty = dimension.isEmpty(new mc.BlockLocation(0, 4, 0));
  if (isEmpty) {
    // ...
  }
}

/**
 * アイテムエンティティを、その次元に出現させる
 */
function spawnItem() {
  const itemType = mc.MinecraftItemTypes.tnt;
  const amount = 64;
  const data = 0;
  const itemStack = new mc.ItemStack(itemType, amount, data);
  dimension.spawnItem(itemStack, new mc.Location(0, 4, 0));
}

/**
 * パーティクルを出現させる
 */
function particle(player: mc.Player) {
  const effectName = 'minecraft:explosion_particle';
  const molangVariables = new mc.MolangVariableMap();
  // molangVariables.setColorRGB();
  // molangVariables.setColorRGBA('colorName', new mc.Color(255, 100, 100, 0.5));
  // molangVariables.setSpeedAndDirection();
  // molangVariables.setVector3('vectorName', new mc.Vector(0, 5, 0));
  dimension.spawnParticle(effectName, player.location, molangVariables);
}

// dimension.runCommand();
// dimension.runCommandAsync();
