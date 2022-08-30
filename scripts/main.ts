import * as mc from 'mojang-minecraft';
import * as mcui from 'mojang-minecraft-ui';
// event
import { toggleBlockEvents } from './events/block';
import { toggleChargeEvents } from './events/charge';
import { toggleEntityEvents } from './events/entity';

const dynamicProperties = [
  {
    name: 'testEvent:toggleBlock',
    label: 'ブロックイベント',
    type: 'boolean',
    default: false,
  },
  {
    name: 'testEvent:toggleEntity',
    label: 'エンティティイベント',
    type: 'boolean',
    default: false,
  },
];

/**
 * ワールド作成時に、プレイヤーエンティティに設定保存用の場所（ダイナミックプロパティ）を作成する
 */
mc.world.events.worldInitialize.subscribe((event) => {
  const playerDef = new mc.DynamicPropertiesDefinition();
  for (const dp of dynamicProperties) {
    if (dp.type === 'boolean') {
      playerDef.defineBoolean(dp.name);
    }
  }
  event.propertyRegistry.registerEntityTypeDynamicProperties(playerDef, mc.MinecraftEntityTypes.player);
});

/**
 * プレイヤー参加時に初期値を設定する
 */
mc.world.events.playerJoin.subscribe((event) => {
  for (const dp of dynamicProperties) {
    event.player.setDynamicProperty(dp.name, dp.default);
  }
});

/**
 * 特定のアイテムを使用したときにフォームを表示する
 */
mc.world.events.beforeItemUse.subscribe((event) => {
  // プレイヤー以外が起こしたイベントなら（起こせるかどうかわからないが）処理を終了
  if (event.source.id !== mc.MinecraftEntityTypes.player.id) {
    // ここで関数を終了
    return;
  }
  // 使用したアイテムが特定のアイテム以外なら処理を終了
  if (event.item.id !== mc.MinecraftItemTypes.feather.id) {
    return;
  }

  // 使用者の型をEntityからPlayerに変更（ここのsourseはEntity型）
  const player: mc.Player = <mc.Player>event.source;
  // ModalFormのインスタンスを作成
  const ModalForm = new mcui.ModalFormData();

  // 題名を設定
  ModalForm.title('イベントの切り替え');
  ModalForm.toggle('ブロックイベント', getPlayerDynamicProperty(player, 'testEvent:toggleBlock'));
  ModalForm.toggle('エンティティイベント', getPlayerDynamicProperty(player, 'testEvent:toggleEntity'));

  // モーダルを表示
  ModalForm.show(player).then((response) => {
    if (response.isCanceled) {
      player.runCommand('say フォームを閉じました');
      return;
    }

    const [toggleBlock, toggleEntity] = response.formValues;
    toggleBlockEvents(toggleBlock);
    player.setDynamicProperty('testEvent:toggleBlock', toggleBlock);
    toggleEntityEvents(toggleEntity);
    player.setDynamicProperty('testEvent:toggleEntity', toggleEntity);

    player.runCommand(`say 設定を更新しました。`);
  });
});

/**
 * プレイヤーのダイナミックプロパティから値を取得し、その際に例外処理を加える
 *
 * @param player
 * @param propertyName
 * @returns
 */
function getPlayerDynamicProperty(player: mc.Player, propertyName: string) {
  try {
    return <boolean>player.getDynamicProperty(propertyName);
  } catch {
    player.runCommand(`say [error] Cound't find ${propertyName}`);
  }
  return false;
}
