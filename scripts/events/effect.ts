import * as mc from 'mojang-minecraft';
import { log } from '../utilities';

/**
 * effectAdd
 *
 * エンティティにエフェクトが追加されたとき
 * すでに同じ効果を持っている場合は発生しない
 *
 * ハスクから空腹効果をうけたとき
 * ポーションを飲んだ時
 * /effectで効果を受けたとき
 */
export function onEffectAdd(event: mc.EffectAddEvent) {
  // 追加されたエフェクト
  const effect: mc.Effect = event.effect;
  // エフェクト番号
  const effectState: number = event.effectState;
  // 効果を受けたエンティティ
  const entity: mc.Entity = event.entity;

  log(
    `${entity.id} が ${effect.displayName}(${effectState}) の効果を` +
      `強さ${effect.amplifier} で ${effect.duration}ティック間 受けました。`
  );
}

export function registerEffectEvents() {
  mc.world.events.effectAdd.subscribe(onEffectAdd);
}
