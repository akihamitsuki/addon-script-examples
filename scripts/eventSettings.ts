import { toggleBlockEvents } from './events/block';
import { toggleChargeEvents } from './events/charge';
import { toggleChatEvents } from './events/chat';
import { toggleDeviceEvents } from './events/device';
import { toggleEffectEvents } from './events/effect';
import { toggleEntityEvents } from './events/entity';
import { toggleExplosionEvents } from './events/explosion';
import { toggleItemEvents } from './events/item';
import { togglePlayerEvents } from './events/player';
import { toggleProjectileEvents } from './events/projectile';
import { toggleWorldEvents } from './events/world';
import { toggleRunCommandTests } from './run-commands/run-command';

const eventSettings = [
  {
    name: 'testEvent:toggleBlock',
    label: 'Block Events',
    type: 'boolean',
    default: false,
    func: toggleBlockEvents,
  },
  {
    name: 'testEvent:toggleCharge',
    label: 'Charge Events',
    type: 'boolean',
    default: false,
    func: toggleChargeEvents,
  },
  {
    name: 'testEvent:toggleChat',
    label: 'Chat Events',
    type: 'boolean',
    default: false,
    func: toggleChatEvents,
  },
  {
    name: 'testEvent:toggleDevice',
    label: 'Device Events',
    type: 'boolean',
    default: false,
    func: toggleDeviceEvents,
  },
  {
    name: 'testEvent:toggleEffect',
    label: 'Effect Events',
    type: 'boolean',
    default: false,
    func: toggleEffectEvents,
  },
  {
    name: 'testEvent:toggleEntity',
    label: 'Entity Events',
    type: 'boolean',
    default: false,
    func: toggleEntityEvents,
  },
  {
    name: 'testEvent:toggleExplosion',
    label: 'Explosion Events',
    type: 'boolean',
    default: false,
    func: toggleExplosionEvents,
  },
  {
    name: 'testEvent:toggleItem',
    label: 'Item Events',
    type: 'boolean',
    default: false,
    func: toggleItemEvents,
  },
  {
    name: 'testEvent:togglePlayer',
    label: 'Player Events',
    type: 'boolean',
    default: false,
    func: togglePlayerEvents,
  },
  {
    name: 'testEvent:toggleProjectile',
    label: 'Projectile Events',
    type: 'boolean',
    default: false,
    func: toggleProjectileEvents,
  },
  {
    name: 'testEvent:toggleWorld',
    label: 'World Events',
    type: 'boolean',
    default: false,
    func: toggleWorldEvents,
  },
  {
    name: 'testEvent:toggleRunCommand',
    label: 'RunCommand',
    type: 'boolean',
    default: false,
    func: toggleRunCommandTests,
  },
];

export default eventSettings;
