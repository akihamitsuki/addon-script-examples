import * as mc from 'mojang-minecraft';
import { log } from '../utilities';

/**
 * playerJoin
 *
 * プレイヤーがワールドに参加したとき
 */
function onPlayerJoin(event: mc.PlayerJoinEvent) {
  // 参加したプレイヤー
  const player: mc.Player = event.player;

  player.runCommand(`give ${player.name} tnt 1`);
}

/**
 * playerLeave
 *
 * プレイヤーがワールドを退出したとき
 */
function onPlayerLeave(event: mc.PlayerLeaveEvent) {
  // 退出したプレイヤーの名前
  const playerName: string = event.playerName;
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
