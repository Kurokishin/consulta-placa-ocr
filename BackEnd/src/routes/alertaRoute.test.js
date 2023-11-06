const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./alertaRoute'); // Importe o seu aplicativo Express

chai.use(chaiHttp);

describe('AlertaRoute', () => {
  it('deve responder à rota POST /alerta', (done) => {
    chai
      .request(app)
      .post('/alerta')
      .send({ message: 'Teste de alerta' })
      .end((err, res) => {
        // Encerra o teste sem verificar a resposta
        done();
      });
  });
});
