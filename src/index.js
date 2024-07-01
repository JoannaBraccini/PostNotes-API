import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import { v4 as uuid } from 'uuid'

import { messages, users, userData} from './database/db.js'
import authUser from './middlewares/authUser.js'
import authMessage from './middlewares/authMessage.js'

const app = express()
// const PORT = process.env.PORT
const PORT = 3000

app.use(cors())
app.use(express.json())

//SIGNUP
app.post('/signup', async (request,response)=>{

    const {name, email, password} = request.body
    
    if(!name){
        return response.status(400).json({
            success: false,
            message: 'Por favor, insira um nome válido.'
        })
    }

    if(!email){
        return response.status(400).json({
            success: false,
            message: 'Por favor, insira um email válido.'
        })

    } else if(users.find(user => user.email === email)){
        return response.status(400).json({
            success: false,
            message: 'Email já cadastrado, faça login.'
        })
    }

    if(!password){
        return response.status(400).json({
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

//LOGIN
app.post('/login', async (request,response)=>{
    
    const {email, password} = request.body
    
    if(!email){
        return response.status(400).json({
            success: false,
            message: 'Insira um e-mail válido'
        })
    }
        
    if(!password){
        return response.status(400).json({
            success: false,
            message: 'Insira uma senha válida'
        })
    }

    const user = users.find(user => user.email === email)

    if (!user) {
        return response.status(400).json({
            success: false,
            message: 'Email ou senha inválidos.'
        })
    }

    const userVerify = userData.find(user => user.email === email)
    const passwordMatch = await bcrypt.compare(password, userVerify.password)
    
    if (!userVerify || !passwordMatch){
        return response.status(400).json({
            success: false,
            message: 'Email ou senha inválidos.'
        })
    }

    response.status(200).json({
        success: true,
        message: 'Pessoa usuária logada com sucesso!',
        data: user
    })
})

//GET USERS
app.get('/users', (request, response) => {

    if (users.length > 0){
        response.status(200).json({
            success: true,
            message: 'Usuários buscados com sucesso!',
            data: users
        })
    } else {
        return response.status(404).json({
            success: false,
            message: 'Lista de usuários vazia'
        })
    }    
})

//CREATE NOTE
app.post('/message', authUser, (request,response)=>{

    const userId = request.userId
    const {title, description} = request.body

    if(!title || title.length < 1){
        return response.status(400).json({
            success: false,
            message: 'Por favor, insira um título válido.'
        })
    }

    if (!description || description.length < 1) {
        return response.status(400).json({
            success: false,
            message: 'Por favor, insira uma descrição válida.'
        })
    }

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ]

    let dateObj = new Date()
    let day = dateObj.getDate()
    let month = months[dateObj.getMonth()]
    let year = dateObj.getFullYear()
    let hours = dateObj.getHours()
    let minutes = dateObj.getMinutes()
    minutes = minutes < 10 ? '0' + minutes : minutes
    let date = `${day} de ${month}, ${year} ${hours}:${minutes}`
    
    const newMessage = {
        id:uuid(), 
        title, 
        description,
        date,
        userId: userId
    }

    messages.push(newMessage)

    response.status(201).json({
        success: true,
        message: 'Recado criado com sucesso!',
        data: newMessage
    })
})

//READ NOTES
app.get('/message', authUser, (request,response)=>{

    const userId = request.userId

    const page = Number(request.query.page) || 1
    const limit = Number(request.query.limit) || 10

    const foundMessages = messages.filter(message => message.userId === userId)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const notesPagination = foundMessages.slice(startIndex, endIndex)

    if(foundMessages.length === 0){
        return response.status(404).json({
            success: false,
            message: 'Você não tem recados.'
        })
    } else {
        response.status(200).json({
            success: true,
            message: 'Recado buscado com sucesso!',
            data: {
                notes: notesPagination,
                total: foundMessages.length
            }
        })
    }
})

//UPDATE NOTE
app.put('/message/:id', authMessage, (request,response)=>{    

    const {title, description} = request.body
    const message = request.message

    if (!title || title.length < 1) {
        return response.status(400).json({
            success: false,
            message: 'Por favor, insira um título válido.'
        });
    }
    message.title = title
    
    if (!description || description.length < 1) {
        return response.status(400).json({
            success: false,
            message: 'Por favor, insira uma descrição válida.'
        });
    }
    message.description = description

    response.status(200).json({
        success: true,
        message: "Recado atualizado com sucesso!",
        data: message
    })
})

//DELETE NOTE
app.delete('/message/:id', authMessage, (request,response)=>{

    const verifyIndex = request.verifyIndex
    const deletedMessage = messages.splice(verifyIndex, 1)

    response.status(200).json({
        success: true,
        message: "Recado deletado com sucesso!",
        data: deletedMessage
    })
})

//WELCOME
app.get('/', (request,response)=>{
    response.status(200).send(
        `Seja bem-vindo(a) à API do PostNotes!📝<br>
        Documentação: https://documenter.getpostman.com/view/34248306/2sA3BrYqB5`
    )
})

//PORT
app.listen(PORT, () => console.log('Server running at',PORT))