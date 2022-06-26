import * as mc from 'mojang-minecraft';

const overworld = mc.world.getDimension(mc.MinecraftDimensionTypes.overworld);

/**
 * ブロック
 */
function getBlock(player: mc.Player) {
  // 短い変数に代入
  const loc = player.location;
  // プレイヤーの足元の座標をブロック座標に変換
  const blockLocation = new mc.BlockLocation(loc.x, loc.y - 1, loc.z);
  // 次元がら、その座標のブロックを取得する
  const block: mc.Block = overworld.getBlock(blockLocation);

  // 次元を取得
  const dimenstion: mc.Dimension = block.dimension;
  // identifier
  const identifer: string = block.id;
  player.runCommand(`say ${dimenstion.id}: ${identifer}`);
  // 空気ブロックかどうか
  const isEmpty: boolean = block.isEmpty;
  if (isEmpty) {
    player.runCommand(`say 足元は空気ブロックです`);
  } else {
    player.runCommand(`say 足元は空気ブロックではありません`);
  }
  // 水を含んでいるか（水中の階段など）
  const isWaterlogged: boolean = block.isWaterlogged;
  if (isWaterlogged || identifer === 'minecraft:water') {
    player.runCommand(`say 足元のブロックには水が含まれています`);
  } else {
    player.runCommand(`say 足元のブロックには水が含まれていません`);
  }

  // ???
  // block.getComponent
  // const tags: string[] = block.getTags();
  // const hasTag: boolean = block.hasTag('tagName');
}

/**
 * ブロック座標
 */
function location(player: mc.Player) {
  const loc = player.location;
  const block: mc.Block = overworld.getBlock(new mc.BlockLocation(loc.x, loc.y - 1, loc.z));
  // BlockLocation
  const blockLocation: mc.BlockLocation = block.location;

  // その上のブロック座標を取得する(y+1)
  const aboveBlock: mc.BlockLocation = blockLocation.above();
  // 相対的なブロック位置を取得する
  const offsetBlockLocation = blockLocation.offset(0, 1, 0);
  // そのブロック座標と同じかどうか
  const isSame: boolean = aboveBlock.equals(offsetBlockLocation);
  if (isSame) {
    player.runCommand(`say 二つの座標は同じです。`);
  } else {
    player.runCommand(`say 二つの座標は同じではありません。`);
  }

  // 二つのブロックの間のブロック座標配列を取得する
  const betweenBlocks: mc.BlockLocation[] = blockLocation.blocksBetween(new mc.BlockLocation(loc.x, loc.y - 5, loc.z));
  for (const loc of betweenBlocks) {
    const block = overworld.getBlock(loc);
    player.runCommand(`say ${block.id}(${block.x}, ${block.y}, ${block.z})`);
  }
}

/**
 * ブロックの組み合わせ情報
 */
function pemutation(player: mc.Player) {
  const loc = player.location;
  const block: mc.Block = overworld.getBlock(new mc.BlockLocation(loc.x, loc.y - 1, loc.z));

  // BlockPemutation
  const permutation: mc.BlockPermutation = block.permutation;
  //
  const permutationClone: mc.BlockPermutation = permutation.clone();
  // そのブロックが持っているすべてのプロパティを取得
  const propertites: mc.IBlockProperty[] = permutation.getAllProperties();
  for (const property of propertites) {
    player.runCommand(`say ${property.name}`);
  }

  // ブロックプロパティ
  // const propertyName: string = mc.BlockProperties.height;
  // const property: mc.IBlockProperty = permutation.getProperty(propertyName);
  // const permutationTags: string[] = permutation.getTags();
  // const hasTag: boolean = permutation.hasTag('tagName');
  // permutation.type;
  // block.setPermutation(permutation);
}

/**
 * ブロックの種類
 */
function type(player: mc.Player) {
  const loc = player.location;
  const block: mc.Block = overworld.getBlock(new mc.BlockLocation(loc.x, loc.y - 1, loc.z));
  // ブロックの種類を設定(変更)
  block.setType(mc.MinecraftBlockTypes.air);
  // ブロックの種類を取得
  const blockType: mc.BlockType = block.type;
  player.runCommand(`say ${blockType.id}`);
}
