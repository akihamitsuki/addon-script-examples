import * as mc from 'mojang-minecraft';

const overworld: mc.Dimension = mc.world.getDimension(mc.MinecraftDimensionTypes.overworld);

/**
 * アイテムの作成
 *
 * @returns
 */
function itemStack() {
  // アイテムの種類
  const itemType: mc.ItemType = mc.MinecraftItemTypes.wool;
  // アイテムの数
  const amount: number = 10;
  // アイテムのデータ値
  const data: number = 2;
  // アイテムスタックの作成（この時点ではただのアイテムデータで、マインクラフトのどこにも存在しない）
  const itemStack: mc.ItemStack = new mc.ItemStack(itemType, amount, data);

  // 一人目のプレイヤーを取得
  const player = [...overworld.getPlayers()][0];

  // アイテムエンティティとして出現させる
  overworld.spawnItem(itemStack, new mc.Location(player.location.x + 5, player.location.y + 5, player.location.z));

  // プレイヤーにアイテムを渡すには、そのプレイヤーのインベントリコンポーネントを取得し、それに対して設定する
  const inventory = player.getComponent('minecraft:inventory') as mc.EntityInventoryComponent;
  inventory.container.addItem(itemStack);
}

/**
 * アイテムの基本情報
 */
function itemInfo() {
  const itemStack: mc.ItemStack = new mc.ItemStack(mc.MinecraftItemTypes.apple, 1);
  // アイテムID
  itemStack.id;
  // アイテムの数
  itemStack.amount;
  // アイテムのデータ値
  itemStack.data;
}

/**
 * アイテムのコンポーネント
 */
function itemComponent() {
  const itemStack: mc.ItemStack = new mc.ItemStack(mc.MinecraftItemTypes.apple, 1);

  // getComponent()
  // 指定したコンポーネントを取得する
  const component: mc.ItemEnchantsComponent = itemStack.getComponent('minecraft:enchantments');
  const enchantmentList = component.enchantments;

  // getComponents()
  // すべてのコンポーネントを取得する
  const itemComponents = itemStack.getComponents();
  overworld.runCommand(`say ${itemComponents.length}`);
  itemComponents.forEach((component) => {
    overworld.runCommand(`say ${component.id}`);
  });

  // hasComponent()
  // そのコンポーネントを持っているか
  const hasComponent: boolean = itemStack.hasComponent('minecraft:enchantments');
  overworld.runCommand(`say ${hasComponent}`);
}

/**
 * アイテムの名前
 *
 * @param player
 */
function lore(player: mc.Player) {
  // リンゴ1個のアイテムスタック情報を作成
  const itemStack = new mc.ItemStack(mc.MinecraftItemTypes.apple, 1);

  // nameTag
  // 名前の設定
  itemStack.nameTag = '怪しいリンゴ';
  overworld.runCommand(`say ${itemStack.nameTag}`);

  // setLore, getLore
  // アイテムの説明（配列形式で改行できる）
  itemStack.setLore(['食べると何が', '起こるかわからない']);
  const lore: string[] = itemStack.getLore();
  for (const line of lore) {
    overworld.runCommand(`say ${line}`);
  }

  // プレイヤーにアイテムを渡すには、そのプレイヤーのインベントリコンポーネントを取得し、それに対して設定する
  // コンポーネントは適切な型に変換して取得する
  const inventory = player.getComponent('minecraft:inventory') as mc.EntityInventoryComponent;
  // addItem(): インベントリに対してアイテムを追加する（同じアイテムがあれば同じスタックに加算される）
  inventory.container.addItem(itemStack);
}

// itemStack.triggerEvent();
