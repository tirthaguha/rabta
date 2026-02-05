import { expressApp } from './express-app';

describe('expressApp', () => {
  it('should work', () => {
    expect(expressApp()).toEqual('express-app');
  });
});
