# イベント

「～が起こった時」にスクリプトが起動します。


## イベントの種類

### [ブロック (block.ts)](./block.ts)

* `BlockBreakEvent`: ブロックが壊れたとき
* `BlockExplodeEvent`: ブロックが爆発で壊れたとき
* `BlockPlaceEvent`: ブロックが置かれたとき


### [チャージ (charge.ts)](./charge.ts)

弓やクロスボウなどの、チャージできるアイテムを使用したとき。

* `ItemStartChargeEvent`: チャージを開始したとき
* `ItemStopChargeEvent`: チャージを停止したとき
* `ItemCompleteChargeEvent`: チャージを完了したとき
* `ItemReleaseChargeEvent`: チャージを解放したとき


### [チャット (chat.ts)](./chat.ts)

* `ChatEvent`: チャットメッセージを送ったとき（送信された後）
* `BeforeChatEvent`: チャットメッセージを送ったとき（送信される直前）


### [装置 (device.ts)](./device.ts)

* `ButtonPushEvent`: ボタンを押したとき
* `LeverActionEvent`: レバーを操作したとき
* `PistonActivateEvent`: ピストンが動いたとき(動いた後)
* `BeforePistonActivateEvent`: ピストンが動くとき(動く直前)


### [エフェクト (effect.ts)](./effect.ts)

* `EffectAddEvent`: ステータス効果が追加されたとき


### [エンティティ (entity.ts)](./entity.ts)

* `EntityCreateEvent`: エンティティが作成されたとき
* `EntityHitEvent`: エンティティが近接攻撃を受けたとき(遠距離 -> `ProjectileHitEvent`)
* `EntityHurtEvent`: エンティティがダメージを受けたとき
* `DataDrivenEntityTriggerEvent`: エンティティのコンポーネントが変更されたとき(直後)
* `BeforeDataDrivenEntityTriggerEvent`: エンティティのコンポーネントが変更されるとき(直前)


### [爆発 (explosion.ts)](./explosion.ts)

* `ExplosionEvent`: 爆発したとき(爆発した直後)
* `BeforeExplosionEvent`: 爆発するとき(爆発する直前)


### [アイテム (item.ts)](./item.ts)

`Use`がアイテムを普通に使用したとき。  
`UseOn`がブロックに向けてアイテムを使用したとき。

* `ItemUseEvent`: アイテムを使用したとき(直後)
* `BeforeItemUseEvent`: アイテムを使用するとき(直前)
* `ItemStartUseOnEvent`: ブロックに向けてアイテムの使用を開始したとき
* `ItemStopUseOnEvent`: ブロックに向けてアイテムの使用を停止したとき
* `ItemUseOnEvent`: ブロックに向けてアイテムの使用を開始したとき
* `BeforeItemUseOnEvent`: ブロックに向けてアイテムの使用を開始するとき
* `ItemDefinitionTriggeredEvent`: アイテムのコンポーネントが変更されたとき
* `BeforeItemDefinitionTriggeredEvent`: アイテムのコンポーネントが変更されるとき


### [プレイヤー (player.ts)](./player.ts)

* `PlayerJoinEvent`: プレイヤーがワールドに入ったとき
* `PlayerLeaveEvent`: プレイやがーワールドから出たとき


### [発射物 (projectile.ts)](./projectile.ts)

* `ProjectileHitEvent`: 発射物が何かに当たったとき


### [ワールド (world.ts)](./world.ts)

* `TickEvent`: 1ティック毎に(1秒に20回)、定期的に実行される
* `WeatherChangeEvent`: 天候が変わったとき
* `WorldInitializeEvent`: ワールドが初期化したとき


## [イベントの登録と削除](./subscribe.ts)

ワールドからイベントシグナルを呼び出して、そこに対応するイベント関数を登録します。
イベント関数とイベントシグナルは対応している必要があります。

削除する場合は、同じ関数を `unsbscribe()` に指定します。


```typescript
import * as mc from 'mojang-minecraft';

// イベント関数を作る
function onBlockBreak(event: mc.BlockBreakEvent) {
  // ...
}

// イベント関数を対応するイベントシグナルに登録する: subscribe()
mc.world.events.blockBreak.subscribe(onBlockBreak);

// イベント関数の登録を解除する: unsubscribe()
mc.world.events.blockBreak.unsubscribe(onBlockBreak);
```

### 直接記述する

無名関数の[アロー関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions)を使い、直接`subscribe()`の中に処理を記述することもできます。

ただし、この場合には登録したイベントを削除することは（おそらく）できません。

```typescript
// この場合eventの型宣言は不要。 subscribe()に記述されている
mc.world.events.blockBreak.subscribe((event) => {
  // ...
});

