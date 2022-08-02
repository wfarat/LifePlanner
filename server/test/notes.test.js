import { expect, server } from './setup';

describe('Notes', () => {
  it('gets notes', (done) => {
    server
      .get('/api/notes/1')
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.notes).to.be.instanceOf(Array);
        done();
      });
  });
});
