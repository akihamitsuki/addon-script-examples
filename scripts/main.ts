import * as mc from 'mojang-minecraft';
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

switchEvent();
