import { toggleBlockEvents } from './events/block';
import { toggleChargeEvents } from './events/charge';
import { toggleChatEvents } from './events/chat';
import { toggleDeviceEvents } from './events/device';
import { toggleEffectEvents } from './events/effect';
import { toggleEntityEvents } from './events/entity';

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
];

export default eventSettings;
