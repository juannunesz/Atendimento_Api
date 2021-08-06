const moment = require('moment')
const conexao = require('../infra/conexao')

class Atendimento {

    adiciona (atendimento, resposta) {
        const dataCriacao = new Date()

        //Faz a padronizção da nossa data antes de enviar para o Banco de dados
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')

        const dataValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteValido = atendimento.cliente.length >=4;

        const validacoes = [
            { 
                nome: 'data',
                valido: dataValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteValido,
                mensagem: 'O cliente deve ter pelo menos 4 caracteres'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if(existemErros){
            resposta.status(400).json(erros)
        }else {
            // Pega todos os dados enviados pela api e junta com a data atual + a data alterada
            const atendimentoDatado = {...atendimento, dataCriacao, data}
    
            //Cria a query da nossa consulta
            const sql = 'INSERT INTO Atendimentos SET ?'
    
            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if(erro) {
                    resposta.status(400).json(erro)
                }else {
                   resposta.status(201).json(resultados)
                }
            })
        }

    }

    lista (resposta){
        const sql = 'SELECT * FROM atendimentos'

        conexao.query(sql , (erro, resultado) => {
            if(erro){
                resposta.status(400).json(erro)
            }else{
                resposta.status(200).json(resultado)
            }
        })
    }
    
    listaId(id, resposta) {

        const sql = `SELECT * FROM atendimentos WHERE id=?`

        conexao.query(sql, id, (erro, resultados) => {
            const atendimento = resultados[0]
            if(erro){
                resposta.status(400).json(erro)
            }else {
                resposta.status(200).json(atendimento)
            }
        })
    }

    altera(id, valores, resposta){

        if(valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }
        
        const sql = `UPDATE atendimentos SET ? WHERE id=?`

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if(erro){
                resposta.status(400).json(erro)
            }else {
                resposta.status(200).json(resultados)
            }
        })
    }

    deleta(id, resposta){

        const sql = 'DELETE FROM atendimentos where id=?'

        conexao.query(sql, id , (erro, resultados) => {
            if(erro) {
                resposta.status(400).json(erro)
            }else {
                resposta.status(200).json({id})
            }
        })
    }

}

module.exports = new Atendimento