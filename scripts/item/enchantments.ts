import * as mc from 'mojang-minecraft';

/**
 * アイテムにエンチャントをかける（まだ動かない）
 */
export function enchantoment(player: mc.Player) {
  // アイテムを作成する
  const itemStack: mc.ItemStack = new mc.ItemStack(mc.MinecraftItemTypes.ironSword, 1);

  // エンチャントコンポーネントを取得する
  const component: mc.ItemEnchantsComponent = itemStack.getComponent('minecraft:enchantments');
  // エンチャントの一覧を取得する
  // const enchantmentList: mc.EnchantmentList = component.enchantments;

  // エンチャントの種類
  const enchantmentType: mc.EnchantmentType = mc.MinecraftEnchantmentTypes.sharpness;
  // エンチャントのレベル
  const level: number = 1;
  // エンチャントを作成
  const enchantment: mc.Enchantment = new mc.Enchantment(enchantmentType);

  // そのエンチャントが付与可能かを判定する
  if (component.enchantments.canAddEnchantment(enchantment)) {
    // エンチャントを追加する
    // ???: この方法ではうまく動かない
    component.enchantments.addEnchantment(enchantment);
  }

  // プレイヤーにアイテムを渡す
  const inventory = player.getComponent('minecraft:inventory') as mc.EntityInventoryComponent;
  inventory.container.addItem(itemStack);
}
