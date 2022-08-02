import { expect, server } from './setup';

describe('Tasks', () => {
  it('gets tasks', (done) => {
    server
      .get('/api/tasks/1')
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.tasks).to.be.instanceOf(Array);
        done();
      });
  });
});
