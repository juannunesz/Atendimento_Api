const Atendimento = require('../models/atendimentos')

module.exports = app => {
    app.get('/atendimentos', function (req, res){
        res.send('rota get');
    });

    app.post('/atendimentos', function(req, res){
        const atendimento = req.body

        Atendimento.adiciona(atendimento)
        res.send('você está na rota POST');
    })
}