import * as mc from 'mojang-minecraft';

/**
 * 装置を設置したブロックの座標を取得する
 *
 * @param button 設置した装置
 * @returns
 */
function getButtonInstalledLocation(button: mc.Block): mc.BlockLocation {
  // ブロックの種類や状態などについての組み合わせ(permutation)情報
  const permutation: mc.BlockPermutation = button.permutation;
  // ブロックの状態名を取得する（getProperty内に直接書いてもよい）
  const propertyName: string = mc.BlockProperties.facingDirection;
  // 向きを取得する（整数のプロパティ型に型変換をしている）
  const face: mc.IntBlockProperty = <mc.IntBlockProperty>permutation.getProperty(propertyName);

  // 元のブロック位置と向きから設置しているブロックを取得する（接地面は向きとは逆になることに注意）
  const blockLocation: mc.BlockLocation = button.location;
  if (face.value === 0) {
    blockLocation.y += 1; // 下向き -> 上面に設置している -> 高さ+1
  } else if (face.value === 1) {
    blockLocation.y -= 1; // 上向き -> 下面に設置
  } else if (face.value === 2) {
    blockLocation.z += 1; // 北向き -> 南面に
  } else if (face.value === 3) {
    blockLocation.z -= 1; // 南
  } else if (face.value === 4) {
    blockLocation.x += 1; // 西
  } else if (face.value === 5) {
    blockLocation.x -= 1; // 東
  }

  return blockLocation;
}

/**
 * buttonPush
 *
 * ボタンが押されたとき
 */
function onButtonPush(event: mc.ButtonPushEvent) {
  // ボタンのブロック情報
  const button: mc.Block = event.block;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // ボタンを押したエンティティ
  const user: mc.Entity = event.source;

  // 押したボタンの種類がアカシアなら
  if (button.id === mc.MinecraftBlockTypes.acaciaButton.id) {
    // 設置先のブロックを取得する
    // 設置したブロックは取得できるが、設置先のブロックは間接的に取得するしかない
    const installedBlock: mc.Block = dimension.getBlock(getButtonInstalledLocation(button));
    // 設置先のブロックをTNTに変える
    installedBlock.setType(mc.MinecraftBlockTypes.tnt);
    // そのままボタンの信号が伝わり着火する
  } else {
    // それ以外なら、押したプレイヤーに雷を落とす
    const location = `${user.location.x} ${user.location.y} ${user.location.z}`;
    dimension.runCommand(`summon lightning_bolt ${location}`);
  }
}

/**
 * 装置を設置したレバーの座標を取得する
 *
 * @param lever 設置した装置
 * @returns
 */
function getLeverInstalledLocation(lever: mc.Block): mc.BlockLocation {
  // ブロックの種類や状態などについての組み合わせ(permutation)情報
  const permutation: mc.BlockPermutation = lever.permutation;
  // ブロックの状態名を取得する（getProperty内に直接書いてもよい）
  const propertyName: string = mc.BlockProperties.leverDirection;
  // 向きを取得する（文字列のプロパティ型に型変換している）
  const face: mc.StringBlockProperty = <mc.StringBlockProperty>permutation.getProperty(propertyName);

  // 元のブロック位置と向きから設置しているブロックを取得する（接地面は向きとは逆になることに注意）
  const blockLocation: mc.BlockLocation = lever.location;
  if (face.value === 'down_east_west' || face.value === 'down_north_south') {
    blockLocation.y += 1; // 下向き -> 上面に設置している
  } else if (face.value === 'up_north_south' || face.value === 'up_east_west') {
    blockLocation.y -= 1; // 上
  } else if (face.value === 'north') {
    blockLocation.z += 1; // 北
  } else if (face.value === 'south') {
    blockLocation.z -= 1; // 南
  } else if (face.value === 'west') {
    blockLocation.x += 1; // 西
  } else if (face.value === 'east') {
    blockLocation.x -= 1; // 東
  }

  return blockLocation;
}

/**
 * leverActivate
 *
 * レバーが動作したとき
 */
