import { messages } from "../database/db"

function authMessage(request, response, next) {
    
    const noteId = request.params.id
    const verifyIndex = messages.findIndex(message => message.id == noteId)
    const message = messages.find(message => message.id == noteId)
    const user = message.userId 

    if (verifyIndex === -1) {
        return response.status(404).json({
            success: false,
            message: "Recado não encontrado!"
        })
    }

    if (message.userId != user) {
        return response.status(403).json({
            success: false,
            message: "Você não tem permissão para editar este recado!"
        })
    }

    request.verifyIndex = verifyIndex
    request.message = message
    return next()
}

export default authMessage