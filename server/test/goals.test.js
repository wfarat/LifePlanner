import { expect, server } from './setup';

describe('Goals', () => {
  it('gets goals', (done) => {
    server
      .get('/api/goals/1')
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.goals).to.be.instanceOf(Array);
        done();
      });
  });
});