function onLeverActivate(event: mc.LeverActionEvent) {
  // レバーのブロック情報
  const lever: mc.Block = event.block;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // レバーが有効になっているか
  const isPowered: boolean = event.isPowered;
  // イベントを発生させたプレイヤー
  const player: mc.Player = event.player;

  // 設置したブロックをレッドストーンランプにする
  // 設置したブロックは取得できるが、設置先のブロックは間接的に取得するしかない
  const installedBlock: mc.Block = dimension.getBlock(getLeverInstalledLocation(lever));
  installedBlock.setType(mc.MinecraftBlockTypes.redstoneLamp);

  // 有効なら夜に、無効なら昼にする
  if (isPowered) {
    dimension.runCommand('time set midnight');
  } else {
    dimension.runCommand('time set noon');
  }
}

/**
 * pistonActivate
 *
 * ピストンが動作したとき（動作した後）
 */
function onPistonActivate(event: mc.PistonActivateEvent) {
  // ピストンのブロック情報
  const block: mc.Block = event.block;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // ピストンが伸びているか
  const isExpanding: boolean = event.isExpanding;
  // イベントが発生したピストン
  const piston: mc.BlockPistonComponent = event.piston;

  // 粘着ピストン以外なら処理を終了
  if (block.type !== mc.MinecraftBlockTypes.stickyPiston) {
    return;
  }

  // ピストンが影響を与えたブロック位置の一覧
  const attachedBlocks: mc.BlockLocation[] = piston.attachedBlocks;
  if (isExpanding) {
    // 押し出すときは金ブロックに帰る
    attachedBlocks.forEach(function (blockLocation) {
      dimension.getBlock(blockLocation).setType(mc.MinecraftBlockTypes.goldBlock);
    });
  } else {
    // 引き戻すときはダイヤモンドブロックに変えたいが……消える(?)
    attachedBlocks.forEach(function (blockLocation) {
      dimension.getBlock(blockLocation).setType(mc.MinecraftBlockTypes.diamondBlock);
    });
  }
}

/**
 * beforePistonActivate
 *
 * ピストンが動作する前
 */
function onBeforePistonActivate(event: mc.BeforePistonActivateEvent) {
  // イベントを停止させるか
  event.cancel;
  // ピストンのブロック情報
  const block: mc.Block = event.block;
  // イベントが発生した次元
  const dimension: mc.Dimension = event.dimension;
  // 動作の後にピストンが伸びているか
  const isExpanding: boolean = event.isExpanding;
  // イベントが発生したピストン
  const piston: mc.BlockPistonComponent = event.piston;

  // 通常ピストン以外なら処理を終了
  if (block.type !== mc.MinecraftBlockTypes.piston) {
    return;
  }

  if (isExpanding) {
    // ピストンが影響を与えるブロック位置の一覧
    const attachedBlocks: mc.BlockLocation[] = piston.attachedBlocks;
    attachedBlocks.forEach(function (blockLocation) {
      const block: mc.Block = dimension.getBlock(blockLocation);
      if (block.type === mc.MinecraftBlockTypes.obsidian) {
        // 黒曜石が含まれていると動かない
        event.cancel = true;
      } else {
        // それ以外のブロックはTNTに変える
        block.setType(mc.MinecraftBlockTypes.tnt);
      }
    });
  }
}

export function toggleDeviceEvents(toggle: boolean) {
  if (toggle) {
    mc.world.events.buttonPush.subscribe(onButtonPush);
    mc.world.events.leverActivate.subscribe(onLeverActivate);
    mc.world.events.pistonActivate.subscribe(onPistonActivate);
    mc.world.events.beforePistonActivate.subscribe(onBeforePistonActivate);
  } else {
    mc.world.events.buttonPush.unsubscribe(onButtonPush);
    mc.world.events.leverActivate.unsubscribe(onLeverActivate);
    mc.world.events.pistonActivate.unsubscribe(onPistonActivate);
    mc.world.events.beforePistonActivate.unsubscribe(onBeforePistonActivate);
  }
}
