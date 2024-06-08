import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import { v4 as uuid } from 'uuid'

import { messages, users } from './database/db.js'
import authUser from './middlewares/authUser.js'
import authMessage from './middlewares/authMessage.js'

const app = express()
const PORT = process.env.PORT
const userData = process.env.userSafe

app.use(cors())
app.use(express.json())

app.post('/signup', async (request,response)=>{

    const {name, email, password} = request.body
    
    if(!name){
        response.status(400).json({
            success: false,
            message: 'Por favor, insira um nome válido.'
        })
    }

    if(!email){
        response.status(400).json({
            success: false,
            message: 'Por favor, insira um email válido.'
        })
    } else if(users.find(user => user.email === email)){
        response.status(400).json({
            success: false,
            message: 'Email já cadastrado, faça login.'
        })
    }

    if(!password){
        response.status(400).json({
            success: false,
            message: 'Por favor, insira uma senha válida.'
        })
    }

    const encriptedPassword = await bcrypt.hash(password,10)
    
    const newUser = {
        id:uuid(), 
        name, 
        email
        }

    const userSafe = {
        id:uuid(), 
        name, 
        email,
        password: encriptedPassword
        }

    userData.push(userSafe)
    users.push(newUser)    

    response.status(201).json({
        success: true,
        message: 'Pessoa usuária registrada com sucesso!',
        data: newUser
    })
})

app.post('/login', async (request,response)=>{
    
    const {email, password} = request.body
    
    if(!email){
        response.status(400).json({
            success: false,
            message: 'Insira um e-mail válido'
        })
    }
        
    if(!password){
        response.status(400).json({
            success: false,
            message: 'Insira uma senha válida'
        })
    }
    
    const userVerify = userSafe.find(user => user.email === email)
    const passwordMatch = await bcrypt.compare(password, userVerify.password)

    if (!userVerify || !passwordMatch){
        response.status(400).json({
            success: false,
            message: 'Email ou senha inválidos.'
        })
    }

    const user = users.find(user => user.email === userVerify)

    response.status(200).json({
        success: true,
        message: 'Pessoa usuária logada com sucesso!',
        data: user
    })
})

app.post('/message/:email', authUser, (request,response)=>{

    const user = request.user
    const {title, description} = request.body

    if(!title || title.length < 2){
        response.status(400).json({
            success: false,
            message: 'Por favor, insira um título válido.'
        })
    }

    if (!description || description.length < 2) {
        response.status(400).json({
            success: false,
            message: 'Por favor, insira uma descrição válida.'
        })
    }
    
    const newMessage = {
        id:uuid(), 
        title, 
        description,
        userId: user.id
    }

    messages.push(newMessage)

    response.status(201).json({
        success: true,
        message: 'Recado criado com successo!',
        data: newMessage
    })
})

app.get('/message/:email', authUser, (request,response)=>{

    const user = request.user
    const foundMessages = messages.filter(message => message.userId === user.id)

    if(foundMessages.length === 0){
        response.status(404).json({
            success: false,
            message: 'Nenhum recado encontrado'
        })
    } else {
        response.status(200).json({
            success: true,
            message: 'Recado buscado com sucesso!',
            data: foundMessages
        })
    }
})

app.put('/message/:id', authMessage, (request,response)=>{
    
    const {title, description} = request.body
    const verifyIndex = request.authMessage
    const editMessage = messages[verifyIndex]

    if (!title || title.length < 2) {
        return response.status(400).json({
            success: false,
            message: 'Por favor, insira um título válido.'
        });
    }
    editMessage.title = title
    
    if (!description || description.length < 2) {
        return response.status(400).json({
            success: false,
            message: 'Por favor, insira uma descrição válida.'
        });
    }
    editMessage.description = description

    response.status(200).json({
        success: true,
        message: "Recado atualizado com successo!",
        data: editMessage
    })
})

app.delete('/message/:id', authMessage, (request,response)=>{

    const verifyIndex = request.authMessage
    const deletedMessage = messages.splice(verifyIndex, 1)

    res.status(200).json({
        success: true,
        message: "Recado deletado com successo!",
        data: deletedMessage[0]
    })
})

app.get('/'), (request,response)=>{
    response.status(200).json({
        message: 'Seja bem-vindo(a) à API do PostNotes!📝',
        documentation: 'https://documenter.getpostman.com/view/34248306/2sA3BrYqB5'
    })
}

app.listen(PORT, () => console.log('Server running at',PORT))