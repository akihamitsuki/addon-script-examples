import * as mc from 'mojang-minecraft';
import * as mcui from 'mojang-minecraft-ui';
// event
import { registerBlockEvents } from './events/block';
import { registerChargeEvents } from './events/charge';
import { registerChatEvents } from './events/chat';
import { registerDeviceEvents } from './events/device';
import { registerEffectEvents } from './events/effect';
import { registerEntityEvents } from './events/entity';
import { registerExplosionEvents } from './events/explosion';
import { registerItemEvents } from './events/item';
import { registerPlayerEvents } from './events/player';
import { registerProjectileEvents } from './events/projectile';
import { registerWorldEvents } from './events/world';
import { switchEvent } from './events/subscribe';
// ui
import { showActionForm } from './ui/action-form';
import { showMessageForm } from './ui/message-form';
import { registerModalFormEvents } from './ui/modal-form';

// registerBlockEvents();
// registerChargeEvents();
// registerChatEvents();
// registerDeviceEvents();
// registerEffectEvents();
// registerEntityEvents();
// registerExplosionEvents();
// registerItemEvents();
// registerPlayerEvents();
// registerProjectileEvents();
// registerWorldEvents();
// switchEvent();

// mc.world.events.beforeItemUse.subscribe(showActionForm);
// mc.world.events.beforeItemUse.subscribe(showMessageForm);
// registerModalFormEvents();
