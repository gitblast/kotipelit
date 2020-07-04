import * as events from './socketio.events';
import { EmittedEvent, EventType } from '../types';

describe('event creators', () => {
  it('should create event for succesful room creation', () => {
    const expectedEvent: EmittedEvent = {
      event: EventType.CREATE_SUCCESS,
      data: 'token for jitsi',
    };

    expect(events.createSuccess('token for jitsi')).toEqual(expectedEvent);
  });

  it('should create event for failure of room creation', () => {
    const expectedEvent: EmittedEvent = {
      event: EventType.CREATE_FAILURE,
      data: {
        error: 'error message',
      },
    };

    expect(events.createFailure('error message')).toEqual(expectedEvent);
  });
});
