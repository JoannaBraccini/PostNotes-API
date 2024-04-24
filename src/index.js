import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import validateMessage from './middlewares/validateMessage'

const app = express()

app.use(cors())
app.use(express.json())

let users = []
let nextUser = 1

app.post('/signup',async (request,response)=>{

    const {name, email, password} = request.body
    
    if(!name){
        response.status(400).send(JSON.stringify({Mensagem: 'Por favor, verifique se passou o nome'}))
    }
    if(!email || email.indexOf("@") === -1 || email.indexOf(".") === -1){
        response.status(400).send(JSON.stringify({Mensagem: 'Por favor, verifique se passou o email'}))
    } else if(users.find(user => user.email === email)){
        response.status(400).send(JSON.stringify({Mensagem: 'Email já cadastrado, insira outro'}))
    }
    if(!password){
        response.status(400).send(JSON.stringify({Mensagem: 'Por favor, verifique se passou a senha'}))
    }

    const encriptedPassword = await bcrypt.hash(password,10)
    
    let newUser = {id:nextUser, name:name, email:email, password:encriptedPassword, messages: []}

    users.push(newUser)
    nextUser++
    
    response.status(201).send(JSON.stringify({Mensagem: `Seja bem vindo(a) ${newUser.name}! Pessoa usuária registrada com sucesso!`}))
})

app.put('/login',async (request,response)=>{
    
    const {email, password} = request.body
    
    const user = users.find(user => user.email === email)
    if(!email || email.indexOf("@") === -1 || email.indexOf(".") === -1){
        response.status(400).send('Insira um e-mail válido')
    } else if(!user){
        response.status(400).send('Email não encontrado no sistema, verifique ou crie uma conta')
    }
    if(!password){
        response.status(400).send('Insira uma senha válida')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if(!passwordMatch){
        response.status(400).send(JSON.stringify({Mensagem: 'Credencial inválida. Confira sua senha.'}))
    }
    
    response.status(200).send(`Seja bem vindo(a) ${user.name}! Pessoa usuária logada com sucesso!`)
})

let nextMessage = 1

app.post('/message', validateMessage, (request,response)=>{

    const data = request.body    
    let findUser = users.findIndex(user => user.email === data.email)

    if(findUser === -1){
        response.status(400).send('Email não encontrado no sistema, verifique ou crie uma conta')
    }
        
    let newMessage = {id:nextMessage, title:data.title, description:data.description}
    users[findUser].messages.push(newMessage)
    nextMessage++

    response.status(201).send(JSON.stringify({Mensagem: `Mensagem criada com sucesso! | ID: ${newMessage.id} | Título: ${newMessage.title} | Descrição: ${newMessage.description}`}))
})

app.get('/message/:email',(request,response)=>{

    const email = request.params.email

    let findUser = users.findIndex(user => user.email === email)
    if(findUser === -1){
        response.status(404).send(JSON.stringify({Mensagem: 'Email não encontrado, verifique ou crie uma conta'}))

    }

    let userMessages = users[findUser].messages
    let mapMessages = userMessages.map((message)=>`${message.id} | ${message.title} | ${message.description}`)

    if(userMessages.length === 0){
        response.status(404).send(JSON.stringify({Mensagem: 'Nenhuma mensagem encontrada'}))
    } else {
        response.status(200).send(JSON.stringify({Mensagem: `Seja bem-vinde!`,mapMessages}))
    }
})

app.put('/message/:id', validateMessage, (request,response)=>{
    
    const data = request.body
    const id = Number(request.params.id)

    let findUser = users.findIndex(user => user.email === data.email)
    if(findUser === -1){
        response.status(404).send(JSON.stringify({Mensagem:'Email não encontrado, verifique ou crie uma conta'}))
    }

    let findMessage = users[findUser].messages.findIndex(message => message.id === id)
    if(findMessage === -1){
        response.status(404).send(JSON.stringify({Mensagem: 'Por favor, informe um id válido da mensagem'}))
    }
    
    users[findUser].messages[findMessage].title = data.title
    users[findUser].messages[findMessage].description = data.description

    response.status(200).send(JSON.stringify({Mensagem: `Mensagem atualizada com sucesso!`,
    data: users[findUser].messages[findMessage]}))
})

app.delete('/message/:id',(request,response)=>{

    const email = request.body.email
    const id = Number(request.params.id)

    let findUser = users.findIndex(user => user.email === email)
    if(findUser === -1){
        response.status(404).send(JSON.stringify({Mensagem: 'Email não encontrado, verifique ou crie uma conta'}))
    }

    let findMessage = users[findUser].messages.findIndex(message => message.id === id)
    if(findMessage === -1){
        response.status(404).send(JSON.stringify({Mensagem: 'Mensagem não encontrada, verifique o identificador em nosso banco'}))
    }

    users[findUser].messages.splice(findMessage, 1)
    response.status(200).send(JSON.stringify({Mensagem:'Mensagem apagada com sucesso'}))
})

app.listen(3333,()=>console.log('Servidor rodando na porta 3333'))