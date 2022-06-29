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
