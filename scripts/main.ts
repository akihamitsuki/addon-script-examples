import * as mc from 'mojang-minecraft';
import * as mcui from 'mojang-minecraft-ui';
import eventSettings from './eventSettings';
import { onPlayerJoin } from './events/player';

/** 設定用アイテムを渡す */
mc.world.events.playerJoin.subscribe(onPlayerJoin);

/**
 * ワールド作成時に、プレイヤーエンティティに設定保存用の場所（ダイナミックプロパティ）を作成する
 */
mc.world.events.worldInitialize.subscribe((event) => {
  // 定義インスタンスを作成
  const worldDef = new mc.DynamicPropertiesDefinition();
  // 設定配列で繰り返して、定義を設定する
  for (const dp of eventSettings) {
    if (dp.type === 'boolean') {
      worldDef.defineBoolean(dp.name);
    }
  }
  // ワールドに追加
  event.propertyRegistry.registerWorldDynamicProperties(worldDef);
  // 初期値を設定
  for (const dp of eventSettings) {
    mc.world.setDynamicProperty(dp.name, dp.default);
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
  for (const dp of eventSettings) {
    ModalForm.toggle(dp.label, getWorldDynamicProperty(mc.world, dp.name));
  }

  // モーダルを表示
  ModalForm.show(player).then((response) => {
    if (response.isCanceled) {
      player.runCommand('say フォームを閉じました');
      return;
    }
    // 設定で繰り返し
    eventSettings.forEach((dp, index) => {
      // 設定した順番で入力結果が返ってくる
      const value = response.formValues[index];
      // 設定内の関数を入力結果を引数にして実行
      dp.func(value);
      // ダイナミックプロパティに入力結果を保存
      mc.world.setDynamicProperty(dp.name, value);
    });

    player.runCommand(`say 設定を更新しました。`);
  });
});

/**
 * ワールドのダイナミックプロパティから値を取得し、その際に例外処理を加える
 *
 * @param world
 * @param propertyName
 * @returns
 */
function getWorldDynamicProperty(world: mc.World, propertyName: string) {
  try {
    return <boolean>world.getDynamicProperty(propertyName);
  } catch (e) {
    console.log(`[error] ${e}`);
  }
  return false;
}
