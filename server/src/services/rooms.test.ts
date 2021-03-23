import rtcrooms from './rooms';

describe('rtc rooms', () => {
  it('should init with empty rooms', () => {
    const rooms = rtcrooms.getRooms();

    expect(rooms.size).toBe(0);
  });
});
