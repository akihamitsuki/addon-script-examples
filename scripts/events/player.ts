import * as mc from 'mojang-minecraft';

/**
 * playerJoin
 *
 * プレイヤーがワールドに参加したとき
 */
export function onPlayerJoin(event: mc.PlayerJoinEvent) {
  // 参加したプレイヤー
  const player: mc.Player = event.player;

  // この時点でのコマンドは無効
  // event.player.runCommand('give @s apple');

  // 専用のメソッドで設定用アイテムを渡す
  const itemStack = new mc.ItemStack(mc.MinecraftItemTypes.feather, 1);
  itemStack.nameTag = 'イベント設定';
  const inventory = player.getComponent('minecraft:inventory') as mc.EntityInventoryComponent;
  inventory.container.addItem(itemStack);
}

/**
 * playerLeave
 *
 * プレイヤーがワールドを退出したとき
 */
function onPlayerLeave(event: mc.PlayerLeaveEvent) {
  // 退出したプレイヤーの名前だけ取得可能
  // ワールドから離れた後なので、そのプレイヤーに対しては何もできない
  const playerName: string = event.playerName;

  const dimension = mc.world.getDimension(mc.MinecraftDimensionTypes.overworld);
  dimension.runCommand(`say PlayerLeaveEvent: ${playerName} がワールドから退出しました。`);
}

export function togglePlayerEvents(toggle: boolean) {
  if (toggle) {
    mc.world.events.playerJoin.subscribe(onPlayerJoin);
    mc.world.events.playerLeave.subscribe(onPlayerLeave);
  } else {
    mc.world.events.playerJoin.unsubscribe(onPlayerJoin);
    mc.world.events.playerLeave.unsubscribe(onPlayerLeave);
  }
}
