function validateMessage(request, response, next){

    const {email, title, description} = request.body

    if(!email || email.indexOf("@") === -1 || email.indexOf(".") === -1){
        response.status(400).send('Insira um e-mail válido')
    }
    
    if(!title){
        response.status(400).send(JSON.stringify({Mensagem: 'Título não pode estar vazio'}))
    }

    if(!description){
        response.status(400).send(JSON.stringify({Mensagem: 'Descrição não pode estar vazia'}))
    }

    return next()
}

export default validateMessage