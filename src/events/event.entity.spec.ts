import { EventEnt } from "./event.entity";

test('event should be init', () => {
    const event = new EventEnt({
        name: 'cool event',
        description: 'cool',

    });

    expect(event).toEqual({
        name: 'cool event',
        description: 'cool',
        id: undefined,
        when: undefined,
        address: undefined,
        attendeeCount: undefined,
        attendeeRejected: undefined,
        attendeeMaybe:undefined,
        attendeeAccepted:undefined,
    });
});

