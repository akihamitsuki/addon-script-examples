import * as mc from 'mojang-minecraft';
import { getButtonInstalledLocation, getLeverInstalledLocation } from '../utilities';

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
    user.runCommand(`summon lightning_bolt`);
  }
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
  // このイベントでは設置したブロックは取得できるが、設置先のブロックは間接的に取得するしかない
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
    for (const blockLocation of attachedBlocks) {
      dimension.getBlock(blockLocation).setType(mc.MinecraftBlockTypes.goldBlock);
    }
  } else {
    // 引き戻すときはダイヤモンドブロックに変える
    for (const blockLocation of attachedBlocks) {
      dimension.getBlock(blockLocation).setType(mc.MinecraftBlockTypes.diamondBlock);
    }
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
    for (const blockLocation of attachedBlocks) {
      const block: mc.Block = dimension.getBlock(blockLocation);
      if (block.type === mc.MinecraftBlockTypes.obsidian) {
        // 黒曜石が含まれていると動かない
        event.cancel = true;
      } else {
        // それ以外のブロックはTNTに変える
        block.setType(mc.MinecraftBlockTypes.tnt);
      }
    }
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
