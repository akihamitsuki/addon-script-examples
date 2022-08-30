import { toggleBlockEvents } from './events/block';
import { toggleChargeEvents } from './events/charge';
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
    name: 'testEvent:toggleEntity',
    label: 'Entity Events',
    type: 'boolean',
    default: false,
    func: toggleEntityEvents,
  },
];

export default eventSettings;
