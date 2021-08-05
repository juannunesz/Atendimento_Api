const customExpress = require('./config/custom.js');
const conexao = require('./infra/conexao.js')
const Tabelas = require('./infra/tabelas.js')

conexao.connect((erro) => {
    if(erro){
        console.log(erro)
    }else {
        Tabelas.init(conexao)

        const app = customExpress()
        app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
    }
})


