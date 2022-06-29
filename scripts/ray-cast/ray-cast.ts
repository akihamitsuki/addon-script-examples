import * as mc from 'mojang-minecraft';

// entity

/**
 * 向いている方向のブロックを取得する
 */
function getBlockFromViewVector(player: mc.Player) {
  // レイキャストの設定（対象がブロック）
  const options = new mc.BlockRaycastOptions();
  // 液体を判定に含むか
  options.includeLiquidBlocks = true;
  // 光が通過できるブロック（ガラスなど）を判定に含むか
  options.includePassableBlocks = true;
  // どこまでの距離を判定に含めるか
  options.maxDistance = 255;

  // 上の設定でレイキャストを使いブロックを取得
  const block: mc.Block = player.getBlockFromViewVector(options);
  player.runCommand(`say ${block.id} を発見しました。`);
}

/**
 * 向いている方向のエンティティを取得する
 */
function getEntitiesFromViewVector(player: mc.Player) {
  // レイキャストの設定（対象がエンティティ）
  const options = new mc.EntityRaycastOptions();
  // どこまでの距離を判定に含めるか
  options.maxDistance = 255;
  // エンティティを取得するまで光を通すので、液体や透過ブロックは関係がない

  // 上の設定でレイキャストを使いエンティティを取得
  const entities: mc.Entity[] = player.getEntitiesFromViewVector(options);

  // エンティティが取得できたかどうかは配列の長さで判定する（1以上ならtrue、0ならfalse）
  if (entities.length) {
    for (const entity of entities) {
      player.runCommand(`say ${entity.id} を発見しました。`);
    }
  } else {
    player.runCommand(`say 見つかりませんでした。`);
  }
}

// dimension

/**
 * 次元からのレイキャストでブロックを取得する
 */
function getBlockFromRay(player: mc.Player) {
  // この地点から（自分の位置）
  const location = player.location;
  // この方向に（今回は真下）
  const direction = new mc.Vector(0, -1, 0);

  // レイキャストの設定（対象がブロック）
  const options = new mc.BlockRaycastOptions();
  // 液体を判定に含むか
  options.includeLiquidBlocks = true;
  // 光が通過できるブロック（ガラスなど）を判定に含むか
  options.includePassableBlocks = false;
  // どこまでの距離を判定に含めるか
  options.maxDistance = 255 + 64;

  // 上の設定でレイキャストを使いブロックを取得
  const foundBlock: mc.Block = player.dimension.getBlockFromRay(location, direction, options);
  player.runCommand(`say 真下のブロックは「${foundBlock.id}」です。`);
}

/**
 * 次元からのレイキャストでエンティティを取得する
 */
function getEntitiesFromRay(player: mc.Player) {
  // この地点から（自分の位置）
  const location = player.location;
  // この方向に（今回は真下）
  const direction = new mc.Vector(0, -1, 0);

  // レイキャストの設定（対象がエンティティ）
  const options = new mc.EntityRaycastOptions();
  // どこまでの距離を判定に含めるか
  options.maxDistance = 255;

  // 上の設定でレイキャストを使いエンティティを取得
  const entities: mc.Entity[] = player.dimension.getEntitiesFromRay(location, direction, options);
  if (entities.length) {
    for (let entity of entities) {
      entity.runCommand(`say ${entity.id}を発見しました。`);
    }
  } else {
    player.runCommand(`say 真下にエンティティは見つかりませんでした。`);
  }
}
