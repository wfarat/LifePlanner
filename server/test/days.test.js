import { expect, server } from './setup';

describe('Days', () => {
  it('gets day', (done) => {
    server
      .get('/api/days/1/111990')
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.day.id).to.equal(1);
        expect(res.body.day.comment).to.equal('this day was cool');
        expect(res.body.day.user_id).to.equal(1);
        expect(res.body.dayNotes).to.be.instanceOf(Array);
        expect(res.body.dayTasks).to.be.instanceOf(Array);
        done();
      });
  });
});
